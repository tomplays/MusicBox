'use strict';
/**
* @description API methods for user
* @function 
* @link 
* @todo nothing
*/




/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    documents = require('./documents'),
    User = mongoose.model('User'),
    Document = mongoose.model('Document'),
     _ = require('underscore'),
    auth = require('../authorization'),
    mails = require('./mails.js'),
    nconf = require('nconf')

nconf.argv().env().file({file:'config.json'});

/**
* @description List all users (in console only)
* @function 
* @link 
* @todo nothing
*/

exports.list= function(req, res) {
    User.find({}, function(err, users) {
        //var userMap = {}
      
        var out= {}
       out.users= []
       out.count= users.length
        users.forEach(function(user) {
            

            user.secret = 'secret'
            out.users.push(user)
            
            // console.log(user)
            // userMap[user._id] = user
            console.log('username: '+user.username +' mail: '+user.email)
        })
        res.send('console only infos')
        // res.json(out)
    });
}

exports.login = function(req, res) {
    var user_ = new Object({'username': null,  'image_url':null})
    res.render('index', { user_in:user_ } );
};



exports.lostpass = function(req, res) {
   

    if(req.body.email){

        var qmail = req.body.email.replace(/\s/g, "+")
        console.log(qmail)

         var user= User.findOne({email : qmail }).exec(function(err,user) {
            if(user) {
               // todo !! 

              
                        console.log('mail')
                        var admin_email = new Object({
                        'subject': nconf.get('SITE_TITLE')+' - Reset password', 
                        'bodytext':'Veuillez cliquer ce <a href="'+nconf.get('ROOT_URL')+':'+nconf.get('PORT')+'/api/v1/subscribe_action?action=reset&mail='+user.email+'&key='+user.secret+'">lien</a> pour </p><p>ou entrez directement cette adresse dans votre navigateur : '+nconf.get('ROOT_URL')+':'+nconf.get('PORT')+'/api/v1/subscribe_action?action=reset&mail='+user.email+'&key='+user.secret+'</p>', 
                        'to':'homeof@gmail.com'
                         })
                         mails.sendmailer(admin_email)   
                

                        
            } 
            else {
               

                console.log('no mail')
                return;
          
             
            }
        });
        
    }
   
    res.json('maybe sent, may be not :) ');


};



exports.signup = function(req, res) {
  var user_ = new Object({'username': null,  'image_url':null})
  res.render('index', { user_in:user_ } ); 
};

exports.signin_login= function(req, res) {
    if(req.user){
        var out = new Object({'redirect_url': req.body.redirect_url})
        res.json(out)
    }
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('');
};


exports.authCallback = function(req, res) {
    res.redirect('/');
};


exports.signin = function(req, res) {};

exports.account = function(req, res) {
       
        var user_ = new Object({'username': req.user.username, '_id':req.user._id})


        res.render('index', {
            doc: new Object(),
            user_in : user_,
        });
}

exports.account_api = function(req, res) {
    console.log()
    if(req.user._id){
        Document.find({user : req.user._id}).sort('-updated').populate('user', '-hashed-password').populate('room').exec(function(err, user_documents) {
            if (err) {
                return 'Error';
                res.send('err')
            } else {
               //console.log(user_documents);
               var out = new Object();
               if(req.user.trust == 'confirmed'){
                    out.user_documents = user_documents;
               }
                else{
                    out.user_documents = [];
                }
               out.user = req.user;
               res.json(out);
            }
        });
    }
    else{
          res.send('error on user in')
    }
}  
exports.edit = function(req, res) {
    var out = new Object();
    if(req.user._id){
    //console.log(req.body)

       var user = User.findOne({ _id:req.user._id}).populate('room').exec(function(err, user) {
            if (err && err.code) {
                out.error = err.code
                 res.json(out);
                 return
            } 
            else {
                _.each(['username', 'password', 'email', 'newsletter'] , function(f){ 
                    user[f] = (req.body[f] && req.body[f] !== "" && req.body[f] !== 'undefined') ? req.body[f]  : user[f]
                });
                user.save(function(err) {
                     if (err && err.code) {
                         out.error =err.code

                     }
                     else{
                        out.edited = 'saved'
                        out.user = user;
                     }
                         res.json(out);
                        return
                }) 
            }
        });
    }
    else{
          res.send('error on user in')
    }
} 

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.create = function(req, res) {
    console.log(req.body)

    var user = new User(req.body);

    var message = null;
    user.user_options = new Array();
   // 52, 152, 219 blue! 
    var r = getRandomInt(40, 65);
    var g = getRandomInt(140, 175);
    var b = getRandomInt(200, 225);
    var rand_color = 'rgb('+r+', '+g+', '+b+')';
    var user_option = new Object( {'option_name':'color', 'option_value': rand_color,  'option_type': '' } )
    user.user_options.push(user_option)
    user.provider = 'local';

    user.markModified = true;
    console.log('req.body>')
    console.log(req.body)
    // TODO ; newletter > req.body.newsletter
    user.save(function(err) {
        if (err) {
            message = err.code;

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
         var user_email = new Object({
                'subject':'['+ nconf.get('SITE_TITLE')+'] - Confirmer inscription', 
                'bodytext':'Veuillez cliquer ce <a href="'+nconf.get('ROOT_URL')+':'+nconf.get('PORT')+'/api/v1/subscribe_action?action=confirm&mail='+user.email+'&key='+user.secret+'">lien</a> pour activer votre inscription </p><p>ou entrez directement cette adresse dans votre navigateur : '+nconf.get('ROOT_URL')+':'+nconf.get('PORT')+'/api/v1/subscribe_action?action=confirm&mail='+user.email+'&key='+user.secret+'</p>', 
                'to':'homeof@gmail.com'
                //user.email
            })
            var admin_email = new Object({
                'subject':'[SITE ADMIN '+ nconf.get('SITE_TITLE')+'] - new signup', 
                'bodytext':'new_user_signup'+JSON.stringify(user), 
                'to':'homeof@gmail.com'
            })
            mails.sendmailer(user_email)
            mails.sendmailer(admin_email)



        req.logIn(user, function(err) {

           
            

            // var email_object = new Object({'subject':'[SITE ADMIN new user] - ', 'bodytext':'new_user_signup'+JSON.stringify(user) })
            // mails.sendmailer(email_object)

            if (err){
                res.send('user')
            }
            //res.redirect('/');
            res.send('user')

        });
    });
};

