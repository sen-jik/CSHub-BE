import { Module } from '@nestjs/common';
import { PointController } from './presentation/point.controller';
import { PointService } from './application/point.service';

@Module({
  controllers: [PointController],
  providers: [PointService],
})
export class PointModule {}
