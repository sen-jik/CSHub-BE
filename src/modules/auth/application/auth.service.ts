import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { JwtService } from '@nestjs/jwt';
import { KakaoUser } from '../domain/kakao-user.type';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE_CONFIG,
  REFRESH_TOKEN_COOKIE_CONFIG,
} from '../domain/cookie.constant';
import { KakaoAuthClient } from '../infrastructure/external/kakao/kakao-auth.client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly kakaoAuthClient: KakaoAuthClient,
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

  async generateTokens(payload: KakaoUser) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  private generateAccessToken(kakaoUser: KakaoUser) {
    const accessToken = this.jwtService.sign({
      ...kakaoUser,
      tokenType: 'access',
    });
    return accessToken;
  }

  private generateRefreshToken(kakaoUser: KakaoUser) {
    const refreshToken = this.jwtService.sign({
      ...kakaoUser,
      tokenType: 'refresh',
    });
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
