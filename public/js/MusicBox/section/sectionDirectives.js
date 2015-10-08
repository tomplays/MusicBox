angular.module('musicBox.SectionDirectives', [])

.directive("mbSection", function($rootScope) {

		var link= function(scope){
					console.log(' [Section] directive')
          scope.section.index_ = scope.$index

		}
        return {
          restrict: "A",
         scope: true,
          link:link,
          
          templateUrl: function() {
                return "js/MusicBox/section/tpl/section.tpl.html";
          }
        };
})

.directive("mbSectioninlineeditor", function($rootScope) {

    var link = function(){
      console.log(' [Section] inline-editor directive')
    }
        return {
          restrict: "EA",
          scope: true,
          link:link,
          templateUrl: function() {
                return "js/MusicBox/section/tpl/inline-editor.tpl.html";
          }
        };
})

.directive("mbSectioneditor", function($rootScope) {

    var link = function(){
      console.log(' [Section] editor directive')
    }
        return {
          restrict: "EA",
          scope: true,
          link:link,
          templateUrl: function() {
                return "js/MusicBox/section/tpl/editor.tpl.html";
          }
        };
})
.directive("mbDataset", function($rootScope) {

		var link = function(){
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
.directive("mbCommentform", function($rootScope) {

    var link = function(){
      console.log(' [comment form] directive')
    }
        return {
          restrict: "EA",
          link:link,
          templateUrl: function() {
                return "js/MusicBox/section/tpl/comment_form.tpl.html";
          }
        };
})
.directive('fluidtexte',   
  function($rootScope) {
    // Toggle "letters mode" on click, mouvedown, ..
    
     function link(scope, elem, attrs) { 
        elem.bind('click', function(event) {
            // console.log(event)
            scope.$apply(function(){
            
            /// OFF ONE-CLICK AUTO TOGGLE
           scope.section.modeletters = 'single';
           
            //    var logevent = {'directive':'fluidtext', 'event':'mouseup'}
            //    $rootScope.ui.selected_range.debug.push(logevent)
           })
        })
    }
    return {
            scope: {
              section   : '=',     
            },
            template: '<span  ng-bind-html="section.fulltext_block"></span>',
            transclude :true,
            restrict: 'A',
            link: link,
        }
})


