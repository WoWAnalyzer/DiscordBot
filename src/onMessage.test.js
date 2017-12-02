import onMessage  from './onMessage';

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
      },
      guild: {
        id: 12345,
        name: 'Unit Test Server',
      },
      ...props,
    });
  });

  it('responds to a regular WCL link', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE');
      });
  });
  it('responds to a message with padding text', () => {
    const message = createMessage({
      content: 'Please review: https://www.warcraftlogs.com/reports/PROPERREPORTCODE. Thanks!',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE');
      });
  });
  it('does not respond to a message with an invalid or private report', () => {
    const message = createMessage({
      content: 'Please review: https://www.warcraftlogs.com/reports/AWRONGREPORTCODE. Thanks!',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).not.toHaveBeenCalled();
      });
  });
  it('ignores messages with multiple links', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L and https://www.warcraftlogs.com/reports/aaaaaaaaaaaaaaaa',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).not.toHaveBeenCalled();
      });
  });
  it('requires domain', () => {
    const message = createMessage({
      content: '/reports/AB1CDEf2G3HIjk4L',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).not.toHaveBeenCalled();
      });
  });
  it('responds to bots (like the WCL webhook)', () => {
    const message = createMessage({
      author: {
        bot: true,
      },
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).toHaveBeenCalled();
      });
  });
  it('preselects fight and player', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#fight=11&source=75&type=healing',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE/11-Mythic+Sisters+of+the+Moon+-+Kill+(5:16)/Zerotorescue');
      });
  });
  it('preselects fight when it\'s alone', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#fight=11',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE/11-Mythic+Sisters+of+the+Moon+-+Kill+(5:16)');
      });
  });
  it('preselects fight when it\'s last', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#fight=last',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE/42-Mythic+Fallen+Avatar+-+Wipe+14+(3:49)');
      });
  });
  it('ignores preselected player if fight isn\'t provided', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#source=75&type=healing',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/PROPERREPORTCODE');
      });
  });
  it('ignores reports with advanced filters', () => {
    const message1 = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#source=75&type=healing&start=2356367&end=2381131',
    });
    const message2 = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#fight=11&source=75&start=2356367&end=2381131&view=events&pins=2%24Off%24%23244F4B%24auras-gained%24-1%240.0.0.Any%240.0.0.Any%24true%240.0.0.Any%24true%2431821%24true%24true',
    });
    const message3 = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE/#source=75&fight=last&type=healing&phase=1',
    });
    expect.assertions(3);
    return Promise.all([
      onMessage(null, message1)
        .then(() => {
          expect(message1.channel.send).not.toHaveBeenCalled();
        }),
      onMessage(null, message2)
        .then(() => {
          expect(message2.channel.send).not.toHaveBeenCalled();
        }),
      onMessage(null, message3)
        .then(() => {
          expect(message2.channel.send).not.toHaveBeenCalled();
        }),
    ]);
  });
  it('puts a report on cooldown after sending it', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });
    const memoryHistory = require('./memoryHistory');

    expect.assertions(2);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).toHaveBeenCalled();
        expect(memoryHistory.putOnCooldown).toHaveBeenCalledWith(12345, 'PROPERREPORTCODE');
      });
  });
  it('ignores a report already on cooldown', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });
    const memoryHistory = require('./memoryHistory');
    memoryHistory.isOnCooldown = jest.fn(() => true);

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).not.toHaveBeenCalled();
      });
  });
  it('triggers the history purge check', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/PROPERREPORTCODE',
    });
    const memoryHistory = require('./memoryHistory');

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(memoryHistory.checkHistoryPurge).toHaveBeenCalled();
      });
  });
  it('handles emojis gracefully (does not trigger an unhandled promise rejection)', () => {
    const message = createMessage({
      content: 'pepe_oops:346683709187031041',
    });

    expect.assertions(1);
    return onMessage(null, message)
      .then(() => {
        expect(message.channel.send).not.toHaveBeenCalled();
      });
  });
});
