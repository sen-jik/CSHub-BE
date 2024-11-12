import { Controller, Get } from '@nestjs/common';
import { PointHistoryService } from '../application/point-history.service';

@Controller('point-histories')
export class PointHistoryController {
  constructor(private readonly pointHistoryService: PointHistoryService) {}

  @Get()
  findAll(): string {
    return this.pointHistoryService.findAll();
  }
}
