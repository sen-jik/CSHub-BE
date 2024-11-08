import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController, UserController],
})
export class AppModule {}
