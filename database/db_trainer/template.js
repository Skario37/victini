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
    pc : [
      {
        "name": "#1",
        "order": 1,
        "box": [],
      },
      {
        "name": "#2",
        "order": 2,
        "box": [],
      },
      {
        "name": "#3",
        "order": 3,
        "box": [],
      },
      {
        "name": "#4",
        "order": 4,
        "box": [],
      },
      {
        "name": "#5",
        "order": 5,
        "box": [],
      },
      {
        "name": "#6",
        "order": 6,
        "box": [],
      }
    ],
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
