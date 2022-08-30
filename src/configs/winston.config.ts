import * as winston from 'winston';

const winstonFormat: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    (info: winston.Logform.TransformableInfo) =>
      `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`,
  ),
);

export const winstonConfig: winston.LoggerOptions = {
  transports: [
    new winston.transports.File({
      filename: 'app.log',
      format: winstonFormat,
    }),
    new winston.transports.Console({
      format: winstonFormat,
    }),
  ],
};
