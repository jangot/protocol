var net = require('net');
var MD5 = require('MD5');

var STRING_END = '\r\n';
var STRING = 'YooMoe Fuck my brain.Fucking.sdfsdf/sdfsdf';
//    '/sdfsdf/w342342/23423rf2/f32f23fwaefrefghsde56u7y/e54sdfsdfas' +
//    'dasassfs sdf8u9sf adf adsfh aef  aewrfup84era  arfdgh arfepuh arf' +
//    'gsd<f araeg aerg dfg sdfg szdfg sr<<<<<<>>>>>>//////uh............&';
var hash = MD5(STRING);
var HASH_LENGTH = hash.length;

var waitStart = false;
var client = net.connect({port: 8124},
    function() {
        var count = HASH_LENGTH;
        var step = 0;
        var intervalID = setInterval(function(){
            send(step);
            step++;
            if (count == step) {
                clearInterval(intervalID);
                waitStart = true;
                return;
            }
        }, 100)
    });

var strSend = false;
client.on('data', function(data) {
    var string = data.toString();
    if (waitStart && !strSend) {
        string = string.replace(/\r\n$/, '');
        if (string == hash[hash.length - 1]) {
            return;
        }
        strSend = true;
        sendString(string);
    }
    if (strSend) {
       console.log(string);
    }
});
client.on('end', function() {
    console.log('client disconnected');
});

function sendString(n) {
    var count = STRING.length;
    var step = n;

    console.log(hash);
    var intervalID = setInterval(function(){
        var str = STRING[step];
        client.write(str);
        step++
        if (count == step) {
            clearInterval(intervalID);
        }
    }, 100)
}

function send(n) {
    var str = hash[n];
    client.write(str);
    return;
}

