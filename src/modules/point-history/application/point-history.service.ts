import { Injectable } from '@nestjs/common';

@Injectable()
export class PointHistoryService {
  findAll(): string {
    return 'point-history';
  }
}
