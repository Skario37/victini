module.exports = (client) => {
  client.compareNormalizedStrings = (a ,b) => {
    return a.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() === b.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
};
  