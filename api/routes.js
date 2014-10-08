'use strict';


var index = require('../api/controllers/index');
var docs = require('../api/controllers/documents');
var users = require('../api/controllers/users');
var rooms = require('../api/controllers/rooms');



module.exports = function(app, passport, auth) {
    app.get('/login', index.login );
    app.post('/register', users.create);

   app.get('/signup', index.signup );
  //  app.post('/login', users.signin);
  

 var fileupload = require('fileupload').createFileUpload('public/uploads').middleware;

    app.post('/api/v1/media/upload', fileupload, function(req, res) {
       res.send(req.body.image)
     })



	// USER

    app.get('/signout', users.signout);
  //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'],
        failureRedirect: '/'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/'
    }), users.authCallback);

   
    //Finish with setting up the username param
    //app.param('username', users.userByName);
    app.param('userId', users.userById);


     app.get('/me/account', auth.requiresLogin, users.account);
     app.get('/api/v1/me/account', auth.requiresLogin, users.account_api);


/*
    app.post('/login',   function(req, res, next) {
passport.authenticate('local', function(err, user, info) {
    console.log('user')
if (err) { return next(err) }
if (!user) {
return res.redirect('/login')
}
req.logIn(user, function(err) {
if (err) { return next(err); }
return res.redirect('/');
});
})(req,res, next);
});
*/
 //Setting the local strategy route
  

      
    //Home 


    /* with view */
    app.get('/',                            docs.index_doc);
    //app.get('/docs',                      docs.listRender);
    //app.get('/docs/:list?',               docs.listRender);
  	app.get('/doc/:slug',                   docs.index_doc);
    app.get('/partials/:name/:param?',      index.partial); // document, lists, etc..
   

    app.get('/fragments/:name/:param?',     index.fragments); // load sub-blocks 
    app.get('/doc/fragments/:name/:param?', index.fragments); // load sub-blocks ? express/angualar..?

  
    app.get('/doc/create',  auth.requiresLogin, docs.index_doc ); // load sub-blocks ? express/angualar..?

    app.get('/api/v1/docs', docs.list);

    // DOC
    // single doc record
    app.get('/api/v1/doc/:slug', docs.docByIdOrTitle);
    
    // create 
    app.post('/api/v1/doc/create',  auth.requiresLogin, docs.doc_create);

    // delete 




    // Main api feature : handle massive markups update
    // all mk in range
    app.get('/api/v1/doc/:slug/markups/offset/:side/:start/:end/:qty', auth.requiresLogin, docs.markups_offset);
    // single mk 
    app.post('/api/v1/doc/:slug/markup/:markup_id/offset', auth.requiresLogin, docs.markup_offset);


    app.post('/api/v1/doc/:slug/markup/:markup_id/edit',auth.requiresLogin_or_secret,  docs.markup_edit);
    app.post('/api/v1/doc/:doc_id/edit',auth.requiresLogin,  docs.doc_edit);
   

    // doc_options
    app.post('/api/v1/doc/:slug/edit_option', auth.requiresLogin, docs.doc_edit_option);
    app.post('/api/v1/doc/:slug/create_option', auth.requiresLogin, docs.doc_create_option);
    app.post('/api/v1/doc/:slug/delete_option', auth.requiresLogin, docs.doc_delete_option);



   app.post('/api/v1/doc/:slug/markups/push', auth.requiresLogin, docs.markup_create);



    app.get('/api/v1/doc/:slug/markups/delete/:markup_id', auth.requiresLogin, docs.markup_delete);
    // app.post('/api/v1/doc/:doc_id_or_title/markups/delete/' , docs.markup_delete);





    app.get('/sockets/list', index.sockets_list);


    app.post('/api/v1/userlogin', passport.authenticate('local', {}), users.signin_login);

    app.get('/api/v1/room/create/:slug?',  auth.requiresLogin, rooms.createroom);


};