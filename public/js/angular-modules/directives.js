'use strict';

// custom musicBox directives
// not very used.. only for video players in v1.
// some tests for a reafactoring commented

angular.module('musicBox.directives', [])


.directive('fluid', function ( $rootScope ) {
     // http://www.openstreetmap.org/export/embed.html?bbox=-407.8125%2C-85.45805784937232%2C226.40625%2C85.56806584676865&amp;layer=hot
    // http://www.openstreetmap.org/export/embed.html?bbox=0.68115234375%2C43.78695837311561%2C20.06103515625%2C51.795027225829145&amp;layer=mapnik
// http://player.vimeo.com/video/107038653
//  https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/172455259&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true
    function link(scope, elem, attr) {
         
         // uh ?? 
         console.log(scope.$parent.$parent.$parent.markup.position)
         
         if(scope.subtype == 'open-street-map'){

           elem.children(0)[0].style.width = '800px'
           elem.children(0)[0].style.height ='800px'

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
})

.directive('myText', 


  function($rootScope, $compile) {



      return ({
          scope: {
                   section   : '=',
                   selecting : '='
          },
          transclude :true,
          restrict: 'E',
          link: link
      });



      function draw(scope, elem, attrs){
        console.log('drawing...')
        var text_out = '';
        _.each($rootScope.letters[scope.section.sectionin], function(lt, w){


           
           var lt_classes = 'lt '
          
          /* _.each(lt.classes, function(ltc, x){
             lt_classes += ' '+ltc 
           });
*/
            if(lt.char === " " || lt.char === ""){
             lt.char = ' '
             //lt_classes += ' blank '
            }
            //text_out += '<lte ng-click="lc()" lettersi="'+lt.sectionin+'" letterorder="'+lt.order+'"  class="'+lt_classes+'"  chars="'+lt.char+'">'+lt.char+'</lte>';
        });       
        elem.html(text_out);
          // 
       //  console.log('..end')
        //console.log('compile?'+scope.compile_)
      }
      
     function link(scope, elem, attrs) {

        
           

            scope.$watch(attrs.selecting, function(value,old) {
                //console.log(attrs.selecting)
               // console.log(value, old)
               // console.log(old)
               if(old !== value && old && value) {
                console.log('draw by change selecting')
                draw(scope, elem, attrs);
              }
            });


            scope.compile_ = false;
            scope.compiled_once = false;

            // a way to load uncompiled letters, as we dont need their binding 
            elem.bind('click', function() {

                      if(scope.compiled_once == false){
                          // never compiled 
                       
                          scope.$apply(function(){
                            scope.compile_ = true;
                            scope.compiled_once == true;
                          });
                          $compile(elem.contents())(scope);
                      }
                      else{
                        // never triggered after... cause child directives bindings running
                         console.log('already c.')
                      }
            });


         draw(scope, elem, attrs);
  
      }

    

 })


.directive('lte', function($rootScope) {
  // parsing avoid scope...
    return {
     
      scope: {
          ltLetterorder: '=letterorder',
          ltLettersi: '=lettersi',
      },



     /*
          template: '<span class="{{classe}}">{{chars}}</span>',
     */
      //require: 'ngModel',
      restrict: 'EA',

      link: function(scope, elem, attrs) { //  ngModel

         scope.lc  = function(){
        console.log('le')
      }
      
            /*
          elem.bind('click', function(e) {
            console.log('click')
            //  alert('sd')
            //console.log(scope.customerLetter)
            //console.log(elem)
            //console.log(attrs)
            // alert(attrs.chars)
            // 
            // alert($rootScope.doc.title)
            // console.log($scope)
            //  var src = elem.find('img').attr('src');
            // call your SmoothZoom here
            //  angular.element(attrs.options).css({'background-image':'url('+ scope.item.src +')'});
            
          });
*/
       
          elem.bind('mouseup', function() {
                     console.log('mouseup')
                     // var parsed = JSON.parse(attrs.letterz)
                     //console.log(parsed.order)
                     scope.$parent.$parent.over(scope.ltLetterorder, 'up')
                      scope.$apply(function(){
                          scope.$parent.selecting = Math.random()+'ov';
                      });

          });
          
           elem.bind('mousedown', function() {
              console.log('mousedown')
              // console.log(scope.ltLetterorder)
              //alert(attrs.chars)
              scope.$parent.$parent.over( scope.ltLetterorder, 'down')
          });



      }
    };
  })


.directive('lt', function() {
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
