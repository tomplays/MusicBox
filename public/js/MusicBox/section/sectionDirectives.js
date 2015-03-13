angular.module('musicBox.SectionDirectives', [])
.directive("mbSection", function() {
        return {
          restrict: "E",
          templateUrl: function() {
                return "js/MusicBox/section/section.tpl.html";
          }
        };
})
;