'use strict';

// custom musicBox directives
// not very used.. only for video players in v1.
// some tests for a reafactoring commented

angular.module('musicBox.directives', [])


.directive('ngKeystrokeffff', function($rootScope){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs){
            elem.bind("keyup", function(){
              console.log('ft')
               // scope.$digest(); //we manually refresh all the watchers. I don't know why the watcher on {{log}} won't trigger if the event is fired on a "space" key :s but the push is done regardless
            });
        }
    };
})
.directive('fluid', 

  function($rootScope) {
     // http://www.openstreetmap.org/export/embed.html?bbox=-407.8125%2C-85.45805784937232%2C226.40625%2C85.56806584676865&amp;layer=hot
    // http://www.openstreetmap.org/export/embed.html?bbox=0.68115234375%2C43.78695837311561%2C20.06103515625%2C51.795027225829145&amp;layer=mapnik
// http://player.vimeo.com/video/107038653
//  https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/172455259&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true
    function link(scope, elem, attr) {
         
         // uh ?? 
         console.log(scope.position)
         
       
       
           // https://www.mail-archive.com/angular@googlegroups.com/msg03078.html
            var wrapper = angular.element(elem.parent());

            var o_w = wrapper.prop('offsetWidth');
            var o_h = o_w;

            elem.children(0)[0].style.width = o_w+'px';
            elem.children(0)[0].style.height= o_h+'px';
        
    }
    return {
          scope: {
            url   : '@',
            subtype   : '@', 
            position : '@'
          },
          link:link,
          template: '<iframe  webkitallowfullscreen mozallowfullscreen allowfullscreen scrolling="no" frameborder="no" src="{{url}}"></iframe><p>{{subtype}}</p>'
    };
})



