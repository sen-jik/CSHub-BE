import { Injectable } from '@nestjs/common';
import { SubCategory } from '../infrastructure/db/entity/sub-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategoryEnum } from '../domain/sub-category.enum';
import { CreateSubCategoryReqDto } from '../dto/category.req.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async findSubCategory(subCategory: SubCategoryEnum) {
    return this.subCategoryRepository.findOne({
      where: { name: subCategory },
    });
  }

  async createSubCategory(data: CreateSubCategoryReqDto) {
    const subCategoryEntity = new SubCategory();
    subCategoryEntity.name = data.subCategory;
    subCategoryEntity.main_category = data.mainCategory;

    return this.subCategoryRepository.save(subCategoryEntity);
  }
}
