'use strict';



// require all controllers

var index   = require('../api/controllers/index');
var docs    = require('../api/controllers/documents');
var markups = require('../api/controllers/markups');
var users   = require('../api/controllers/users');
var rooms   = require('../api/controllers/rooms');

var mails  = require('../api/controllers/mails');


module.exports = function(app, passport, auth) {
    

    app.get('/login', users.login );
    app.post('/register', users.create);
    app.get('/signup', users.signup );
	// USER
    app.get('/signout', users.signout);
    app.post('/api/v1/user/lostpass', users.lostpass);


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

    app.post('/api/v1/me/edit', auth.requiresLogin, users.edit);


    var fileupload = require('fileupload').createFileUpload('public/uploads').middleware;
    app.post('/api/v1/media/upload', fileupload, function(req, res) {
       res.send(req.body.image)
     })

   
    app.get('/',                            docs.index_doc);

    app.get('/doc/create',  auth.requiresLogin, docs.doc_create_view ); 
 // 'Third party editing'


    // routes errors
    app.get('/doc',                         index.errors);
    app.get('/docs',                        index.errors);

    // views & partials
  	app.get('/doc/:slug',                   docs.index_doc);
    app.get('/doc_editor/:slug',            docs.index_doc);

    // lite mode
    app.get('/readonly/:slug',               docs.index_doc);



    //app.get('/partials/:name/:param?',      index.partial); // document, lists, etc..
    app.get('/partials/:sub?/:name/:param?', index.partial); // document, lists, etc..

    app.get('/fragments/:name/:param?',     index.fragments); // load sub-blocks 
    app.get('/doc/fragments/:name/:param?', index.fragments); // load sub-blocks ? express/angualar..?

  

    app.get('/api/v1/docs',                         docs.list);

    // DOC
    // single doc record
    app.get ('/api/v1/doc/:slug',                   docs.doc_get);
    app.post('/api/v1/doc/:doc_id/edit',            auth.requiresLogin_or_secret,  docs.doc_edit);
    app.post('/api/v1/doc/:slug/delete',            auth.requiresLogin_or_secret, docs.doc_delete);
    

    // doc_options
    app.post('/api/v1/doc/:slug/doc_option_edit', auth.requiresLogin_or_secret, docs.doc_option_edit);
    app.post('/api/v1/doc/:slug/doc_option_new',auth.requiresLogin_or_secret, docs.doc_option_new);
    app.post('/api/v1/doc/:slug/doc_option_delete', auth.requiresLogin_or_secret, docs.doc_option_delete);
    
    // hard reset
    app.get ('/api/v1/doc/:slug/reset',    auth.requiresLogin,  docs.doc_reset);
    
    // markup offsetting method
    app.post('/api/v1/doc/:slug/sync',     auth.requiresLogin,  docs.doc_sync);


    app.post('/api/v1/doc/:slug/markup/:markup_id/edit',auth.requiresLogin_or_secret,  markups.edit);
    app.post ('/api/v1/doc/:slug/markup/:markup_id/delete', auth.requiresLogin_or_secret, markups.delete);


    app.post('/api/v1/doc/:slug/markup/push', auth.requiresLogin, markups.create);
    // app.post('/api/v1/doc/:doc_id_or_title/markup/delete/' , docs.delete);

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

    // user
    app.get('/api/v1/users', users.list);
     
  	// first boot
  	app.get('/init', docs.init );


    // newletter api
    app.get('/subscribe',                   mails.subscribe_view);
    app.post('/api/v1/subscribe',           mails.subscribe_post);
    app.get('/api/v1/subscribe_action',     mails.subscribe_action );
    app.get('/api/v1/get_subscribers',  auth.requiresLogin,   mails.get_subscribers);
    app.get('/api/v1/send_mail',                    mails.send_mail_from_html);
    app.get('/api/v1/send_mail_internal/:slug',     mails.send_mail_from_internal_document);
    app.get('/api/v1/send_generate',                mails.generate_mail_to_html);


   

};