'use strict';

// custom musicBox directives

/*


"textListener" directive :

> handle the section's editable textarea

"lt" (letter) directive 

> the letter element.

*/


// not very used.. only for video players in v1.
// some tests for a reafactoring commented

angular.module('musicBox.LetterDirectives', [])
.directive('textListener', function($rootScope) {

  function textarea_running(eventname, event, scope){
      // console.log($rootScope)

      $rootScope.ui.current_action = eventname

      if(eventname == 'mousedown' || eventname == 'mouseup' ){
        $rootScope.ui.selected_range.start  = event.target.selectionStart
        $rootScope.ui.selected_range.end    =  event.target.selectionEnd
      }
      else if(eventname== 'saving'){
                var string  = '';
                _.each($rootScope.containers, function(container){
                    string  += container.fulltext;
                    console.log(container.fulltext)
                })
                $rootScope.doc.content = string;     
                textarea_running('yo', 'yo') 
      }
      else if(eventname== 'delete'){
        $rootScope.ui.selected_range.start = event.target.selectionStart
        $rootScope.ui.selected_range.end  =  event.target.selectionEnd
      }
       else if(eventname== 'mv'){
          $rootScope.ui.selected_range.start = event.target.selectionStart
          $rootScope.ui.selected_range.end   =  event.target.selectionStart 
       }
      else if(eventname== 'key'){
        $rootScope.ui.selected_range.start = event.target.selectionStart
        $rootScope.ui.selected_range.end  =  event.target.selectionStart
        _.each($rootScope.markups, function(markup, i){
          if(markup.type !== 'container'){
                     
                if(markup.end < event.target.selectionStart ){
                    console.log('outmark:#1')   
                }
                else{
                    if(markup.start <= event.target.selectionEnd){
                      console.log('outmark:#2')
                      markup.end++
                      if(!_.contains($rootScope.ui.offset_queue, markup)){
                          $rootScope.ui.offset_queue.push(markup)
                      }
                    }

                    if(markup.start > event.target.selectionEnd){
                      console.log('outmark:#3')
                      markup.end++
                      markup.start++
                      if(!_.contains($rootScope.ui.offset_queue, markup)){
                        $rootScope.ui.offset_queue.push(markup)
                      }

                    }
                }                       
          }
        })
        return;
      }
      //console.log(event)
      //console.log(event.target.textLength)
  }

  function link(scope, elem, attrs, $rootScope) { 

      elem.bind("mousedown", function(event){
            textarea_running('mousedown', event)
            // scope.$parent.section.debuggr.push('md')
            scope.$apply();
            return
      })

      elem.bind("mouseup", function(event){
            textarea_running('mouseup', event)
            // scope.$parent.section.debuggr.push('up--'+ event.target.selectionStart+'-'+event.target.selectionEnd)
            scope.$apply();
            return
      })
      elem.bind("keyup", function(event){
          console.log('ft')
          if(event.which== 13){
            textarea_running('saving', event)
            scope.$parent.sync_queue()
          }
          else if(event.which== 16 || event.which== 39 || event.which== 37  || event.which== 40 || event.which== 38){
             textarea_running('mv', event, scope)
          }
           else if(event.which== 8){

          // alert(event.target.textLength)
          //  alert(scope.section.end-scope.section.start)

            if(event.target.textLength !==scope.section.end-scope.section.start){
              scope.section.end = event.target.textLength;
            }


            textarea_running('delete', event)
         //   scope.$parent.section.end = scope.$parent.section.end - 1;
            scope.$parent.section.debuggr.push('delete'+event.target.selectionEnd)
        
          }

          else{
            scope.$parent.section.end++;
          
            textarea_running('key', event)
            //  scope.$parent.remap()
              //  scope.$parent.section.debuggr.push('hey'+event.which+'--'+ event.target.selectionStart+'-'+event.target.selectionEnd)
          
          }
         scope.$apply();
         return
          
      });
    }

    return {
      restrict: 'A',
      link:link
    }

})
.directive('lt',   function($rootScope, MusicBoxLoop) {
  
  function selection_ends(scope){
      $rootScope.ui.selected_range.wait_ev = false  // now ready!
      // $rootScope.ui.selected_range.end = scope.lt.order+scope.$parent.section.start // 'end' is last event..
      $rootScope.ui.selected_range.end =  scope.lt.absolute_order
      // alert($rootScope.ui.selected_range.end)
      $rootScope.ui.selected_range.textrange = '';
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

    $rootScope.$apply(function(){});
      
  }  // SCAN /

    function link(scope, elem, attrs) { 

          // $rootScope.ui.current_action = 'mousedown'
          // console.log(scope.lt)
          // scope.lt.classes = new Array('h2') 
          // = scope.lt.classes
          // scope.lt.char =  '*';

          elem.bind('click', function() {
              if(scope.lt.href){
                  // window.location=  ; 
                  window.open(scope.lt.href,'_blank');
              }
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
              $rootScope.ui.renderAvailable_active =  'editor'
              scope.$parent.section.editing_text = true;
              scope.$parent.section.editing = true;
              //alert('char: '+scope.lt.char+'scope.absolute_order:'+scope.lt.absolute_order+'  scope.order:'+scope.lt.order)
              sets()
          });

          elem.bind('mousedown', function(e) { // restarting a selection
              //selection_starts(scope)
              $rootScope.ui.selected_range.wait_ev = true  // now waiting mouseup!
              $rootScope.ui.selected_range.start =    scope.lt.absolute_order
              sets()
          });
          elem.bind('mouseup', function(e) { // selection ends
              selection_ends(scope) 
              sets()
          });
          /*
           elem.bind('mouseover', function(e) {  // while selection is active
             //selection_running(scope) 
             //  scope.lt.inrange=true
             sets()
          });
          */
    }

    return {
          template: '<span class="lt" ng-class="lt.classes" inrange="{{lt.inrange}}" ng-bind-html="lt.char"></span>',
          //   transclude :true,
          replace :true,
          restrict: 'A',
          link:link,
          scope: {
            lt : '='
          } 
    };
  })
.directive('fluidtexte',   
  function($rootScope, MusicBoxLoop) {

    // Toggle "letters mode" on click, mouvedown, ..
    function transforms(scope, ev){
        console.log('tranforms > modeletter mode by event :' +ev)
         scope.$apply(function(){
           // if($rootScope.doc_owner == true){

              //$rootScope.ui.selected_range.start = 0
              $rootScope.ui.selected_range.wait_ev = true;
              scope.section.modeletters = 'single';
              $rootScope.ui.selected_section_index =999
           // }
        });
    }
   
    function link(scope, elem, attrs, $rootScope) { 
    
      elem.bind('mouseup', function() {
          transforms(scope, 'mouseup', $rootScope)
      })

      elem.bind('mousedown', function() {
          console.log(scope)
          transforms(scope, 'mousedown', $rootScope)
      })

      elem.bind('click', function() {
        transforms(scope, 'click', $rootScope)
      })

      elem.bind('dblclick', function() {
        // never happen
      })
    }
    return {
            scope: {
              section   : '=',     
            },
            transclude :true,
            restrict: 'EA',
            link: link,
        }
})