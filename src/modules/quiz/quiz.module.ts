import { Module } from '@nestjs/common';
import { QuizController } from './presentation/quiz.controller';
import { QuizService } from './application/quiz.service';
import { LikeController } from './presentation/like.controller';
import { LikeService } from './application/like.service';
import { CategoryController } from './presentation/category.controller';
import { CategoryService } from './application/catgegory.service';

@Module({
  controllers: [QuizController, LikeController, CategoryController],
  providers: [QuizService, LikeService, CategoryService],
  exports: [QuizService, LikeService, CategoryService],
})
export class QuizModule {}
