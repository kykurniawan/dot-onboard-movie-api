import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from '../../app.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JWTUser } from '../auth/strategies/jwt.strategy';
import { OrderDto } from './dto/order.dto';
import { TransactionService } from './transaction.service';

@Controller('order')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('preview')
  async previewOrder(@Body() orderDto: OrderDto, @Res() res: Response) {
    const previewResult = await this.transactionService.preview(orderDto);
    return res.status(200).json({
      success: true,
      message: 'order preview',
      data: previewResult,
    });
  }

  @Post('checkout')
  async checkoutOrder(
    @Body() orderDto: OrderDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as JWTUser;
    const order = await this.transactionService.checkout(
      user.user_id,
      orderDto,
    );

    return res.status(201).json({
      success: true,
      meessage: 'checkout success',
      data: {
        order: order,
      },
    });
  }
}
