import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: any, res: any, next: (error?: any) => void) {
    this.logger.info('Request from ip: ' + req.ip);
    next();
  }
}
