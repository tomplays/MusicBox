angular.module('musicBox.markup.directive', [])

.directive("markupView", function($rootScope) {

        function link(scope, elem, attr) {
           console.log('   ---[m] directiive')
        }
        return {
          restrict: "E",
          link:link,
             scope: true,
          templateUrl: function() {
                return "js/MusicBox/markup/tpl/view.tpl.html";
          }
          
        };
})
.directive("markupEditor", function($rootScope) {
        return {
          restrict: "E",
             scope: true,
          controller:"MarkupEditorCtrl",
          templateUrl: function() {
                return "js/MusicBox/markup/tpl/editor.tpl.html";
          }
        };
})