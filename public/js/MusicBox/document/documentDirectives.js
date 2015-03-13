angular.module('musicBox.Document.DocumentDirectives', [])
.directive("docTitle", function() {
        return {
          restrict: "E",
          templateUrl: function() {
                return "js/MusicBox/document/doctitle.tpl.html";
          }
        };
})
