exports.run = async (client, message, args, level) => {
  if (!args || args.length < 1) return message.reply("T'as oublié d'annoncer quelque chose. Kappa.");

  const settings = client.getSettings(message.guild);
  if (settings.announceEnabled !== "true") return;

  message.guild.channels.find(c => c.name === settings.announceChannel).send(args.join(" "));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["announce"],
  permLevel: "Server Owner"
};

exports.help = {
  name: "annonce",
  category: { fr : "Système", en : "System" },
  description: {
    fr : "Envoie un message d'annonce dans le channel approprié.",
    en : "Send announce message in the correct channel."
  },
  usage: "announce <text>"
};
