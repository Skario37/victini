exports.run = async (client, message, args, level) => {
  const settings = client.getSettings(message.guild);
  const user = message.mentions.users.first() || {};
  const member = await message.guild.members.fetch(user.id) || await message.guild.members.fetch(args[0]);

  var amount = args[0];
  if (member.id) amount = args[1];
  
  if( isNaN(amount) || amount < 1 || amount > 100 ) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You must specify an amount between 1 and 100 messages to delete.");
        break;
      case 'fr':
      default:
        return message.reply("Doit spécifier un montant entre 1 et 100 messages à supprimer.");
    }
  }
  if( (isNaN(amount) || amount < 1 || amount > 100) && !member ) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You must specify a member and an amount, or only an amount, of messages to clean!");
        break;
      case 'fr':
      default:
        return message.reply("Doit spécifier un utilisateur et un montant, ou juste un montant, de messages à purger !");
    }
  }

  // Fetch 100 messages (will be filtered and lowered up to max amount requested)
  message.channel.messages.fetch({
   limit: 100,
  }).then((messages) => {
   if (member.id) {
     const filterBy = member.id ? member.id : client.user.id;
     messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
   } else {
     messages = messages.array().slice(0, amount);
   }
   message.channel.bulkDelete(messages);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["clear", "clean", "nettoyer"],
  permLevel: "Moderator"
};

exports.help = {
  name: "purge",
  category: { fr : "Modération", en : "Moderation" },
  description: {
    fr : "Supprime les derniers messages d'un salon ou d'un utilisateur.",
    en : "Delete last messages of a channel or guild member."
  },
  usage: "purge [@user] <amount>"
};
