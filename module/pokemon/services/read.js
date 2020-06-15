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
  return files.length;
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
exports.getMoveUrlByID = (client, _id) => {
  return `${move_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`;
}

exports.getItemByID = (client, _id) => {
  return JSON.parse(fs.readFileSync(
    `${assets_path}${item_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  ));
}