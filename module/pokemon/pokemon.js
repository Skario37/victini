const Pokemon = require('./classes/ClassPokemon.js');

const stc = require('string-to-color');

const DISCORD = require('discord.js');

const read = require('./services/read.js');

module.exports = (client) => {
    client.pokemon.generatePokemon = async (
      client, 
      // Attr : _id[number], origin_trainer[struct], level[number], 
      // iv[number], isStarter[boolean], origin[struct], isEgg[boolean], 
      // isShinyLock[boolean], isShiny[boolean], form[number], hasHiddenAbility[boolean], 
      // gender[string], happiness[number], moves[array], item[struct], variety[number]
      struct = {}
    ) => {
      // Create new pokemon
      const pokemon = new Pokemon(struct._id, client.getUUID(), new Date());

      // Get the pokemon species
      const pokemonSpecies = read.getPokemonByID(client, struct._id);

      // Get the pokemon variety
      if (!struct.variety) struct.variety = 0;
      const pokemonVariety = read.getPokemonVarietyByID(client, struct._id, struct.variety);

      // Is Pokemon egg
      if ( struct.isEgg ) {
        pokemon.setEgg(true);
        pokemon.setHatchCounter(pokemonSpecies.hatch_counter * 255);
      } else pokemon.setNames(pokemonSpecies.names);

      // Set Nicknames
      // Do not need

      // Set PID
      // Do not need while it's generated itself

      // Set gender
      if ( struct.gender ) { 
        pokemon.setGender(struct.gender);
      } else {
        if ( !pokemonSpecies.gender_rate === -1 ) {
          pokemon.setGender(3);
        } else {
          if ( client.percent( pokemonSpecies.gender_rate, 8 )) { 
            pokemon.setGender(1);
          } else { 
            pokemon.setGender(2); 
          }
        }
      }


      // Is Pokemon Shinyyyyyyy ?
      if ( struct.isShinyLock ) pokemon.setShiny(false);
      else {
        // We need to know if it's undefined
        if ( typeof struct.isShiny !== "undefined" ) {
          switch ( struct.isShiny ) {
            case true: case "true": 
              pokemon.setShiny(true); 
              break;
            default: 
              pokemon.setShiny(false);
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

            if ( result < 16 ) { 
              pokemon.setShiny(true); 
              break; 
            } else pokemon.setShiny(false);
          }
        }
      }

      
      // Set ball
      // Set starter
      if ( struct.isStarter ) {
        pokemon.setStarter(true);
        pokemon.setBall(12);
      } else pokemon.setStarter(false);


      // Set happiness
      if ( struct.happiness ) pokemon.setHappiness(struct.happiness);
      else pokemon.setHappiness(pokemonSpecies.base_happiness);
    

      // Set Origin Trainer
      if ( struct.origin_trainer ) pokemon.setOriginTrainer(struct.origin_trainer);


      // Set Pokemon varieties
      pokemon.setVarieties(pokemonSpecies.varieties);
      pokemon.setCurrentVariety({
        "base_experience": pokemonVariety.base_experience,
        "is_default": pokemonVariety.is_default,
        // Set Height and Weight
        "height_coef": Number(client.getRandomArbitrary(0.7, 1.3).toFixed(2)),
        "weight_coef": Number(client.getRandomArbitrary(0.7, 1.3).toFixed(2)),
        "height": (pokemonVariety.height * Number(pokemon.getHeightCoef()).toFixed(2)),
        "weight": (pokemonVariety.weight * Number(pokemon.getWeightCoef()).toFixed(2)),
        // Set sprites and icons
        "sprites": pokemonVariety.sprites,
        "icons": pokemonVariety.icons,
        "stats": pokemonVariety.stats,
        "types": pokemonVariety.types
      });


      // Set Pokemon forms and current form
      pokemon.setForms(pokemonVariety.forms);
      const { formStartIndex, formEndIndex } = getFormRange(struct._id, struct.variety);
      if ( struct.form ) {
        if ( struct.form >= formStartIndex && struct.form <= formEndIndex ) {
          pokemon.setCurrentForm(read.getPokemonFormByID(client, struct._id, struct.form)); 
        } else {
          let rand = client.getRandomInt( formStartIndex, formEndIndex );
          pokemon.setCurrentForm(read.getPokemonFormByID(client, struct._id, rand));
        }
      } else { 
        let rand = client.getRandomInt( formStartIndex, formEndIndex );
        pokemon.setCurrentForm(read.getPokemonFormByID(client, struct._id, rand)); 
      }

      
      // Set ability
      let ability = {};
      let abilities = {};
      if(struct.hasHiddenAbility) { // HAVE his hidden ability
        ability = pokemonVariety.abilities.filter(ability => {
          return ability.is_hidden === true;
        });
      } else {
        if(typeof struct.hasHiddenAbility !== "undefined") { // DONT HAVE his hidden ability
          abilities = pokemonVariety.abilities.filter(ability => {
            return ability.is_hidden === false;
          });
          let rand = client.getRandomInt(0, abilities.length - 1); 
          ability = abilities[rand];
        } else { // CAN HAVE his hidden ability
          if( client.percent( 90, 100 ) ) { // Dont have
            let rand = client.getRandomInt(0, abilities.length - 1); 
            abilities = pokemonVariety.abilities.filter(ability => {
              return ability.is_hidden === false;
            });
            ability = abilities[rand];
          } else { // have
            ability = pokemonVariety.abilities.filter(ability => {
              return ability.is_hidden === true;
            });
          }
        }
      }
      pokemon.setAbility(ability);


      // Set Nature
      const naturesLength = read.getNaturesLength(); 
      if(struct.nature) {
        pokemon.setNature(read.getNatureByID(client, struct.nature));
      } else {
        let rand = client.getRandomInt(1, naturesLength - 1); // Nature index start at 1
        pokemon.setNature(read.getNatureByID(client, rand))
      }

      
      // Set experience
      const growth = read.getGrowthByURL(pokemonSpecies.growth_rate.url);
      const experience = {};
      let level = 1;
      if(struct.level) {
        experience.level = struct.level;
      } else {
        let rand = client.getRandomIntInclusive(-8, 4);
        level = 100 - Math.floor( Math.pow( pokemonSpecies.capture_rate + 125, 0.76 ) );
        level += rand;
        experience.level = level;
      }
      let maxEXP = Math.max.apply( Math, growth.levels.map( level => { return level.experience; } ) );
      experience.points = client.pokemon.levelSystem.calcEXP( experience.level, maxEXP );
      experience.obtained_level = experience.level;
      pokemon.setExperience(experience);


      // Set Stats
      const stats = pokemonVariety.stats.forEach((stat, index) => {
        let maxStat = false;
        if(struct.iv) {
          if(client.getRandomIntInclusive(0, 1) === 1 || struct.iv === pokemonVariety.stats.length - index) {
            maxStat = true;
            struct.iv -= 1;
          }
        }
        if(maxStat) stat.internal = 31; 
        else stat.internal = client.getRandomIntInclusive(1, 31);
      });
      pokemon.setStats(stats);


      // Set Moves
      const moves = [];
      if(struct.moves) {
        for (let index = 0; index < struct.moves.length; index++) {
          const move = read.getMoveByID(client, struct.moves[index]);
          const m = {
            "name": move.name,
            "url": read.getMoveUrlByID(client, struct.moves[index])
          }
          moves.push(m);
        }
      } else {
        const filtered_moves = pokemonVariety.moves.filter(move => {
          return ( move.version_group_details[0].level_learned_at <= experience.level && ( move.version_group_details[0].move_learn_method.name === "egg" || move.version_group_details[0].move_learn_method.name === "level-up" ) );
        });
        if(filtered_moves.length > 4) { 
          for(let i = 0; i < 4; i++) { 
            let m = filtered_moves.splice( client.getRandomInt( 0, filtered_moves.length ), 1 )[0];
            moves.push( m.move ); 
          } 
        }
        else {
          for (let i = 0; i < filtered_moves.length; i++) { 
            moves.push( filtered_moves[i].move ); 
          } 
        }
      }
      pokemon.setMoves(moves);


      // Set Item
      let item = {};
      if(struct.item) { 
        const it = read.getItemByID(client, struct.item);
        item = {
          "name": it.name,
          "url" : read.getItemUrlByID(client, struct.item),
          "is_held": true,
          "is_used": false
        }
      } else {
        for (let i = 0; i < pokemonVariety.held_items.length; i++ ) {
          if ( client.percent( 100 / pokemonVariety.held_items.length, 100 ) && !pokemon.isStarter ) {
            item = pokemonVariety.held_items[i].item;
            item.is_held = true;
            item.is_used = false
            break;
          } else {
            item = null;
          }
        }
      }
      pokemon.setItem(item);


      // Set Encountered Location
      if(struct.encountered_location) {
        pokemon.setEncounteredLocation(struct.encountered_location);
      } else {
        pokemon.setEncounteredLocation();
      }


      console.log(pokemon);
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

    const getFormRange = (pokemonID, varietyID) => {
      let formStartIndex = 0;
        let formEndIndex = 0;
        let lastLength = 0;
        for (let i = 0; i < varietyID; i++) {
          let pv = read.getPokemonVarietyByID(pokemonID, varietyID);
          if (i == 1) lastLength -= 1; // Because of index start at 0
          formStartIndex += lastLength;
          formEndIndex += pv.forms.length;
          lastLength = pv.forms.length;
        }
        if (formEndIndex > 0) formEndIndex -= 1; // Because index start at 0
        return {
          "formStartIndex": formStartIndex,
          "formEndIndex": formEndIndex
        }
    };
};



/*
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
      */