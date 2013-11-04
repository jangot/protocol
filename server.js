var net = require('net');

var STRING_END = '\r\n';

module.exports = function() {

    this._onConnect = function(){};
    this._connect = null;
}
module.exports.prototype = {

    _onConnect: null,

    onConnect: function(cb){
       this._onConnect = cb;
    },

    send: function(message) {
        this._connect.write(message + STRING_END);
    },

    listen: function(port) {
        var server = net.createServer(function(c) {
            this._connect = c;
            this._connect.pipe(this._connect);
        }.bind(this));
        server.on('connection', function(connect){
            console.log('Client connected');
            connect.on('end', function() {
                console.log('Client disconnected');
            });

            this._onConnect(connect);
        }.bind(this));
        server.listen(port, function() { //'listening' listener
            console.log('server bound');
        });
        return this;
    }
}
