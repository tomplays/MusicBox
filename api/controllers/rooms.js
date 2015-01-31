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
exports.list = function(req, res){
var rooms =  Room.find( {is_public: true}, {secret: 0, owner_email:0}).populate('owner', '-user_options -hashed_password -email -salt').exec(function(err, rooms) {
   	res.json(rooms)
});	
}


exports.room_view = function(req, res){


var user_ = ''
		if(req.user){
			user_ = new Object({'_id': req.user._id , 'username': req.user.username,  'image_url': req.user.image_url})
		}
		res.render('index_v1', {
			user_in : user_
		});
}

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
