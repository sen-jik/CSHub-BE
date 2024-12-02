import { ApiProperty } from '@nestjs/swagger';
export class CreateInterviewResDto {
  @ApiProperty({
    description: '인터뷰 ID',
    example: 1,
  })
  id: number;
}

export class InterviewResDto {
  @ApiProperty({
    description: '인터뷰 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '질문',
    example: 'HTTP와 HTTPS의 차이점은 무엇인가요?',
  })
  question: string;

  @ApiProperty({
    description: '답변',
    example:
      'HTTP는 암호화되지 않은 평문 통신이며, HTTPS는 SSL/TLS를 통해 암호화된 통신을 합니다.',
  })
  answer: string;

  @ApiProperty({
    description: '키워드 목록',
    example: ['HTTP', 'HTTPS', 'SSL', 'TLS', '보안'],
  })
  keywords: string[];

  @ApiProperty({
    description: '생성일시',
  })
  createdAt: Date;
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
    type: [InterviewResDto],
  })
  interviews: InterviewResDto[];
}

export class GetAllInterviewResDto {
  @ApiProperty({
    description: '카테고리별 인터뷰 목록',
    type: [GetInterviewByCategoryResDto],
  })
  items: GetInterviewByCategoryResDto[];
}
