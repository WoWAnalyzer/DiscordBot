import onMessage from './onMessage';

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
      ...props,
    });
  });

  it('responds to a regular WCL link', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L',
    });

    onMessage(null, message);
    expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/AB1CDEf2G3HIjk4L');
  });
  it('responds to a message with padding text', () => {
    const message = createMessage({
      content: 'Please review: https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L. Thanks!',
    });

    onMessage(null, message);
    expect(message.channel.send).toHaveBeenCalledWith('https://wowanalyzer.com/report/AB1CDEf2G3HIjk4L');
  });
  it('ignores messages with multiple links', () => {
    const message = createMessage({
      content: 'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L and https://www.warcraftlogs.com/reports/aaaaaaaaaaaaaaaa',
    });

    onMessage(null, message);
    expect(message.channel.send).not.toHaveBeenCalled();
  });
  it('requires domain', () => {
    const message = createMessage({
      content: '/reports/AB1CDEf2G3HIjk4L',
    });

    onMessage(null, message);
    expect(message.channel.send).not.toHaveBeenCalled();
  });
  it('ignores bots', () => {
    const message = createMessage({
      author: {
        bot: true,
      },
      content: 'https://www.warcraftlogs.com/reports/AB1CDEf2G3HIjk4L',
    });

    onMessage(null, message);
    expect(message.channel.send).not.toHaveBeenCalled();
  });
});
