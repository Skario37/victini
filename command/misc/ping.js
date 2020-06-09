const DISCORD = require('discord.js');

exports.run = async (client, message, args, level) => {
  const msg = await message.channel.send("Ping ?");

  const botPing = msg.createdTimestamp - message.createdTimestamp;
  const apiPing = Math.round(client.ws.ping);
  const average = ( botPing + apiPing ) / 2;

  const settings = client.getSettings(message.guild);

  var embed = new DISCORD.MessageEmbed();
  if (settings.embedColorEnabled) embed.setColor(settings.embedColor);
  else embed.setColor(client.embedColor);
  embed.addField( ":ping_pong: Pong !", `Bot Latency: ***${botPing}*** *ms*\nAPI Latency: ***${apiPing}*** *ms*` );
  switch (settings.serverLanguage.toLowerCase()) {
    case 'en':
      if        ( average <= 200  ) { embed.addField( "\u200b", `*${message.author} miss the ball! I am the best!*  :v:` );
      } else if ( average <= 1200 ) { embed.addField( "\u200b", `*It is a tense game!* ${message.author} is a good opponent! :v:` );
      } else if ( average >  1200 ) { embed.addField( "\u200b", `*${message.author} beat me!* Gratz, excellent duel! :v:` );
      }
      break;
    case 'fr':
    default:
      if        ( average <= 200  ) { embed.addField( "\u200b", `*${message.author} rate la balle !* Je suis trop rapide ! :v:` );
      } else if ( average <= 1200 ) { embed.addField( "\u200b", `*Ce match est tendu !* ${message.author} est un bon adversaire ! :v:` );
      } else if ( average >  1200 ) { embed.addField( "\u200b", `*${message.author} m'a battu !* Bravo, excellent duel ! :v:` );
      }
  }
  msg.edit(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["pong"],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: { fr : "Autre", en : "Misc" },
  description: {
    fr : "C'est comme *ping*... *PONG* t'as reçu une réponse.",
    en : "It's like *ping*... *PONG* you received a reply!"
  },
  usage: "ping"
};
