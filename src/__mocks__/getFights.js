import fs from 'fs';
import errors from 'request-promise-native/errors';

function getFights(reportCode) {
  return new Promise((resolve, reject) => {
    switch (reportCode) {
      case 'PROPERREPORTCODE': {
        const filename = require.resolve('./fights.txt');
        fs.readFile(filename, 'utf8', (_, fights) => {
          resolve(fights);
        });
        break;
      }
      default:
        reject(new errors.StatusCodeError(400, '{"error":"WCL API error","message":"{ \\"status\\": 400, \\"error\\": \\"This report does not exist or is private.\\" }"}'));
        break;
    }
  });
}

module.exports = getFights;
