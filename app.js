/*

Main load file


Basic configuration for Express, Jade and socket.io server
Use package.json for npm 
Use config.json  for config


TODO
  move "socket_c" in a file

*/


var package = require('./package.json'),
     nconf = require('nconf'), 
    _ = require('underscore')._,
    express = require('express'),
    http = require('http'),
    path = require('path'),
    cors = require('cors'),
    fs = require('fs');

  var program = require('commander');
    var request = require('request');

var passport = require('passport')
, flash = require('connect-flash')
, LocalStrategy = require('passport-local').Strategy;

nconf.argv().env().file({file:'config.json'});
program
    .version(package.version)
    .parse(process.argv);

  
var app = express();
// views and misc

 


//
var users = new Array()
var r = request.get('http://localhost:3001/apis/profiles/list/'+nconf.get('API_SECRET'), function optionalCallback (err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  users  = JSON.parse(body)
  console.log(users)
  //app.set('users',users);
  return users;
  
})


function findById(id, fn) {
    console.log('useazeazr ok')
var idx = id - 1;
if (users[idx]) {
fn(null, users[idx]);
} else {
fn(new Error('User ' + id + ' does not exist'));
}
}
function findByUsername(username, fn) {
    console.log('user zezaeok')
for (var i = 0, len = users.length; i < len; i++) {
var user = users[i];
if (user.username === username) {
return fn(null, user);
}
}
return fn(null, null);
}

function findById___(id, fn) {





var re = request.get('http://localhost:3001/apis/profiles/auth/2/tom', function optionalCallback (err, httpResponse, body) {
  if (err) {
      console.log('user erer')
    //return console.error('upload failed:', err);
     return fn(null, null);
  }
  user  = JSON.parse(body)
   console.log('userrrrrr ok')
  //app.set('users',users);
  fn(null, user);
  //return user;
  
})
}
function findByUsername__(username, fn) {
  var re = request.get('http://localhost:3001/apis/profiles/auth/2/tom', function optionalCallback (err, httpResponse, body) {
  if (err) {
    //return console.error('upload failed:', err);
          console.log('user erer')

     return fn(null, null);
  }
  user  = JSON.parse(body)
  console.log('useeer ok')
  //app.set('users',users);
  fn(null, user);
  //return user;
  
})

}



// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
done(null, user.id);
});
passport.deserializeUser(function(id, done) {
findById(id, function (err, user) {
done(err, user);
});
});
// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object. In the real world, this would query a database;
// however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
function(username, password, done) {
// asynchronous verification, for effect...
process.nextTick(function () {
// Find the user by username. If there is no user with the given
// username, or the password is not correct, set the user to `false` to
// indicate failure and set a flash message. Otherwise, return the
// authenticated `user`.
findByUsername(username, function(err, user) {
if (err) { return done(err); }
if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
return done(null, user);
})
});
}
));



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}



var app = express();
// views and misc
app.configure(function(){
  app.set('port',nconf.get('PORT') );
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade'); // http://jade-lang.com/
  app.set('view options', {
    layout: true
  });
 // app.use(express.bodyParser());
 // app.use(express.methodOverride());
//  app.use(cors())
  //app.use(express.cookieParser(  nconf.get('COOKIESECRET') ) );
  //app.use(express.session( nconf.get('SESSIONSECRET') ) );
 


 //app.use(express.logger());
//app.use(flash());
// Initialize Passport! Also use passport.session() middleware, to support
// persistent login sessions (recommended).
//app.use(passport.initialize());
//app.use(passport.session());




  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: false , showStack: false }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});
// Routes
var routes = require('./routes')(app);







// Start server
var server =  http.createServer(app).listen(app.get('port'), function(){
    console.log("*/* Exress server listening on port " + app.get('port'));

    var io_internal = require('./routes/socket.js').init(server)




});


      /*
      Note :
      There are two sockets servers : Internal(1) listen and relay external(2)

      external socket is running a standalone server and remote address (or not)
      See : https://github.com/tomplays/MusicBoxSocketServer
      */
    //  if( nconf.get('USE_SOCKET_SERVER') === true ){
        
        // socket internal (1)
        //io_internal
        // socket "external" (2) server connection
        var io_c = require('socket.io-client'),
        socket_c = io_c.connect(nconf.get('SOCKET_SERVER_URL'), {
            port: nconf.get('SOCKET_SERVER_PORT')
        });
        socket_c.on('connect', function () { 
          console.log("~:~:~~: Socket connected to socket server @ " + nconf.get('SOCKET_SERVER_URL') + " port:" + nconf.get('SOCKET_SERVER_PORT'));
          // test external/internal
          socket_c.on('users_count', function (data) { 
                      console.log('> ~:~:~~ <');
                    // io_internal.says(data);
          });
        });

        socket_c.on('disconnect', function () {
          console.log('~:~:~~: socket disconneted')
        });

   //   }

