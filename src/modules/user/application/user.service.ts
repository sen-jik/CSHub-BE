import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../infrastructure/db/entity/user.entity';
import { Repository } from 'typeorm';
import { Provider } from '../domain/provider.enum';
import { KakaoUser } from '../../auth/domain/kakao-user.type';
import { Role } from '../domain/role.enum';
import { DefaultNicknamePolicy } from 'src/modules/user/domain/default-nickname-policy';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return `findOne: ${id}`;
  }

  async findUserByKakaoId(kakaoId: string) {
    const user = await this.userRepository.findOne({
      where: { platformId: kakaoId },
    });
    return user;
  }

  async createUser(kakaoUser: KakaoUser) {
    const user = new User();

    user.nickname = DefaultNicknamePolicy.generateRandomString();
    user.profile_image = kakaoUser.profile_image;
    user.platformId = kakaoUser.kakaoId;
    user.provider = Provider.KAKAO;
    return await this.userRepository.save(user);
  }

  async checkUserIsAdmin(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user.role === Role.ADMIN;
  }
}
