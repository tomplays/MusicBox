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


    return function(scope, elm, attrs) {



       elm.bind("mousedown", function(event) {
        active_section_tool(scope)
       // console.log(event)
      });
        elm.bind("mouseup", function(event) {
          
          active_section_tool(scope)
      
           $rootScope.ui.selected_range.end = event.target.selectionEnd
           $rootScope.ui.selected_range.start = event.target.selectionStart
      
        
            scope.$apply();




      });
        elm.bind("keyup", function(event) {

          active_section_tool(scope)

          var dif_pos = event.target.selectionStart

          console.log(event.which)
          if(event.which== 39 || event.which== 37  || event.which== 40 || event.which== 38){
            console.log(event)
            $rootScope.ui.selected_range.insert = dif_pos;
            
            if(scope.$parent.section.letters[event.target.selectionStart-1]){
              scope.$parent.section.letters[event.target.selectionStart-1].classes.push('mup')
            }
            scope.$apply(attrs.keyListener);

            return
          }
          if(event.which == 13){
            var this_sync = new DocumentService()
            this_sync.SetSlug($rootScope.doc.slug)
            this_sync.docsync()

            
            console.log('section add ? ')
            return
          }

          

          $rootScope.ui.selected_range.insert= dif_pos;


_.each($rootScope.doc.markups, function(mk, i){


           


          
          // nothing to to if after range
          if( dif_pos >  mk.end) {
                if(mk.type== 'container'){
                  console.log('diff supe ')
                   mk.offset_end = mk.offset_end+1
                   mk.has_offset = true;
                   console.log('mk END:'+mk.offset_end)
                   var nl = new Object({'char':'*','classes':[]})
                   scope.$parent.section.letters.push(nl)
                 

                }
          
 



          }
          else if( dif_pos ==  mk.end) {
                console.log('diff same ')
          }


          // means "on" the left of range
          else{
            // means between the range
            if(  dif_pos >=  mk.start) {
              // offset end only
              mk.offset_end = mk.offset_end+1
              mk.has_offset = true;
                console.log('c1 ')
            }
            // means before both start and end..
            else{
              // offset both
              mk.offset_start = mk.offset_start+1
              mk.offset_end   = mk.offset_end+1
              mk.has_offset = true;
               console.log('c1 ')
            }
          }
          if(mk.has_offset){
          


           console.log(mk)
        

            //mk.editing = true;
            //mk.selected = true;
           // var inarry = _.find($rootScope.ui.selected_range.markups_to_offset, function(el){ return el.id == m.id; })
            
            // var match = _.find($rootScope.ui.selected_range.markups_to_offset, function(m){ return m._id  == mk._id; });
           
            $rootScope.ui.selected_range.markups_to_offset.push(mk)
            

          
          

           // mk.offset_start =0
           // mk.offset_end =0
          }
        });



 var current_length = scope.$parent.section.end-scope.$parent.section.start+1
           

            console.log(event.target.textLength-1)
            console.log(scope.$parent.section.end - scope.$parent.section.start)

            if(event.target.textLength !== current_length){
                var o_end = scope.$parent.section.start + (event.target.textLength - 1)
                //console.log(o_end)
                scope.$parent.section.offset_end = - (scope.$parent.section.end - o_end)
                console.log(scope.$parent.section.offset_end)
            }
          

           // console.log(event)
           // console.log(attrs.keyListener)

           // console.log('length section:'+ (scope.$parent.section.end-scope.$parent.section.start) )
            
           /*


                var objects_in_section = scope.$parent.section.objects
               // console.log($rootScope.available_sections_objects)
                //console.log($rootScope.available_layouts)
                _.each($rootScope.available_sections_objects, function(o_type, i){
                    _.each($rootScope.available_layouts, function(o_pos, i){
                        _.each(objects_in_section[o_type][o_pos.name], function(m, i){
                           //m.offset_start = m.offset_start+1;

                         if(m.type== 'container'){

                              // m.offset_end = m.start+event.target.textLength;
                              m.touched = true;

                          }

                        })
                     });
                 })
*/

             // console.log(event.target.value)

             // scope.$parent.section.fulltext = 'event.target.value'
            scope.$parent.section.fulltext = event.target.value;


            _.each(scope.$parent.section.letters, function(letter,y){
            //  letter.classes = new Array() // 'mup', 'h1'
                
                  letter.classes = new Array();
                  letter.char = scope.$parent.section.fulltext[y]
                
            })


/*
if( scope.$parent.section.letters[event.target.selectionStart-1]){
              scope.$parent.section.letters[event.target.selectionStart-1].classes.push('mup')
}
*/
           // scope.$parent.section.letters[event.target.selectionEnd].classes.push('h2')

 //console.log(event.target.value)
   ///                                 console.log('vs')
                var string  = '';
                _.each($rootScope.containers, function(container){
                    string  += container.fulltext;
                     console.log(container.fulltext)
                })



               $rootScope.doc.content = string;
      
              
              //scope.$parent.section.offset_start = 0
              //scope.$parent.section.offset_end   = 0



            //console.log($rootScope)
           

           console.log($rootScope.containers)


            var this_sync = new DocumentService()
            this_sync.SetSlug($rootScope.doc.slug)
             this_sync.docsync()

            scope.$apply(attrs.keyListener);
        });
    };
})

.directive('lt',   function($rootScope, MusicBoxLoop) {
  

  function selection_ends(scope){
               //mb_service.remove_lt_classes(m)
       //        mb_service.set_container_attribute(scope.$parent.section,'editing_text', true, true)

      $rootScope.ui.selected_range.wait_ev = false  // now ready!
      
      $rootScope.ui.selected_range.end = scope.lt.order // 'end' is last event..
      $rootScope.ui.selected_range.textrange = '';

      // reorder if/sup test here.
      if( $rootScope.ui.selected_range.start >  scope.lt.order){
        var temp_s = $rootScope.ui.selected_range.start;
        $rootScope.ui.selected_range.start  = scope.lt.order
        $rootScope.ui.selected_range.end = temp_s
      }

      for (var i =  $rootScope.ui.selected_range.start; i <= $rootScope.ui.selected_range.end; i++) {
         if(scope.$parent.section.letters[i]){
          scope.$parent.section.letters[i].classes.push('mup')
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
          lt.classes = _.without(lt.classes, 'mup')
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
           scope.lt.classes_ = new Array('h2') 
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



