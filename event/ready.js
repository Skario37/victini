let spawn = false;

module.exports = async client => {
  // Log that the bot is online.
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
  client.users.cache.get(client.config.ownerID).send("Prêt pour te servir :heart:");

  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`${client.settings.get("default").prefix}help`, {type: "WATCHING"});

  // Init spawn
  if(!spawn) {
    spawn = true;
    client.pokemon.spawn.init();
  }
};
