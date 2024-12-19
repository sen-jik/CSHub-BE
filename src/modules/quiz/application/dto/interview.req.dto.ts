import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { SubCategoryEnum } from '../../domain/sub-category.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginationReqDto } from 'src/common/dto/pagination.dto';

export class CreateInterviewReqDto {
  @ApiProperty({
    required: true,
    description: '질문',
    example: '질문',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    required: true,
    description: '답변',
    example: '답변',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({
    required: true,
    description: '키워드',
    example: ['키워드1', '키워드2'],
  })
  @IsArray()
  @IsNotEmpty()
  keywords: string[];

  @ApiProperty({
    required: true,
    description: '서브 카테고리',
    example: 'network',
  })
  @IsString()
  @IsEnum(SubCategoryEnum)
  @IsNotEmpty()
  subCategory: SubCategoryEnum;
}

export class SearchInterviewReqDto extends PaginationReqDto {
  @ApiProperty({
    required: false,
    description: '검색어',
    example: '검색어',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: '카테고리',
    example: 'network',
    name: 'sub_category',
  })
  @Expose({ name: 'sub_category' })
  @IsString()
  @IsEnum(SubCategoryEnum)
  @IsOptional()
  subCategory?: SubCategoryEnum;
}
