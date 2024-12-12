import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationReqDto {
  @ApiProperty({
    required: false,
    description: '페이지',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({
    required: false,
    description: '페이지 크기',
    example: 10,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class PaginationResDto {
  @ApiProperty({
    description: '현재 페이지',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '페이지당 항목 수',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: '전체 항목 수',
    example: 100,
  })
  total: number;
}
