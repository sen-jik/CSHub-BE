import { ApiProperty } from '@nestjs/swagger';

export class Interview {
  @ApiProperty({
    description: '인터뷰 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '서브 카테고리 정보',
    example: {
      id: 1,
      name: 'network',
      main_category: 'common',
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

  @ApiProperty({
    description: '좋아요 목록',
    required: false,
  })
  likes?: { userId: number }[];
}
