const read = require('../services/read.js');

const cache = [];

module.exports = (client) => {

  // Start all workers
  client.pokemon.spawn = {};
  client.pokemon.spawn.init = async () => {
    let index = 0;
    client.guilds.cache.forEach(guild => {
      let settings = client.pokemon.getSettings(guild);
      cache.push({"id": guild.id});

      if (settings.spawnKantoEnabled === "true" && guild.channels.cache.get(settings.categoryKantoID) !== "undefined") {
        cache[index].kanto = {
          "working": true,
          "intervalID": looooop(
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
      index++;
    });
  }

  function handlerSpecificGuild(state, guild, region, key) {
    state = state.toLowerCase();
    const settings = client.pokemon.getSettings(guild);
    const categoryID = settings[key];
    const workerIndex = cache.findIndex(w => w.id === guild.id);
    let worker = {"id": guild.id};
    if (workerIndex < 0) {
      worker[region] = {};
      cache.push(worker);
    } else {
      worker = cache[workerIndex];
    }

    if ((worker[region].working + '') === state) return;
    if (state === "true") {
      if (guild.channels.cache.get(categoryID) === "undefined") return;
      // Modify & Start the worker
      worker[region] = {
        "working": true,
        "intervalID": looooop(
          client, 
          guild, 
          {
            "id": categoryID,
            "index": 1,
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
    switch (key) {
      case 'categoryKantoID':   region = 'kanto';
      case 'categoryJohtoID':   region = 'johto';
      case 'categoryHoennID':   region = 'hoenn';
      case 'categorySinnohID':  region = 'sinnoh';
      case 'categoryUnysID' :   region = 'unys';
      case 'categoryKalosID':   region = 'kalos';
      case 'categoryAlolaID':   region = 'alola';
      case 'categoryGalarID':   region = 'galar';
        if (isAllGuilds) {
          client.guilds.cache.forEach(g => handlerSpecificGuild(joinedValue, g, region, key));
        } else {
          handlerSpecificGuild(joinedValue, guild, region, key);
        }
      break;
      default: break;
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