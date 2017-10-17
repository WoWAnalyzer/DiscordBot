const debug = true || process.env.NODE_ENV === 'development'; // log by default for now so we can analyze where it needs improving

// This will contain recently posted reports to avoid repeating our message
let history = {};

const MINUTE = 60;
const HOUR = 3600;
const HISTORY_PURGE_INTERVAL_MS = MINUTE * 1000;
const HISTORY_EXPIRATION_MS = HOUR * 1000;
function purgeHistory() {
  debug && console.log('Checking history for expiries....');
  const now = +new Date();
  Object.keys(history).forEach(serverId => {
    const serverHistory = history[serverId];
    let hasItem = false;
    Object.keys(serverHistory).forEach(key => {
      hasItem = true;
      const createdAt = serverHistory[key];
      if (now > (createdAt + HISTORY_EXPIRATION_MS)) {
        delete serverHistory[key];
        debug && console.log(key, 'expired.');
      }
    });
    if (!hasItem) {
      delete history[serverId];
    }
  });
}
let lastHistoryPurge = new Date();
export function checkHistoryPurge() {
  const now = +new Date();
  if ((now - lastHistoryPurge) > HISTORY_PURGE_INTERVAL_MS) {
    lastHistoryPurge = now;
    // Wait until next tick so that this request doesn't get slowed down
    process.nextTick(purgeHistory);
  }
}
export function resetHistory() {
  history = {};
}
export function isOnCooldown(serverId, reportCode) {
  const serverHistory = history[serverId];
  return serverHistory && serverHistory[reportCode] && (serverHistory[reportCode] + HISTORY_EXPIRATION_MS) > +new Date();
}
export function putOnCooldown(serverId, reportCode) {
  history[serverId] = history[serverId] || {};
  history[serverId][reportCode] = +new Date();
}
