import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

export enum LikeTargetType {
  INTERVIEW = 'interview',
  QUIZ = 'quiz',
}

export class ToggleLikeReqDto {
  @ApiProperty({
    description: '좋아요 대상 타입',
    enum: LikeTargetType,
    example: LikeTargetType.INTERVIEW,
  })
  @IsEnum(LikeTargetType)
  type: LikeTargetType;

  @ApiProperty({
    description: '좋아요 대상 ID',
    example: 1,
  })
  @IsNumber()
  targetId: number;
}
