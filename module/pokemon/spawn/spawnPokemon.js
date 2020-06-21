const read = require('../services/read.js');

const cache = [];

module.exports = (client) => {

  // Start all workers
  client.pokemon.spawnInit = async () => {
    let index = 0;
    client.guilds.cache.forEach(guild => {
      let settings = client.pokemon.getSettings(guild);
      cache.push({"id": guild.id});
      if (settings.spawnKantoEnabled === "true") {
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

  client.pokemon.workersInitByGuildChanges = async (guild) => {
    const settings = client.pokemon.getSettings(guild);
    // THE REST OF THE CODE NEED TO BE WRITTEN LATER
    // DONT FORGET
    // Add watcher changes in pconf and pset
    // /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ 
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
            const message = client.pokemon.displayPokemon( client, pokemon.encountered_location, pokemon);
            r.pokemon.push(pokemon);
            await client.database.db_spawn.request.addPokemon(client, guild.id, region.name, pokemon);
            channel.fetchMessage( message.id )
              .then( msg => {
                msg.delete( 600 * 1000 )
                  .then( async () => {
                    await client.database.db_spawn.request.delPokemon(client, guild.id, region.name, pokemon.uuid);
                  }
                );
              }
            );
          }
        }
      },
      client.getRandomIntInclusive( 90, 240 ) * 1000
    )
  }
}