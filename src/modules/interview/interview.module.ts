import { Logger, Module } from '@nestjs/common';
import { InterviewController } from '../interview/presentation/interview.controller';
import { InterviewService } from '../interview/application/interview.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewRepository } from '../interview/infrastructure/db/repository/interview.repository';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { Interview } from './infrastructure/db/entity/interview.entity';
import { SubCategory } from '../category/infrastructure/db/entity/sub-category.entity';
import { Like } from '../like/infrastructure/db/entity/like.entity';
import { LikeService } from '../like/application/like.service';
import { CategoryService } from '../category/application/catgegory.service';
import { LikeController } from '../like/presentation/like.controller';
import { CategoryController } from '../category/presentation/category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview, SubCategory, Like]),
    AuthModule,
    UserModule,
  ],
  controllers: [LikeController, CategoryController, InterviewController],
  providers: [
    LikeService,
    CategoryService,
    InterviewService,
    Logger,
    {
      provide: 'IInterviewRepository',
      useClass: InterviewRepository,
    },
  ],
  exports: [LikeService, CategoryService, InterviewService],
})
export class InterviewModule {}
