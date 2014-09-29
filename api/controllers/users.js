'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    documents = require('./documents'),
    User = mongoose.model('User');
    var auth = require('../authorization');


/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};


exports.account = function(req, res) {
  
        if(req.user){
                user_ = new Object({'username': 'jsjd',  'image_url':'img'})

        }
        
        res.render('index_v1', {
            doc: new Object(),
            docs: new Object(),
            user : user_,
            socket_url: nconf.get('SOCKET_SERVER_URL')
        });


  

}

/**
 * Create user
 */
exports.create = function(req, res, next) {
    var user = new User(req.body);
    var message = null;

    user.provider = 'local';

    user.user_options = new Array();
    
    var user_option = new Object( {'option_name':'color', 'option_value':'#ccc',  'option_type': '' } )



    user.user_options.push(user_option)

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

            return res.render('users/signup', {
                message: message,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
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