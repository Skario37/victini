exports.run = async (client, message, args, level) => {

  const settings = client.getSettings(message.guild);
  const pokemonSettings = client.pokemon.getSettings(message.guild);
  const trainerRole = message.guild.roles.cache.get(pokemonSettings.trainerRoleID);
  
  if ( message.member.roles.cache.get(trainerRole.id) ) {
    switch ( settings.serverLanguage.toLowerCase() ) {
      case "en":
        return message.reply(`You are already ${trainerRole.name}.`);
      case "fr":
      default:
        return message.reply(`Tu es déjà ${trainerRole.name}.`);
    }
  }

  let starters = [];
  let temp = await client.database.db_trainer.request.getStarter(client, message.member);
  if ( Object.keys(temp).length > 0 && temp instanceof Object ) {
    starters = temp;
  } else {
    switch ( settings.serverLanguage.toLowerCase() ) {
      case "en": 
        return message.reply(`I have not shown you your Pokémon yet. Please use ${settings.prefix}pstart.`);
      case "fr":
      default:
        return message.reply(`Je ne t'ai pas encore montré tes Pokémon. Utilise ${settings.prefix}pstart.`);
    }
  }

  let arg = args.join(' ');
  let index = -1;
  if(! isNaN(arg) || Number.isInteger(arg)) {
    index = arg-1;
  } else {
    index = starters.findIndex( pokemon => {
      let name = pokemon.names.filter(name => name.language.name === settings.serverLanguage.toLowerCase());
      if(client.compareNormalizedStrings(name[0].name, arg)) return pokemon;
    });
  }

  if(index < 0 || index >= starters.length) {
    switch ( settings.serverLanguage.toLowerCase() ) {
      case "en": 
        return message.reply(`Choose a number between 1 and ${starters.length} or the Pokémon name.`);
      case "fr":
      default:
        return message.reply(`Choisi un nombre entre 1 et ${starters.length} ou le nom du Pokémon.`);
    }
  }

  client.pokemon.capture(client, message, starters[index]);

  client.addRole(message.guild, message.member, pokemonSettings.trainerRoleID);

  switch (Number(starters[index]._id)) {
    case 1: case 4: case 7: case 25: case 133:
    default:
      client.addRole(message.guild, message.member, pokemonSettings.kantoRoleID);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["pcommencerchoisir"],
  permLevel: "User"
};

exports.help = {
  name: "pstartchoose",
  category: { fr : "Pokémon", en : "Pokémon" },
  description: {
    fr : "Choisis ton Pokémon !",
    en : "Choose your Pokémon!"
  },
  usage: "pchoosestart <index>"
};
