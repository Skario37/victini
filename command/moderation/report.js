const DISCORD = require('discord.js');

exports.run = async (client, message, args, level) => {
  const settings = client.getSettings(message.guild);
  if (settings.reportEnabled === "false") {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("This command is deactivated on this server.");
        break;
      case 'fr':
      default:
        return message.reply("Cette commande est désactivée sur ce serveur.");
    }
  }

  // No Arg
  if (!args[0]) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You forgot to mention member or message id.");
        break;
      case 'fr':
      default:
        return message.reply("T'as oublié de mentionner un membre ou l'id d'un message.");
    }
  }

  const user = message.mentions.users.first() || {};
  const member = await message.guild.members.fetch(user.id) || await message.guild.members.fetch(args[0]);
  var msg = false;
  if (!member.id) {
    msg = await message.channel.messages.fetch(args[0]) || false;
  }

  // No found
  if ( !member.id && !msg ) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("I did not find neither member or message.");
        break;
      case 'fr':
      default:
        return message.reply("Je ne trouve ni membre ni message.");
    }
  }

  // No reason
  if (member.id && !args[1]) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("Invalid reason.");
        break;
      case 'fr':
      default:
        return message.reply("Raison invalide.");
    }
  }

  const embedMessage = new DISCORD.MessageEmbed();
  if (settings.embedColorEnabled) embedMessage.setColor(settings.embedColor);
  else embedMessage.setColor(client.embedColor);
  switch (settings.serverLanguage.toLowerCase()) {
    case 'en':
      embedMessage.setTitle("Reports");
  
      if (!msg) {
        embedMessage.setThumbnail(member.user.avatarURL());
        embedMessage.addField("Suspect :", `${member.user.toString()}`);
        embedMessage.addField("ID :", `${member.user.id}`);
        embedMessage.addField("Reason :", args.slice(1).join(" "));
      } else {
        embedMessage.setThumbnail(msg.author.avatarURL());
        embedMessage.addField("Suspect :", `${msg.author.toString()}`);
        embedMessage.addField("ID :", `${msg.author.id}`);
        embedMessage.addField("Message :", msg.content);
      }

      embedMessage.addField("Accuser :", `${message.author.toString()}`);
      embedMessage.addField("ID :", `${message.author.id}`);
      break;
    case 'fr':
    default:
      embedMessage.setTitle("Reports");
  
      if (!msg) {
        embedMessage.setThumbnail(member.user.avatarURL());
        embedMessage.addField("Suspect :", `${member.user.toString()}`);
        embedMessage.addField("ID :", `${member.user.id}`);
        embedMessage.addField("Raison :", args.slice(1).join(" "));
      } else {
        embedMessage.setThumbnail(msg.author.avatarURL());
        embedMessage.addField("Suspect :", `${msg.author.toString()}`);
        embedMessage.addField("ID :", `${msg.author.id}`);
        embedMessage.addField("Message :", msg.content);
      }

      embedMessage.addField("Accusateur :", `${message.author.toString()}`);
      embedMessage.addField("ID :", `${message.author.id}`);
  }

  message.guild.channels.cache.get(settings.reportChannelID).send(embedMessage);
};



exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "report",
  category: { fr : "Modération", en : "Moderation" },
  description: {
    fr : "Aide les modérateurs en dénonçant un comportement allant à l'encontre des règles du serveur. (Donner une raison mention membre)",
    en : "Help moderators by reporting behavior that goes against server rules. (Give reason using mention)"
  },
  usage: "report <@user/userID/messageID> [reason]"
};
