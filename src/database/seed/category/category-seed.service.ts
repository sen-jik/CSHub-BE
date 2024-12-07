import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainCategoryEnum } from 'src/modules/quiz/domain/main-category.enum';
import { SubCategoryEnum } from 'src/modules/quiz/domain/sub-category.enum';
import { SubCategory } from 'src/modules/quiz/infrastructure/db/entity/sub-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategorySeedService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
  ) {}
  async run() {
    const countSubCategory = await this.subCategoryRepository.count({});
    if (!countSubCategory) {
      await this.subCategoryRepository.manager.transaction(async (manager) => {
        // FE
        await manager.save(SubCategory, [
          { name: SubCategoryEnum.BROWSER, main_category: MainCategoryEnum.FE },
          { name: SubCategoryEnum.REACT, main_category: MainCategoryEnum.FE },
          { name: SubCategoryEnum.NEXT, main_category: MainCategoryEnum.FE },
          { name: SubCategoryEnum.HTML, main_category: MainCategoryEnum.FE },
          { name: SubCategoryEnum.CSS, main_category: MainCategoryEnum.FE },
          { name: SubCategoryEnum.FE_ETC, main_category: MainCategoryEnum.FE },
        ]);

        // BE
        await manager.save(SubCategory, [
          { name: SubCategoryEnum.OS, main_category: MainCategoryEnum.BE },
          { name: SubCategoryEnum.DB, main_category: MainCategoryEnum.BE },
          { name: SubCategoryEnum.NODE, main_category: MainCategoryEnum.BE },
          { name: SubCategoryEnum.SPRING, main_category: MainCategoryEnum.BE },
          { name: SubCategoryEnum.CLOUD, main_category: MainCategoryEnum.BE },
          { name: SubCategoryEnum.BE_ETC, main_category: MainCategoryEnum.BE },
        ]);

        // COMMON
        await manager.save(SubCategory, [
          {
            name: SubCategoryEnum.NETWORK,
            main_category: MainCategoryEnum.COMMON,
          },
          {
            name: SubCategoryEnum.DATA_STRUCTURE,
            main_category: MainCategoryEnum.COMMON,
          },
          {
            name: SubCategoryEnum.ALGORITHM,
            main_category: MainCategoryEnum.COMMON,
          },
          { name: SubCategoryEnum.FIT, main_category: MainCategoryEnum.COMMON },
          {
            name: SubCategoryEnum.COMMON_ETC,
            main_category: MainCategoryEnum.COMMON,
          },
        ]);

        // LANGUAGE
        await manager.save(SubCategory, [
          {
            name: SubCategoryEnum.JAVASCRIPT,
            main_category: MainCategoryEnum.LANGUAGE,
          },
          {
            name: SubCategoryEnum.TYPESCRIPT,
            main_category: MainCategoryEnum.LANGUAGE,
          },
          {
            name: SubCategoryEnum.JAVA,
            main_category: MainCategoryEnum.LANGUAGE,
          },
        ]);
      });
    }
  }
}
