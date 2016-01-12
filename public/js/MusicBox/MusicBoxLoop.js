'use strict';
/*

  "MusicBox algorithm" (sorting, distribution, letters system)
*/


 /**
 * Factory / services for MusicBox Render 
 * 
 * @class MusicBoxLoop
 * @param {Factory} MusicBoxLoop -  
 * @inject $rootScope, $http, $location,$sce, $routeParams, socket, renderfactory, $locale, $timeout, renderfactory
 */

var musicBox = angular.module('musicBox.MusicBoxLoop', ['musicBox.document_controller','ngLocale', 'ngResource', 'ngRoute','musicBox.services', 'musicBox.directives', 'ngSanitize', 'musicBox.DocumentRest', 'musicBox.MusicBoxLoop'])
.factory('MusicBoxLoop', function ($rootScope, $http, $location,$sce, $routeParams, socket, $locale, $timeout) {
 return function (inf) {
    var self = {
      
    }
     
    
      return self
  }
});