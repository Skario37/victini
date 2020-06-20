const fs = require('fs');
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

exports.getPokemonByID = (client, _id) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
};
exports.getPokemonVarietyByID = (client, _id, n = 0) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}/varieties/${client.addBeginZero(n, 3)}${json_ext}`, 
    options
  ));
};
exports.getPokemonFormByID = (client, _id, n = 0) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}/forms/${client.addBeginZero(n, 3)}${json_ext}`, 
    options
  ));
};


exports.getGenderByID = (client, _id = 3) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${gender_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
}

exports.getNaturesLength = () => {
  const files = fs.readdirSync(`${assets_path}${nature_path_from_assets}`);
  return files.length;
}
exports.getNatureByID = (client, _id = 1) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${nature_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
}

exports.getGrowthLength = () => {
  const files = fs.readdirSync(`${assets_path}${growth_path_from_assets}`);
  return files.filter(dirent => dirent.isFile()).length;
}
exports.getGrowthByURL = (url) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${url}`, 
    options
  ));
}

exports.getMoveByID = (client, _id) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${move_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
}
exports.getMoveURLByID = (client, _id) => {
  return `${move_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`;
}

exports.getItemByID = (client, _id) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${item_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
}



exports.getSpriteByURL = (url) => {
  return `${assets_path}${pokemon_sprite_path_from_assets}${url}`;
}


exports.getVersionGroupByURL = (url) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${url}`, 
    options
  ));
}

exports.getPokemonByGeneration = (client, generation) => {
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

  const pokemonLength = this.getPokemonLength();
  for (let i = 1; i <= pokemonLength; i++) {
    let p = {
      "index": i,
      "varieties": [],
    };

    let nbform = 0;
    let k = 0;
    const varietyLength = this.getPokemonVarietyLength(client, i);
    for (let j = 0; j < varietyLength - 1; j++) {

      let pv = {
        "index": j,
        "forms": []
      }

      let v = this.getPokemonVarietyByID(client, i, j);
      for (k += nbform; k < v.forms.length + nbform - 1; k++) {
        let f = this.getPokemonFormByID(client, i, k);
        let vg = this.getVersionGroupByURL(f.version_group.url);
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

exports.getPokemonLength = () => {
  const files = fs.readdirSync(`${assets_path}${pokemon_path_from_assets}`, { withFileTypes: true });
  return files.filter(dirent => dirent.isFile()).length;
}

exports.getPokemonVarietyLength = (client, _id) => {
  const files = fs.readdirSync(`${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}/varieties/`, { withFileTypes: true });
  return files.filter(dirent => dirent.isFile()).length;
}