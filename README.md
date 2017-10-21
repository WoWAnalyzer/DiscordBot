# WoWAnalyzer Discord Bot [![Build Status](https://travis-ci.org/WoWAnalyzer/DiscordBot.svg?branch=master)](https://travis-ci.org/WoWAnalyzer/DiscordBot)

Here resides the WoWAnalyzer Discord Bot (source). This bot responds to WCL report links with a WoWAnalyzer.com link to get users to analyze themselves without lifting a finger (even if they don't read the pins). It doesn't do anything else. If a fight or player has been selected, it will provide a link straight to the results. It tries to ignore links that are unlikely to be for log reviewing, such as if they have filters, pins or are on other pages such as the timeline or rankings view. It also ignores the same report for 1 hour to allow you to theorycraft in peace.

You can add the bot with this link:

https://discordapp.com/oauth2/authorize?&client_id=368144406181838861&scope=bot&permissions=3072

For more information about the WoWAnalyzer project, please see the main repo: https://github.com/WoWAnalyzer/WoWAnalyzer or join us on Discord: https://discord.gg/AxphPxU

# FAQ

**It stopped responding to my links!**

To avoid spamming when a log gets passed around a lot for analysis the bot ignores repeated links for the same report. (let us know if you think this should be more) This also includes links that were never responded to, such as if they have were ignored due to being presumed used for analysis. This may happen if the report link had an ability selected, was on an other view than the default, had a time or phase selection active or had a pin. All these factors cause the report URL to be assumed used for a reason other than a request for analysis, and will be ignored to avoid the bot being annoying.

**How do I limit it to specific channels?**

Discord hasn't made this very easy. You should make a group for bots and add that group to every single channel while revoking (red cross) its send and read message privileges (it's important to also revoke read message). Once done, also add the WoWAnalyzer bot to the channels you want and give it explicit permission (green check) to read and send messages. Make sure it's sorted above the bot group so that it overrides the permissions.

When making the bot group and blocking it from all channels you should include channels you want the bot to post in so that you can re-use the group for other bots you might want to listen to other channels. If you set it up like this adding other bots will be easy; Just assign them the bots group and add new exceptions to the channels those bots get access to.

**How do I disable the preview?**

Ok here's what you do. You go to your channel permissions, add whatever bot rank you have and set *Embed links* to disallowed. That's it. Here are some screenshots of me doing this:

![image](https://user-images.githubusercontent.com/4565223/31564302-a7582c82-b062-11e7-8bef-7e4261783f7e.png)
![image](https://user-images.githubusercontent.com/4565223/31564315-ad904d1e-b062-11e7-84ba-95e28e80ab47.png)
![image](https://user-images.githubusercontent.com/4565223/31564322-b225186e-b062-11e7-8b9e-7d9ca940a260.png)

