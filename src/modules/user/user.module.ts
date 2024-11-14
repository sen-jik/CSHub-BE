import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infrastructure/db/entity/user.entity';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
