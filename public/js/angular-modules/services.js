 /**
* @constructor
*/
// this file contains 
// event register
// thx to btford seed  : https://github.com/btford/angular-socket-io-im/
var musicBox =  angular.module('musicBox.services', []);

musicBox.run(function($rootScope) {
    console.log('cross controllers service listening ..')
    /*
      Receive emitted message and broadcast it.
    */
    // $rootScope.$on('summarizeEvent', function(event, args) {
       // $rootScope.$broadcast('summarize', args);
    // });
});
musicBox.run(function($rootScope, $http, $route) {
 
  $rootScope.$on('$routeChangeSuccess', function (e, cur, prev) {
    if(cur && prev && cur !== prev){
      console.log(prev.originalPath)
      console.log(cur.originalPath)
      // $rootScope.$emit('docEvent', {action: 'reload' });
      // if(prev.originalPath == '')
      // from '/docs/:mode' to '/doc/:docid'
      // console.log('route.change')
       
       console.log($route)
       $rootScope.doc       = '';
       $rootScope.ui        = '';
  }
  });

   $rootScope.$on('renderEvent', function(event, args) {
          $rootScope.$broadcast('render', args);
      });  

     $rootScope.$on('render', function(event, args) {
        console.log(args, event)

    }); 

    $rootScope.$on('docEvent', function(event, args) {
        $rootScope.$broadcast('doc', args);
    });
    $rootScope.$on('sectionEvent', function(event, args) {
        $rootScope.$broadcast('section', args);
    });
    $rootScope.$on('letterEvent', function(event, args) {
        $rootScope.$broadcast('letter', args);
    });
    $rootScope.$on('fragmentEvent', function(event, args) {
        $rootScope.$broadcast('fragment', args);
    });
    $rootScope.$on('keyEvent', function(event, args) {
        $rootScope.$broadcast('key', args);
    });
});




 // SOCKET part 
musicBox.factory('socket', function($rootScope, $http, $location)  {
  //  app.locals.port=
  if(SOCKET_URL !==""){
       var socket = io.connect(SOCKET_URL+':'+SOCKET_SERVER_PORT);
  
    return {
      start: function(){
       //console.log(socket)
      },
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
         $rootScope.$apply(function () {
            
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              //alert('on')
              callback.apply(socket, args);
            }
          });
        })
      }
    };

  }
  else {
    var socket = '';
    return {
      on:  function () {},
      emit:  function () {}

    }
    
  };
});
