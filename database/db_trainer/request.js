module.exports = {
  init : async (client, member) => {
    const memberdbName =  `db_${member.user.id}`;
    // Create database structure with template
    await client.database.db.create( memberdbName )
      .then( async () => {
        // trainer
        client.database.db_trainer.template[0].trainerID = client.generatePID(client, 16);
        client.database.db_trainer.template[0].joinedTimestamp = member.joinedTimestamp;
        client.database.db_trainer.template[0].character = { current : "001", available : [ "001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "030" ]};
        client.database.db_trainer.template[0].role = member.roles.cache.map(role => { return role.id });
        client.database.db_trainer.template[0].card = "blue";
        client.database.db_trainer.template[0].money.pokedollar = 1000;

        const memberdb = client.database.db.use( memberdbName );
        await memberdb.bulk({ docs : client.database.db_trainer.template } );
      });
  },

  exists : async (client, member) => {
    const memberdbName =  `db_${member.user.id}`;
    return await client.database.db.list()
      .then((body) => { return body.find( db => db === memberdbName ) });
  },

  getRole : async (client, member) => {
    const memberdbName =  `db_${member.user.id}`;
    const userdb = client.database.use( memberdbName );
    const roles = userdb.get("trainer")
      .then( ( document ) => {
        return document.docs[0].role;
      }
    );
    return roles;
  },

  addExperience : async (client, member, xp) => {
    const memberdbName =  `db_${member.user.id}`;
    const userdb = client.database.use( memberdbName );
    userdb.get("trainer")
      .then( async ( document ) => {
        document.docs[0].experience += xp;
        await userdb.insert( 
          document, 
          "trainer", 
          function( err, response ) {
            if ( !err ) client.logger.log(`[${member.user.id}] ${document.docs[0].experience} addExperience.`, "debug");
            else client.logger.log(`[${member.user.id}] error addExperience\n${response}`, "error");
        });
    });
  },

  getDocument : async (client, member, docName) => {
    const memberdbName =  `db_${member.user.id}`;
    const userdb = client.database.use( memberdbName );
    return userdb.get( docName ).then( ( document ) => { return document; });
  },

  setStarter : async (client, member, starter) => {
    const memberdbName =  `db_${member.user.id}`;
    const userdb = client.database.use( memberdbName );
    userdb.get( "starter" )
      .then( async ( document ) => {
        document.docs[0]["pokemon"] = starter;
        await userdb.insert( 
          document, 
          "starter", 
          function( err, reponse ) {
            if ( ! err ) client.logger.log(`[${member.user.id}] ${document.docs[0].starter} setStarter`, "debug");
            else client.logger.log(`[${member.user.id}] error setStarter\n${response}`, "error");
        });
    });
  }

}
