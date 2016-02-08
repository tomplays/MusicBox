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
	var content_pushed = []
	var markups_pushed = []
	var save_doc = false;

	if(data.identifier){
			var query = Document.findOne({ 'slug':data.identifier});
			query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {
				if (err){
					res.json(err)
				} 
				else{
					if(doc){
						
						_.each(data.actions, function(action){

							if(action.type == 'markup_push'){
								//console.log(action.markup)
								var markup = new Markup( { 'username':data.user.username, 'user_id': data.user.user_id, 'position': action.markup.position, 'start':action.markup.start, 'end':action.markup.end, 'subtype':action.markup.subtype, 'type':action.markup.type, 'status': 'pending', 'metadata': action.markup.metadata, 'depth': 1} )
								markup.user = {'username':data.user.username, 'user_id': data.user.user_id}
								markup.user_id =  data.user.user_id
								markup.isNew; // true
								doc.markups.push(markup)
								markups_pushed.push(markup)
								save_doc = true

							}
							if(action.type == 'content_push' &&  action.value){
								console.log('content_push')
								console.log(data)
								doc.content = action.value+''+doc.content
								content_pushed.push(action)
								save_doc = true

							}

							if(action.type == 'ranges_test'){
								console.log('ranges_test server middleware')
								// console.log(data)
							}




						})

						if(save_doc == true ){
							doc.markModified('markups');
							doc.save(function(err,doc) {
								if (err) {
									console.log(err)
								} 
								else {
									console.log('pushed')

									if(markups_pushed.length>0){
										data.markups_pushed = markups_pushed

									}
									if(content_pushed.length>0){
										data.content_pushed = doc.content
									}


									socket.broadcast.emit('newsback', data)
									//res.send('socketed view')
								}
								
							});
						}
						else{
							socket.broadcast.emit('newsback', data)
							//res.send('socketed view')
						}
					
						
						
					}
				}
			});

	}
}
