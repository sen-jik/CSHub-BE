import { ApiProperty } from '@nestjs/swagger';
export class CreateInterviewResDto {
  @ApiProperty({
    description: '인터뷰 ID',
    example: 1,
  })
  id: number;
}

export class FindInterviewInfoResDto {
  @ApiProperty({
    description: '인터뷰 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '서브 카테고리 정보',
    example: {
      id: 1,
      name: 'NETWORK',
      main_category: 'COMMON',
    },
  })
  subCategory: {
    id: number;
    name: string;
    main_category: string;
  };

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

export class FindInterviewInfoWithLikeResDto extends FindInterviewInfoResDto {
  @ApiProperty({
    description: '좋아요 여부',
    example: true,
  })
  isLiked: boolean;
}

export class FindInterviewResDto {
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
}
export class FindInterviewByCategoryResDto {
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
    type: [FindInterviewResDto],
  })
  interviews: FindInterviewResDto[];
}

export class FindAllInterviewResDto {
  @ApiProperty({
    description: '카테고리별 인터뷰 목록',
    type: [FindInterviewByCategoryResDto],
  })
  items: FindInterviewByCategoryResDto[];
}
