'use strict';



// require all controllers

var index   = require('../api/controllers/index');
var docs    = require('../api/controllers/documents');
var markups = require('../api/controllers/markups');
var users   = require('../api/controllers/users');
var rooms   = require('../api/controllers/rooms');

var mails  = require('../api/controllers/mails');

var plugins  = require('../api/controllers/plugins');
var api_prefix = '/api/v1/'
var api_v2_prefix = '/api/v2/'




module.exports = function(app, passport, auth) {
    
    
    // USER
    app.get('/login', users.login);
    app.get('/signup', users.signup );
    app.get('/signout', users.signout);
    app.get('/me/account', auth.requiresLogin, users.account);

    app.post(api_prefix+'user/register', users.create);
    app.post(api_prefix+'user/lostpass', users.lostpass);
    app.get (api_prefix+'me/account', auth.requiresLogin, users.account_api);
    app.post(api_prefix+'me/edit', auth.requiresLogin, users.edit);

     // users
    app.get(api_prefix+'users', auth.requiresAdmin, users.list);





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


  


    var fileupload = require('fileupload').createFileUpload('public/uploads').middleware;
    app.post(api_prefix+'media/upload', fileupload, function(req, res) {
       res.send(req.body.image)
     })

   
    app.get('/',                            docs.index_doc);
    // home Mb
    //   app.get('/', plugins.welcome);


    app.get('/doc/create',  auth.requiresLogin, docs.doc_create_view ); 


    // routes errors
    app.get('/doc',                         index.errors);
    app.get('/docs',                        index.errors);

    // views & partials
  	app.get('/doc/:slug',                   docs.index_doc);
    app.get('/doc/:authorname/:slug',        docs.index_doc);

    app.get('/doc_editor/:slug',            docs.index_doc);

    // lite mode
    app.get('/readonly/:slug',               docs.index_doc);


    //app.get('/partials/:name/:param?',      index.partial); // document, lists, etc..
    app.get('/partials/:sub?/:name/:param?', index.partial); // document, lists, etc..

    app.get('/fragments/:name/:param?',     index.fragments); // load sub-blocks 
    app.get('/doc/fragments/:name/:param?', index.fragments); // load sub-blocks ? express/angualar..?

  

    app.get(api_prefix+'docs',                 auth.requiresAdmin,                     docs.list);

    // DOC
    // single doc record
    app.get(api_prefix+'doc/:slug/:output?',           docs.doc_get);

    app.get(api_v2_prefix+'doc/:slug/:output?',        docs.doc_get_virtual);

    app.post(api_prefix+'doc/:doc_id/edit',            auth.requiresLogin_or_secret,  docs.doc_edit);
    app.post(api_prefix+'doc/:slug/delete',            auth.requiresLogin_or_secret, docs.doc_delete);
    

    // doc_options
    app.post(api_prefix+'doc/:slug/doc_option_edit', auth.requiresLogin_or_secret, docs.doc_option_edit);
    app.post(api_prefix+'doc/:slug/doc_option_new',auth.requiresLogin_or_secret, docs.doc_option_new);
    app.post(api_prefix+'doc/:slug/doc_option_delete', auth.requiresLogin_or_secret, docs.doc_option_delete);
    

    // hard reset
    app.get(api_prefix+'doc/:slug/reset',    auth.requiresLogin,  docs.doc_reset);
    
    // markup offsetting method
    app.post(api_prefix+'doc/:slug/sync',     auth.requiresLogin,  docs.doc_sync);


    app.post(api_prefix+'doc/:slug/markup/:markup_id/edit',auth.requiresLogin_or_secret,  markups.edit);
    app.post(api_prefix+'doc/:slug/markup/:markup_id/delete', auth.requiresLogin_or_secret, markups.delete);


    app.post(api_prefix+'doc/:slug/markup/:markup_id/:action', auth.requiresLogin_or_secret, markups.options_actions);


    app.post(api_prefix+'doc/:slug/markup/push', auth.requiresLogin, markups.create);
    // app.post(api_prefix+'doc/:doc_id_or_title/markup/delete/' , docs.delete);

    // create a doc
    app.post(api_prefix+'doc/create',  auth.requiresLogin, docs.doc_create);

    // clone a doc
    app.get(api_prefix+'doc/:slug/clone/:clone_slug',  auth.requiresLogin, docs.doc_clone);


     app.get('/sockets/list', index.sockets_list);
     app.get('/sockets/list/doc/:slug', index.sockets_list);

    //
    app.post(api_prefix+'user/userlogin', passport.authenticate('local', {}), users.signin_login);

    
    // ROOM & ROOMS
    app.get(api_prefix+'room/create/:slug?',  auth.requiresLogin, rooms.createroom);
    app.get(api_prefix+'rooms/list', rooms.list);
    app.get(api_prefix+'rooms/list/:filter?/:filter_value', rooms.list);

    app.get('/room/:slug', rooms.room_view);

   
     
  	// first boot
  	app.get('/init', docs.init);


    // newletter api
    app.get('/subscribe',                   mails.subscribe_view);
    app.post(api_prefix+'subscribe',           mails.subscribe_post);
    app.get(api_prefix+'subscribe_action',     mails.subscribe_action );
    app.get(api_prefix+'get_subscribers',    auth.requiresAdmin,   mails.get_subscribers);
    app.get(api_prefix+'send_mail',                    mails.send_mail_from_html);
    app.get(api_prefix+'send_mail_internal/:slug',     mails.send_mail_from_internal_document);
    app.get(api_prefix+'send_generate',                mails.generate_mail_to_html);


};