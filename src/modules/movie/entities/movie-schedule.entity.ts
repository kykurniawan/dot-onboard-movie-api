import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from '../../transaction/entities/order-item.entity';
import { Movie } from './movie.entity';
import { Studio } from './studio.entity';

@Entity('movie_schedules')
export class MovieSchedule {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Movie, (movie: Movie) => movie.schedules)
  movie: Movie;

  @ManyToOne(() => Studio, (studio: Studio) => studio.schedules)
  studio: Studio;

  @OneToMany(
    () => OrderItem,
    (orderItem: OrderItem) => orderItem.movie_schedule,
  )
  order_items: OrderItem[];

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  price: number;

  @Column()
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
