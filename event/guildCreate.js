// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
  if(guild.id != client.config.guildID && guild.id != client.config.guildDevID) guild.leave(); // Leave guild
};
