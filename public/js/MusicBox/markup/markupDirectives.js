angular.module('musicBox.markup.directive', [])

.directive("markupView", function() {

        function link(scope, elem, attr) {
           console.log('   ---[m] directiive')
        }
        return {
          restrict: "E",
          link:link,
          templateUrl: function() {
                return "js/MusicBox/markup/tpl/view.tpl.html";
          }
          
        };
})
.directive("markupEditor", function() {
        return {
          restrict: "E",
          controller:"MarkupEditorCtrl",
          templateUrl: function() {
                return "js/MusicBox/markup/tpl/editor.tpl.html";
          }
        };
})