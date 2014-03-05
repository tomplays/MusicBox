'use strict';

// custom musicBox directives
// not very used.. only for video players in v1.
// some tests for a reafactoring commented

angular.module('musicBox.directives', [])
.directive('fluidvids', function () {
    return {
        restrict: 'EA',
        replace: false,
        transclude: false,
        scope: {
           position: '@position',
             video: '@',
             autoplay :'@autoplay',
             kind :'@kind',
             sectionindex: '@sectionindex'
         },
         template: '<iframe src=""></iframe>',

        link: function (scope, element, attrs) {
          console.log(attrs.sectionindex)
          console.log(attrs.position);
          // prepare auto options.
          var hashes = attrs.video.split('&amp;');
          _.each(hashes, function(hash, index){
            // console.log(hash.split('='));
          });
          var autoheight = ( element.width()  * .6);
          //console.log(autoheight)
          element.children(0)[0].style.width = element.width() +'px';
                element.children(0)[0].style.height = autoheight+'px'
          //
          if(attrs.kind== 'soundcloud'){
            // change to min height
                  // element.children(0)[0].style.height = '450px';
          }
          if(attrs.autoplay == '1')
          {
            element.children(0)[0].src = attrs.video+';autoplay=1';
          }
          else{
            element.children(0)[0].src = attrs.video;
          }
          //console.log(element..width)
          //
          //var cwidth = window.innerWidth;
          //var hwidth = cwidth*(.6);
          console.log(cwidth)
          console.log(element.children(0))
          // var ratio = (attrs.height / attrs.width) * 100;
          // element[0].style.position = 'absolute';
          //element[0].style.zIndex = 9999;
          element[0].className = element[0].className + " playing";
          console.log( attrs.autoplay)
        }
    };
});
/*
V2 will use more directives...
I will create a sandbox file to test better implementation 
dsection
*/
/*
.directive('dsection', function ($rootScope) {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
          //  video: "@video"
         },
        // template: '<h1>hello #</h1>',
        link: function (scope, element, attrs) {
          //   console.log(scope.$root.words[0])
            // console.log(attrs.sectionindex)
           // console.log(attrs.position);
           // console.log($rootScope.words);
           // console.log($rootScope.sorted_sections);
            //element.html = 'yo' 
        }
    };
})
.directive('tsection', function ($rootScope) {
    return {
        restrict: 'AE',
        replace: false,
        transclude: true,
        scope: {
           end : '@sectionEnd',
           index : '@sectionIndex',
           classes : '&'
         },
         template: '<section ng-transclude class="{{classes}}" ></section>',
          link: function (scope, element, attrs) {
           //  attrs.classes = 'black_bg'
            // attrs.sectionClasses = 'black_bg'

            //   element.classes = 'black_bg'
          // if(attrs.sectionIndex == 1){
             //   console.log($rootScope)
                // scope.class = $rootScope.objects_sections[1].classes
           // }
         //   console.log(attrs);
        }
    };
})
.directive('lts', function ($rootScope) {
    return {
        restrict: 'AE',
        replace: false,
        transclude: true,
        scope: {
           end : '@sectionEnd',
           index : '@sectionIndex',
           classes : '&'
         },
         template: '<section ng-transclude class="{{classes}}" ></section>',
          link: function (scope, element, attrs) {
            // attrs.classes = 'black_bg'
            // attrs.sectionClasses = 'black_bg'
            // element.classes = 'black_bg'
            // if(attrs.sectionIndex == 1){
            //   console.log($rootScope)
            // scope.class = $rootScope.objects_sections[1].classes
           }
           //console.log(attrs);
        }
    };
})
*/
