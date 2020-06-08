module.exports = [
  // TRAINER
  {
    _id : "trainer",
    trainerID : 0,
    joinedTimestamp : 0,
    character : {},
    role : [],
    experience : 0,
    card : "",
    money : {
      pokedollar : 0,
      battlepoint : 0
    }
  },

  // POKEMON
  {
    _id : "pokemon",
    team : [],
    pc : [],
    daycare : []
  },

  // POKEDEX
  {
    _id : "pokedex",
    evolution : 0,
    hatch : 0,
    trade : 0,
    pokemon : []
  },

  // STARTER
  {
    _id : "starter",
    pokemon : []
  },

  // INVENTORY
  {
    _id : "inventory",
    item : [],
    medicine : [],
    ball : [],
    rare : []
  }
]
