'use strict';

 /**
* @constructor
*/
// this file contains 
// event register
// thx to btford seed  : https://github.com/btford/angular-socket-io-im/
angular.module('musicBox.socket', [])
.factory('socket', function($rootScope, $http, $location)  {
  //  app.locals.port=
  if(SOCKET_URL !==""){
     console.log('loading sockets')
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
     console.log('not loading sockets')
    var socket = '';
    return {
      on:  function () {},
      emit:  function () {}

    }
    
  };
});
