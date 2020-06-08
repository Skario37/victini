module.exports = {
    getDocument : async (client, docName) => {
        const db = client.database.use( "db_server" );
        return db.get( docName ).then( ( document ) => { return document; });
    }
}
  