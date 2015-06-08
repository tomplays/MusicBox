var io;
var socket;
var says;
var mongoose = require('mongoose'),
 _ = require('underscore'),
 S = require('string'),
Document = mongoose.model('Document'),
meta_options = mongoose.model('Metaoptions'),
User = mongoose.model('User'),
Markup  = mongoose.model('Markup');


var nconf = require('nconf');

nconf.argv().env().file({file:'config.json'});

var chalk = require('chalk');
var app;

exports.socketer = function(socket, data){
	console.log('socket data')
	// console.log(data)



	if(data.identifier){
			var query = Document.findOne({ 'slug':data.identifier});
			query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {
				if (err){
					res.json(err)
				} 
				else{
					if(doc){
						var markups_pushed = []
						_.each(data.actions, function(action){
							if(action.type == 'markup_push'){
								console.log(action.markup)
								var markup = new Object( { 'username':data.user.username, 'user_id': data.user.user_id, 'position': action.markup.position, 'start':action.markup.start, 'end':action.markup.end, 'subtype':action.markup.subtype, 'type':action.markup.type, 'status': 'pending', 'metadata': action.markup.metadata, 'depth': 1} )
								


								markup.isNew; // true
								doc.markups.push(markup)
								markup.user = {'username':data.user.username, 'user_id': data.user.user_id}
								markups_pushed.push(markup)
							}
						})
						
						doc.markModified('markups');
						doc.save(function(err,doc) {
							if (err) {
								console.log(err)
							} 
							else {
								console.log('pushed')

								data.markups_pushed = markups_pushed


								socket.broadcast.emit('newsback', data)
								}
							
						});
					}
				}
			});

	}


	//socket.emit('newsback', data)
	//socket.broadcast.to('homepage').emit('newsback', data)
	//io.sockets.in(room).emit('message', data);
	// to front
	//socket.broadcast.emit('newsback', data)
}
