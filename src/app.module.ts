import * as dotenv from 'dotenv';
import {
  HttpException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './app.middleware';
import { WinstonModule } from 'nest-winston';
import { MovieModule } from './modules/movie/movie.module';
import * as winston from 'winston';
import { BackofficeModule } from './modules/backoffice/backoffice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobModule } from './modules/cronjob/cronjob.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AppController } from './app.controller';
import { RavenModule } from 'nest-raven';
import { RavenInterceptor } from 'nest-raven/dist/raven.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

dotenv.config();

const winstonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`,
  ),
);

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          filename: 'app.log',
          format: winstonFormat,
        }),
        new winston.transports.Console({
          format: winstonFormat,
        }),
      ],
    }),
    UserModule,
    AuthModule,
    MovieModule,
    BackofficeModule,
    CronjobModule,
    TransactionModule,
    RavenModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({
        filters: [
          {
            type: HttpException,
            filter: (exception: HttpException) => 500 > exception.getStatus(),
          },
        ],
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
