import { User } from 'src/modules/user/domain/user';

export type JwtPayload = Pick<
  User,
  'id' | 'role' | 'profile_image' | 'nickname'
> & {
  tokenType: 'access' | 'refresh';
  iat: number;
  exp: number;
};
