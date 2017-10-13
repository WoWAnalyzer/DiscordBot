import onMessage from './onMessage';

describe('onMessage', () => {
  it('responds to a regular WCL link', () => {
    const message = {
      author: {
        bot: false,
      },
      channel: {
        send: jest.fn(),
      },
      content: 'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L',
    };

    onMessage(null, message);
    expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/AB1CDEf2G3HIjk4L');
  });
  it('requires domain', () => {
    const message = {
      author: {
        bot: false,
      },
      channel: {
        send: jest.fn(),
      },
      content: '/reports/AB1CDEf2G3HIjk4L',
    };

    onMessage(null, message);
    expect(message.channel.send).not.toHaveBeenCalled();
  });
  it('ignores bots', () => {
    const message = {
      author: {
        bot: true,
      },
      channel: {
        send: jest.fn(),
      },
      content: 'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L',
    };

    onMessage(null, message);
    expect(message.channel.send).not.toHaveBeenCalled();
  });
});
