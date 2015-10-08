'use strict';

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized (requiresLogin)');
    }
    next();
};
exports.requiresLogin_or_secret = function(req, res, next) {
    
    if(req.isAuthenticated()){
        console.log('user is in')
    }
    else{
     console.log('user is not in')
    }
    
    if (req.body.secret) {
         console.log('using secret')
    }
    else{
        console.log('not using secret')
    }

    // if both are null == no acces.
    if (!req.isAuthenticated() &&  !req.body.secret) {
        return res.json('User need login and/or secret key');
        return;
    }
    else{
         next();
    }
};



/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
             return res.json('User need login and/or secret key');
        }
        next();
    }
};

/**
 * Article authorizations routing middleware
 */
exports.document = {
    hasAuthorization: function(req, res, next) {
        if (req.document.user.id != req.user.id) {
            return res.json('User need login and/or secret key');
        }
        next();
    }
};