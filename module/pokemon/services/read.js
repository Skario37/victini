const fs = require('fs');
const options = { encoding: 'utf8' };
const assets_path = "./../../../assets/";
const pokemon_path_from_assets = "json/pokemon/";
const gender_path_from_assets = "json/gender/";
const json_ext = ".json";

exports.getPokemonByID = (client, _id) => {
  return fs.readFileSync(
    `${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  );
};
exports.getPokemonVarietyByID = (client, _id, n = 0) => {
  return fs.readFileSync(
    `${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}varieties/${client.addBeginZero(n, 3)}${json_ext}`, 
    options
  );
};
exports.getPokemonFormByID = (client, _id, n = 0) => {
  return fs.readFileSync(
    `${assets_path}${pokemon_path_from_assets}${client.addBeginZero(_id, 4)}forms/${client.addBeginZero(n, 3)}${json_ext}`, 
    options
  );
};


exports.getGenderByID = (client, id = 0) => {
  return fs.readFileSync(
    `${assets_path}${gender_path_from_assets}${client.addBeginZero(_id, 4)}${json_ext}`, 
    options
  );
}