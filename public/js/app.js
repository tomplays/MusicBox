'use strict';

// Declare app level module which depends on filters, and services
angular.module('musicBox',  ['ngLocale', 'ngResource', 'musicBox.filters', 'ngRoute', 'musicBox.services', 'musicBox.directives', 'ngSanitize']).
  config(['$localeProvider','$routeProvider', '$locationProvider', '$sceProvider', function($localeProvider,$routeProvider, $locationProvider, $sceProvider ) {
    $routeProvider.
 	   when('/', {
        templateUrl: 'partials/document',
        controller: DocumentCtrl
      }).
      when('/doc/create', {
         templateUrl: '/partials/document_new',
        controller: DocumentNewCtrl
      }).
       when('/login', {
         templateUrl: '/partials/document_new',
        controller: DocumentNewCtrl
      }).
       when('/signup', {
        templateUrl: '/partials/signup',
        controller: SignUpCtrl
      }).
      when('/doc/:docid', {
        templateUrl: '/../partials/document',
        controller: DocumentCtrl
      }).
       when('/sockets/list', {
        templateUrl: '/partials/sockets_list',
        controller: SocketsListCtrl
      }).
      when('/docs/:mode', {
        templateUrl: '/partials/documents_list',
        controller: DocumentsListCtrl
      }).
     
      when('/me/account', {
        templateUrl: '/partials/user_account',
        controller: UserCtrl
      }).
      when('_=_', {
        redirectTo: '/!'
      }).
      
     //     

     
      otherwise({
        redirectTo: '/!'
      });
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');


      //console.log($localeProvider)

     
     

      // $sceProvider.enabled(false);
     //$sceDelegateProvider.resourceUrlWhitelist(['.*']);
    }
  ]);


// instead of empty file include, but files exist #v+
// if/not included switcher
angular.module('musicBox.filters', [])
angular.module('musicBox.directives', [])


