import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
