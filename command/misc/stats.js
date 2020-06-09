const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  message.channel.send(`= STATS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.cache.size.toLocaleString()}
• Invite     :: <https://discord.gg/rJ67pjN>
• Guilds     :: ${client.guilds.cache.size.toLocaleString()}
• Discord.js :: ${version}
• Node       :: ${process.version}`, {code: "asciidoc"});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["stat"],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: { fr : "Autre", en : "Misc" },
  description: { 
    fr : "Statistiques sur Victini.",
    en : "Victini statistics."
  },
  usage: "stats"
};
