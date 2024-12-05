import { Logger, Module } from '@nestjs/common';
import { QuizController } from './presentation/quiz.controller';
import { QuizService } from './application/quiz.service';
import { LikeController } from './presentation/like.controller';
import { LikeService } from './application/like.service';
import { CategoryController } from './presentation/category.controller';
import { CategoryService } from './application/catgegory.service';
import { InterviewController } from './presentation/interview.controller';
import { InterviewService } from './application/interview.service';
import { Interview } from './infrastructure/db/entity/interview.entity';
import { SubCategory } from './infrastructure/db/entity/sub-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewRepository } from './infrastructure/db/repository/interview.repository';
import { Like } from './infrastructure/db/entity/like.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview, SubCategory, Like]),
    AuthModule,
    UserModule,
  ],
  controllers: [
    QuizController,
    LikeController,
    CategoryController,
    InterviewController,
  ],
  providers: [
    QuizService,
    LikeService,
    CategoryService,
    InterviewService,
    Logger,
    {
      provide: 'IInterviewRepository',
      useClass: InterviewRepository,
    },
  ],
  exports: [QuizService, LikeService, CategoryService, InterviewService],
})
export class QuizModule {}
