'use strict';

// custom musicBox directives
// not very used.. only for video players in v1.
// some tests for a reafactoring commented

angular.module('musicBox.directives', [])

.directive('myText', 


  function($rootScope, $compile) {

      function draw(scope, elem, attrs){
        console.log('drawing...')
        var text_out = '';
        _.each($rootScope.letters[scope.section.sectionin], function(lt, w){


           
           var lt_classes = 'lt '
           _.each(lt.classes, function(ltc, x){
             lt_classes += ' '+ltc 
           });

            if(lt.char === " " || lt.char === ""){
             lt.char = ' '
             //lt_classes += ' blank '
            }
            text_out += '<lt ng-click="lc()" lettersi="'+lt.sectionin+'" letterorder="'+lt.order+'"  class="'+lt_classes+'"  chars="'+lt.char+'">'+lt.char+'</lt>';
        });       
        elem.html(text_out);
       $compile(elem.contents())(scope);

      }
      
     function link(scope, elem, attrs) {

        
            scope.lc = function(){
                console.log('lc')
            }

            scope.$watch(attrs.selecting, function(value,old) {
                //console.log(attrs.selecting)
               // console.log(value, old)
               // console.log(old)
               if(old !== value && old && value) {draw(scope, elem, attrs);}
            });


         draw(scope, elem, attrs);
  
      }
    

    return ({
      scope: {
       section : '=',
       selecting : '='
      },

    
      transclude :true,
      restrict: 'E',
      link: link
      //  compile: compile,
      // template: '<span>{{customerSection.start}}{{customerSection.starte}}</span>'

  })

 })


.directive('lt', function($rootScope) {
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
                     scope.$parent.$parent.over(scope.ltLetterorder, 'down')

                      scope.$apply(function(){
                          scope.$parent.selecting = Math.random()+'ov';
                      });

          });
          
           elem.bind('mousedown', function() {
              console.log('ousedown')
            // console.log(scope.ltLetterorder)
            //alert(attrs.chars)
           // scope.$parent.$parent.over( scope.ltLetterorder, 'down')
          });



      }
    };
  });
