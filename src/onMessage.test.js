import onMessage from './onMessage';
import { checkHistoryPurge, putOnCooldown } from './memoryHistory';

jest.mock('./getFights');
jest.mock('./memoryHistory');

describe('onMessage', () => {
  let createMessage;
  beforeEach(() => {
    createMessage = props => ({
      author: {
        bot: false,
      },
      channel: {
        send: jest.fn(),
        permissionsFor: jest.fn(() => ({
          has: jest.fn(() => true),
        })),
      },
      guild: {
        id: 12345,
        name: 'Unit Test Server',
      },
      content: '',
      embeds: [],
      ...props,
    });
    console.log = jest.fn();
  });

  it('responds to a regular WCL link', async () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });

    await onMessage({}, message);

    expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE');
  });
  it('responds to a message with padding text', async () => {
    const message = createMessage({
      content: 'Please review: https://www.warcraftlogs.com/reports/PROPERREPORTCODE. Thanks!',
    });

    await onMessage({}, message);

    expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE');
  });
  it('does not respond to a message with an invalid or private report', async () => {
    const message = createMessage({
      content: 'Please review: https://www.warcraftlogs.com/reports/AWRONGREPORTCODE. Thanks!',
    });

    await onMessage({}, message);

    expect(message.channel.send).not.toHaveBeenCalled();
  });
  it('ignores messages with multiple links', async () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L and https://www.warcraftlogs.com/reports/aaaaaaaaaaaaaaaa',
    });

    await onMessage({}, message);

    expect(message.channel.send).not.toHaveBeenCalled();
  });
  it('requires domain', async () => {
    const message = createMessage({
      content: '/reports/AB1CDEf2G3HIjk4L',
    });

    await onMessage({}, message);

    expect(message.channel.send).not.toHaveBeenCalled();
  });
  it('responds to bots (like the WCL webhook)', async () => {
    const message = createMessage({
      author: {
        bot: true,
      },
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });

    await onMessage({}, message);

    expect(message.channel.send).toHaveBeenCalled();
  });
  it('preselects fight and player', async () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#fight=11&source=75&type=healing',
    });

    await onMessage({}, message);

    expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE/11-Mythic+Sisters+of+the+Moon+-+Kill+(5:16)/75-Zerotorescue');
  });
  it('preselects fight when it\'s alone', async () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#fight=11',
    });

    await onMessage({}, message);

    expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE/11-Mythic+Sisters+of+the+Moon+-+Kill+(5:16)');
  });
  it('preselects fight when it\'s last', async () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#fight=last',
    });

    await onMessage({}, message);

    expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE/42-Mythic+Fallen+Avatar+-+Wipe+14+(3:49)');
  });
  it('ignores preselected player if fight isn\'t provided', async () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#source=75&type=healing',
    });

    await onMessage({}, message);

    expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE');
  });
  it('ignores reports with advanced filters', async () => {
    const message1 = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#source=75&type=healing&start=2356367&end=2381131',
    });

    await onMessage({}, message1);

    expect(message1.channel.send).not.toHaveBeenCalled();

    const message2 = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#fight=11&source=75&start=2356367&end=2381131&view=events&pins=2%24Off%24%23244F4B%24auras-gained%24-1%240.0.0.Any%240.0.0.Any%24true%240.0.0.Any%24true%2431821%24true%24true',
    });

    await onMessage({}, message2);

    expect(message2.channel.send).not.toHaveBeenCalled();

    const message3 = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#source=75&fight=last&type=healing&phase=1',
    });

    await onMessage({}, message3);

    expect(message2.channel.send).not.toHaveBeenCalled();
  });
  it('puts a report on cooldown after sending it', async () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });

    await onMessage({}, message);

    expect(message.channel.send).toHaveBeenCalled();
    expect(putOnCooldown).toHaveBeenCalledWith(12345, 'PROPERREPORTCODE');
  });
  describe('memoryHistory', async () => {
    const memoryHistory = require('./memoryHistory');
    beforeEach(() => {
      memoryHistory.isOnCooldown = jest.fn(() => true);
    });
    afterEach(() => {
      memoryHistory.isOnCooldown = jest.fn();
    });
    it('ignores a report already on cooldown', async () => {
      const message = createMessage({
        content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
      });

      await onMessage({}, message);

      expect(message.channel.send).not.toHaveBeenCalled();
    });
  });
  it('triggers the history purge check', async () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });

    await onMessage({}, message);

    expect(checkHistoryPurge).toHaveBeenCalled();
  });
  it('handles emojis gracefully (does not trigger an unhandled promise rejection)', async () => {
    const message = createMessage({
      content: 'pepe_oops:346683709187031041',
    });

    await onMessage({}, message);

    expect(message.channel.send).not.toHaveBeenCalled();
  });
  it('also responds to urls in embeds', async () => {
    const message = createMessage({
      embeds: [
        {
          url: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
        },
      ],
    });

    await onMessage({}, message);

    expect(message.channel.send).toHaveBeenCalled();
  });
});
