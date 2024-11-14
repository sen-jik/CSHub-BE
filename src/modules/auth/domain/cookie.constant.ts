export const ACCESS_TOKEN_COOKIE_CONFIG = {
  httpOnly: true,
  // TODO : 배포 후 개발 환경에 따라 다르게 구성
  secure: false,
  sameSite: 'lax',
  maxAge: 60 * 60 * 1000, // 1시간
  signed: true,
} as const;

export const REFRESH_TOKEN_COOKIE_CONFIG = {
  httpOnly: true,
  // TODO : 배포 후 개발 환경에 따라 다르게 구성
  secure: false,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  signed: true,
} as const;
