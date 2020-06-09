const wol = require('wake_on_lan');

module.exports = (client) => {
    client.home = {};

    client.home.wakeOnLan = () => {
        wol.wake(client.config.computerMacAddress, sendWakeUUUUP);
    };

    function sendWakeUUUUP(error) {
        if (error) {
            client.users.cache.get(client.config.ownerID).send("Je n'ai pas réussi à démarer ton PC. Peut-être l'est-il déjà ?");
        } else {
            client.users.cache.get(client.config.ownerID).send("J'ai allumé ton PC :v:");
        }
    };
};
