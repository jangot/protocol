var Server = require('./server');
var encrypt = require('MD5');

var HASH_LENGTH = 32;

var mainDataList = {
//    '51ba2de19634bda447ca454188e31927': 'Yoo'
};

var connect = new Server();
connect
    .listen(8124)
    .onConnect(function(connect){
        var hash = '';
        var notGettingData = true;
        connect.on('data', function(data){
            var symbol = data.toString()[0];
            if (HASH_LENGTH > hash.length) {
                hash += symbol;
                if (HASH_LENGTH > hash.length) {
                    return;
                }
                console.log('Loaded hash:', hash);
            }
            if (mainDataList[hash] === undefined) {
                mainDataList[hash] = '';
            }
            if (notGettingData) {
                var dataPosition = mainDataList[hash].length;
                console.log('Start position:', dataPosition);
                connect.write(dataPosition + '\r\n');
                notGettingData = false;
                return;
            }

            mainDataList[hash] += symbol;

            var testingHash = encrypt(mainDataList[hash]);
            if (testingHash == hash) {
                console.log('Loaded data:' + mainDataList[hash]);
                connect.end();

                delete mainDataList[hash];
            }
        });
        connect.on('end', function() {
            if (HASH_LENGTH > hash.length) {
                delete mainDataList[hash];
            };
        });
    })
;

function onData(data) {

}



