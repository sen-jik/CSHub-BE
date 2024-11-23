import { Injectable } from '@nestjs/common';

@Injectable()
export class PointService {
  findAll(): string {
    return 'point';
  }
}
