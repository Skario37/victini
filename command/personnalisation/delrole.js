exports.run = async (client, message, args, level) => {
  const settings = client.getSettings(message.guild);
  if (!message.member.hasPermission("MANAGE_ROLES")) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("Sorry You do not have permission to modify roles.");
        break;
      case 'fr':
      default:
        return message.reply("Désolé tu n'as pas la permission de modifier les rôles.");
    }
  }
  if (!args || args.length < 1) {
    switch (settings.serverLanguage.toLowerCase()) {
      case 'en':
        return message.reply("You forgot role id. Kappa.");
        break;
      case 'fr':
      default:
        return message.reply("T'as oublié l'id du rôle. Kappa.");
    }
  }

  const user = message.mentions.users.first();
  if (user) {
    args = args.filter(arg => arg != `<@!${user.id}>`);
    client.removeRole(message.guild, user, args.join(" "));
  } else {
    client.removeRole(message.guild, user, args.join(" "));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["removerole", "deleterole", "supprrole", "supprimerrole"],
  permLevel: "Moderator"
};

exports.help = {
  name: "delrole",
  category: { fr : "Personnalisation", en : "Custom" },
  description: {
    fr : "Supprime un rôle à un membre.",
    en : "Remove role to a guild member."
  },
  usage: "removerole [@user] <role>"
};
