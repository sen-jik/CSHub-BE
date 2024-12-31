import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './infrastructure/db/entity/sub-category.entity';
import { CategoryController } from './presentation/category.controller';
import { CategoryService } from './application/catgegory.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
