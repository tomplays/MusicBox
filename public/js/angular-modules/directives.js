'use strict';

// custom musicBox directives
// not very used.. only for video players in v1.
// some tests for a reafactoring commented

angular.module('musicBox.directives', [])
/*
.directive('parent', function () {
  return {
    restrict : 'E',
    transclude : true,
    replace: true,
    template : '<div class="parent"><b>Parent</b><div ng-transclude class="container"></div></div>'
  }
})
.directive('child', function () {
  return {
    scope : {},
    replace: true,
    transclude: true,
    scope: {
      'value' : '='	
    },
    restrict : 'E',
    link : function (scope, element, attrs) {
      element.bind('click', function () {
     
        scope.$apply(function () {
	        scope.value = '123';
        })
      })
    },
    template : '<div class="child"><i>Child : {{value}}</i><div class="container" ng-transclude></div></div>'
  }
});
*/