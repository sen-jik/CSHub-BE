import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { KakaoUser } from 'src/modules/auth/domain/kakao-user.type';

@Injectable()
export class KakaoAuthClient {
  private readonly KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/token';
  private readonly KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

  constructor(private readonly http: HttpService) {}

  async getKakaoToken(apiKey: string, redirectUri: string, code: string) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const config = {
      grant_type: 'authorization_code',
      client_id: apiKey,
      redirect_uri: redirectUri,
      code,
    };

    const { data } = await firstValueFrom(
      this.http.post(
        this.KAKAO_AUTH_URL,
        new URLSearchParams(config).toString(),
        { headers },
      ),
    );
    return data;
  }

  async getKakaoUser(accessToken: string): Promise<KakaoUser> {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const { data: userInfo } = await firstValueFrom(
      this.http.get(this.KAKAO_USER_INFO_URL, { headers }),
    );

    const { nickname, profile_image } = userInfo.properties;
    return {
      nickname,
      profile_image,
      kakaoId: userInfo.id,
    };
  }
}
