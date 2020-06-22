const read = require('../services/read.js');

const cache = [];

module.exports = (client) => {

  // Start all workers
  client.pokemon.spawn = {};
  client.pokemon.spawn.init = () => {
    let index = 0;
    client.guilds.cache.forEach(async guild => {
      let settings = client.pokemon.getSettings(guild);
      cache.push({"id": guild.id});

      if (settings.spawnKantoEnabled === "true" && guild.channels.cache.get(settings.categoryKantoID) !== "undefined") {
        cache[index].kanto = {
          "working": true,
          "intervalID": await looooop(
            client, 
            guild, 
            {
              "id": settings.categoryKantoID,
              "index": 1,
              "name": "kanto"
            }
          )
        }
      }

      if (settings.spawnJohtoEnabled === "true" && guild.channels.cache.get(settings.categoryJohtoID) !== "undefined") {
        cache[index].johto = {
          "working": true,
          "intervalID": await looooop(
            client, 
            guild, 
            {
              "id": settings.categoryJohtoID,
              "index": 2,
              "name": "johto"
            }
          )
        }
      }

      if (settings.spawnHoennEnabled === "true" && guild.channels.cache.get(settings.categoryHoennID) !== "undefined") {
        cache[index].hoenn = {
          "working": true,
          "intervalID": await looooop(
            client, 
            guild, 
            {
              "id": settings.categoryHoennID,
              "index": 3,
              "name": "hoenn"
            }
          )
        }
      }

      if (settings.spawnSinnohEnabled === "true" && guild.channels.cache.get(settings.categorySinnohID) !== "undefined") {
        cache[index].sinnoh = {
          "working": true,
          "intervalID": await looooop(
            client, 
            guild, 
            {
              "id": settings.categorySinnohID,
              "index": 4,
              "name": "sinnoh"
            }
          )
        }
      }

      if (settings.spawnUnysEnabled === "true" && guild.channels.cache.get(settings.categoryUnysID) !== "undefined") {
        cache[index].unys = {
          "working": true,
          "intervalID": await looooop(
            client, 
            guild, 
            {
              "id": settings.categoryUnysID,
              "index": 5,
              "name": "unys"
            }
          )
        }
      }

      if (settings.spawnKalosEnabled === "true" && guild.channels.cache.get(settings.categoryKalosID) !== "undefined") {
        cache[index].kalos = {
          "working": true,
          "intervalID": await looooop(
            client, 
            guild, 
            {
              "id": settings.categoryKalosID,
              "index": 6,
              "name": "kalos"
            }
          )
        }
      }

      if (settings.spawnAlolaEnabled === "true" && guild.channels.cache.get(settings.categoryAlolaID) !== "undefined") {
        cache[index].alola = {
          "working": true,
          "intervalID": await looooop(
            client, 
            guild, 
            {
              "id": settings.categoryAlolaID,
              "index": 7,
              "name": "alola"
            }
          )
        }
      }
      index++;
    });
  }

  async function handlerSpecificGuild(state, guild, region, key, index) {
    state = state.toLowerCase();
    const settings = client.pokemon.getSettings(guild);
    const categoryID = settings[key];
    let workerIndex = cache.findIndex(w => w.id === guild.id);
    let worker = {"id": guild.id};
    if (workerIndex < 0) {
      worker[region] = {};
      cache.push(worker);
      workerIndex = cache.length - 1;
    } else {
      worker = cache[workerIndex];
      if (worker[region] === undefined) worker[region] = {};
    }

    if ((worker[region].working + '') === state) return;
    if (state === "true") {
      if (guild.channels.cache.get(categoryID) === "undefined") return;
      // Modify & Start the worker
      worker[region] = {
        "working": true,
        "intervalID": await looooop(
          client, 
          guild, 
          {
            "id": categoryID,
            "index": index,
            "name": region
          }
        )
      }
    } else {
      // Stop the worker
      clearInterval(worker[region].intervalID);
      // Modify the worker
      worker[region].working = false;
    }

    cache[workerIndex] = worker;
  }

  client.pokemon.spawn.handleSpawn = (key, joinedValue, guild = null, isAllGuilds = false) => {
    let region = 'kanto';
    let index = 1;
    let modify = true;
    let category = 'categoryKantoID';
    switch (key) {
      case 'spawnKantoEnabled':
        region = 'kanto';
        index = 1;
        category = 'categoryKantoID';
        break;
      case 'spawnJohtoEnabled':
        region = 'johto';
        index = 2;
        category = 'categoryJohtoID';
        break;
      case 'spawnHoennEnabled':
        region = 'hoenn';
        index = 3;
        category = 'categoryHoennID';
        break;
      case 'spawnSinnohEnabled':  
        region = 'sinnoh';
        index = 4;
        category = 'categorySinnohID';
        break;
      case 'spawnUnysEnabled' :   
        region = 'unys';
        index = 5;
        category = 'categoryUnysID';
        break;
      case 'spawnKalosEnabled':   
        region = 'kalos';
        index = 6;
        category = 'categoryKalosID';
        break;
      case 'spawnAlolaEnabled':   
        region = 'alola';
        index = 7;
        category = 'categoryAlolaID';
        break;
      case 'spawnGalarEnabled':   
        region = 'galar';
        index = 8;
        category = 'categoryGalarID';
        break;
      default: 
        modify = false;
        break;
    }

    if (modify) {
      if (isAllGuilds) {
        client.guilds.cache.forEach(g => handlerSpecificGuild(joinedValue, g, region, category, index));
      } else {
        handlerSpecificGuild(joinedValue, guild, region, category, index);
      }
    }
  }


  async function looooop(client, guild, region) {
    const channels = client.getChannelsByCategoryID(guild.channels.cache, region.id, "text");
    const pokemonArray = await read.getPokemonByGeneration(client, region.index);
    
    return setInterval(
      async () => {
        const crand = client.getRandomInt(0, channels.length);
        const channel = channels[crand];
        

        // While pokemon has no spawned we continue to find one and check if he is available to spawn
        let spawned = false;
        while (!spawned) {
          const poketemp = pokemonArray[client.getRandomInt(0, pokemonArray.length)];
          const pokemonIndex = poketemp.index;

          const varietytemp = poketemp.varieties[client.getRandomInt(0, poketemp.varieties.length)]
          const pokemonVarietyIndex = varietytemp.index;

          const pokemonFormIndex = varietytemp[client.getRandomInt(0, varietytemp.forms.length)];

          const pokemon = await client.pokemon.generatePokemon( client, { "_id" : pokemonIndex, "variety": pokemonVarietyIndex, "form": pokemonFormIndex, "encountered_location" : channel } )

          spawned = client.percent(1 / 260 * pokemon.capture_rate * 1.3, 1);

          const r = await client.database.db_spawn.request.getDocument(client, guild.id, region.name);
          const p = r.pokemon.findIndex(p => {
            const name = p.name === pokemon.name;
            const channel = p.encountered_location.id === pokemon.encountered_location.id;
            return name && channel;
          });
          if (p < 0) {
            spawned = true;
            const message = await client.pokemon.displayPokemon( client, pokemon.encountered_location, pokemon);
            const msg = await channel.messages.fetch( message.id );
            pokemon.message = msg;
            r.pokemon.push(pokemon);

            await client.database.db_spawn.request.addPokemon(client, guild.id, region.name, pokemon);
            msg.delete({"timeout": 600 * 1000})
              .then( async () => { 
                await client.database.db_spawn.request.delPokemon(client, guild.id, region.name, pokemon.uuid);
              }
            );
          }
        }
      },
      client.getRandomIntInclusive( 90, 240 ) * 1000
    )
  }
}