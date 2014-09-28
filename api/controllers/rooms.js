'use strict';

var mongoose = require('mongoose'),
 _ = require('underscore'),
Room = mongoose.model('Room')


var nconf = require('nconf')
nconf.argv().env().file({file:'config.json'});


/**
* todo : list_users_of
* POST method


*/

exports.createroom = function(req, res){
	//var ar = new Object({'title':'bloue'+Math.random()})
	var new_room = new Object({'name':req.params.title, 'slug':req.params.title})
	var room_options  = new Object( {'option_name':'branding_image_url', 'option_value':'logo.jpg',  'option_type': 'branding' } )
	var room = new Room(new_room);
	room.room_options.push(room_options)
	if(req.user){
		room.owner_email = req.user.email
   	 	console.log(req.user.email)
	}
	else{
			// todo		
	}
	room.save(function(err,room) {
		if (err) {
   			res.json(err);
        } else {
        	res.json(room)
        	console.log(room)
      		//	var room =  Room.findOne({title: new_doc.title}).populate('user', 'name username image_url').exec(function(err, doc) {
   			// });	            
        }
    });
}
