# WoWAnalyzer Discord Bot [![Build Status](https://travis-ci.org/WoWAnalyzer/DiscordBot.svg?branch=master)](https://travis-ci.org/WoWAnalyzer/DiscordBot)

Here resides the WoWAnalyzer Discord Bot (source). This bot responds to WCL report links with a WoWAnalyzer.com link to get users to analyze themselves without lifting a finger (even if they don't read the pins). It doesn't do anything else. If a fight or player has been selected, it will provide a link straight to the results. It tries to ignore links that are unlikely to be for log reviewing, such as if they have filters, pins or are on other pages such as the timeline or rankings view. It also ignores the same report for 1 hour to allow you to theorycraft in peace.

You can add the bot with this link:

https://discordapp.com/oauth2/authorize?&client_id=368144406181838861&scope=bot&permissions=3072

For more information about the WoWAnalyzer project, please see the main repo: https://github.com/WoWAnalyzer/WoWAnalyzer or join us on Discord: https://discord.gg/AxphPxU

# I don't want no preview!

Ok here's what you do. You go to your channel permissions, add whatever bot rank you have and set *Embed links* to disallowed. That's it. Here are some screenshots of me doing this:

![image](https://user-images.githubusercontent.com/4565223/31564302-a7582c82-b062-11e7-8bef-7e4261783f7e.png)
![image](https://user-images.githubusercontent.com/4565223/31564315-ad904d1e-b062-11e7-84ba-95e28e80ab47.png)
![image](https://user-images.githubusercontent.com/4565223/31564322-b225186e-b062-11e7-8b9e-7d9ca940a260.png)

