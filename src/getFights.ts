import request from "request-promise-native";

async function getFights(reportCode: string) {
  const jsonString = await request.get({
    url: `https://wowanalyzer.com/i/v1/report/fights/${reportCode}?translate=true`,
    headers: {
      "User-Agent": "WoWAnalyzer.com DiscordBot",
    },
    gzip: true, // using gzip is 80% quicker
    forever: true, // we'll be making several requests, so pool connections
  });

  return jsonString;
}

export default getFights;
