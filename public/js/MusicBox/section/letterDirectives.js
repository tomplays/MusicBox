'use strict';

// custom musicBox directives

/*


"textListener" directive :

> handle the section's editable textarea

"lt" (letter) directive 

> the letter element.

*/

angular.module('musicBox.LetterDirectives', [])
.directive('lt',   function($rootScope) {
 // var use_markup = 'h1'


  var use_markup = 'span'




  function selection_ends(scope,e){
      // $rootScope.ui.selected_range.end = scope.lt.order+scope.$parent.section.start // 'end' is last event..
      

      console.log(e)
      $rootScope.ui.selected_range.end =  scope.lt.absolute_order+1
      $rootScope.ui.selected_range.start=  scope.lt.absolute_order
      // alert($rootScope.ui.selected_range.end)
      $rootScope.ui.selected_range.textrange = '';
      $rootScope.ui.selected_range.wait_ev = false  // now ready!



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

  var tsts = 0
  var logevent = {'directive':'lt', 'event':'none','count':tsts, 'waiting':null}
  function sets(scope){
    tsts++
   
    logevent.started = $rootScope.ui.selected_range.start
    logevent.ended = $rootScope.ui.selected_range.end


             $rootScope.ui.selected_range.working_section        =  scope.$parent.section.sectionin  


    console.log(logevent)

    // $rootScope.ui.selected_range.debug.push(logevent)
    $rootScope.$apply(function(){});
    console.log('waiting '+$rootScope.ui.selected_range.wait_ev)
    //if($rootScope.ui.selected_range.wait_ev == false){
     
    //}
    console.log('sets')

  }  // SCAN /

    function link(scope, elem, attrs) { 

     //  console.log(scope.lt)


          // $rootScope.ui.current_action = 'mousedown'
          //
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
/*
           scope.lt.isparentready = false


           var tc =   scope.lt.classes



          tc.push('lt')
          tc.push('ispr')
          console.log(tc)

          scope.lt.tc = tc

        //  scope.$apply()

*/
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

             logevent.event = 'click'
             sets(scope)
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
              sets(scope)
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
              $rootScope.ui.selected_range.wait_ev = false  // now waiting mouseup!
             logevent.event = 'mousedown'
 
              sets(scope)
          });

          elem.bind('change', function(e) { // selection ends
            alert('k')
          })

          elem.bind('mouseup', function(e) { // selection ends

            logevent.event = 'mouseup'


            var rstart =  $rootScope.ui.selected_range.start
            var rend =    $rootScope.ui.selected_range.end

              if(rstart  >  rend){
               alert('583')

              }
               
              if(!rend){
                if(scope.lt.absolute_order==0){
                     rend= 0
                    }
                    else{
                      rend= scope.lt.absolute_order
                    }
               }
               else{
                 rend = scope.lt.order

               }

               if(!rstart){

                  if(rstart==0){
                  }
                  else{
                      rstart= scope.lt.absolute_order
                  }
               }
               else{
                  rend = scope.lt.absolute_order

               }

              if(rstart >  rend){
                 var temp_s = rstart+1;
                 rstart  = rend
                 rend = temp_s
                 logevent.event = 'mouseup-reversed'
              }
              
              if(rend<0){
               rend=0
              }


             
              $rootScope.ui.selected_range.wait_ev    = false  // now waiting mouseup!
              $rootScope.ui.selected_range.start      = rstart 
              $rootScope.ui.selected_range.end        = rend



              sets(scope)
          });
          /*
           elem.bind('mouseover', function(e) {  // while selection is active
             //selection_running(scope) 
             sets()
          });
          */
         
    }

    return {
          template: '<span contenteditable_  class="lt" ng-class="lt.classes" inselection="{{lt.inselection}}" inrange="{{lt.inrange}}" ng-bind-html="lt.char"></span>',
          replace :false,
          restrict: 'A',
          link:link,
          scope: {
            lt : '='
          } 
    };
  })


.directive("contenteditable_ddd", function() {
  return {
    restrict: "A",
    link: function(scope, element, attrs, ngModel) {

      

      element.bind("blur keyup change", function() {
        console.log(element.html())
         //console.log(scope.lt.char)
               // element.html('I')
               // scope.lt.char ='('
               // scope.$apply();
      });
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


         elem.bind('keyup', function(event) {
            console.log(event)
            console.log('keyup mbeditable')
            //alert(event.target.selectionStart)
            //scope.$apply(function(){
            //  scope.$parent.section.end++
            //  scope.$parent.section.fulltext = event.target.textContent

                 
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