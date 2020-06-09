exports.run = async (client, message, args, level) => {
  client.home.wakeOnLan();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "wol",
  category: { fr : "Maison", en : "Home" },
  description: {
    fr : "Allume ton ordinateur.",
    en : "Wake your computer."
  },
  usage: "wol"
};
