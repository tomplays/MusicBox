angular.module('musicBox.SectionDirectives', [])
.directive("mbSection", function() {
        return {
          restrict: "EA",
          templateUrl: function() {
                return "js/MusicBox/section/section.tpl.html";
          }
        };
})
;