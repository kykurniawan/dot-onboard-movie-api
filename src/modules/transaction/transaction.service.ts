import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieScheduleService } from '../movie/services/movie-schedule.service';
import { UserService } from '../user/user.service';
import { OrderDto } from './dto/order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly movieScheduleService: MovieScheduleService,
    private readonly userService: UserService,
  ) {}

  async preview(orderDto: OrderDto) {
    const { items } = orderDto;
    let totalQuantity = 0;
    const orderItems = [];
    let totalPrice = 0;
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const schedule = await this.movieScheduleService.findOneScheduleById(
        item.movie_schedule_id,
      );
      totalQuantity += item.qty;
      const subTotal = schedule.price * item.qty;
      totalPrice += subTotal;
      orderItems.push({
        movie: {
          id: schedule.movie.id,
          title: schedule.movie.title,
        },
        studio_number: schedule.studio.studio_number,
        qty: item.qty,
        price: schedule.price,
        sub_total_price: subTotal,
        schedule_id: schedule.id,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      });
    }
    return {
      total_qty: totalQuantity,
      total_price: totalPrice,
      item_details: orderItems,
    };
  }

  async checkout(userId: number, orderDto: OrderDto): Promise<Order> {
    const previewResult = await this.preview(orderDto);

    const items = [];
    for (let index = 0; index < previewResult.item_details.length; index++) {
      const item = previewResult.item_details[index];
      const schedule = await this.movieScheduleService.findOneScheduleById(
        item.schedule_id,
      );

      const orderItem = new OrderItem();
      orderItem.movie_schedule = schedule;
      orderItem.quantity = item.qty;
      orderItem.price = item.price;
      orderItem.sub_total_price = item.sub_total_price;
      const newOrderItem = await this.orderItemRepository.save(orderItem);
      items.push(newOrderItem);
    }

    const user = await this.userService.findOneId(userId);

    const order = new Order();
    order.orderItems = items;
    order.payment_method = orderDto.payment_method;
    order.user = user;
    order.total_item_price = previewResult.total_price;

    return await this.orderRepository.save(order);
  }
}
