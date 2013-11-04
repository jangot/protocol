var Protocol = require('./protocol');

var loader = new Protocol(8124);

loader
    .onLoad(function(data){
        console.log(data)
    })
;