import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './infrastructure/db/entity/like.entity';
import { LikeController } from './presentation/like.controller';
import { LikeService } from './application/like.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UserModule, AuthModule],
  controllers: [LikeController],
  providers: [LikeService, Logger],
  exports: [LikeService],
})
export class LikeModule {}
