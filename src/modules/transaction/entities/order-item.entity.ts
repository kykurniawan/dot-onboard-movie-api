import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MovieSchedule } from '../../movie/entities/movie-schedule.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Order, (order: Order) => order.orderItems)
  order: Order;

  @ManyToOne(
    () => MovieSchedule,
    (movieSchedule: MovieSchedule) => movieSchedule.order_items,
  )
  movie_schedule: MovieSchedule;

  @Column()
  quantity: number;

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'double' })
  sub_total_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
