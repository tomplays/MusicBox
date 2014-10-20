'use strict';

// custom musicBox directives
// not very used.. only for video players in v1.
// some tests for a reafactoring commented

angular.module('musicBox.directives', []).directive('fluid', 

  function($rootScope) {
     // http://www.openstreetmap.org/export/embed.html?bbox=-407.8125%2C-85.45805784937232%2C226.40625%2C85.56806584676865&amp;layer=hot
    // http://www.openstreetmap.org/export/embed.html?bbox=0.68115234375%2C43.78695837311561%2C20.06103515625%2C51.795027225829145&amp;layer=mapnik
// http://player.vimeo.com/video/107038653
//  https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/172455259&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true
    function link(scope, elem, attr) {
         
         // uh ?? 
         console.log(scope.$parent.$parent.$parent.markup.position)
         
         if(scope.subtype == 'open-street-map'){

           elem.children(0)[0].style.width = '800px';
           elem.children(0)[0].style.height ='800px';

         }
         else{
            elem.children(0)[0].style.width = '800px'
            elem.children(0)[0].style.height ='800px'
         }
    }
    return {
          scope: {
            url   : '@',
            subtype   : '@', 
          },
          link:link,
          template: '<iframe  webkitallowfullscreen mozallowfullscreen allowfullscreen scrolling="no" frameborder="no" src="{{url}}"></iframe><p>{{subtype}}</p>'
    };
}).directive('lt', function() {
    return {
  // template: '{{l.char}}',
   transclude :true,
   // replace :true,
      restrict: 'EA',
      link: function(scope, elem, attrs) { 
          elem.bind('click', function() {
            scope.$parent.$parent.over(scope, 'click')
            //console.log(scope)
          //  alert('sd') 
          });
          elem.bind('mousedown', function() {
             
              // console.log(scope.ltLetterorder)
              //alert(attrs.chars)
            scope.$parent.$parent.over( scope, 'down')
          });
          elem.bind('mouseup', function() {
              // console.log(scope.ltLetterorder)
              //alert(attrs.chars)
            scope.$parent.$parent.over( scope, 'up')
          });
      }
    };
  });
