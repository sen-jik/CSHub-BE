export const ACCESS_TOKEN_COOKIE_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 1000, // 1시간
} as const;

export const REFRESH_TOKEN_COOKIE_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
} as const;
