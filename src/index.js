import Raven from 'raven';

import main from './main';

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://669adafa75124f91bff5754d9c34b13a:b07f6d83af184b18ac2a554d0509e2f6@sentry.io/253783', {
    captureUnhandledRejections: true,
  }).install();
}

main(process.env.DISCORD_TOKEN);
