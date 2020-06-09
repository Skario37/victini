exports.run = async (client, message, args, level) => {
  const settings = client.getSettings(message.guild);
  const friendly = client.permlevelSettings.find(l => l.level === level).name;
  switch (settings.serverLanguage.toLowerCase()) {
    case 'en':
      message.reply(`Your permission level is: ${level} - ${friendly}`);
      break;
    case 'fr':
    default:
      message.reply(`Votre niveau de permission est : ${level} - ${friendly}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["perm", "perms"],
  permLevel: "User"
};

exports.help = {
  name: "permission",
  category: { fr : "Autre", en : "Misc" },
  description: { 
    fr :"Affiche le niveau de permission pour l'emplacement actuel du message.",
    en : "Display permission level for the current message location.",
  },
  usage: "permission"
};
