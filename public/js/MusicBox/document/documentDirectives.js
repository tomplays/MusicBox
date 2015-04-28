angular.module('musicBox.DocumentDirectives', [])
.directive("docTitle", function() {
        return {
          restrict: "E",
          templateUrl: function() {
                return "js/MusicBox/document/doctitle.tpl.html";
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
          templateUrl: function() {
                return "js/MusicBox/document/document.tpl.html";
          }
        };
})
;