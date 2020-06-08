exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args || args.length < 1) return message.reply("T'as oublié le nom de la commande. Kappa.");
  if (args.length == 1) { // essential command
    const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));

    let response = await client.unloadCommand(args[0]);
    if (response) return message.reply(`Error Unloading: ${response}`);

    message.reply(`La commande \`${command.help.name}\` a été unloaded`);

  } else {
    const command = client.commands.get(args[1]) || client.commands.get(client.aliases.get(args[1]));

    let response = await client.unloadCommand(`${args[0]}/${args[1]}`);
    if (response) return message.reply(`Error Unloading: ${response}`);

    message.reply(`La commande \`${command.help.name}\` a été unloaded`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["uc", "unload-c", "unloadc"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "unloadcommand",
  category: { fr : "Système", en : "System" },
  description: {
    fr : "Décharge une commande.",
    en : "Unload a command."
  },
  usage: "unload [module] <command>"
};

exports.pokemon = {
  experience: 0
};