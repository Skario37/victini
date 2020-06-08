exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args || args.length < 1) return message.reply("T'as oublié le nom de la commande. Kappa.");
  if (args.length == 1) { // essential command
    response = client.loadCommand(args[0]);
    if (response) return message.reply(`Error Loading: ${response}`);

    const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
    message.reply(`La commande \`${command.help.name}\` a été loaded.`);

  } else {
    response = client.loadCommand(`${args[0]}/${args[1]}`);
    if (response) return message.reply(`Error Loading: ${response}`);

    const command = client.commands.get(args[1]) || client.commands.get(client.aliases.get(args[1]));
    message.reply(`La commande \`${command.help.name}\` a été loaded.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["lc", "load-c", "loadc"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "loadcommand",
  category: { fr : "Système", en : "System" },
  description: {
    fr : "Charge une commande.",
    en : "Load a command."
  },
  usage: "load [module] <commande>"
};
