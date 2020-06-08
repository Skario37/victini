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

  // No time
  if (!args[1]) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You forgot to give a duration.");
        break;
      case 'fr':
      default:
        return message.reply("T'as oublié de donner une durée.");
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
        return message.reply("You cannot mute yourself...");
        break;
      case 'fr':
      default:
        return message.reply("Tu ne peux pas te muter...");
    }
  }

  // Permissions
  if (!member.manageable) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("I cannot mute this member.");
        break;
      case 'fr':
      default:
        return message.reply("Je ne peux pas muter ce membre.");
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

  await client.addRole(message.guild, member, muterole.id);
  switch (settings.serverLanguage.toLowerCase()) {
    case 'en':
      message.reply(`${member.user.toString()} has been muted for ${MS(MS(args[1]))}`);
      break;
    case 'fr':
    default:
      message.reply(`${member.user.toString()} a été muté pour ${MS(MS(args[1]))}`);
  }

  setTimeout(function(){
    client.removeRole(message.guild, member, muterole.id);
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        message.channel.send(`${member.user.toString()} has been demuted!`);
        break;
      case 'fr':
      default:
        message.channel.send(`${member.user.toString()} a été démuté !`);
    }
  }, MS(args[1]))
};



exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "mute",
  category: { fr : "Modération", en : "Moderation" },
  description: {
    fr : "Mute un membre du serveur.",
    en : "Mute a guild member."
  },
  usage: "mute <@user/userID> <1s/m/h/j>"
};
