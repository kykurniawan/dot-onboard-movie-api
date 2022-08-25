import * as dotenv from 'dotenv';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './app.middleware';
import { WinstonModule } from 'nest-winston';
import { MovieModule } from './movie/movie.module';
import * as winston from 'winston';
dotenv.config();

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          filename: 'app.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        }),
      ],
    }),
    MovieModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
