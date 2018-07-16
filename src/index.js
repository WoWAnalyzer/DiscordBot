import Raven from 'raven';

import main from './main';

if (process.env.NODE_ENV === 'production') {
  console.log('Sentry is ENABLED');
  // I thought Sentry caught unhandled rejections by default now, but not so according to https://docs.sentry.io/clients/node/usage/#promises + it didn't catch some rejections
  Raven.config('https://669adafa75124f91bff5754d9c34b13a@sentry.io/253783', {
    captureUnhandledRejections: true
  }).install();
}

main(process.env.DISCORD_TOKEN);
