# Contributing

As always documentating sucks so this will be pretty basic. We're available on the Discord for more info.

I assume you're familiar with the main project setup.

## Setup testing environment

1. `npm install`
2. `npm start`
3. notice it complain about token
4. Do this: https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token (name it something like "WoWAnalyzer DEV")
5. Set token in environment variable and then run;
    * PowerShell: `$env:DISCORD_TOKEN="YoURAmaZINgLyLong-ToKEN"; npm start`
    * cmd.exe: `set DISCORD_TOKEN=YoURAmaZINgLyLong-ToKEN&& npm start` (no space between token and &&!)
    * UNIX: `DISCORD_TOKEN=YoURAmaZINgLyLong-ToKEN npm start`
