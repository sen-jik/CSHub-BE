import { Provider } from './provider.enum';
import { Role } from './role.enum';

export class User {
  id: string;

  platformId: string;

  provider: Provider;

  role: Role;

  profile_image: string | null;

  nickname: string;

  total_points: number;

  current_rank: number;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}
