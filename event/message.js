// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  if (message.author.bot) return;

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getSettings(message.guild);
  message.settings.pokemon = client.pokemon.getSettings(message.guild);

  // Checks if the bot was mentioned, with no message after it, returns the prefix.
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`Mon préfixe sur ce serveur est : *\`${settings.prefix}\`*`);
  }

  if (message.content.indexOf(settings.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.fetchMember(message.author);

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in victini.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("Cette commande est indisponible en message privé. Veuillez exécuter cette commande dans un serveur.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`Vous n'avez pas la permission d'utiliser cette commande.
  Votre niveau de permission est : ${level} (${client.permlevelSettings.find(l => l.level === level).name})
  Cette commande nécessite le niveau : ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`[CMD] ${client.permlevelSettings.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  const success = cmd.run(client, message, args, level);
  if (message.guild) {
    message.delete();

    // If command was successfull, **AND** command give some exp, add experience on trainer.
    if (success && cmd.pokemon) {
      client.database.db_trainer.request.addExperience(client, await message.guild.members.fetch(message.author.id), cmd.pokemon.experience);
    }
  }

  
};
