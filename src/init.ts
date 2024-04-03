import fs from 'fs';
import Raven from 'raven';

import loadDotEnv from './env';
import './metrics';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const appDirectory = fs.realpathSync(process.cwd());

loadDotEnv(appDirectory);

if (process.env.NODE_ENV === 'production') {
  console.log('Sentry is ENABLED');
  // I thought Sentry caught unhandled rejections by default now, but not so according to https://docs.sentry.io/clients/node/usage/#promises + it didn't catch some rejections
  Raven.config('https://669adafa75124f91bff5754d9c34b13a@o105799.ingest.sentry.io/253783', {
    captureUnhandledRejections: true
  }).install();
} else {
  console.log('Sentry is DISABLED');
}
