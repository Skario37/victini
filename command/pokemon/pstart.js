exports.run = async (client, message, args, level) => {
    const settings = client.getSettings(message.guild);
    const pokemonSettings = client.pokemon.getSettings(message.guild);
    const trainerRole = message.guild.roles.cache.get(pokemonSettings.trainerRoleID);
    
    if ( message.member.roles.cache.get(trainerRole.id) ) {
        switch ( settings.serverLanguage.toLowerCase() ) {
            case "en":
                return message.reply(`You are already ${trainerRole.name}.`);
                break;
            case "fr":
            default:
                return message.reply(`Tu es déjà ${trainerRole.name}.`);
        }
    }

    // Init the member database
    if ( typeof await client.database.db_trainer.request.exists(client, message.member) === "undefined" ) {
      await client.database.db_trainer.request.init(client, message.member);
    }

    let starters = [];
    const temp = await client.database.db_trainer.request.getStarter(client, message.member);
    const trainer = await client.database.db_trainer.request.getDocument(client, message.member, "trainer");
    if ( Object.keys(temp).length > 0 && temp.constructor === Object ) {
        starters = temp.pokemon;
    } else {
        starters.push( await client.pokemon.generatePokemon( client, { "_id" : "1", "level" : 5, "isShinyLock" : true, "iv" : 3, "origin_trainer" : { "name" : message.author.username, "id" : trainer.trainerID }, "isStarter" : true, "encountered_location" : message.channel } ) );
        starters.push( await client.pokemon.generatePokemon( client, { "_id" : "4", "level" : 5, "isShinyLock" : true, "iv" : 3, "origin_trainer" : { "name" : message.author.username, "id" : trainer.trainerID }, "isStarter" : true, "encountered_location" : message.channel } ) );
        starters.push( await client.pokemon.generatePokemon( client, { "_id" : "7", "level" : 5, "isShinyLock" : true, "iv" : 3, "origin_trainer" : { "name" : message.author.username, "id" : trainer.trainerID }, "isStarter" : true, "encountered_location" : message.channel } ) );
        starters.push( await client.pokemon.generatePokemon( client, { "_id" : "25", "level" : 5, "isShinyLock" : true, "iv" : 3, "origin_trainer" : { "name" : message.author.username, "id" : trainer.trainerID }, "isStarter" : true, "encountered_location" : message.channel } ) );
        starters.push( await client.pokemon.generatePokemon( client, { "_id" : "133", "level" : 5, "isShinyLock" : true, "iv" : 3, "origin_trainer" : { "name" : message.author.username, "id" : trainer.trainerID }, "isStarter" : true, "encountered_location" : message.channel } ) );
        await client.database.db_trainer.request.setStarter( client, message.member, starters );
    }

    for (var i = 0; i < starters.length; i++) {
        await client.pokemon.displayPokemon( client, message, starters[i], i + 1 );
    }
    
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["pcommencer"],
    permLevel: "User"
  };
  
  exports.help = {
    name: "pstart",
    category: { fr : "Pokémon", en : "Pokémon" },
    description: {
      fr : "Débute ton aventure !",
      en : "Begin your adventure!"
    },
    usage: "pstart"
  };
  