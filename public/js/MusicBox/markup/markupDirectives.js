angular.module('musicBox.MarkupDirectives', [])
.directive("markupEditor", function() {
        return {
          restrict: "E",
          templateUrl: function() {
                return "js/MusicBox/markup/tpl/editor.tpl.html";
          }
        };
})
.directive("markupView", function() {


        function link(scope, elem, attr) {
         
           console.log('mk directiive')
           console.log(scope)
            console.log('mk section')

                      console.log(scope.$parent)

        
        }
        return {
          restrict: "E",
          link:link,
         
          templateUrl: function() {
                return "js/MusicBox/markup/tpl/view.tpl.html";
          }
          
        };
})