'use strict';

/**
* @description

Emailing and newsletter extensions to MusicBox
Including 
	- a subscribe/unsubscribe function
	- a generated html newsletter view
	- Email functions


* @function 
* @link 
* @todo nothing
*/

var app,
mongoose = require('mongoose'),
 _ = require('underscore'),
 S = require('string'),
Document = mongoose.model('Document'),
meta_options = mongoose.model('Metaoptions'),
User = mongoose.model('User'),
nconf = require('nconf'),
chalk = require('chalk'),
mail= require('./../../sendmail.js'),
nodemailer = require('nodemailer'),
directTransport = require('nodemailer-direct-transport'),
fs = require('fs');

nconf.argv().env().file({file:'config.json'});
var sent_mail = 0;

//var transporter = nodemailer.createTransport(directTransport());
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: nconf.get('MAIL_PROVIDER_MAIL'),
        pass: nconf.get('MAIL_PROVIDER_PASS')
    }
});

// setup e-mail data (defaults)


var sendmailer = exports.sendmailer = function(options){
		var mailOptions = {
		    from: options.from ? options.from :  nconf.get('SITE_TITLE')+' <'+ nconf.get('MAIL_PROVIDER_MAIL')+'>', // sender address
		    to: options.to ? options.to : 'homeof+debugmail@gmail.com', // list of receivers
		    subject: options.subject ? options.subject : 'MB', // Subject line
		    text: options.bodytext ? options.bodytext : '-', // plaintext body
		    html: options.bodytext ? options.bodytext : '-' // html body
		};

        // DEPENDS FROM API / SERVER CONFIGs
        if(!nconf.get('MAIL_API')){
            console.log('NO MAIL API')
        }

        else{
        console.log(' MAIL API')
                 transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Message sent: ' + info.response);
                        sent_mail++;
                        console.log(sent_mail)
                    }
        });
        console.log('sent mail>')
        console.log(mailOptions)
        }
       	return;
}

exports.generate_mail_to_html= function(req, res) {
	var sampledata = 'Hello Tom'
	var targetFile     = 'public/templates/pilot-gen.html';
	fs.writeFile(targetFile, sampledata, '', function(err, dataz){
		res.send(sampledata)
	});     
}

exports.send_mail_from_internal_document= function(req, res) {
	var query = Document.findOne({ 'slug':req.params.slug })
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {
		if (err){
			res.json(err)
		} 
		else{
			if(doc){
				var content = doc.content;
				var sections =   _.filter(doc.markups, function(td){ return  td.type == 'container'; });
				var markups  = 	 _.sortBy(doc.markups,function (num) {
           			return num.start;
     			});

				sections.forEach(function(s) {
					
					var left = []
					var right = []


					s.objects = new Object({left:left,right:right})
					s.text = '';
					for (var pos= s.start; pos<=s.end; pos++){ 
						s.text +=doc.content[pos]
					}
					doc.markups.forEach(function(m) {
						//if(m.start>=s.start){

							s.objects.right.push(m);
						//}
    				})
    				console.log(s.objects)
    			})

				doc.markups.forEach(function(m) {
  	
    			})
				res.render('newsletter', {
					doc_title: doc.title,
					doc_content : doc.content,
					markups: doc.markups,
					sections: sections
				})		
			}
			else{
				res.send('err')
			}
		}
	});	
}

exports.get_subscribers= function(req, res) {
    User.find({newsletter: true, trust : 'confirmed'} , {secret:0, email:0, user_options:0} , function(err, users) {
        users.forEach(function(user) {
            // console.log(user)
            // userMap[user._id] = user
            //console.log('newsletter: '+user.newsletter +' mail: '+user.email)
        })
 		var out = {count:users.length, users:users }
        res.json(out)
    });
}

exports.send_mail_from_html= function(req, res) {

	var sourceFile     = 'public/newsletter/pilot-gen.html';
	fs.readFile(sourceFile ,{ 
	      encoding: 'utf8',
	  },function (err, data) {
	    if (err){
	        console.log('err')
	         res.send('err')

	    } 
	    else{
	         console.log(data)
	             var o = new Object({'subject':'hello', 'bodytext': data})
	             sendmailer(o)
	             res.send(data)
	    }
	});
}

exports.subscribe_view = function(req, res) {
	    var user_ = new Object({'username': null,  'image_url':null})
        res.render('index', { user_in:user_ } );
    
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.subscribe_post = function(req, res) {

    var b = req.body
    b.username 	= 'What\'s your name ? '+Math.random();
    var user = new User(b);
    var message = null;
    user.user_options = new Array();
    var r = getRandomInt(0, 255);
    var g = getRandomInt(0, 255);
    var b = getRandomInt(0, 255);
    var rand_color = 'rgb('+r+', '+g+', '+b+')';
    var user_option = new Object( {'option_name':'color', 'option_value': rand_color,  'option_type': '' } )
    user.user_options.push(user_option)
	user.newsletter = true;
    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Username already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }

            return res.send(message);
        }
        else{
			var user_email = new Object({
				'subject':'hacktuel.fr - Confirmer inscription', 
				'bodytext':'Veuillez cliquer ce <a href="http://localhost:8087/api/v1/subscribe_action?action=confirm&mail='+user.email+'&key='+user.secret+'">lien</a> pour activer votre abonnement à la newsletter d\'hacktuel</p><p>ou entrez directement cette adresse dans votre navigateur : http://localhost:8087/api/v1/subscribe_action?action=confirm&mail='+user.email+'&key='+user.secret+'</p>', 
				'to':user.email
			})
			var admin_email = new Object({
				'subject':'hacktuel.fr - new subscriber', 
				'bodytext':'Veuillez cliquer ce <a href="http://localhost:8087/api/v1/subscribe_action?action=confirm&mail='+user.email+'&key='+user.secret+'">lien</a> pour activer votre abonnement à la newsletter d\'hacktuel</p><p>ou entrez directement cette adresse dans votre navigateur : http://localhost:8087/api/v1/subscribe_action?action=confirm&mail='+user.email+'&key='+user.secret+'</p>', 
				'to':'homeof@gmail.com'
			})
			sendmailer(user_email)
			//sendmailer(admin_email)
			console.log(user)
			res.send(user) 
        }
    });
};
     
exports.subscribe_action = function(req, res) {
	if(req.query.action && req.query.mail && req.query.key){
		User.findOne({email: req.query.mail}).exec(function(err, user) {
			if (err){
				res.send(err)
			} 
			if(user){
	 				if(user.secret == req.query.key){ // test match (secret/GET value)
	 					if(req.query.action == 'confirm'){
	 						user.trust = 'confirmed'
		 					user.save(function(err) {
									var user_ = new Object({'username': null,  'image_url':null})
									res.render('index', { action_: 'confirmed' , user_in:user_ } );
		 					})
	 					}
	 					else if(req.query.action == 'unsubscribe'){
	 						user.trust = 'unsubscribed'
		 					user.save(function(err) {
									var user_ = new Object({'username': null,  'image_url':null})
									res.render('index', { action_: 'unsubscribed' , user_in:user_ } );
		 					})
	 					}
						else if(req.query.action == 'reset'){
							res.send('mail reset to: #todo > contact site owner')
	 					}

	 					else{
							res.send('?action')
	 					}
	 				}
	 				else{
	 					res.send('error mail match')
	 				}
	        }
	        else{
	 			res.send('error user')
	 		}
        });
	}
	else{
		res.send('err key,mail, action')
	}
}
