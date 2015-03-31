'use strict';

var mongoose = require('mongoose'),
request = require('request'),
//TwitterStrategy = require('passport-twitter').Strategy,
//  FacebookStrategy = require('passport-facebook').Strategy,
LocalStrategy = require('passport-local').Strategy,
//BufferAppStrategy = require('passport-bufferapp').Strategy,

User = mongoose.model('User'),
nconf = require('nconf');

module.exports = function(passport) {
    //Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        //console.log('deserialize')
        User.findOne({
            _id: id
        }, '-salt -hashed_password', function(err, user) {
            //   console.log('user in')
            done(err, user);
        });
        
    });

  passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) { 
            console.log('err')
            return done(err); }
        if (!user) { 
            console.log('Unknown user')
            return done(null, false, { message: 'Unknown user ' + username }); 
        }
        user.authenticate(password, function(cb) {
             if(cb){
                return done(null, user);
             }
             else{
                 return done(err);
             }
        })
    });
}));
    
    // keep track / not used anymore
    //Use facebook strategy
    /*
    var facebook = new Object({
        'clientID': nconf.get('FACEBOOK_ID'),
        'clientSecret': nconf.get('FACEBOOK_SECRET'),
        'callbackURL': nconf.get("ROOT_URL")+"/auth/facebook/callback" // 
    });

    passport.use(new FacebookStrategy({
            clientID: facebook.clientID,
            clientSecret: facebook.clientSecret,
            callbackURL: facebook.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            //console.log('CB!')
            User.findOne({
                'facebook.id': profile.id
            }, function(err, user) {
                if (err) {
                    //console.log(user)
                    return done(err);
                }
                if (!user) {
                    
                        user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,

                        provider: 'facebook',
                        facebook: profile._json,
                        image_url : "http://graph.facebook.com/" + profile._json.id + "/picture?type=square"
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                      //  console.log(user)
                        return done(err, user);
                    });
                  
                } else {
                                   //     console.log(user)

                    return done(err, user);
                }
            });
           
        }
    ));
    */
};