import { Module } from '@nestjs/common';
import { PointHistoryController } from './presentation/point-history.controller';
import { PointHistoryService } from './application/point-history.service';

@Module({
  controllers: [PointHistoryController],
  providers: [PointHistoryService],
})
export class PointHistoryModule {}
