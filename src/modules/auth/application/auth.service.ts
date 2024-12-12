import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { JwtService } from '@nestjs/jwt';
import { KakaoUser } from '../domain/kakao-user.type';
import { Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE_CONFIG,
  REFRESH_TOKEN_COOKIE_CONFIG,
} from '../domain/cookie.constant';
import { KakaoAuthClient } from '../infrastructure/external/kakao/kakao-auth.client';
import { JwtPayload } from '../strategy/type/jwt-payload.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly kakaoAuthClient: KakaoAuthClient,
    private readonly configService: ConfigService,
  ) {}

  async kakaoLogin(apiKey: string, redirectUri: string, code: string) {
    const data = await this.kakaoAuthClient.getKakaoToken(
      apiKey,
      redirectUri,
      code,
    );
    const userInfo: KakaoUser = await this.kakaoAuthClient.getKakaoUser(
      data.access_token,
    );
    return userInfo;
  }

  async findOrCreateUser(kakaoUser: KakaoUser) {
    let user = await this.userService.findUserByKakaoId(kakaoUser.kakaoId);
    if (!user) {
      user = await this.userService.createUser({ ...kakaoUser });
    }
    return user;
  }

  async generateTokens(
    payload: Pick<JwtPayload, 'id' | 'role' | 'profile_image' | 'nickname'>,
  ) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload.id);
    return { accessToken, refreshToken };
  }

  private generateAccessToken(
    payload: Pick<JwtPayload, 'id' | 'role' | 'profile_image' | 'nickname'>,
  ) {
    const accessToken = this.jwtService.sign({
      ...payload,
      tokenType: 'access',
    });
    return accessToken;
  }

  private generateRefreshToken(id: string) {
    const refreshToken = this.jwtService.sign(
      {
        id,
        tokenType: 'refresh',
      },
      {
        expiresIn: this.configService.get('auth.jwt.refreshExpiresIn'),
      },
    );
    return refreshToken;
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie('access_token', accessToken, ACCESS_TOKEN_COOKIE_CONFIG);
    res.cookie('refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_CONFIG);
  }
}
