var io;
var socket;
var says;


exports.socketer = function(socket, data){
	console.log('socket data')
	console.log(data)
	//socket.emit('newsback', data)
	//socket.broadcast.to('homepage').emit('newsback', data)
	//io.sockets.in(room).emit('message', data);
	socket.broadcast.emit('newsback', data)
}
