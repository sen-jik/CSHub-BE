import {
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/application/user.service';
import { Role } from '../user/domain/role.enum';
import { Request, Response } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';
import { ROLES_KEY } from 'src/common/decorator/role.decorator';
import { ACCESS_TOKEN_COOKIE_CONFIG } from './domain/cookie.constant';
import { AUTH_ERROR_MESSAGES } from 'src/common/constants/error-messages';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
    @Inject(Logger)
    private logger: LoggerService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.isPublicRoute(context);
    const { request, response } = this.getHttpContext(context);
    const { accessToken, refreshToken } = this.extractTokens(
      request.headers.cookie,
    );

    // NOTE : public route인 경우도 토큰 검증 수행. ( 비로그인과 로그인 유저 모두 접근해야하는 라우트 용)
    if (isPublic) {
      if (accessToken || refreshToken) {
        await this.validateTokensOnPublic(
          context,
          accessToken,
          refreshToken,
          response,
        );
      }
      return true;
    }

    if (!accessToken && !refreshToken) {
      this.throwUnauthorized(AUTH_ERROR_MESSAGES.TOKEN_REQUIRED);
    }

    return this.validateTokens(context, accessToken, refreshToken, response);
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getHttpContext(context: ExecutionContext) {
    const http = context.switchToHttp();
    return {
      request: http.getRequest<Request>(),
      response: http.getResponse<Response>(),
    };
  }

  private extractTokens(cookie: string) {
    return {
      accessToken: this.extractTokenFromCookie(cookie, 'access_token'),
      refreshToken: this.extractTokenFromCookie(cookie, 'refresh_token'),
    };
  }

  private setUserContext(request, decodedToken) {
    request.user = {
      id: parseInt(decodedToken.id),
      role: decodedToken.role,
      profile_image: decodedToken.profile_image,
      nickname: decodedToken.nickname,
    };
  }

  private async validateTokens(
    context: ExecutionContext,
    accessToken: string,
    refreshToken: string,
    response: Response,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let decodedToken = await this.verifyAccessToken(accessToken);

    if (!decodedToken && refreshToken) {
      try {
        decodedToken = await this.verifyRefreshTokenAndSignAccessToken(
          refreshToken,
          response,
        );

        if (!decodedToken) {
          this.throwUnauthorized(AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
        }
      } catch (error) {
        this.logger.log(error);
        this.throwUnauthorized(AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
      }
    }

    if (!decodedToken) {
      this.throwUnauthorized(AUTH_ERROR_MESSAGES.TOKEN_REQUIRED);
    }

    this.setUserContext(request, decodedToken);

    return this.checkRolePermission(context, parseInt(decodedToken.id));
  }

  private async validateTokensOnPublic(
    context: ExecutionContext,
    accessToken: string,
    refreshToken: string,
    response: Response,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let decodedToken = await this.verifyAccessToken(accessToken);

    if (!decodedToken && refreshToken) {
      try {
        decodedToken = await this.verifyRefreshTokenAndSignAccessTokenOnPublic(
          refreshToken,
          response,
        );
      } catch (error) {
        this.logger.log(error);
        this.throwUnauthorized(AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
      }
    }
    if (decodedToken) {
      this.setUserContext(request, decodedToken);
    }

    return this.checkRolePermission(context, parseInt(decodedToken.id));
  }

  private async verifyAccessToken(accessToken: string) {
    if (!accessToken) return null;

    try {
      const decoded = this.jwtService.verify(accessToken);
      if (decoded.tokenType === 'refresh') {
        this.throwUnauthorized(AUTH_ERROR_MESSAGES.TOKEN_REQUIRED);
      }
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return null; // refresh token으로 재발급 시도하기 위해
      }
      this.logger.error(AUTH_ERROR_MESSAGES.INVALID_TOKEN, error.message);
      this.throwUnauthorized(AUTH_ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  private issueAccessTokenWithCookie(refreshDecoded, response: Response) {
    const newAccessToken = this.jwtService.sign({
      id: refreshDecoded.id,
      role: refreshDecoded.role,
      profile_image: refreshDecoded.profile_image,
      nickname: refreshDecoded.nickname,
      tokenType: 'access',
    });
    response.cookie('access_token', newAccessToken, ACCESS_TOKEN_COOKIE_CONFIG);
    return newAccessToken;
  }

  private async verifyRefreshTokenAndSignAccessToken(
    refreshToken: string,
    response: Response,
  ) {
    try {
      const refreshDecoded = this.jwtService.verify(refreshToken);
      if (refreshDecoded.tokenType !== 'refresh') {
        this.throwUnauthorized(AUTH_ERROR_MESSAGES.INVALID_TOKEN);
      }

      const newAccessToken = this.issueAccessTokenWithCookie(
        refreshDecoded,
        response,
      );

      return this.jwtService.verify(newAccessToken);
    } catch (error) {
      this.logger.error(AUTH_ERROR_MESSAGES.INVALID_TOKEN, error.message);
      this.throwUnauthorized(AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
    }
  }

  private async verifyRefreshTokenAndSignAccessTokenOnPublic(
    refreshToken: string,
    response: Response,
  ) {
    try {
      const refreshDecoded = this.jwtService.verify(refreshToken);
      if (refreshDecoded.tokenType === 'refresh') {
        const newAccessToken = this.issueAccessTokenWithCookie(
          refreshDecoded,
          response,
        );
        return this.jwtService.verify(newAccessToken);
      }
    } catch (error) {
      error.message = 'public route unauthorized user';
      this.logger.log(error.message);
      return true;
    }
  }

  private async checkRolePermission(
    context: ExecutionContext,
    userId: number,
  ): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles) {
      return this.userService.checkUserIsAdmin(userId);
    }

    return true;
  }

  private throwUnauthorized(message: string): never {
    const error = new UnauthorizedException(message);
    this.logger.error(error.message, error.stack);
    throw error;
  }

  private extractTokenFromCookie(cookie: string, tokenName: string): string {
    return cookie
      ?.split(';')
      .find((c) => c.trim().startsWith(`${tokenName}=`))
      ?.split('=')[1];
  }
}
