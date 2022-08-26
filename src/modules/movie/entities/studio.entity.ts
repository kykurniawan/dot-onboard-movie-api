import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MovieSchedule } from './movie-schedule.entity';

@Entity('studios')
export class Studio {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  studio_number: number;

  @Column()
  seat_capacity: number;

  @OneToMany(
    () => MovieSchedule,
    (movieSchedule: MovieSchedule) => movieSchedule.studio,
  )
  schedules: MovieSchedule[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
