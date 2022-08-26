import fs from "fs";
import errors from "request-promise-native/errors";

function getFights(reportCode: string): Promise<string> {
  return new Promise((resolve, reject) => {
    switch (reportCode) {
      case "PROPERREPORTCODE": {
        const filename = require.resolve("./fights.txt");
        fs.readFile(filename, "utf8", (_, fights) => {
          resolve(fights);
        });
        break;
      }
      default:
        reject(
          new errors.StatusCodeError(
            400,
            '{"error":"WCL API error","message":"{ \\"status\\": 400, \\"error\\": \\"This report does not exist or is private.\\" }"}',
            (null as unknown) as any,
            ({} as unknown) as any
          )
        );
        break;
    }
  });
}

module.exports = getFights;
