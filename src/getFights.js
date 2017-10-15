import request from 'request-promise-native';

async function getFights(reportCode) {
  const jsonString = await request.get({
    url: `https://wowanalyzer.com/api/v1/report/fights/${reportCode}?translate=true`,
    headers: {
      'User-Agent': 'WoWAnalyzer.com DiscordBot',
    },
    gzip: true, // using gzip is 80% quicker
    forever: true, // we'll be making several requests, so pool connections
  });

  return jsonString;
}

module.exports = getFights;
