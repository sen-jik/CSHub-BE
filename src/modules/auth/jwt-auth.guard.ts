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
import { Observable } from 'rxjs';
import { Role } from '../user/domain/role.enum';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';
import { ROLES_KEY } from 'src/common/decorator/role.decorator';

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
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const http = context.switchToHttp();
    const { url, headers } = http.getRequest<Request>();
    const token = headers.authorization?.split(' ')[1];

    if (!token) {
      const error = new UnauthorizedException('토큰이 없습니다');
      this.logger.error(error.message, error.stack);
      throw error;
    }

    const decoded = this.jwtService.verify(token);
    if (!decoded) {
      const error = new UnauthorizedException('토큰이 유효하지 않습니다.');
      this.logger.error(error.message, error.stack);
      throw error;
    }

    if (url !== '/auth/refresh' && decoded['tokenType'] === 'refresh') {
      const error = new UnauthorizedException('access token이 필요합니다.');
      this.logger.error(error.message, error.stack);
      throw error;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles) {
      const userId = decoded['sub'];
      return this.userService.checkUserIsAdmin(userId);
    }

    return super.canActivate(context);
  }
}
