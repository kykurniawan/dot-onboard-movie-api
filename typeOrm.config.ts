import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { User } from './src/user/entities/user.entity';
import { CreateTables1661327539690 } from './src/database/migrations/1661327539690-CreateTables';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'app',
  entities: [User],
  migrations: [CreateTables1661327539690],
});
