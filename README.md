# Victini [Archive]
Discord bot including stories and Pocket Monsters from Pokémon. Uses Discord.js for the Discord API.

Bot originally created for the following Discord server: https://discord.gg/rJ67pjN

# Installation
This bot is not think for personnal installation but you can setup it for your own server. (Not for the moment, I made this bot private for yet)

### Default settings
```js
{
  "prefix": "v.",
  "modLogChannelID": "598583330719531115",
  "modRoleID": "564199961462439963",
  "adminRoleID": "536317214056251392",
  "systemNotice": "true",
  "welcomeChannelID": "536313473341063169",
  "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
  "welcomeEnabled": "false",
  "announceChannelID" : "536954645503934475",
  "annouceEnabled" : "false",
  "reportChannelID": "705954157403570257",
  "reportEnabled": "false",
  "embedColor": "#FFCC66",
  "embedColorEnabled": "false",
  "muteRoleID" : "706186120987148298",
  "muteEnabled" : "false",
  "serverLanguage" : "FR"
}
```
### Configuration (Server Owner)
```
  v.set edit <key> <value>
      Edit a key with given value

  v.set del <key>
      Restore a key to the default value

  v.set get <key>
      Display value of given key

  v.set
      Display whole configuration
```

# Usage
This bot offer some useful commands that can be shown with
`v.help`

### Server Owner
```
  v.announce <text>
    If announce channel is enabled, Victini display given message to it's channel.
```
### Moderation (Moderator)
```
  v.ban <@user/userID> <reason>
    Ban a user giving a reason why.
  
  v.kick <@user/userID> <reason>
    Kick a user giving a reason why.
    
  v.movemessage <messageID> <channelID>
    Move a message to another channel.
    
  v.mute <@user/userID> <1s/m/h/j>
    Mute a user with specified time (1s, 5m, 2h, 7d)
    
  v.unmute <@user/userID>
    Unmute a muted user.
    
  v.purge [@user] <amount>
    Clean lasts channel messages or user if given.
  
  v.report <@user/userID/messageID> [reason]
    Report a user giving a reason why or a message.
    e.g.
      v.report @Skario Did not patpat Victini.
      or
      v.report <messageID>
```
### Other
```
  v.ping
    *PONG* you received current bot network quality.
  
  v.stats
    Display bot stats
```

# Disclaimer
This in no way is meant to compete with official Pokémon games and all others Discord bot.

# Licence
This project is under the [MIT License](https://github.com/Skario37/Victini-Bot/blob/master/LICENSE)
