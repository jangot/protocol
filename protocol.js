var net = require('net');
var encrypt = require('MD5');

var HASH_LENGTH = 32;

function log() {
    console.log.apply(console, arguments);
}

module.exports = function(port) {
    this._port = port;
    this._onLoad = function(){};
    this._mainDataList = {};

    this
        ._listen()
    ;
}
module.exports.prototype = {

    _port: null,
    _onLoad: null,
    _mainDataList: null,
    _server: null,


    onLoad: function(cb) {
        if (typeof cb !== 'function') {
            return this;
        }
        this._onLoad = cb;
        return this;
    },

    _listen: function() {
        var server = net.createServer(function(c) {
            this._server = c;
            this._server.pipe(this._server);
        }.bind(this));
        server.on('connection', function(connect){
            log('Client connected');
            connect.on('end', function() {
                log('Client disconnected');
            });

            this._onConnect(connect);
        }.bind(this));
        server.listen(this._port, function() { //'listening' listener
            log('server bound');
        });
        return this;
    },

    _onConnect: function(connect) {
        var hash = '';
        var notGettingData = true;
        connect.on('data', function(data){
            var symbol = data.toString()[0];
            if (HASH_LENGTH > hash.length) {
                hash += symbol;
                if (HASH_LENGTH > hash.length) {
                    return;
                }
                log('Loaded hash:', hash);
            }
            if (this._mainDataList[hash] === undefined) {
                this._mainDataList[hash] = '';
            }
            if (notGettingData) {
                var dataPosition = this._mainDataList[hash].length;
                log('Start position:', dataPosition);
                connect.write(dataPosition + '\r\n');
                notGettingData = false;
                return;
            }

            this._mainDataList[hash] += symbol;

            var testingHash = encrypt(this._mainDataList[hash]);
            if (testingHash == hash) {
                this._onLoad(this._mainDataList[hash]);
                connect.end();

                delete this._mainDataList[hash];
            }
        }.bind(this));
        connect.on('end', function() {
            if (HASH_LENGTH > hash.length) {
                delete this._mainDataList[hash];
            };
        });
    }
}