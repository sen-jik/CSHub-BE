import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategoryEnum } from '../domain/sub-category.enum';
import { CreateSubCategoryReqDto } from '../dto/category.req.dto';
import { SubCategory } from '../infrastructure/db/entity/sub-category.entity';
import { MainCategoryEnum } from '../domain/main-category.enum';

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

  async findSubCategoryWithCount(mainCategory: MainCategoryEnum) {
    const result = await this.subCategoryRepository
      .createQueryBuilder('sub_category')
      .leftJoin(
        'interview',
        'interview',
        'interview.sub_category_id = sub_category.id',
      )
      .select('sub_category.name', 'name')
      .addSelect('COUNT(interview.id)', 'interviewCount')
      .where('sub_category.main_category = :mainCategory', { mainCategory })
      .groupBy('sub_category.name')
      .getRawMany();

    return result.map((item) => ({
      name: item.name,
      interviewCount: parseInt(item.interviewCount),
    }));
  }
}
