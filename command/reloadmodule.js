exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args || args.length < 1) return message.reply("T'as oublié le nom du module. Kappa.");

  let response = await client.unloadModuleCommand(args[0]);
  if (response) return message.reply(`Error Unloading: ${response}`);

  response = await client.loadModuleCommand(args[0]);
  if (response) return message.reply(`Error Loading: ${response}`);

  message.reply(`Le module \`${args[0]}\` a été reloaded.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rm", "reload-m", "reloadm"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "reloadmodule",
  category: { fr : "Système", en : "System" },
  description: {
    fr : "Recharge un module.",
    en : "Reload a module."
  },
  usage: "reload <module>"
};
