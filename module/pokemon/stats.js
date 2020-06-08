module.exports = (client) => {
    client.pokemon.stats = {};
    client.pokemon.stats.calcHP = ( level, iv, ev, base ) => {
        return Math.floor( ( ( ( 2 * base + iv + ev / 4 ) * level ) / 100 ) + level + 10 );
    };

    client.pokemon.stats.calcStat = ( level, iv, ev, base, nature ) => {
        return Math.floor( ( ( ( 2 * base + iv + ev / 4 ) * level ) / 100 + 5 ) * nature );
    };
};