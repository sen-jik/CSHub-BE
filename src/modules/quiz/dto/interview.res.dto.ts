import { ApiProperty } from '@nestjs/swagger';

export class CreateInterviewResDto {
  @ApiProperty({
    description: '인터뷰 ID',
    example: 1,
  })
  id: number;
}
