'use strict';

// Declare app level module which depends on filters, and services



angular.module('musicBox',  ['ui.bootstrap','musicBox.controller','musicBox.controllerz', 'ngLocale', 'ngResource', 'ngRoute','musicBox.services',  'musicBox.directives', 'ngSanitize', , 'musicBox.DocumentRest',  'musicBox.DocumentService','musicBox.MusicBoxLoop']).
  config(['$localeProvider','$routeProvider', '$locationProvider','$sceDelegateProvider', '$sceProvider', function($localeProvider,$routeProvider, $locationProvider, $sceDelegateProvider,$sceProvider ) {
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
         templateUrl: '/partials/login',
        controller: UserCtrl
      }).
       when('/signup', {
        templateUrl: '/partials/signup',
        controller: UserCtrl
      }).
      when('/doc/:docid', {
        templateUrl: '/../partials/document',
        controller: DocumentCtrl
      }).
      when('/readonly/:docid', {
        templateUrl: '/../partials/document_ro',
        controller: DocumentCtrlRo
      }).
       when('/sockets/list', {
        templateUrl: '/partials/sockets_list',
        controller: SocketsListCtrl
      }).
      
      when('/sockets/list/doc/:slug', {
        templateUrl: '/partials/sockets_list',
        controller: SocketsListCtrl
      }).

      when('/docs/:mode', {
        templateUrl: '/partials/documents_list',
        controller: DocumentsListCtrl
      }).
     
      when('/me/account', {
        templateUrl: '/partials/user_account',
        controller: UserProfileCtrl
      }).
       when('/room/:room_slug', {
        templateUrl: '/partials/sockets_list',
        controller: SocketsListCtrl
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
  // .config( ['$controllerProvider', function($controllerProvider) { $controllerProvider.allowGlobals(); }]);



// instead of empty file include, but files exist #v+
// if/not included switcher
