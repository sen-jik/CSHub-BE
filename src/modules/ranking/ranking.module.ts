import { Module } from '@nestjs/common';
import { RankingController } from './presentation/ranking.controller';
import { RankingService } from './application/ranking.service';

@Module({
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
