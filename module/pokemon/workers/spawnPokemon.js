const { StaticPool } = require("node-worker-threads-pool");
const pool = new DynamicPool(1);
const read = require('./services/read.js');

const cache = {
  kanto: false,
  johto: false,
  hoenn: false,
  sinnoh: false,
  unys: false,
  kalos: false,
  alola: false,
  galar: false
}

module.exports = (client) => {

  // Start all workers
  client.pokemon.workersInit = async () => {
    for (let guild in client.guilds.cache) {
      let settings = client.pokemon.getSettings(guild);
      if (!settings.spawnEnabled) continue;
      workerSpawnKanto(guild, regionID);
    }
  }

  client.pokemon.workersInitByGuildChanges = async (guild) => {
    const settings = client.pokemon.getSettings(guild);
    // THE REST OF THE CODE NEED TO BE WRITTEN LATER
    // DONT FORGET
    // Add watcher changes in pconf and pset
    // /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ 
  }

  workerSpawnKanto = async (guild, regionID) => {
    if (cache.kanto) return;
    await pool.exec({
      task: looooop,
      workerData: {
        guild: guild,
        regionID: regionID,
        regionIndex: 1,
        regionName: "kanto"
      }
    });
  }

  workerSpawnJohto = () => {
    
  }

  function looooop() {
    const guild = this.workerData.guild;
    const regionID = this.workerData.regionID;
    const regionIndex = this.workerData.regionIndex;
    const regionName = this.workerData.regionName;

    const channels = client.getChannelsByCategoryID(guild.channels.cache, regionID, "text");

    setInterval(
      async () => {
        const crand = client.getRandomInt(0, channels.length);
        const channel = channels[crand];
        const pokemonArray = await read.getPokemonByGeneration(client, regionIndex);

        let spawned = false;
        while (!spawned) {
          const poketemp = pokemon[client.getRandomIntInclusive(1, pokemonArray.length)];
          const pokemonIndex = poketemp.index;

          const varietytemp = poketemp.varieties[client.getRandomInt(0, poketemp.varieties.length)]
          const pokemonVarietyIndex = varietytemp.index;

          const pokemonFormIndex = varietytemp[client.getRandomInt(0, varietytemp.forms.length)];

          const pokemon = await client.pokemon.generatePokemon( client, { "_id" : pokemonIndex, "variety": pokemonVarietyIndex, "form": pokemonFormIndex, "encountered_location" : channel } )

          spawned = client.percent(1 / 260 * pokemon.capture_rate * 1.3, 1);

          const region = await client.database.db_spawn.request.getDocument(client, guild.id, regionName);
          const p = region.pokemon.findIndex(p => {
            const name = p.name === pokemon.name;
            const channel = p.encountered_location.id === pokemon.encountered_location.id;
            return name && channel;
          });
          if (p < 0) {
            spawned = true;
            const message = client.pokemon.displayPokemon( client, guild, pokemon);
            region.pokemon.push(pokemon);
            await client.database.db_spawn.request.addPokemon(client, guild.id, regionName);
            channel.fetchMessage( message.id )
              .then( msg => {
                msg.delete( 600 * 1000 )
                  .then( async () => {
                    await client.database.db_spawn.request.delPokemon(client, guild.id, regionName, pokemon.name);
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