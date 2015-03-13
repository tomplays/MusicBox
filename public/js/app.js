'use strict';

// Declare app level module which depends on filters, and services



angular.module('musicBox',  [
  'ui.bootstrap',
  'musicBox.controller','musicBox.section_controller',
   'ngLocale', 'ngResource', 'ngRoute','musicBox.services',
   'musicBox.directives', 'ngSanitize',  
   'musicBox.DocumentRest','musicBox.UserRest', 'musicBox.MarkupRest',
  'musicBox.UserService','musicBox.MusicBoxLoop', 
  'musicBox.DocumentService', 
  'musicBox.SectionDirectives','musicBox.Document.DocumentDirectives', 'musicBox.MarkupDirectives'
  ]).
  config(['$localeProvider','$routeProvider', '$locationProvider','$sceDelegateProvider', '$sceProvider', function($localeProvider,$routeProvider, $locationProvider, $sceDelegateProvider,$sceProvider ) {
    $routeProvider.
 	   when('/', {
        templateUrl: 'partials/document/single',
        controller: DocumentCtrl
      }).
      when('/doc/create', {
        templateUrl: '/partials/document/new',
        controller: DocumentNewCtrl
      }).
       when('/doc/:docid', {
        templateUrl: '/../partials/document/single',
        controller: DocumentCtrl
      }).
      when('/readonly/:docid', {
        templateUrl: '/../partials/document/document_ro',
        controller: DocumentCtrlRo
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
     
      when('/sockets/list/doc/:slug', {
        templateUrl: '/partials/socket/list',
        controller: SocketsListCtrl
      }).
      
      when('/room/:room_slug', {
        templateUrl: '/partials/room/single',
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
