exports.run = async (client, message, args, level) => {
  const settings = client.getSettings(message.guild);
  if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("Sorry I do not have permission to modify nickname.");
        break;
      case 'fr':
      default:
        return message.reply("Désolé je n'ai pas la permission de modifier les pseudos.");
    }
  }

  if (!args || args.length < 1) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You must specify nickname to use!");
        break;
      case 'fr':
      default:
        return message.reply("Tu dois spécifier un pseudonyme à utiliser !");
    }
  }
  
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("Sorry you do not have permission to modify nicknames.");
        break;
      case 'fr':
      default:
        return message.reply("Désolé tu n'as pas la permission de modifier les pseudos.");
    }
  }

  const user = message.mentions.users.first() || message.author;

  if (user.id === client.config.ownerID) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("Sorry I can not change nickname of my Master.");
        break;
      case 'fr':
      default:
        return message.reply("Désolé je ne peux pas modifier le pseudo de mon Maître.");
    }
  }


  args = args.filter(arg => arg != `<@!${user.id}>`);
  message.guild.members.cache.get(user.id).setNickname(args.join(" "));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["nickname", "pseudo", "surnom"],
  permLevel: "User"
};

exports.help = {
  name: "nick",
  category: { fr : "Personnalisation", en : "Custom" },
  description: {
    fr : "Change votre pseudo sur le serveur.",
    en : "Modify your nickname on server."
  },
  usage: "nick [@user] <nickname>"
};
