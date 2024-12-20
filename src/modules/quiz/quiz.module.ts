import { Logger, Module } from '@nestjs/common';
import { QuizController } from './presentation/quiz.controller';
import { QuizService } from './application/quiz.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [QuizController],
  providers: [QuizService, Logger],
  exports: [QuizService],
})
export class QuizModule {}
