# WoWAnalyzer Discord Bot [![Build Status](https://travis-ci.org/WoWAnalyzer/DiscordBot.svg?branch=master)](https://travis-ci.org/WoWAnalyzer/DiscordBot)

Here resides the WoWAnalyzer Discord Bot. This bot responds to any WCL report links with a WoWAnalyzer.com link to point people in the self-analysis direction we all so much prefer over manual labour. It doesn't do anything else. The goal is to have it recognize selected fights, players and ignore logs that look like they're from smart people that don't want no pesky bots responding to them (e.g. with a filter in the link). It might not yet do those things at the time you're reading this, but this text is likely going to get outdated soon so I can't tell you for sure.

You can add the bot with this link:

https://discordapp.com/oauth2/authorize?&client_id=368144406181838861&scope=bot&permissions=3072

For more information about the WoWAnalyzer project, please see the main repo: https://github.com/WoWAnalyzer/WoWAnalyzer or join us on Discord: https://discord.gg/AxphPxU

# FAQ

**It stopped responding to my links!**
To avoid spamming during analysis, the bot only responds to a post report once per hour. (let us know if you think this should be more)

**How do I limit it to specific channels?**
Discord hasn't made this very easy. You should make a group for bots and add that group to every single channel while revoking (red cross) its send and read message privileges (it's important to also revoke read message). Once done, also add the WoWAnalyzer bot to the channels you want and give it explicit permission (green check) to read and send messages. Make sure it's sorted above the bot group so that it overrides the permissions.

When making the bot group and blocking it from all channels you should include channels you want the bot to post in so that you can re-use the group for other bots you might want to listen to other channels. If you set it up like this adding other bots will be easy. Just assign them the general bots group and add exceptions to the channels those bots get access to.

**How do I disable the preview?**

Ok here's what you do. You go to your channel permissions, add whatever bot rank you have and set *Embed links* to disallowed. That's it. Here are some screenshots of me doing this:

![image](https://user-images.githubusercontent.com/4565223/31564302-a7582c82-b062-11e7-8bef-7e4261783f7e.png)
![image](https://user-images.githubusercontent.com/4565223/31564315-ad904d1e-b062-11e7-84ba-95e28e80ab47.png)
![image](https://user-images.githubusercontent.com/4565223/31564322-b225186e-b062-11e7-8b9e-7d9ca940a260.png)

