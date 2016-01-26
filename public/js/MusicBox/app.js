'use strict';

// Declare app level modules


angular.module('musicBox',  [
  'ngLocale', 'ngResource', 'ngRoute', 'ngSanitize', 
  'ui.bootstrap',
  'musicBox.socket',
  'musicBox.render',
  'musicBox.ui',
  'musicBox.directives', 
  'musicBox.document',
  'musicBox.section',
  'musicBox.markup',
  'musicBox.user'
  ]).
  config(['$localeProvider','$routeProvider', '$locationProvider','$sceDelegateProvider', '$sceProvider', function($localeProvider,$routeProvider, $locationProvider, $sceDelegateProvider,$sceProvider ) {
    $routeProvider.
 	   when('/', {
        templateUrl: 'partials/document/single',
        controller: DocumentCtrl
      }).
      when('/readonly/:docid', {
        templateUrl: '/../partials/document/compiled',
        controller: DocumentCtrlCompiled
      }).
      when('/docs/:mode', {
        templateUrl: '/partials/document/list',
        controller: DocumentsListCtrl
      }).

       when('/login', {
         templateUrl: '/partials/user/login',
        controller: UserCtrl
      }).
       when('/signup', {
        templateUrl: '/partials/user/signup',
        controller: UserCtrl
      }).
      when('/me/account', {
        templateUrl: '/partials/user/account',
        controller: UserProfileCtrl
      }).
      when('/subscribe', {
        templateUrl: '/partials/mail/subscribe',
        controller:UserCtrl
      }).
      when('/api/v1/subscribe_action', {
        templateUrl: '/partials/mail/confirmation',
        controller: UserCtrl
      }).
      when('/sockets/list/doc/:slug', {
        templateUrl: '/partials/socket/list',
        controller: SocketsListCtrl
      }).
      
      when('/room/:room_slug', {
        templateUrl: '/partials/room/single',
        controller: SocketsListCtrl
      }).
      when('/:docmode/:docid', {
        // match doc, doc_editor
        templateUrl: '/../partials/document/single',
        controller: DocumentCtrl
      }).
      when('#_=_', {
        redirectTo: '/'
      }).
      otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
     // $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?soundcloud\.com/.+$')]);

      //console.log($localeProvider)
      $sceProvider.enabled(false);
   //  $sceDelegateProvider.resourceUrlWhitelist(['*']);
    }
  ])
.run(function($rootScope, $http, $route) {
   console.log('cross controllers service listening ..')
   // $rootScope.$on('summarizeEvent', function(event, args) {
       // $rootScope.$broadcast('summarize', args);
    // });
 
  $rootScope.$on('$routeChangeSuccess', function (e, cur, prev) {
    if(cur && prev && cur !== prev){
    //  console.log(prev.originalPath)
    //  console.log(cur.originalPath)
      // $rootScope.$emit('docEvent', {action: 'reload' });
      // if(prev.originalPath == '')
      // from '/docs/:mode' to '/doc/:docid'
      // console.log('route.change')
       
       console.log($route)
       if($rootScope.doc){
        $rootScope.doc       = null;
       }


     
       //if(!$rootScope.ui){
         // $rootScope.ui        = null;
      //}
  }
  });
});
  // .config( ['$controllerProvider', function($controllerProvider) { $controllerProvider.allowGlobals(); }]);



