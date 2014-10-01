'use strict';


var index = require('../api/controllers/index');
var docs = require('../api/controllers/documents');
var users = require('../api/controllers/users');
var rooms = require('../api/controllers/rooms');



module.exports = function(app, passport, auth) {


 var fileupload = require('fileupload').createFileUpload('public/uploads').middleware;

    app.post('/api/v1/media/upload', fileupload, function(req, res) {
       res.send(req.body.image)
     })


	// USER

    app.get('/signout', users.signout);
  //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'publish_stream'],
        failureRedirect: '/'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/'
    }), users.authCallback);

   
    //Finish with setting up the username param
    //app.param('username', users.userByName);
    app.param('userId', users.userById);


     app.get('/me/account', passport.authenticate('facebook', {
        failureRedirect: '/'
    }), users.account);


    //Home 
   


    /* with view */
    app.get('/',                            docs.index_doc);
    //app.get('/docs',                      docs.listRender);
    //app.get('/docs/:list?',               docs.listRender);
  	app.get('/doc/:slug',                   docs.index_doc);
    app.get('/partials/:name/:param?',      index.partial); // document, lists, etc..
   

    app.get('/fragments/:name/:param?',     index.fragments); // load sub-blocks 
    app.get('/doc/fragments/:name/:param?', index.fragments); // load sub-blocks ? express/angualar..?

   

    app.get('/api/v1/docs', docs.list);

    //a single doc record
    app.get('/api/v1/doc/:slug', docs.docByIdOrTitle);




    // Main api feature : handle massive markups update
    // all mk in range
    app.get('/api/v1/doc/:slug/markups/offset/:side/:start/:end/:qty', auth.requiresLogin, docs.markups_offset);
    // single mk 
    app.get('/api/v1/doc/:slug/markup/:markup_id/offset/:side/:start/:end/:qty', auth.requiresLogin, docs.markup_offset);


    app.post('/api/v1/doc/:slug/markup/:markup_id/edit',auth.requiresLogin,  docs.markup_edit);
    app.post('/api/v1/doc/:doc_id/edit',auth.requiresLogin,  docs.edit);
    app.post('/api/v1/doc/:slug/edit_options', auth.requiresLogin, docs.edit_options);
    app.post('/api/v1/doc/:slug/markups/push', auth.requiresLogin, docs.markup_create);


    app.get('/api/v1/doc/:slug/markups/delete/:markup_id', auth.requiresLogin, docs.markup_delete);
    // app.post('/api/v1/doc/:doc_id_or_title/markups/delete/' , docs.markup_delete);




    app.get('/api/v1/doc/create/:slug?',  auth.requiresLogin, docs.createdoc);
    app.get('/sockets/list', index.sockets_list);




    app.get('/api/v1/room/create/:title?',  auth.requiresLogin, rooms.createroom);


};