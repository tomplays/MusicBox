
/* 
main "service / angular factory"

handle POST/GET calls to api (rest) for document, doc_options, markups .. crud / backend methods
can be called from contollers (init on load, save / edits from UI )
can emit events, flash_messages and websockets.
can redirect window


 Contains "MusicBox algorithm" (sorting, distribution, letters system)
*/


 /**
 * Factory / services for document model
 * 
 * @class docfactory
 * @param {Factory} docfactory -  angular custom factory for document 
 * @inject $rootScope, $http, $location,$sce, $routeParams, socket, renderfactory, $locale, $timeout
 */

var temp_scope;
angular.module('musicBox.MarkupService', [])
.factory("MarkupService", function($rootScope, $http,$sce, $resource, MarkupRest, UserService, $timeout, $locale) {

  
  var MarkupService = function(markup) {
    this.api_method = MarkupRest;
    this.markup = markup;
    console.log(this.markup)
 
  };


  MarkupService.prototype.add = function () {

      //  var promise = this.api_method.add({Id:this.slug},{  }).$promise;
      return true

  }
  MarkupService.prototype.save= function () {
      return true
  
  }
  MarkupService.prototype.delete = function () {

      return true
  }


  
  return MarkupService;
})