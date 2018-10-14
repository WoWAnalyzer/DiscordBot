// noinspection JSFileReferences
import Discord from 'discord.js';

import bot from './bot';

describe('main', () => {
  it('errors when missing a token', () => {
    console.error = jest.fn();
    expect(bot()).toBe(false);
    // It should let us know what happened
    expect(console.error).toHaveBeenCalled();
  });
  it('tries to login with the token', () => {
    const login = jest.fn();
    Discord.Client = jest.fn(() => ({
      on: jest.fn(),
      login,
    }));
    bot('test-token');
    expect(Discord.Client).toHaveBeenCalled();
    expect(login).toHaveBeenCalledWith('test-token');
  });
});
