'use strict';

// custom musicBox directives

/*


"textListener" directive :

> handle the section's editable textarea

"lt" (letter) directive 

> the letter element.

*/

angular.module('musicBox.LetterDirectives', [])
.directive('lt',   function($rootScope, MusicBoxLoop) {
  
  function selection_ends(scope,e){
      // $rootScope.ui.selected_range.end = scope.lt.order+scope.$parent.section.start // 'end' is last event..
      

      console.log(e)
      $rootScope.ui.selected_range.end =  scope.lt.absolute_order+1
      
      $rootScope.ui.selected_range.start=  scope.lt.absolute_order


      // alert($rootScope.ui.selected_range.end)
      $rootScope.ui.selected_range.textrange = '';
/*

      // reorder if/sup test here.
      if( $rootScope.ui.selected_range.start >  scope.lt.absolute_order){
        var temp_s = $rootScope.ui.selected_range.start;
        $rootScope.ui.selected_range.start  = scope.lt.absolute_order
        $rootScope.ui.selected_range.end = temp_s
      }
      for (var i =  $rootScope.ui.selected_range.start; i <= $rootScope.ui.selected_range.end; i++) {
        var delta = i - scope.$parent.section.start
           if(scope.$parent.section.letters[delta]){
             // scope.$parent.section.letters[delta].classes.push('cursor_at')
              $rootScope.ui.selected_range.textrange +=scope.$parent.section.letters[delta].char
            }
        }

*/
      $rootScope.ui.selected_range.wait_ev = false  // now ready!


  }
  function selection_starts(scope){
    
       
      // as starting new selection, remove all classes.
      //_.each(scope.$parent.section.letters, function(lt, w){
         // lt.classes = _.without(lt.classes, 'cursor_at')
      // });
     // scope.lt.classes.push('mup') // the "mousedowned" one
     
      //scope.$parent.section.start + event.target.selectionEnd
      //scope.lt.order+scope.$parent.section.start   //'start' is first event..
     // $rootScope.ui.selected_range.end =   scope.lt.order+scope.$parent.section.start;    // as new selection end by default
  }

  /*
  function selection_running(scope){
       if(scope.$parent.ui.selected_range.wait_ev == true){
      //  scope.lt.classes.push('mup');
        }
  }
  */



  function sets(){
    var logevent = {'directive':'lt', 'event':'none'}

    // $rootScope.ui.selected_range.debug.push(logevent)
    $rootScope.$apply(function(){});
      console.log('waiting '+$rootScope.ui.selected_range.wait_ev)
      if($rootScope.ui.selected_range.wait_ev == false){
       //console.log($rootScope.ui.selected_range)

      }

console.log('sets')

  }  // SCAN /

    function link(scope, elem, attrs) { 


          // $rootScope.ui.current_action = 'mousedown'
          // console.log(scope.lt)
          // scope.lt.classes = new Array('h2') 
          // = scope.lt.classes
         /* scope.lt.char =   scope.$parent.section.start+' p:'+scope.lt.char +'- order:'+scope.lt.order+' abs;'+scope.lt.absolute_order

          if(scope.lt.absolute_order== scope.$parent.section.start){
            scope.lt.char +='FIRST' 
          }

           if(scope.lt.absolute_order-1 ==  scope.$parent.section.end){
            scope.lt.char +='LAST('+scope.lt.absolute_order+'/'+scope.$parent.section.end+')' 
          }
          */
         // scope.lt.char = ''+scope.lt.absolute_order;

          if(scope.lt.islast){
           
          }
          if(scope.lt.isfirst){
           
          }
        

          elem.bind('click', function(event) {
        
              if(scope.lt.href){
                  // window.location=  ; 
                  window.open(scope.lt.href,'_blank');
              }
              else{
                  if($rootScope.doc_owner == true){
                      $rootScope.ui.renderAvailable_active =  'editor'
                      scope.$parent.section.editing_text = true;
                      scope.$parent.section.editing = true;
                  }
                 
              }


             // scope.lt.char = '<clicker class="clickers">+</clicker>'
              $rootScope.ui.selected_range.wait_ev =false
             // alert('char: '+scope.lt.char+'scope.absolute_order:'+scope.lt.absolute_order+'  scope.order:'+scope.lt.order)


              sets()
          });

          elem.bind('dblclick', function(event) {

                // console.log(scope.lt)
                if($rootScope.ui.renderAvailable_active ==  'editor'){
                 // $rootScope.ui.renderAvailable_active =  'read'

                  //scope.section.modeletters = 'block';
                }
                else{
              //  $rootScope.ui.renderAvailable_active =  'editor'
                }
              

              // AUTO OFF
              /*
              $rootScope.ui.renderAvailable_active =  'editor'
            

              scope.$parent.section.editing_text = true;
              scope.$parent.section.editing = true;
             
              */
 $rootScope.ui.selected_range.wait_ev = false
              //alert('char: '+scope.lt.char+'scope.absolute_order:'+scope.lt.absolute_order+'  scope.order:'+scope.lt.order)
              sets()
          });
        

          elem.bind('mousedown', function(e) { // restarting a selection
              //selection_starts(scope)


 
              if(!$rootScope.ui.selected_range.end){
                if(scope.lt.order==0){
                      $rootScope.ui.selected_range.end= 0
                    }
                    else{
                      $rootScope.ui.selected_range.end= scope.lt.absolute_order
                    }
               }
               else{
                 $rootScope.ui.selected_range.end= scope.lt.absolute_order

               }
                if(!$rootScope.ui.selected_range.start){

                   if(scope.lt.order==0){
                      $rootScope.ui.selected_range.start = 0
                    }
                    else{
                      $rootScope.ui.selected_range.start= scope.lt.absolute_order
                    }
               }
               else{
                 $rootScope.ui.selected_range.start= scope.lt.absolute_order
               }


   
              if( $rootScope.ui.selected_range.start >  $rootScope.ui.selected_range.end){
                var temp_s = $rootScope.ui.selected_range.start+1;
                $rootScope.ui.selected_range.start  = $rootScope.ui.selected_range.end
                $rootScope.ui.selected_range.end = temp_s

              }
              


              console.log(e)
              $rootScope.ui.selected_range.wait_ev = true  // now waiting mouseup!
            //  $rootScope.ui.selected_range.end =    scope.lt.absolute_order
         
              sets()
          });

          elem.bind('change', function(e) { // selection ends
            alert('k')
          })

          elem.bind('mouseup', function(e) { // selection ends



             
              if( $rootScope.ui.selected_range.start >  $rootScope.ui.selected_range.end){
               alert('583')

              }
               
              if(!$rootScope.ui.selected_range.end){
                if(scope.lt.absolute_order==0){
                      $rootScope.ui.selected_range.end= 0
                    }
                    else{
                      $rootScope.ui.selected_range.end= scope.lt.absolute_order
                    }
               }
               else{
                 $rootScope.ui.selected_range.end = scope.lt.order

               }
                if(!$rootScope.ui.selected_range.start){

                   if($rootScope.ui.selected_range.start==0){
                    }
                    else{
                      $rootScope.ui.selected_range.start= scope.lt.absolute_order
                    }
               }
               else{
                  $rootScope.ui.selected_range.end = scope.lt.absolute_order

               }





              //selection_ends(scope,e) 
              if( $rootScope.ui.selected_range.start >  $rootScope.ui.selected_range.end){
                var temp_s = $rootScope.ui.selected_range.start+1;
                $rootScope.ui.selected_range.start  = $rootScope.ui.selected_range.end
                $rootScope.ui.selected_range.end = temp_s

              }
              


              if($rootScope.ui.selected_range.end<0){
                $rootScope.ui.selected_range.end=0
              }
               $rootScope.ui.selected_range.wait_ev = false  // now waiting mouseup!

              sets()
          });
         /*
           elem.bind('mouseover', function(e) {  // while selection is active
             //selection_running(scope) 
            
             sets()
          });
*/
         
    }

    return {
          template: '<span class="lt" ng-class="lt.classes" inselection="{{lt.inselection}}" inrange="{{lt.inrange}}" ng-bind-html="lt.char"></span>',
          replace :false,
          restrict: 'A',
          link:link,
          scope: {
            lt : '='
          } 
    };
  })





.directive('clicker',   
  function($rootScope) {
  
     function link(scope, elem, attrs) { 
        elem.bind('click', function(event) {
        alert('d')
        })

  


    }
    return {
           
            restrict: 'EA',
            link: link,
        }
})

.directive('mbEditable',   
  function($rootScope) {
  
     function link(scope, elem, attrs) { 
          elem.bind('click', function(event) {
          

          // TOGGLE AUTO ONE_CLICK
          //
          // scope.section.modeletters = 'single';
        })

      /* elem.bind(' DOMNodeInserted', function(event) {
          console.log( 'DOMNodeInserted')
                 console.log(event)

        })
      */

 elem.bind('change', function(event) {
console.log(event)
            console.log('change mbeditable')
 })
         elem.bind('keyup', function(event) {
           console.log(event)
            console.log('keyup mbeditable')
            //alert(event.target.selectionStart)
          //scope.$apply(function(){
           //  scope.$parent.section.end++
             //          scope.$parent.section.fulltext = event.target.textContent

                 
                //  return
       //     });
        })
    }
    return {
             scope: {
              section   : '=',     
            },
            restrict: 'C',
            link: link,
        }
})