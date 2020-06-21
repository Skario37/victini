module.exports = {
  init : async (client, guildID) => {
    const spawndbName =  `db_spawn_${guildID}`;
    // Create database structure with template
    await client.database.db.create( spawndbName )
      .then( async () => {
        const spawndb = client.database.db.use( spawndbName );
        await spawndb.bulk({ docs : client.database.db_spawn.template } );
      });
  },

  exists : async (client, guildID) => {
    const spawndbName =  `db_spawn_${guildID}`;
    return await client.database.db.list()
      .then((body) => { return body.find( db => db === spawndbName ) });
  },

  destroy : async (client, guildID) => {
    const spawndbName =  `db_spawn_${guildID}`;
    client.database.db.destroy(spawndbName);
  },
  // Delete to do

  getDocument : async (client, guildID, docName) => {
    const spawndbName = `db_spawn_${guildID}`;
    const db = client.database.use(spawndbName);
    return db.get( docName ).then( ( document ) => { return document; });
  },

  addDocument : async (client, guildID, document) => {
    const spawndbName = `db_spawn_${guildID}`;
    await userdb.insert( 
      document, 
      spawndbName, 
      function( err, response ) {
        if ( ! err ) client.logger.log(`[${guildID} - ${document._id}] addDocument`, "debug");
        else client.logger.log(`[${guildID} - ${document._id}] error setStarter\n${response}`, "error");
    });
  },

  addPokemon : async (client, guildID, docName, pokemon) => {
    const spawndbName = `db_spawn_${guildID}`;
    const db = client.database.use(spawndbName);
    db.get( docName )
      .then( async ( document ) => { 
        document.pokemon.push(pokemon); 
        await db.insert( 
          document, 
          docName, 
          function( err, response ) {
            if ( ! err ) client.logger.log(`[${guildID} - ${pokemon.name}] addPokemon`, "debug");
            else client.logger.log(`[${guildID} - ${pokemon.name}] error addPokemon\n${response}`, "error");
        });
      }
    );
  },

  delPokemon : async (client, guildID, docName, puuid) => {
    const spawndbName = `db_spawn_${guildID}`;
    const db = client.database.use(spawndbName);
    db.get( docName )
      .then( async ( document ) => { 
        const index = document.pokemon.findIndex(p => p.uuid === puuid);
        if (index > -1) {
          document.pokemon.splice(index, 1);
        }
        await db.insert( 
          document, 
          docName, 
          function( err, response ) {
            if ( ! err ) client.logger.log(`[${guildID} - ${puuid}] delPokemon`, "debug");
            else client.logger.log(`[${guildID} - ${puuid}] error delPokemon\n${response}`, "error");
        });
      }
    );
  }

}
