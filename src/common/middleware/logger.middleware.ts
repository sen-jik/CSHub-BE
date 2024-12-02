import { Inject, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, query, params, body } = req;

    res.on('close', () => {
      const responseTime = Date.now() - start;
      const { statusCode } = res;

      this.logger.log(
        JSON.stringify({
          request: { method, originalUrl, query, params, body },
          response: { statusCode, responseTime },
        }),
      );
    });

    next();
  }
}
