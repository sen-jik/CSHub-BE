import { IsEnum, IsNotEmpty } from 'class-validator';
import { SubCategoryEnum } from '../../category/domain/sub-category.enum';
import { ApiProperty } from '@nestjs/swagger';
import { MainCategoryEnum } from '../../category/domain/main-category.enum';
import { Transform } from 'class-transformer';

export class CreateSubCategoryReqDto {
  @ApiProperty({
    required: true,
    description: '서브 카테고리',
    example: 'network',
  })
  @IsEnum(SubCategoryEnum)
  @IsNotEmpty()
  subCategory: SubCategoryEnum;

  @ApiProperty({
    required: true,
    description: '메인 카테고리',
    example: 'common',
  })
  @IsEnum(MainCategoryEnum)
  @IsNotEmpty()
  mainCategory: MainCategoryEnum;
}

export class FindSubCategoryByMainReqDto {
  @ApiProperty({
    enum: MainCategoryEnum,
    description: '메인 카테고리',
    example: MainCategoryEnum.COMMON,
  })
  @IsEnum(MainCategoryEnum)
  @Transform(({ value }) => value.toLowerCase())
  main_category: MainCategoryEnum;
}
