exports.run = async (client, message, args, level) => {
  if (!args || args.length < 1) return message.reply("Je ne dirais rien. Kappa.");
  message.channel.send(args.join(" "));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["repeat"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "say",
  category: { fr : "Système", en : "System" },
  description: {
    fr : "Demande à Victini de répéter.",
    en : "Ask Victini to repeat."
  },
  usage: "say <text>"
};
