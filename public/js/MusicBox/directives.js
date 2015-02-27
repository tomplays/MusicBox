'use strict';

// custom musicBox directives
// not very used.. only for video players in v1.
// some tests for a reafactoring commented

angular.module('musicBox.directives', [])


.directive('ngKeystroke', function($rootScope){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs){
            elem.bind("keyup", function(){
              console.log('ft')
                scope.$digest(); //we manually refresh all the watchers. I don't know why the watcher on {{log}} won't trigger if the event is fired on a "space" key :s but the push is done regardless
            });
        }
    };
})
.directive('keyListener', function($rootScope, DocumentService, MusicBoxLoop) {


    function active_section_tool(scope){

              var mb_service =  new MusicBoxLoop()
               //mb_service.remove_lt_classes(m)
              mb_service.set_container_attribute(scope.$parent.section,'editing_text', true, true)
              scope.$parent.section.modeletters = 'single';

        // = true;
    }


    function concerned_markups(scope, event){




    }



    return function(scope, elm, attrs) {



       elm.bind("mousedown", function(event) {
        active_section_tool(scope)
       // console.log(event)
      });
        elm.bind("mouseup", function(event) {
          
          active_section_tool(scope)
      
           $rootScope.ui.selected_range.end = event.target.selectionEnd+scope.section.start
           $rootScope.ui.selected_range.start = event.target.selectionStart+scope.section.start
      
        
            scope.$apply();




      });
        elm.bind("keyup", function(event) {
            


          active_section_tool(scope)
          $rootScope.ui.selected_range.insert_mode= 'atomic'
          $rootScope.ui.selected_range.insert =         event.target.selectionStart
          $rootScope.ui.selected_range.insert_scratch = event.target.selectionStart+scope.section.start;
          $rootScope.ui.selected_range.section_current_length = scope.section.end-scope.section.start+1;
          $rootScope.ui.selected_range.fulltext_value = event.target.value.replace("\n", "")
          $rootScope.ui.selected_range.fulltext_length = event.target.textLength


          //alert(dif_pos+'--'+dif_pos_scratch)
          //console.log(event.which)
          // dif_pos;
          //$= dif_pos_scratch


          if(event.which== 39 || event.which== 37  || event.which== 40 || event.which== 38){
              $rootScope.ui.selected_range.insert_direction= 'cursor';
              scope.$parent.section.cursor_at = event.target.selectionEnd;

               scope.$apply(attrs.keyListener);
             
          }
          if(event.which== 13){
             $rootScope.ui.selected_range.insert_direction= 'save';
               scope.$parent.section.cursor_at = event.target.selectionEnd;


          }
          
          if($rootScope.ui.selected_range.section_current_length < $rootScope.ui.selected_range.fulltext_length){
             // $rootScope.ui.selected_range.insert_direction= 'expanding';

          }
           
          if($rootScope.ui.selected_range.section_current_length > $rootScope.ui.selected_range.fulltext_length){
            // $rootScope.ui.selected_range.insert_direction= 'reducing';

          }
          if($rootScope.ui.selected_range.section_current_length == $rootScope.ui.selected_range.fulltext_length){
             //$rootScope.ui.selected_range.insert_direction= 'cursor or-';

          }


          scope.$apply(attrs.keyListener);
          return



        });
    };
})

.directive('lt',   function($rootScope, MusicBoxLoop) {
  

  function selection_ends(scope){
               //mb_service.remove_lt_classes(m)
       //        mb_service.set_container_attribute(scope.$parent.section,'editing_text', true, true)

      $rootScope.ui.selected_range.wait_ev = false  // now ready!
      
      $rootScope.ui.selected_range.end = scope.lt.order // 'end' is last event..
     // alert($rootScope.ui.selected_range.end)
      $rootScope.ui.selected_range.textrange = '';

      // reorder if/sup test here.
      if( $rootScope.ui.selected_range.start >  scope.lt.order){
        var temp_s = $rootScope.ui.selected_range.start;
        $rootScope.ui.selected_range.start  = scope.lt.order
        $rootScope.ui.selected_range.end = temp_s
      }

      for (var i =  $rootScope.ui.selected_range.start; i <= $rootScope.ui.selected_range.end; i++) {
         if(scope.$parent.section.letters[i]){
          

          scope.$parent.section.letters[i].classes.push('cursor_at')
          $rootScope.ui.selected_range.textrange +=scope.$parent.section.letters[i].char
          }
        }
        var obj = scope.$parent.section.objects
      
         _.each($rootScope.doc.markups, function(markup, i){
         if( 
      //  strict in.
      //  todo add other cases.
      (markup.start <= $rootScope.ui.selected_range.start  && markup.end >= $rootScope.ui.selected_range.end) 
      ){
        if(markup.type == 'container'){
               console.log('container parent match')
             //  markup.selected = true
        }
        else{
           markup.selected = true
              //selected_objects.push(markup)
              console.log('markup stric. in range type: '+markup.type +' from: '+ markup.start +' to: '+ markup.end)
        }
    
    }
    else{
      // INV ? ?? 
     markup.selected = false
    }


        });  

       

  }
  function selection_starts(scope){
      
    
      // as starting new selection, remove all classes.
      _.each(scope.$parent.section.letters, function(lt, w){
          lt.classes = _.without(lt.classes, 'cursor_at')
      });
     // scope.lt.classes.push('mup') // the "mousedowned" one
      $rootScope.ui.selected_range.wait_ev = true  // now waiting mouseup!
      $rootScope.ui.selected_range.start = scope.lt.order   //'start' is first event..
      $rootScope.ui.selected_range.end = scope.lt.order;    // as new selection end by default

  }
function selection_running(scope){
     if($rootScope.ui.selected_range.wait_ev == true){
       // scope.lt.classes.push('mup');
      }
   

}
  function sets(){
    $rootScope.$apply(function(){});
      
  }  // SCAN /

    function link(scope, elem, attrs) { 


//         console.log(scope.lt.classes_array)
        //   scope.lt.classes_ = new Array('h2') 
     //= scope.lt.classes
      // scope.lt.char =  '*';



          elem.bind('click', function() {

              if(scope.lt.href){

                  window.location=  scope.lt.href; 
              }
          });

          elem.bind('dblclick', function(scope) {
                // console.log(scope.lt)
                if($rootScope.ui.renderAvailable_active ==  'editor'){
                 // $rootScope.ui.renderAvailable_active =  'read'
                  //scope.section.modeletters = 'block';
                }
                else{
              //  $rootScope.ui.renderAvailable_active =  'editor'
                }
             
              sets()
          });

          elem.bind('mousedown', function(e) { // restarting a selection
              selection_starts(scope) 
              sets()
          });
          elem.bind('mouseup', function(e) { // selection ends
              selection_ends(scope) 
              sets()
          });
           elem.bind('mouseover', function(e) {  // while selection is active
             selection_running(scope) 
             sets()
          });
    }

    return {
      template: '{{lt.char}}',
     // template: '{{l.char}}',
 //   transclude :true,
 // replace :true,
      restrict: 'EA',
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
}).directive('fluid', 

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



