exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args || args.length < 1) return message.reply("T'as oublié le nom de la commande. Kappa.");
  if (args.length == 1) { // essential command
    const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));

    let response = await client.unloadCommand(args[0]);
    if (response) return message.reply(`Error Unloading: ${response}`);

    response = client.loadCommand(command.help.name);
    if (response) return message.reply(`Error Loading: ${response}`);

    message.reply(`La commande \`${command.help.name}\` a été reloaded.`);

  } else {
    const command = client.commands.get(args[1]) || client.commands.get(client.aliases.get(args[1]));

    let response = await client.unloadCommand(`${args[0]}/${args[1]}`);
    if (response) return message.reply(`Error Unloading: ${response}`);

    response = client.loadCommand(`${args[0]}/${command.help.name}`);
    if (response) return message.reply(`Error Loading: ${response}`);

    message.reply(`La commande \`${command.help.name}\` a été reloaded.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rc", "reload-c", "reloadc"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "reloadcommand",
  category: { fr : "Système", en : "System" },
  description: {
    fr : "Recharge une commande.",
    en : "Reload a command."
  },
  usage: "reload [module] <commande>"
};
