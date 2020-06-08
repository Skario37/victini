const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

const stc = require('string-to-color');

const DISCORD = require('discord.js');

module.exports = (client) => {
    client.pokemon.generatePokemon = async (
      client, 
      // Attr : _id[number], origin_trainer[struct], level[number], iv[number], isStarter[boolean], origin[struct], isEgg[boolean], isShinyLock[boolean], isShiny[boolean], form[number], hasHiddenAbility[boolean], gender[string], happiness[number], moves[array], item[struct]
      struct = {}
    ) => {
      var pokemonDefault = await P.getPokemonByName(struct._id).then( async pokemon => { return pokemon; });
      var pokemonSpecies = await P.resource(pokemonDefault.species.url).then( async pokemon => { return pokemon; });
      var pokemon = {};

      // Origin Trainer
      if ( struct.origin_trainer ) pokemon.origin_trainer = struct.origin_trainer;
      
      // Starter
      if ( struct.isStarter ) pokemon.isStarter = struct.isStarter;


      // Pokemon ID
      pokemon._id = pokemonDefault.id;
      pokemon.uuid = client.getUUID();
      pokemon.created_date = new Date();

      // Is Pokemon Shiny ?
      if ( struct.isShinyLock ) pokemon.shiny = false;
      else {
        if ( typeof struct.isShiny !== "undefined" ) {
          switch ( struct.isShiny ) {
            case true: case "true": pokemon.isShiny = true; break;
            default: pokemon.isShiny = false;
          }
        } else {
          const server = await client.database.db_server.request.getDocument(client, "server");
          const kitty = await client.database.db_server.request.getDocument(client, "kitty");
          var binTID = client.bin( server.trainer_id, 16 );
          var binSID = client.bin( server.secret_id, 16 );
          var binPID; 
          var result; 
          var n = 1;
          
          if ( kitty.reward[0].is_unlocked ) n += 2;
          for ( var i = 0; i < n; i++ ) {
            var pidForBinPID = client.generatePID(client, 32);
            binPID = client.bin( pidForBinPID, 32 );

            var binPIDA = binPID.substr(0,16);
            var binPIDB = binPID.substr(16);

            result = parseInt(binPIDA, 2) ^ parseInt(binPIDB, 2) ^ parseInt(binTID, 2) ^ parseInt(binSID, 2);

            if ( result < 16 ) { pokemon.isShiny = true; break; }
            else { pokemon.isShiny = false; }
          }
        }
      }

      // PID
      if ( pidForBinPID ) pokemon.pid = pidForBinPID;
      else pokemon.pid = client.generatePID(client, 32);

      // Pokemon Form
      if ( struct.form ) {
        if ( typeof pokemonDefault.forms[struct.form] === "undefined" ) {
          var rand = client.getRandomInt( 0, pokemonDefault.forms.length );
          pokemon.form_url = pokemonDefault.forms[rand].url;
        } else { pokemon.form_url = pokemonDefault.forms[struct.form].url; }
      } else { pokemon.form_url = pokemonDefault.forms[0].url; }


      // Pokemon Types
      pokemon.types = pokemonDefault.types;

      // Is Pokemon egg
      if ( struct.isEgg ) {
        pokemon.nickname = { "fr" : "Œuf", "en" : "Egg" };
        pokemon.isEgg = true;
      }

      // Height and Weight
      pokemon.height_coef = client.getRandomArbitrary(0.7, 1.3).toFixed(2);
      pokemon.weight_coef = client.getRandomArbitrary(0.7, 1.3).toFixed(2);
      pokemon.height = (pokemonDefault.height * pokemon.height_coef).toFixed(2);
      pokemon.weight = (pokemonDefault.weight * pokemon.weight_coef).toFixed(2);

      // Determine ability
      var pos = 0;
      if ( !struct.hasHiddenAbility ) { 
        pos = client.getRandomInt(1, pokemonDefault.abilities.length - 1); 
      } else if ( typeof struct.hasHiddenAbility === "undefined" ) {
        if ( client.percent( 90, 100 ) ) { pos = client.getRandomInt(1, pokemonDefault.abilities.length - 1); }
      }
      pokemon.ability = { 
        "url" : pokemonDefault.abilities[ pos ].ability.url,
        "is_hidden" : pokemonDefault.abilities[ pos ].is_hidden,
        "slot" : pokemonDefault.abilities[ pos ].slot
      }

      // Pokéball
      if ( struct.ball ) pokemon.ball;

      // Détermine le sexe d'un pokémon et l'image à utiliser en conséquence
      if ( struct.gender ) { pokemon.gender = struct.gender; } 
      else {
        if ( !pokemonSpecies.gender_rate === -1 ) {
          pokemon.gender = "";
        } else {
          if ( client.percent( pokemonSpecies.gender_rate, 8 )) { pokemon.gender = "♀"; }
          else { pokemon.gender = "♂"; }
        }
      }

      // Pokemon Nature
      pokemon.nature_url = `https://pokeapi.co/api/v2/nature/${client.getRandomIntInclusive( 1, 25 )}`;
      var nature = await P.resource(pokemon.nature_url).then( async nature => { return nature; });

      // Set Level
      var growth = await P.resource(pokemonSpecies.growth_rate.url).then( async nature => { return nature; });;
      pokemon.experience = {};
      if ( struct.level ) { pokemon.experience.level = struct.level; }
      else {
        var rand = client.getRandomIntInclusive(-8, 4);
        var level = 100 - Math.floor( Math.pow( pokemonSpecies.capture_rate + 125, 0.76 ) );
        level += rand;
        pokemon.experience.level = level;
      }
      var maxEXP = Math.max.apply( Math, growth.levels.map( level => { return level.experience; } ) );
      pokemon.experience.points = client.pokemon.levelSystem.calcEXP( pokemon.experience.level, maxEXP );
      pokemon.experience.obtained_level = pokemon.experience.level;

      // Stats
      pokemon.stats = {};

      // Internal Value
      // If given number, maximize IV's
      pokemon.stats.iv = [];
      var maxStat = false;
      for (var i = 0; i < 6; i++) {
        if ( struct.iv ) {
          if ( client.getRandomIntInclusive(0, 1) == 1 ) {
            maxStat = true;
            struct.iv -= 1;
          }
        }
        if ( maxStat ) pokemon.stats.iv.push( 31 );
        else pokemon.stats.iv.push( client.getRandomIntInclusive(1, 31) );
      }

      // External Value set to 0
      pokemon.stats.ev = [];
      for (var i = 0; i < 6; i++) {
        pokemon.stats.ev.push( 0 );
      }

      // Real Stats
      pokemon.stats.real = [];
      var tempNature = 1.0;
      // Speed
      if ( nature.decreased_stat && nature.increased_stat ) {
        if ( nature.decreased_stat.name === "speed" ) tempNature = 0.9;
        else if ( nature.increased_stat.name === "speed" ) tempNature = 1.1;
        else tempNature = 1.0;
      } else { tempNature = 1.0; }
      pokemon.stats.real.push( client.pokemon.stats.calcStat( pokemon.experience.level, pokemon.stats.iv[0], pokemon.stats.ev[0], pokemonDefault.stats[0].base_stat, tempNature ) );

      // Special Defense
      if ( nature.decreased_stat && nature.increased_stat ) {
        if ( nature.decreased_stat.name === "special-defense" ) tempNature = 0.9;
        else if ( nature.increased_stat.name === "special-defense" ) tempNature = 1.1;
        else tempNature = 1.0;
      } else { tempNature = 1.0; }
      pokemon.stats.real.push( client.pokemon.stats.calcStat( pokemon.experience.level, pokemon.stats.iv[1], pokemon.stats.ev[1], pokemonDefault.stats[1].base_stat, tempNature ) );

      // Special Attack
      if ( nature.decreased_stat && nature.increased_stat ) {
        if ( nature.decreased_stat.name === "special-attack" ) tempNature = 0.9;
        else if ( nature.increased_stat.name === "special-attack" ) tempNature = 1.1;
        else tempNature = 1.0;
      } else { tempNature = 1.0; }
      pokemon.stats.real.push( client.pokemon.stats.calcStat( pokemon.experience.level, pokemon.stats.iv[2], pokemon.stats.ev[2], pokemonDefault.stats[2].base_stat, tempNature ) );

      // Defense
      if ( nature.decreased_stat && nature.increased_stat ) {
        if ( nature.decreased_stat.name === "defense" ) tempNature = 0.9;
        else if ( nature.increased_stat.name === "defense" ) tempNature = 1.1;
        else tempNature = 1.0;
      } else { tempNature = 1.0; }
      pokemon.stats.real.push( client.pokemon.stats.calcStat( pokemon.experience.level, pokemon.stats.iv[3], pokemon.stats.ev[3], pokemonDefault.stats[3].base_stat, tempNature ) );

      // Attack
      if ( nature.decreased_stat && nature.increased_stat ) {
        if ( nature.decreased_stat.name === "attack" ) tempNature = 0.9;
        else if ( nature.increased_stat.name === "attack" ) tempNature = 1.1;
        else tempNature = 1.0;
      } else { tempNature = 1.0; }
      pokemon.stats.real.push( client.pokemon.stats.calcStat( pokemon.experience.level, pokemon.stats.iv[4], pokemon.stats.ev[4], pokemonDefault.stats[4].base_stat, tempNature ) );

      // HP
      pokemon.stats.real.push( client.pokemon.stats.calcHP( pokemon.experience.level, pokemon.stats.iv[5], pokemon.stats.ev[5], pokemonDefault.stats[5].base_stat ) );

      // Pokemon Origin
      if ( struct.origin ) pokemon.origin = struct.origin;

      // Happiness
      if ( struct.happiness ) pokemon.happiness = struct.happiness;

      // Moves
      if ( struct.moves ) { pokemon.moves = struct.moves; }
      else {
        pokemon.moves = [];

        var moves = pokemonDefault.moves.filter( move => { 
          return ( move.version_group_details[0].level_learned_at <= pokemon.experience.level && ( move.version_group_details[0].move_learn_method.name === "egg" || move.version_group_details[0].move_learn_method.name === "level-up" ) );
        });
        
        if ( moves.length > 4 ) { 
          for ( var i = 0; i < 4; i++ ) { 
            pokemon.moves.push( moves.splice( client.getRandomInt( 0, moves.length ), 1 )[0].move.url ); 
          } 
        }
        else {
          for ( var i = 0; i < moves.length; i++ ) { 
            pokemon.moves.push( moves[i].move.url ); 
          } 
        }
      }

      // Held Item
      pokemon.item = {};
      if ( struct.item ) { 
        pokemon.item.url = struct.item.url;
        pokemon.item.is_held = true;
        pokemon.item.is_used = false; 
      } else {
        for (var i = 0; i < pokemonDefault.held_items.length; i++ ) {
          if ( client.percent( 100 / pokemonDefault.held_items.length, 100 ) && !pokemon.isStarter ) {
            pokemon.item.url = pokemonDefault.held_items[i];
            pokemon.item.is_held = true;
            pokemon.item.is_used = false
            break;
          } else {
            pokemon.item.url = undefined;
            pokemon.item.is_held = false;
            pokemon.item.is_used = false;
          }
        }
      }
    

      return pokemon;
    };


    client.pokemon.displayPokemon = async ( client, message, pokemon, isBack = false, index = null) => {
      const settings = client.getSettings(message.guild);
      var pokemonDefault = await P.getPokemonByName(pokemon._id).then( async pokemon => { return pokemon; });
      var pokemonSpecies = await P.resource(pokemonDefault.species.url).then( async pokemon => { return pokemon; });

      var embed = new DISCORD.RichEmbed();
      embed.setColor( stc(pokemonSpecies.color.name) );
      var title = '';

      // Title
      if ( pokemon.isShiny ) {        title += `${client.pokemon.emoji.shiny}`; }
      if ( pokemon.isStarter ) {      title += `${index} `; }
      if ( pokemon.origin_trainer ) { title += `(${pokemon.origin_trainer.name}) `; }
      if ( pokemon.nickname ) {       title += `**${pokemon.nickname}** `; }
      else {                          title += `**${pokemonSpecies.names.find( name => name.language.name === settings.serverLanguage.toLowerCase() ).name}** `; }
      if ( pokemon.gender ) {         title += `${client.pokemon.emoji.gender[pokemon.gender]}`; }
      switch ( settings.serverLanguage.toLowerCase() ) {
        case "en":
          title += `*lvl:* **${pokemon.experience.level}**`;
          break;
        case "fr":
        default:
          title += `*niv:* **${pokemon.experience.level}**`;
      }

      embed.setTitle( title );

      // Construct HP's
      if ( !pokemon.isStarter ) {
        var percentHP = Math.floor( pokemon.stats.real[5] / client.pokemon.stats.calcHP( pokemon.experience.level, pokemon.stats.iv[5], pokemon.stats.ev[5], pokemonDefault.stats[5].base_stat ) * 100 );
        var gauge = '';
        for( var i = 0; i<=20; i++ ) {
          if ( i <= percentHP / 5 ) gauge += "l";
          else gauge += " ";
        }
        embed.setDescription(`[${gauge}] ${percentHP}%`);
      }

      // Construct Type
      var types = await P.resource("https://pokeapi.co/api/v2/type/1").then( async types => { return types; });
      var type = types.names.find( name => name.language.name === settings.serverLanguage.toLowerCase() ).name;
      var t1 = pokemonDefault.types.find( type => type.slot === 1 ).type.name;
      var t2 = pokemonDefault.types.find( type => type.slot === 2 ); if ( t2 ) t2 = t2.type.name; 
      embed.addField( type, `${client.pokemon.emoji.type[t1]} ${client.pokemon.emoji.type[t2]}`);


      // Construct Sprites
      var image = pokemonDefault.sprites.front_default;
      
      if ( pokemon.gender === "♀" ) {
        if ( pokemon.isShiny ) { 
          if ( isBack ) { image = pokemonDefault.sprites.back_shiny_female; } 
          else { image = pokemonDefault.sprites.front_shiny_female; }
        } else {
          if ( isBack ) { image = pokemonDefault.sprites.back_female; } 
          else { image = pokemonDefault.sprites.front_female; }
        }
      } else {
        if ( pokemon.isShiny ) { 
          if ( isBack ) { image = pokemonDefault.sprites.back_shiny; } 
          else { image = pokemonDefault.sprites.front_shiny; }
        } else {
          if ( isBack ) { image = pokemonDefault.sprites.back_default; } 
          else { image = pokemonDefault.sprites.front_default; }
        }
      }
        
      embed.attachFile( new DISCORD.Attachment( image ), "image.png" );
      embed.setThumbnail( "attachment://" + "image.png" );
    
      return await message.channel.send( embed );
    };
};