const DISCORD = require('discord.js');

exports.run = async (client, message, args, level) => {
  const settings = client.getSettings(message.guild);
  // No Message
  if (!args[0]) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You forget to give message id.");
        break;
      case 'fr':
      default:
        return message.reply("T'as oublié de donner l'id d'un message.");
    }
  }

  // No Channel
  if (!args[1]) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You forget to give channel id.");
        break;
      case 'fr':
      default:
        return message.reply("T'as oublié de donner l'id d'un salon.");
    }
  }

  const msg = await message.channel.messages.fetch(args[0]) || false;

  // No Message found
  if (!msg) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("Selected message not found.");
        break;
      case 'fr':
      default:
        return message.reply("Message selectionné introuvable.");
    }
  }

  // No Channel found
  const channel = message.guild.channels.cache.get(args[1]);
  if (!channel) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("Selected channel not found.");
        break;
      case 'fr':
      default:
        return message.reply("Salon selectionné introuvable.");
    }
  }

  const embedMessage = new DISCORD.MessageEmbed();
  if (settings.embedColorEnabled) embedMessage.setColor(settings.embedColor);
  else embedMessage.setColor(client.embedColor);
  embedMessage.setThumbnail(msg.author.avatarURL());
  switch (settings.serverLanguage.toLowerCase()) {
    case 'en':
      embedMessage.addField("Author :", msg.author.toString());
      embedMessage.addField("Message :", msg.content);
    case 'fr':
    default:
      embedMessage.addField("Auteur :", msg.author.toString());
      embedMessage.addField("Message :", msg.content);
  }

  channel.send(embedMessage);
  msg.delete();
};



exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["mm"],
  permLevel: "Moderator"
};

exports.help = {
  name: "movemessage",
  category: { fr : "Modération", en : "Moderation" },
  description: {
    fr : "Déplace un message dans un autre salon.",
    en : "Move selected message to another channel."
  },
  usage: "movemessage <messageID> <channel/channelID>"
};
