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
import { Observable, firstValueFrom } from 'rxjs';
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

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.isPublicRoute(context)) return true;

    const { request, response } = this.getHttpContext(context);
    const { accessToken, refreshToken } = this.extractTokens(
      request.headers.cookie,
    );

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

  private async validateTokens(
    context: ExecutionContext,
    accessToken: string,
    refreshToken: string,
    response: Response,
  ): Promise<boolean> {
    let decodedToken = await this.verifyAccessToken(accessToken);

    if (!decodedToken && refreshToken) {
      decodedToken = await this.verifyRefreshTokenAndSignAccessToken(
        refreshToken,
        response,
      );
    }

    if (!decodedToken) {
      return firstValueFrom(super.canActivate(context) as Observable<boolean>);
    }

    return this.checkRolePermission(context, decodedToken.id);
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
      this.logger.error(AUTH_ERROR_MESSAGES.INVALID_TOKEN, error.message);
      return null;
    }
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

      const newAccessToken = this.jwtService.sign({
        id: refreshDecoded.id,
        tokenType: 'access',
      });

      response.cookie(
        'access_token',
        newAccessToken,
        ACCESS_TOKEN_COOKIE_CONFIG,
      );
      return this.jwtService.verify(newAccessToken);
    } catch (error) {
      this.logger.error(AUTH_ERROR_MESSAGES.INVALID_TOKEN, error.message);
      this.throwUnauthorized(AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
    }
  }

  private async checkRolePermission(
    context: ExecutionContext,
    userId: string,
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
