const fs = require('fs').promises;

const options = { encoding: 'utf8' };
const assets_path = "./assets/";
const pokemon_path_from_assets = "json/pokemon/";
const gender_path_from_assets = "json/gender/";
const nature_path_from_assets = "json/nature/";
const growth_path_from_assets = "json/growth-rate/";
const move_path_from_assets = "json/moves/";
const item_path_from_assets = "json/item/";

const json_ext = ".json";

const pokemon_sprite_path_from_assets = "images/pokemon/sprites/";

exports.getPokemonByID = async (client, _id) => {
  return JSON.parse(await fs.readFile(
    `${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
};
exports.getPokemonVarietyByID = async (client, _id, n = 0) => {
  return JSON.parse(await fs.readFile(
    `${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}/varieties/${client.addBeginZero(n, 3)}${json_ext}`, 
    options
  ));
};
exports.getPokemonFormByID = async (client, _id, n = 0) => {
  return JSON.parse(await fs.readFile(
    `${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}/forms/${client.addBeginZero(n, 3)}${json_ext}`, 
    options
  ));
};


exports.getGenderByID = async (client, _id = 3) => {
  return JSON.parse(await fs.readFile(
    `${assets_path}${gender_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
}

exports.getNaturesLength = async () => {
  const files = await fs.readdir(`${assets_path}${nature_path_from_assets}`);
  return files.length;
}
exports.getNatureByID = async (client, _id = 1) => {
  return JSON.parse(await fs.readFile(
    `${assets_path}${nature_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
}

exports.getGrowthLength = async () => {
  const files = await fs.readdir(`${assets_path}${growth_path_from_assets}`);
  return files.filter(dirent => dirent.isFile()).length;
}
exports.getGrowthByURL = async (url) => {
  return JSON.parse(await fs.readFile(
    `${assets_path}${url}`, 
    options
  ));
}

exports.getMoveByID = async (client, _id) => {
  return JSON.parse(await fs.readFile(
    `${assets_path}${move_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
}
exports.getMoveURLByID = (client, _id) => {
  return `${move_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`;
}

exports.getItemByID = async (client, _id) => {
  return JSON.parse(await fs.readFile(
    `${assets_path}${item_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
}



exports.getSpriteByURL = (url) => {
  return `${assets_path}${pokemon_sprite_path_from_assets}${url}`;
}


exports.getVersionGroupByURL = async (url) => {
  return JSON.parse(await fs.readFile(
    `${assets_path}${url}`, 
    options
  ));
}

exports.getPokemonByGeneration = async (client, generation) => {
  const pokemon = [];
  generation += '';
  switch (generation.toLowerCase()) {
    case "kanto":
    case "generation-i":
    case "1":
      generation = "generation-i";
      break;
    default:
      generation = "all";
  }

  const pokemonLength = await this.getPokemonLength();
  for (let i = 1; i <= pokemonLength; i++) {
    let p = {
      "index": i,
      "varieties": [],
    };

    let nbform = 0;
    let k = 0;
    const varietyLength = await this.getPokemonVarietyLength(client, i);
    for (let j = 0; j <= varietyLength - 1; j++) {

      let pv = {
        "index": j,
        "forms": []
      }

      let v = await this.getPokemonVarietyByID(client, i, j);
      for (k += nbform; k <= v.forms.length + nbform - 1; k++) {
        let f = await this.getPokemonFormByID(client, i, k);
        let vg = await this.getVersionGroupByURL(f.version_group.url);
        if (vg.generation.name === generation || generation === "all") {
          pv.forms.push(k);
          p.varieties.push(pv);
        }
      }
      nbform = k;
    }

    if (p.varieties.length > 0) pokemon.push(p);
  }

  return pokemon;
}

exports.getPokemonLength = async () => {
  const files = await fs.readdir(`${assets_path}${pokemon_path_from_assets}`, { withFileTypes: true });
  return files.filter(dirent => dirent.isFile()).length;
}

exports.getPokemonVarietyLength = async  (client, _id) => {
  const files = await fs.readdir(`${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}/varieties/`, { withFileTypes: true });
  return files.filter(dirent => dirent.isFile()).length;
}