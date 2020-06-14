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
  
  client.addBeginZero = (number, size) => {
    if (number == -1) return number; 
      var n = "1";
      for (var i = 0; i < size - 1; i++) { n += "0"; }

      for (var i = 0; i < size; i++) {
        if (Number(number) < Number(n)) {
        number = "0" + number;
        n = n.slice(0, -1);
        }
      }
      if (Number(number) == 0) number = number.slice(0, number.length - 1);
      return number;
  };
};
