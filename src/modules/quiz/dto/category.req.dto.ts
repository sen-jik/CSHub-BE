import { IsEnum, IsNotEmpty } from 'class-validator';
import { SubCategoryEnum } from '../domain/sub-category.enum';
import { ApiProperty } from '@nestjs/swagger';
import { MainCategoryEnum } from '../domain/main-category.enum';

export class CreateSubCategoryReqDto {
  @ApiProperty({
    required: true,
    description: '서브 카테고리',
    example: 'NETWORK',
  })
  @IsEnum(SubCategoryEnum)
  @IsNotEmpty()
  subCategory: SubCategoryEnum;

  @ApiProperty({
    required: true,
    description: '메인 카테고리',
    example: 'COMMON',
  })
  @IsEnum(MainCategoryEnum)
  @IsNotEmpty()
  mainCategory: MainCategoryEnum;
}
