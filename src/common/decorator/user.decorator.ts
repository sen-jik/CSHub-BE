import { ExecutionContext } from '@nestjs/common';

import { createParamDecorator } from '@nestjs/common';
import { Role } from 'src/modules/user/domain/role.enum';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export interface UserAfterAuth {
  id: number;
  role: Role;
  profile_image: string;
  nickname: string;
}
