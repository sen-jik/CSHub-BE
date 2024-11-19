export const AUTH_ERROR_MESSAGES = {
  TOKEN_REQUIRED: '토큰이 필요합니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  TOKEN_EXPIRED: '만료된 토큰입니다.',
  UNAUTHORIZED: '인증되지 않은 사용자입니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
} as const;

export const USER_ERROR_MESSAGES = {
  USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
  USER_CREATE_FAILED: '유저 생성에 실패했습니다.',
} as const;
