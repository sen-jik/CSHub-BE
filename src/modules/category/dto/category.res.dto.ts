import { ApiProperty } from '@nestjs/swagger';

export class FindSubCategoryWithCountResDto {
  @ApiProperty({
    description: '서브 카테고리명',
    example: 'network',
  })
  name: string;

  @ApiProperty({
    description: '인터뷰 개수',
    example: 10,
  })
  interviewCount: number;
}
