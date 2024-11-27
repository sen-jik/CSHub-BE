import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const isDevelopment = configService.get('NODE_ENV') === 'development';
const isProduction = configService.get('NODE_ENV') === 'production';

const domainConfig =
  isDevelopment || isProduction ? { domain: '.cshub.kr' } : {};

export const ACCESS_TOKEN_COOKIE_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 1000, // 1시간
  ...domainConfig,
} as const;

export const REFRESH_TOKEN_COOKIE_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  ...domainConfig,
} as const;
