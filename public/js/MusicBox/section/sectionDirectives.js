angular.module('musicBox.SectionDirectives', [])

.directive("mbSection", function($rootScope) {

		var link= function(){
					console.log(' [Section] directive')

		}
        return {
          restrict: "A",
          scope: true,
          link:link,
          templateUrl: function() {
                return "js/MusicBox/section/section.tpl.html";
          }
        };
})
.directive("mbDataset", function($rootScope) {

		var link= function(){
			console.log(' [dataset Section] directive')
		}
        return {
          restrict: "EA",
          scope: true,
          link:link,
          templateUrl: function() {
                return "js/MusicBox/section/tpl/dataset.tpl.html";
          }
        };
})


