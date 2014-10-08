'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    documents = require('./documents'),
    User = mongoose.model('User'),
    Document = mongoose.model('Document'),
    auth = require('../authorization');


/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};


exports.signin = function(req, res) {

};

exports.signin_login= function(req, res) {


    console.log(req.body.redirect_url)
    if(req.user){
        console.log('yoo')
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

/**
 * Session
 */
exports.session = function(req, res) {


    //return res.redirect('/');
    res.json('ok');
};


exports.account = function(req, res) {
       
        var user_ = new Object({'username': req.user.username})
        res.render('index_v1', {
            doc: new Object(),
            user_in : user_,
        });
}

exports.account_api = function(req, res) {
    Document.find({user : req.user._id}).sort('-created').populate('user').exec(function(err, user_documents) {
        if (err) {
            return 'Error';
            res.send('err')
        } else {
           //console.log(user_documents);
           var out = new Object();
           out.user_documents = user_documents;
           out.user = req.user;
           res.json(out);
        }
    });
   
}  


   
exports.create = function(req, res) {
    console.log(req.body)
    var user = new User(req.body);
    var message = null;
    user.user_options = new Array();
    
    var user_option = new Object( {'option_name':'color', 'option_value':'#ccc',  'option_type': '' } )
    user.user_options.push(user_option)
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
        req.logIn(user, function(err) {
            if (err){
                  res.send('user')
            }
            //res.redirect('/');
            res.send('user')
        });
    });
};

/**
 * Send User by Username
 */
exports.getDetailsByName = function(req, res) {
    var reqUsername = req.params.username;
    User.findOne({username: reqUsername}).exec().then(function(reqUser){
        if(reqUser){
            if(req.user && req.user.username === reqUsername){

res.jsonp({
                        user : reqUser
                      //  articles : articles
                    });

                /*articles.allByUsername(reqUsername).then(function(articles){
                    res.jsonp({
                        user : reqUser,
                        articles : articles
                    });
                });
                 */
            }
            else{
                res.jsonp({
                        user : reqUser,
                      //  articles : articles
                    });

                /*
                articles.publishedByUsername(reqUsername).onResolve(function(err, articles){
                    res.jsonp({
                        user : reqUser,
                        articles : articles
                    });
                });
                s*/
            }
        }
        else{
            res.status(404).send('Oops! This person is not here ...');
        }

    });
};


/**
 * Find user by id
 */
exports.userById = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};