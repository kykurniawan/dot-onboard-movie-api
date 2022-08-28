import { Get, Controller, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from './app.filter';

@Controller()
@UseFilters(new HttpExceptionFilter())
export class AppController {
  @Get()
  async root(@Res() res: Response) {
    return res.status(200).json({
      success: true,
      message: 'ok',
      data: null,
    });
  }
}
