var io;
var socket;
var says;
exports.init = function(server){
    exports.io = io = require('socket.io').listen(server);
    return io;
};
// test function for internal use
exports.says = function(data){
    console.log('internal sockets says:'+data)
    return;
};


