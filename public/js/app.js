'use strict';

// Declare app level module which depends on filters, and services
angular.module('musicBox',  ['ngResource', 'musicBox.filters', 'ngRoute', 'musicBox.services', 'musicBox.directives', 'ngSanitize']).
  config(['$routeProvider', '$locationProvider', '$sceProvider', function($routeProvider, $locationProvider, $sceProvider ) {
    $routeProvider.
 	   when('/', {
        templateUrl: 'partials/document',
        controller: DocumentCtrl
      }).

      when('/:docid', {
        templateUrl: 'partials/document',
        controller: DocumentCtrl
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
      when('#_=_', {
        redirectTo: '/!'
      }).
      
     //     

     
      otherwise({
        redirectTo: '/!'
      });
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
      // $sceProvider.enabled(false);
     //$sceDelegateProvider.resourceUrlWhitelist(['.*']);
    }
  ]);


// instead of empty file include, but files exist #v+
// if/not included switcher
//angular.module('musicBox.filters', [])
//angular.module('musicBox.directives', [])


