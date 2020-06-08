const MS = require("ms");

exports.run = async (client, message, args, level) => {
  const settings = client.getSettings(message.guild);
  if (settings.muteEnabled === "false") {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("This command is deactivated on this server.");
        break;
      case 'fr':
      default:
        return message.reply("Cette commande est désactivée sur ce serveur.");
    }
  }

  const user = message.mentions.users.first() || {};
  const member = await message.guild.members.fetch(user.id) || await message.guild.members.fetch(args[0]);

  // No mention
  if (!args[0]) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You forgot to mention member.");
        break;
      case 'fr':
      default:
        return message.reply("T'as oublié de mentionner un membre.");
    }
  }


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
        return message.reply("You cannot demute yourself...");
        break;
      case 'fr':
      default:
        return message.reply("Tu ne peux pas te démuter...");
    }
  }

  // Permissions
  if (!member.manageable) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("I cannot demute this member.");
        break;
      case 'fr':
      default:
        return message.reply("Je ne peux pas démuter ce membre.");
    }
  }

  let muterole = message.guild.roles.cache.get(settings.muteRoleID) || false;
  if (!muterole) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply(`I cannot find a corresponding role : ${settings.muteRoleID}`);
        break;
      case 'fr':
      default:
        return message.reply(`Je ne trouve pas de rôle correspondant : ${settings.muteRoleID}`);
    }
  }

  if (member.roles.cache.get(muterole.id)) {
    await client.removeRole(message.guild, member, muterole.id);
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        message.reply(`${member.user.toString()} has been unmuted!`);
        break;
      case 'fr':
      default:
        message.reply(`${member.user.toString()} a été démuté !`);
    }
  }
};



exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "unmute",
  category: { fr : "Modération", en : "Moderation" },
  description: {
    fr : "Démute un membre du serveur.",
    en : "Unmute a guild member."
  },
  usage: "unmute <@user/userID>"
};
