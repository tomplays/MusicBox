angular.module('musicBox.section', [
	'musicBox.section.controller',
	// 'musicBox.section.controller_b',
	'musicBox.section.editor_controller',
	'musicBox.section.directive.textarea',
	'musicBox.section.directive.section',
	'musicBox.section.directive.letters.letters_controller',
	'musicBox.section.directive.letters',
	'musicBox.section.directive.pusher'
])



.directive('mbLayouts', function($rootScope, $routeParams, $locale){
  var layoutCtrl = function($scope, $rootScope){


  }
  return {
    restrict: 'AE',
     controller: layoutCtrl,
    // link: function(scope, elem, attrs){},
   scope: true,
  // templateUrl: function() {
    //  return "js/MusicBox/document/tpl/ranges.tpl.html";
   // }
  };
})
