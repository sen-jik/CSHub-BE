import {
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../application/auth.service';
import { ConfigService } from '@nestjs/config';
import { KakaoUser } from '../domain/kakao-user.type';
import { Public } from 'src/common/decorator/public.decorator';
import { JwtPayload } from '../strategy/type/jwt-payload.type';
import { USER_ERROR_MESSAGES } from 'src/common/constants/error-messages';

@Controller('auth')
export class AuthController {
  private readonly apiKey: string;
  private readonly redirectUri: string;
  private readonly onboardingUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('auth.kakao.apiKey');
    this.redirectUri = this.configService.get<string>('auth.kakao.redirectUri');
    this.onboardingUrl =
      this.configService.get<string>('app.clientUrl') + '/onboarding';
  }

  @Get('kakao/login')
  @Public()
  @Header('Content-Type', 'text/html')
  async kakaoRedirect(@Res() res: Response): Promise<void> {
    const kakaoAuthorizationUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.apiKey}&redirect_uri=${this.redirectUri}`;
    res.redirect(kakaoAuthorizationUrl);
  }

  @Get('kakao/callback')
  @Public()
  async getKakaoInfo(@Query('code') code: string, @Res() res: Response) {
    const kakaoUser: KakaoUser = await this.authService.kakaoLogin(
      this.apiKey,
      this.redirectUri,
      code,
    );

    const user = await this.authService.findOrCreateUser(kakaoUser);
    if (!user) {
      throw new InternalServerErrorException(
        USER_ERROR_MESSAGES.USER_CREATE_FAILED,
      );
    }

    const payload: Pick<
      JwtPayload,
      'id' | 'role' | 'profile_image' | 'nickname'
    > = {
      id: user.id.toString(),
      role: user.role,
      profile_image: user.profile_image,
      nickname: user.nickname,
    };

    const { accessToken, refreshToken } =
      await this.authService.generateTokens(payload);

    this.authService.setAuthCookies(res, accessToken, refreshToken);

    const redirectUrl = user.isNew
      ? this.onboardingUrl
      : this.configService.get<string>('app.clientUrl');

    return res.redirect(redirectUrl);
  }
}
