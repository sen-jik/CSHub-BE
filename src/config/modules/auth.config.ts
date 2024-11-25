import { registerAs } from '@nestjs/config';
import { AuthConfig } from '../types/auth-config.type';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  KAKAO_API_KEY: string;

  @IsString()
  KAKAO_REDIRECT_URI: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_ACCESS_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    kakao: {
      apiKey: process.env.KAKAO_API_KEY,
      redirectUri: process.env.KAKAO_REDIRECT_URI,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  };
});
