angular.module('musicBox.DocumentDirectives', [])
.directive("docTitle", function() {
  return {
    restrict: "E",
    templateUrl: function() {
      return "js/MusicBox/document/tpl/doctitle.tpl.html";
    }
  };
})
.directive("mbDocument", function() {
		
    function link(scope, elem, attr) {
      console.log('mb doc linked directive') 
    }
    return {
      link:link,
      restrict: "EA",
      scope:true,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/document.tpl.html";
      }
    };
    
})
.directive("mbChapters", function($rootScope) {

    var link= function(){
      console.log(' [chapter Section] directive')
    }
    return {
      restrict: "EA",
      scope: true,
      link:link,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/chapters.tpl.html";
      }
    };
})
;