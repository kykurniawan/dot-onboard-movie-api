import * as dotenv from 'dotenv';
import * as process from 'process';
import { CacheModuleOptions } from '@nestjs/common/cache';
import * as redisStore from 'cache-manager-redis-store';

dotenv.config();

export const cacheConfig: CacheModuleOptions = {
  isGlobal: true,
  ttl: 60,
  store: redisStore.create({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  }),
};
