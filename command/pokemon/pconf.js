const { inspect } = require("util");

/*
FOR GUILD SETTINGS SEE set.js !
This command is used to modify the bot's default configuration values, which affects all guilds.
If a default setting is not specifically overwritten by a guild, changing a default here will
change it for that guild. The `add` action adds a key to the configuration of every guild in
your bot. The `del` action removes the key also from every guild, and loses its value forever.
*/

exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  // Retrieve Default Values from the default settings in the bot.
  const defaults = client.pokemon.settings.get("defaultPokemon");

  // Adding a new key adds it to every guild (it will be visible to all of them)
  if (action === "add") {
    if (!key) return message.reply("Please specify a key to add");
    if (defaults[key]) return message.reply("This key already exists in the default settings");
    if (value.length < 1) return message.reply("Please specify a value");

    // `value` being an array, we need to join it first.
    defaults[key] = value.join(" ");

    // One the settings is modified, we write it back to the collection
    client.pokemon.settings.set("defaultPokemon", defaults);

    // Handle changes for spawn
    client.pokemon.spawn.handleSpawn(key, defaults[key], null, true);
    
    message.reply(`${key} successfully added with the value of ${value.join(" ")}`);
  } else

  // Changing the default value of a key only modified it for guilds that did not change it to another value.
  if (action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    if (!defaults[key]) return message.reply("This key does not exist in the settings");
    if (value.length < 1) return message.reply("Please specify a new value");

    defaults[key] = value.join(" ");

    client.pokemon.settings.set("defaultPokemon", defaults);

    // Handle changes for spawn
    client.pokemon.spawn.handleSpawn(key, defaults[key], null, true);

    message.reply(`${key} successfully edited to ${value.join(" ")}`);
  } else

  // WARNING: DELETING A KEY FROM THE DEFAULTS ALSO REMOVES IT FROM EVERY GUILD
  // MAKE SURE THAT KEY IS REALLY NO LONGER NEEDED!
  if (action === "del") {
    if (!key) return message.reply("Please specify a key to delete.");
    if (!defaults[key]) return message.reply("This key does not exist in the settings");

    // Throw the 'are you sure?' text at them.
    const response = await client.awaitReply(message, `Are you sure you want to permanently delete ${key} from all guilds? This **CANNOT** be undone.`);

    // If they respond with y or yes, continue.
    if (["y", "yes"].includes(response)) {

      // Handle changes for spawn
      client.pokemon.spawn.handleSpawn(key, defaults[key], null, true);

      // We delete the default `key` here.
      delete defaults[key];
      client.pokemon.settings.set("defaultPokemon", defaults);

      // then we loop on all the guilds and remove this key if it exists.
      // "if it exists" is done with the filter (if the key is present and it's not the default config!)
      for (const [guildid, conf] of client.pokemon.settings.filter((setting, id) => setting[key] && id !== "defaultPokemon")) {
        delete conf[key];
        client.pokemon.settings.set(`${guildid}Pokemon`, conf);
      }

      message.reply(`${key} was successfully deleted.`);
    } else
    // If they respond with n or no, we inform them that the action has been cancelled.
    if (["n","no","cancel"].includes(response)) {
      message.reply("Action cancelled.");
    }
  } else

  // Display a key's default value
  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (!defaults[key]) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${defaults[key]}`);

  // Display all default settings.
  } else {
    await message.channel.send(`***__Pokemon Default Settings__***\n\`\`\`json\n${inspect(defaults)}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["pdefaults", "pokedefaults", "pokemondefaults", "pokeconf", "pokemonconf"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "pconf",
  category: { fr : "Pokémon", en : "Pokémon" },
  description: {
    fr : "Modifie la configuration par défaut Pokémon pour tous les serveurs.",
    en : "Set default Pokémon guild configuration."
  },
  usage: "pconf <view/get/edit> <key> <value>"
};
