import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  overview: string;

  @Column({ length: 255 })
  poster: string;

  @Column({ type: 'datetime' })
  play_until: Date;

  @ManyToMany(() => Tag, (tag: Tag) => tag.movies)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
