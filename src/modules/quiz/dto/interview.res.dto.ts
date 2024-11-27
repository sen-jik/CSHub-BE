import { ApiProperty } from '@nestjs/swagger';
import { Interview } from '../domain/interview';
export class CreateInterviewResDto {
  @ApiProperty({
    description: '인터뷰 ID',
    example: 1,
  })
  id: number;
}

export class GetInterviewByCategoryResDto {
  @ApiProperty({
    description: '메인 카테고리명',
    example: 'COMMON',
  })
  mainCategoryName: string;

  @ApiProperty({
    description: '서브 카테고리명',
    example: 'NETWORK',
  })
  subCategoryName: string;

  @ApiProperty({
    description: '인터뷰 목록',
    type: [Interview],
  })
  interviews: Interview[];
}

export class GetAllInterviewResDto {
  @ApiProperty({
    description: '카테고리별 인터뷰 목록',
    type: [GetInterviewByCategoryResDto],
  })
  items: GetInterviewByCategoryResDto[];
}
