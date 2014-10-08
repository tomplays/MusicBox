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
	var new_room = new Object({'name':req.params.slug, 'slug':req.params.slug})
	var room_options  = new Object( {'option_name':'branding_image_url', 'option_value':'logo.jpg',  'option_type': 'branding' } )
	var room = new Room(new_room);
	room.room_options.push(room_options)
	if(req.user){
		room.owner_email = req.user.email
		room.owner = req.user

   	 	console.log(req.user.email)
	}
	else{
			// todo		
	}
	room.save(function(err,room) {
		if (err) {
   			res.json(err);
        } else {
        	//
        	console.log(room)
      		var room =  Room.findOne({slug:req.params.slug}).populate('owner').exec(function(err, room) {
   				res.json(room)
   			});	            
        }
    });
}
