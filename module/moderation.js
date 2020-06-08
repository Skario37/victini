
// SOME FUNCTIONS
module.exports = (client) => {

  client.addRole = (guild, member, role) => {
    const r = guild.roles.cache.get(role);
    if (r) {
      guild.members.cache.get(member.id).roles.add(r);
    }
  };

  client.removeRole = (guild, member, role) => {
    const r = guild.roles.cache.get(role);
    if (role) {
      guild.members.cache.get(member.id).roles.remove(r);
    }
  };
}
