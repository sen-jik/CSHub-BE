import { Controller, Get } from '@nestjs/common';
import { PointService } from '../application/point.service';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get()
  findAll(): string {
    return this.pointService.findAll();
  }
}
