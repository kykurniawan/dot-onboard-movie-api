import { DataSource } from 'typeorm';
import { typeOrmDataSourceConfig } from './typeorm.config';

export default new DataSource(typeOrmDataSourceConfig);
