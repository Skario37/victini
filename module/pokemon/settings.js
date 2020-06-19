const Enmap = require("enmap");

module.exports = (client) => {
  /*
  GUILD SETTINGS FUNCTION
  */
  client.pokemon = {};
  client.pokemon.settings = new Enmap({name: "settings", ensureProps: true});

  const defaultSettings = {
    "spawnEnabled": "false",
    "categoryKantoID": "536314303733694484",
    "categoryJohtoID": "713389609828089897",
    "categorySinnohID": "713389756775661570",
    "categoryUnysID": "713389795534962739",
    "categoryKalosID": "713389838463795311",
    "categoryAlolaID": "713389877424685097",
    "categoryGalarID": "713389915248787557",
    "channelShopID": "536315533365084200",
    "trainerRoleID": "536316575091916800",
    "kantoRoleID": "536324552679096320"
  };

  // getSettings merge les paramètres par défaut du client avec les paramètres de guilde
  // dans enmap.
  client.pokemon.getSettings = (guild) => {
    client.pokemon.settings.ensure("defaultPokemon", defaultSettings);
    if(!guild) return client.pokemon.settings.get("defaultPokemon");
    const guildConf = client.pokemon.settings.get(`${guild.id}Pokemon`) || {};
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    return ({...client.pokemon.settings.get("defaultPokemon"), ...guildConf});
  };
}