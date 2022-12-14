import * as dotenv from 'dotenv';
import * as process from 'process';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Movie } from '../modules/movie/entities/movie.entity';
import { User } from '../modules/user/entities/user.entity';
import { Tag } from '../modules/movie/entities/tag.entity';
import { MovieSchedule } from '../modules/movie/entities/movie-schedule.entity';
import { Studio } from '../modules/movie/entities/studio.entity';
import { Order } from '../modules/transaction/entities/order.entity';
import { OrderItem } from '../modules/transaction/entities/order-item.entity';
import { NowPlayingMovie } from '../modules/movie/entities/now-playing-movie.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'app',
  entities: [
    User,
    Movie,
    Tag,
    MovieSchedule,
    Studio,
    Order,
    OrderItem,
    NowPlayingMovie,
  ],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: false,
};

export const typeOrmConfigTest: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [
    User,
    Movie,
    Tag,
    MovieSchedule,
    Studio,
    Order,
    OrderItem,
    NowPlayingMovie,
  ],
  synchronize: true,
  logging: false,
};
