import * as dotenv from 'dotenv';
import * as process from 'process';
import { Movie } from '../../src/modules/movie/entities/movie.entity';
import { User } from '../../src/modules/user/entities/user.entity';
import { Tag } from '../../src/modules/movie/entities/tag.entity';
import { runSeeders } from 'typeorm-extension';
import { DataSource } from 'typeorm';

(async () => {
  dotenv.config();

  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'app',
    entities: [User, Movie, Tag],
    synchronize: false,
    logging: true,
  });
  await dataSource.initialize();
  await runSeeders(dataSource);
})();
