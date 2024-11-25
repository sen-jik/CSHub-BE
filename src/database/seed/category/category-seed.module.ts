import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from 'src/modules/quiz/infrastructure/db/entity/sub-category.entity';
import { CategorySeedService } from './category-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory])],
  providers: [CategorySeedService],
  exports: [CategorySeedService],
})
export class CategorySeedModule {}
