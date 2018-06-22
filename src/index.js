import Raven from 'raven';

import main from './main';

if (process.env.NODE_ENV === 'production') {
  console.log('Sentry is ENABLED');
  Raven.config('https://669adafa75124f91bff5754d9c34b13a@sentry.io/253783').install();
}

main(process.env.DISCORD_TOKEN);
