// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
  client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);

  // If the settings Enmap contains any guild overrides, remove them.
  // No use keeping stale data!
  if (client.settings.has(guild.id)) {
    client.settings.delete(guild.id);
  }

  // If database contains guild data, remove them
  if (client.database.db_spawn.request.exists(client, guild.id)) {
    client.database.db_spawn.request.destroy(client, guild.id);
  }
};
