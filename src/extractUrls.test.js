import extractUrls from './extractUrls';

describe('extractUrls', () => {
  it('finds a link in a message', () => {
    const message = 'Could someone review this please? https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L Thanks!';

    expect(extractUrls(message)).toEqual([
      'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L',
    ]);
  });
  it('finds links with just domains', () => {
    const message = 'Could someone review this please? https://www.warcraftlogs.com Thanks!';

    expect(extractUrls(message)).toEqual([
      'https://www.warcraftlogs.com',
    ]);
  });
  it('finds multiple links in a message', () => {
    const message = 'Could someone review this please? https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L and https://www.warcraftlogs.com/reports/aaaaaaaaaaaaaaaa Thanks!';

    expect(extractUrls(message)).toEqual([
      'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L',
      'https://www.warcraftlogs.com/reports/aaaaaaaaaaaaaaaa',
    ]);
  });
  it('finds a link in a message without padding', () => {
    const message = 'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L';

    expect(extractUrls(message)).toEqual([
      'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L',
    ]);
  });
  it('finds a link in a message without subdomain', () => {
    const message = 'https://warcraftlogs.com/reports/AB1CDEf2G3HIjk4L';

    expect(extractUrls(message)).toEqual([
      'https://warcraftlogs.com/reports/AB1CDEf2G3HIjk4L',
    ]);
  });
  it('includes the query string', () => {
    const message = 'Could someone review this please? https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L?player=1 Thanks!';

    expect(extractUrls(message)).toEqual([
      'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L?player=1',
    ]);
  });
  it('includes the hash tag', () => {
    const message = 'Could someone review this please? https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L?player=1#fight=2 Thanks!';

    expect(extractUrls(message)).toEqual([
      'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L?player=1#fight=2',
    ]);
  });
  it('includes the hash tag with parenthesis', () => {
    const message = 'Could someone review this please? https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L?player=1#fight=(thanks!)';

    expect(extractUrls(message)).toEqual([
      'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L?player=1#fight=',
    ]);
  });
  it('ignores dots', () => {
    const message = 'Please review: https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L?player=1#fight=1.';

    expect(extractUrls(message)).toEqual([
      'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L?player=1#fight=1',
    ]);
  });
  it('returns an empty array when not finding a result', () => {
    const message = 'Please review my log.';

    expect(extractUrls(message)).toEqual([]);
  });
  it('is resistant to ReDoS', () => {
    {
      // We used the regex in https://stackoverflow.com/questions/11209016/javascript-extract-urls-from-string-inc-querystring-and-return-array/11209098#11209098 previously, but the bot was freezing whenever a url like the one below was posted in a message. Make sure that the issue isn't reintroduced.
      const message = '[https://stackoverflow.com/questions/11209016/javascript-extract-urls-from-string-inc-querystring-and-return-array/11209098#11209098](https://stackoverflow.com/questions/11209016/javascript-extract-urls-from-string-inc-querystring-and-return-array/11209098#11209098)';

      expect(extractUrls(message)).toEqual([
        'https://stackoverflow.com/questions/11209016/javascript-extract-urls-from-string-inc-querystring-and-return-array/11209098#11209098',
        'https://stackoverflow.com/questions/11209016/javascript-extract-urls-from-string-inc-querystring-and-return-array/11209098#11209098',
      ]);
    }
    {
      // According to https://github.com/medialize/URI.js/issues/131 this string could also cause issues:
      const message = "background-image:url('http://example.com/my/long/path/to/an/image.png')";
      expect(extractUrls(message)).toEqual([
        'http://example.com/my/long/path/to/an/image.png',
      ]);
    }
  });
});
