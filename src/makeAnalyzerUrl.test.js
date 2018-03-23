import fs from 'fs';

import makeAnalyzerUrl from './makeAnalyzerUrl';

const filename = require.resolve('./__mocks__/fights.txt');
const report = JSON.parse(fs.readFileSync(filename, 'utf8'));

describe('makeAnalyzerUrl', () => {
  it('works with just a report code', () => {
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE')).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE');
  });
  it('returns the right fight', () => {
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE', 1)).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE/1-Mythic+Goroth+-+Kill+(3:01)');
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE', 3)).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE/3-Mythic+Demonic+Inquisition+-+Kill+(2:25)');
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE', 34)).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE/34-Mythic+Fallen+Avatar+-+Wipe+6+(3:56)');
  });
  it('allows fightId to be a string', () => {
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE', '34')).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE/34-Mythic+Fallen+Avatar+-+Wipe+6+(3:56)');
  });
  it('returns the last fight when selected', () => {
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE', 'last')).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE/42-Mythic+Fallen+Avatar+-+Wipe+14+(3:49)');
  });
  it('returns the right player', () => {
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE', 1, 1)).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE/1-Mythic+Goroth+-+Kill+(3:01)/1-Zerosatroll');
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE', 1, 75)).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE/1-Mythic+Goroth+-+Kill+(3:01)/75-Zerotorescue');
  });
  it('does not return a player when no fight was selected', () => {
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE', null, 1)).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE');
  });
  it('allows playerId to be a string', () => {
    expect(makeAnalyzerUrl(report, 'PROPERREPORTCODE', 1, '75')).toBe('https://wowanalyzer.com/report/PROPERREPORTCODE/1-Mythic+Goroth+-+Kill+(3:01)/75-Zerotorescue');
  });
});
