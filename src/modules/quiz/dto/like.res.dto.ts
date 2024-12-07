import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikeResDto {
  @ApiProperty({
    description: '좋아요 상태',
    example: true,
    type: Boolean,
  })
  isLiked: boolean;
}
