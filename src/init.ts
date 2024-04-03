import * as Sentry from '@sentry/node';
import fs from 'fs';

import loadDotEnv from './env';
import './metrics';

process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
const appDirectory = fs.realpathSync(process.cwd());

loadDotEnv(appDirectory);

if (process.env.NODE_ENV === 'production') {
  console.log('Sentry is ENABLED');
  Sentry.init({
    dsn: 'https://669adafa75124f91bff5754d9c34b13a@o105799.ingest.sentry.io/253783',
    tracesSampleRate: 1.0,
  });

  Sentry.enableAnrDetection({ captureStackTrace: true }).catch(console.error);
}
