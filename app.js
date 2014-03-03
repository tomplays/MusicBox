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
    fs = require('fs');
  var program = require('commander');
    var request = require('request');


nconf.argv().env().file({file:'config.json'});
program
    .version(package.version)
    .parse(process.argv);

  
var app = express();
// views and misc
app.configure(function(){
  app.set('port',nconf.get('PORT') );
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade'); // http://jade-lang.com/
  app.set('view options', {
    layout: true
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.cookieParser(  nconf.get('COOKIESECRET') ) );
  app.use(express.session( nconf.get('SESSIONSECRET') ) );
  app.use(express.static(__dirname + '/public'));
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

