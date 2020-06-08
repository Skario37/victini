const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

module.exports = (client) => {
  /*
  EMBED COLOR FOR CLIENT
  */
  client.embedcolor = "#FFCC66";

  /*
  PROMPT MESSAGE REACTION
  */
  client.promptMessage = async (message, author, time, validReactions) => {
    time *= 1000;

    for (const reaction of validReactions) await message.react(reaction);

    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

    return message
      .awaitReactions(filter, { max: 1, time: time })
      .then(collected => collected.first() && collected.first().emoji.name);
  }

  /*
  GUILD SETTINGS FUNCTION
  */

  const defaultSettings = {
    "prefix": "v.",
    "modLogChannelID": "598583330719531115",
    "modRoleID": "564199961462439963",
    "adminRoleID": "536317214056251392",
    "systemNotice": "true",
    "welcomeChannelID": "536313473341063169",
    "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
    "welcomeEnabled": "false",
    "announceChannelID" : "536954645503934475",
    "annouceEnabled" : "false",
    "reportChannelID": "705954157403570257",
    "reportEnabled": "false",
    "embedColor": "#FFCC66",
    "embedColorEnabled": "false",
    "muteRoleID" : "706186120987148298",
    "muteEnabled" : "false",
    "serverLanguage": "FR"
  };

  // getSettings merge les paramètres par défaut du client avec les paramètres de guilde
  // dans enmap.
  client.getSettings = (guild) => {
    client.settings.ensure("default", defaultSettings);
    if(!guild) return client.settings.get("default");
    const guildConf = client.settings.get(guild.id) || {};
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    return ({...client.settings.get("default"), ...guildConf});
  };

  /*
  SINGLE-LINE AWAITMESSAGE

  USAGE

  const response = await client.awaitReply(msg, "Favourite Pokémon?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  clean supprime les ping @everyone, les tokens.
  Résoud les promesses et stringifies les objets.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, {depth: 1});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    let split = commandName.split('/');
    let moduleName = "";
    if (split.length > 1) { moduleName = split[0]; commandName = split[1]; }
    commandName = commandName.replace(/\.[^/.]+$/, "");

    try {
      client.logger.log(`Loading Command: ${commandName}`);
      const props = require(`../command/${moduleName}/${commandName}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let split = commandName.split('/');
    let moduleName = "";
    if (split.length > 1) { moduleName = split[0]; commandName = split[1]; }
    commandName = commandName.replace(/\.[^/.]+$/, "");

    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    const mod = require.cache[require.resolve(`../command/${moduleName}/${command.help.name}`)];
    delete require.cache[require.resolve(`../command/${moduleName}/${command.help.name}.js`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
    return false;
  };

  client.loadModuleCommand = async (moduleName) => {
    try {
      client.logger.log(`Loading Module: ${moduleName}`);
      const cmdFiles = await readdir(`./command/${moduleName}/`, { withFileTypes : true });
      cmdFiles.command = { length : 0 };
      cmdFiles.forEach( f => {
        if (f.isFile() && f.name.endsWith(".js")) cmdFiles.command.length++;
      });
      client.logger.log(`Loading ${cmdFiles.command.length} commands.`);
      cmdFiles.forEach(async f => {
        if (!f.name.endsWith(".js") && !f.isFile()) return;
        const response = await client.loadCommand(`${moduleName}/${f.name}`);
        if (response) console.log(response);
      });
      return false;
    } catch (e) {
      return `Unable to load module ${moduleName}: ${e}`;
    }
  };

  client.unloadModuleCommand = async (moduleName) => {
    try {
      const cmdFiles = await readdir(`./command/${moduleName}/`, { withFileTypes : true });
      cmdFiles.forEach(async f => {
        if (!f.name.endsWith(".js") && !f.isFile()) return;
        const response = await client.unloadCommand(`${moduleName}/${f.name}`);
        if (response) console.log(response);
      });
      return false;
    } catch (e) {
      return `Unable to unload module ${moduleName}: ${e}`;
    }
  };

  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  // <String>.toPropercase() returns a proper-cased string such as:
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  Object.defineProperty(String.prototype, "toProperCase", {
    value: function() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  });

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Object.defineProperty(Array.prototype, "random", {
    value: function() {
      return this[Math.floor(Math.random() * this.length)];
    }
  });

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    console.error(err);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
    console.error(err);
  });
};
