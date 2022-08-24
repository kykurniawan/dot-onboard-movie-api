import { Logger, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: any, res: any, next: (error?: any) => void) {
    this.logger.log('Request from ip: ' + req.ip);
    next();
  }
}
