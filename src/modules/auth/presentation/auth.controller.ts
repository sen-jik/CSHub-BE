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

@Controller('auth')
export class AuthController {
  private readonly apiKey: string;
  private readonly redirectUri: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('auth.kakao.apiKey');
    this.redirectUri = this.configService.get<string>('auth.kakao.redirectUri');
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
      throw new InternalServerErrorException('유저 생성 실패');
    }
    kakaoUser.id = user.id;

    const { accessToken, refreshToken } =
      await this.authService.generateTokens(kakaoUser);

    this.authService.setAuthCookies(res, accessToken, refreshToken);

    // TODO : 프론트 주소로 변경
    return res.redirect('http://localhost:4000');
  }
}
