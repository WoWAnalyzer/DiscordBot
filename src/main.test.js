// noinspection JSFileReferences
import Discord from 'discord.js';

import main from './main';

describe('main', () => {
  it('errors when missing a token', () => {
    console.error = jest.fn();
    expect(main()).toBe(false);
    // It should let us know what happened
    expect(console.error).toHaveBeenCalled();
  });
  it('tries to login with the token', () => {
    const login = jest.fn();
    Discord.Client = jest.fn(() => ({
      on: jest.fn(),
      login,
    }));
    main('test-token');
    expect(Discord.Client).toHaveBeenCalled();
    expect(login).toHaveBeenCalledWith('test-token');
  });
});
