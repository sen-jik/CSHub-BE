import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { KakaoAuthClient } from './infrastructure/external/kakao/kakao-auth.client';

@Module({
  imports: [
    HttpModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('auth.jwt.secret'),
          signOptions: {
            expiresIn: configService.get('auth.jwt.accessExpiresIn'),
          },
          refreshToken: {
            expiresIn: configService.get('auth.jwt.refreshExpiresIn'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, KakaoAuthClient],
  exports: [AuthService],
})
export class AuthModule {}
