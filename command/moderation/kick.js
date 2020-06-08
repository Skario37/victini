const DISCORD = require('discord.js');

exports.run = async (client, message, args, level) => {
  const settings = client.getSettings(message.guild);
  // Permissions
  if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("Sorry I do not have kick permission.");
        break;
      case 'fr':
      default:
        return message.reply("Désolé je n'ai pas la permission d'expulser.");
    }
  }
  if (!message.member.hasPermission("KICK_MEMBERS")) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("Sorry you do not have kick permission.");
        break;
      case 'fr':
      default:
        return message.reply("Désolé tu n'as pas la permission d'expulser.");
    }
  }

  // No mention
  if (!args[0]) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You forgot to kick someone.");
        break;
      case 'fr':
      default:
        return message.reply("T'as oublié d'expulser quelqu'un.");
    }
  }

  // No reason
  if (!args[1]) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You forgot to give a reason.");
        break;
      case 'fr':
      default:
        return message.reply("T'as oublié de donner une raison.");
    }
  }

  const user = message.mentions.users.first() || {};
  const member = await message.guild.members.fetch(user.id) || await message.guild.members.fetch(args[0]);

  // No member found
  if (!member.id) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply(`I do not find this member : ${args[0]}`);
        break;
      case 'fr':
      default:
        return message.reply(`Je ne trouve pas ce membre : ${args[0]}`);
    }
  }

  if (message.author.id === member.id) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You cannot kick yourself...");
        break;
      case 'fr':
      default:
        return message.reply("Tu ne peux pas t'expulser...");
    }
  }

  if (!member.kickable) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("I cannot kick this member.");
        break;
      case 'fr':
      default:
        return message.reply("Je ne peux pas expulser ce membre.");
    }
  }

  const promptEmbed = new DISCORD.MessageEmbed();
  if (settings.embedColorEnabled) promptEmbed.setColor(settings.embedColor);
  else promptEmbed.setColor(client.embedColor);
  switch (settings.serverLanguage.toLowerCase()) {
    case 'en':
      promptEmbed.setAuthor("This check will become nvalid after 30s.")
      promptEmbed.setDescription(`Kick ${member}?`);
      break;
    case 'fr':
    default:
      promptEmbed.setAuthor("Cette vérification deviendra invalide après 30s.")
      promptEmbed.setDescription(`Expulser ${member} ?`);
  }

  message.channel.send(promptEmbed).then(async msg => {
    const emoji = await client.promptMessage(msg, message.author, 30, ["✅","❌"]);

    if (emoji === "✅") {
      msg.delete();

      member.kick(args.slice(1).join(" "));
    } else if (emoji === "❌") {
      msg.delete();

      switch (settings.serverLanguage.toLowerCase()) {
        case 'en':
          message.reply("Kick narrowly canceled...");
          break;
        case 'fr':
        default:
          message.reply("Expulsion annulée de justesse...");
      }
    }
  });
};



exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "kick",
  category: { fr : "Modération", en : "Moderation" },
  description: {
    fr : "Expulse un membre du serveur.",
    en : "Kick a guild member."
  },
  usage: "kick <@user/userID> <reason>"
};
