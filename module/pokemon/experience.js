module.exports = (client) => {
    client.pokemon.levelSystem = {};
    client.pokemon.levelSystem.calcEXP = ( level, maxEXP ) => {
        var result;
        if ( maxEXP == 800000 ) { result = 0.8 * Math.pow( level, 3 ); } 

        else if ( maxEXP == 1000000 ) { result = Math.pow( level, 3 ); } 

        else if ( maxEXP == 1059860 ) { result = 1.2 * Math.pow( level, 3 ) - 15 * Math.pow( level, 2 ) + 100 * level - 140 ; } 

        else if ( maxEXP == 1250000 ) { result = 1.25 * Math.pow( level, 3 ); } 

        else if ( maxEXP == 600000 ) {
          if ( level <= 50 ) { result = Math.pow( level, 3 ) * ( ( 100 - level ) / 50 ); } 

          else if ( level <= 68 ) { result = Math.pow( level, 3 ) * ( ( 150 - level ) / 100 ); }

          else if ( level <= 98 ) { result = Math.pow( level, 3 ) * ( 1.274 - 1/50 * level/3 - level % 3 ); } 

          else if ( level <= 100 ) { result = Math.pow( level, 3 ) * ( ( 160 - level ) / 100 ); }
        } 

        else if ( maxEXP == 1640000 ) {
          if ( level <= 15 ) { result = Math.pow( level, 3 ) * ( ( 24 + ( level + 1 ) / 3 ) / 50 ); } 

          else if ( level <= 35 ) { result = Math.pow( level, 3 ) * ( ( 14 + level ) / 50 ); } 

          else if ( level <= 100 ) { result = Math.pow( level, 3 ) * ( ( 32 + level/2 ) / 50 ); }
        }


        return Math.round( result );
    };

    client.pokemon.levelSystem.calcLevel = ( levels, exp ) => {
        return levels.filter(level => level.experience <= exp)[0].level;
    };
};