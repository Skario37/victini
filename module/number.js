module.exports = (client) => {
    client.generatePID = (client, bits) => {
        return client.getRandomInt( 0, Math.pow(2, bits) );
    };


    client.getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    client.getRandomArbitrary = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    client.getRandomIntInclusive = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
    };

    client.percent = (a, b) => {
        return Math.random() * b < a;
    };

    client.getUUID = () => {
        return client.chr4() + client.chr4() +
            '-' + client.chr4() +
            '-' + client.chr4() +
            '-' + client.chr4() +
            '-' + client.chr4() + client.chr4() + client.chr4();
    };

    client.chr4 = () => {
        return Math.random().toString(16).slice(-4);
    };

    client.bin = ( x, bits ) => {
        var sign = (x < 0 ? "-" : "");
        var result = Math.abs(x).toString(2);
        while(result.length < bits) {
            result = "0" + result;
        }
        return sign + result;
    };    
};
