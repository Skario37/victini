exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args || args.length < 1) return message.reply("T'as oublié le nom du module. Kappa.");

  let response = await client.unloadModuleCommand(args[0]);
  if (response) return message.reply(`Error Unloading: ${response}`);

  message.reply(`Le module \`${args[0]}\` a été unloaded.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["um", "unload-m", "unloadm"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "unloadmodule",
  category: { fr : "Système", en : "System" },
  description: {
    fr : "Décharge un module.",
    en : "Unload a module."
  },
  usage: "unload <module>"
};
