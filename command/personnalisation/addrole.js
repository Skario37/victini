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

  const user = message.mentions.users.first() || {};
  const member = message.guild.members.fetch(user.id) || message.guild.members.fetch(args[0]);

  if (member) {
    args = args.filter(arg => arg != `<@!${member.id}>`);
    client.addRole(message.guild, member, args.join(" "));
  } else {
    client.addRole(message.guild, message.author, args.join(" "));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ajouterrole", "ajoutrole"],
  permLevel: "Moderator"
};

exports.help = {
  name: "addrole",
  category: { fr : "Personnalisation", en : "Custom" },
  description: {
    fr : "Ajoute un rôle à un membre.",
    en : "Add role to a guild member."
  },
  usage: "addrole [@user] <role>"
};
