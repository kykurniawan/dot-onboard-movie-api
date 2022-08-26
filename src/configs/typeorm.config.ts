import * as dotenv from 'dotenv';
import * as process from 'process';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Movie } from 'src/modules/movie/entities/movie.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Tag } from 'src/modules/movie/entities/tag.entity';
import { DataSourceOptions } from 'typeorm';
import { MovieSchedule } from 'src/modules/movie/entities/movie-schedule.entity';
import { Studio } from 'src/modules/movie/entities/studio.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'app',
  entities: [User, Movie, Tag, MovieSchedule, Studio],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
};

export const typeOrmDataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'app',
  entities: [User, Movie, Tag, MovieSchedule, Studio],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
};
