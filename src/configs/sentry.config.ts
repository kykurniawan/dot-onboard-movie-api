import * as dotenv from 'dotenv';
import * as process from 'process';
import * as Sentry from '@sentry/node';

dotenv.config();

export const sentryConfig: Sentry.NodeOptions = {
  dsn: process.env.SENTRY_DSN,
};
