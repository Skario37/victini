exports.run = async (client, message, args, level) => {
  await message.reply("Bot is shutting down.");
  await Promise.all(client.commands.map(cmd => {
    client.unloadCommand(cmd);
  }));
  process.exit(0);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "reboot",
  category: { fr : "Système", en : "System" },
  description: {
    fr : "Éteint Victini.",
    en : "Shutdown Victini."
  },
  usage: "reboot"
};
