exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args || args.length < 1) return message.reply("T'as oublié le nom du module. Kappa.");

  response = await client.loadModuleCommand(args[0]);
  if (response) return message.reply(`Error Loading: ${response}`);

  message.reply(`Le module \`${args[0]}\` a été loaded.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["lm", "load-m", "loadm"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "loadmodule",
  category: { fr : "Système", en : "System" },
  description: {
    fr : "Charge un module.",
    en : "Load a module."
  },
  usage: "load <module>"
};
