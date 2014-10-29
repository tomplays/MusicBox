'use strict';


var index = require('../api/controllers/index');
var docs = require('../api/controllers/documents');
var markups = require('../api/controllers/markups');
var users = require('../api/controllers/users');
var rooms = require('../api/controllers/rooms');



module.exports = function(app, passport, auth) {
    

    app.get('/login', users.login );
    app.post('/register', users.create);
    app.get('/signup', users.signup );
	// USER
    app.get('/signout', users.signout);
    //Setting the facebook oauth routes
    /*
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'],
        failureRedirect: '/'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/'
    }), users.authCallback);
     */
   
    //Finish with setting up the username param
    //app.param('username', users.userByName);
    //app.param('userId', users.userById);


    app.get('/me/account', auth.requiresLogin, users.account);
    app.get('/api/v1/me/account', auth.requiresLogin, users.account_api);

  
    var fileupload = require('fileupload').createFileUpload('public/uploads').middleware;
    app.post('/api/v1/media/upload', fileupload, function(req, res) {
       res.send(req.body.image)
     })

   
    app.get('/',                            docs.index_doc);

    app.get('/doc/create',  auth.requiresLogin, docs.index_doc ); // load sub-blocks ? express/angualar..?


    // routes errors
    app.get('/doc',                         index.errors);
    app.get('/docs',                        index.errors);

    // views & partials
  	app.get('/doc/:slug',                   docs.index_doc);
    app.get('/partials/:name/:param?',      index.partial); // document, lists, etc..
    app.get('/fragments/:name/:param?',     index.fragments); // load sub-blocks 
    app.get('/doc/fragments/:name/:param?', index.fragments); // load sub-blocks ? express/angualar..?

  

    app.get('/api/v1/docs',                         docs.list);

    // DOC
    // single doc record
    app.get ('/api/v1/doc/:slug',                   docs.doc_get);
    app.post('/api/v1/doc/:doc_id/edit',            auth.requiresLogin_or_secret,  docs.doc_edit);
    app.post('/api/v1/doc/:slug/delete',            auth.requiresLogin_or_secret, docs.doc_delete);
    

    // doc_options
    app.post('/api/v1/doc/:slug/edit_option', auth.requiresLogin, docs.doc_edit_option);
    app.post('/api/v1/doc/:slug/create_option', auth.requiresLogin, docs.doc_create_option);
    app.post('/api/v1/doc/:slug/delete_option', auth.requiresLogin, docs.doc_delete_option);
    
    // hard reset
    app.get ('/api/v1/doc/:slug/reset',    auth.requiresLogin,  docs.doc_reset);
    
    // markup offsetting method
    app.post('/api/v1/doc/:slug/sync',     auth.requiresLogin,  docs.doc_sync);


    app.get ('/api/v1/doc/:slug/markups/offset/:side/:start/:end/:qty', auth.requiresLogin, markups.markups_offset);
    app.post('/api/v1/doc/:slug/markup/:markup_id/offset', auth.requiresLogin,markups.markup_offset);
    app.post('/api/v1/doc/:slug/markup/:markup_id/edit',auth.requiresLogin_or_secret,  markups.markup_edit);
    app.post('/api/v1/doc/:slug/markup/push', auth.requiresLogin, markups.markup_create);
    app.post ('/api/v1/doc/:slug/markup/delete/:markup_id', auth.requiresLogin_or_secret, markups.markup_delete);
    // app.post('/api/v1/doc/:doc_id_or_title/markup/delete/' , docs.markup_delete);

    // create a doc
    app.post('/api/v1/doc/create',  auth.requiresLogin, docs.doc_create);

    // clone a doc
    app.get('/api/v1/doc/:slug/clone/:clone_slug',  auth.requiresLogin, docs.doc_clone);


     app.get('/sockets/list', index.sockets_list);
     app.get('/sockets/list/doc/:slug', index.sockets_list);

    //
    app.post('/api/v1/userlogin', passport.authenticate('local', {}), users.signin_login);

    
    // ROOM & ROOMS
    app.get('/api/v1/room/create/:slug?',  auth.requiresLogin, rooms.createroom);
    app.get('/api/v1/rooms/list', rooms.list);
    app.get('/api/v1/rooms/list/:filter?/:filter_value', rooms.list);

    app.get('/room/:slug', rooms.room_view);


    app.get('/api/v1/users', users.list);



};