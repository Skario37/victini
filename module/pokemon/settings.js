const Enmap = require("enmap");

module.exports = (client) => {
  /*
  GUILD SETTINGS FUNCTION
  */
  client.pokemon = {};
  client.pokemon.settings = new Enmap({name: "settings", ensureProps: true});

  const defaultSettings = {
    "spawnKantoEnabled": "false",
    "categoryKantoID": "536314303733694484",
    "spawnJohtoEnabled": "false",
    "categoryJohtoID": "713389609828089897",
    "spawnSinnohEnabled": "false",
    "categorySinnohID": "713389756775661570",
    "spawnUnysEnabled": "false",
    "categoryUnysID": "713389795534962739",
    "spawnKalosEnabled": "false",
    "categoryKalosID": "713389838463795311",
    "spawnAlolaEnabled": "false",
    "categoryAlolaID": "713389877424685097",
    "spawnGalarEnabled": "false",
    "categoryGalarID": "713389915248787557",
    "channelShopID": "536315533365084200",
    "trainerRoleID": "536316575091916800",
    "kantoRoleID": "536324552679096320",
    "johtoRoleID": "724604181754675280",
    "hoennRoleID": "724604254232248332",
    "sinnohRoleID": "724604336079896686",
    "unysRoleID": "724604422935543928",
    "kalosRoleID": "724604483975381024",
    "alolaRoleID": "724604513025261618"
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