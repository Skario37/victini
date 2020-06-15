module.exports = (client) => {
    client.pokemon.stats = {};
    const calcHP = ( level, iv, ev, base ) => {
        return Math.floor( ( ( ( 2 * base + iv + ev / 4 ) * level ) / 100 ) + level + 10 );
    };

    client.pokemon.stats.calcStat = ( nameStat, level, iv, ev, base, nature = {} ) => {
        if(nameStat === "hp ") {
            return calcHP( level, iv, ev, base );
        } else {
            let mult = 1.0;
            if(typeof nature.decreased_stat !== "undefined" && nature.decreased_stat !== null) {
                if(nature.decreased_stat.name === nameStat) mult = 0.9;
            } else if(typeof nature.increased_stat !== "undefined" && nature.increased_stat !== null) {
                if(nature.increased_stat === nameStat) mult = 1.1;
            }
            return Math.floor( ( ( ( 2 * base + iv + ev / 4 ) * level ) / 100 + 5 ) * mult );
        }
    };
};