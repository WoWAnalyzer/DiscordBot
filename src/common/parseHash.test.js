import parseHash from './parseHash';

describe('parseHash', () => {
  it('converts a hash string to an object', () => {
    expect(parseHash('#fight=16&source=4')).toEqual({
      fight: '16',
      source: '4',
    });
    expect(parseHash('#fight=last&view=events')).toEqual({
      fight: 'last',
      view: 'events',
    });
  });
});
