/*.directive('keyListener', function($rootScope, DocumentService) {


    function active_section_tool(scope){

         //     var mb_service =  new MusicBoxLoop()
              //mb_service.remove_lt_classes(m)
           //   mb_service.set_container_attribute( scope.$parent.section, 'editing_text' , true, true)
             // scope.$parent.section.modeletters = 'single';
              // $rootScope.ui.current_action = 'mousedown ast'
            

        // = true;
    }


    function concerned_markups(scope, event, eventname){

        console.log('concerned_markups')
        console.log(scope.markups.length)

        var _start = event.target.selectionStart
        var _end   = event.target.selectionEnd


          _.each(scope.markups, function(markup, i){


                console.log(markup.type+markup.subtype)
               // 


                //console.log('starts: '+markup.start+' /'+event.target.selectionStart)
                //console.log('ends: '+markup.end+' /'+event.target.selectionEnd)
                if(markup.end < event.target.selectionEnd){
                    console.log('outmark:#1')
                    
                }
                else{
                    if(markup.start<event.target.selectionEnd && markup.end > event.target.selectionEnd){
                       console.log('outmark:#2')
                      markup.has_offset= true
                      markup.end++

                    }
                    else{
                       console.log('outmark:#3')
                       markup.has_offset= true

                    }


                }

         }); 


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
           scope.$parent.section.cursor_at_end = event.target.selectionEnd;
           scope.$parent.section.cursor_at_start = event.target.selectionStart;
        
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
                           
               concerned_markups(scope,event, 'moving')
               $rootScope.ui.current_action = 'moving ('+event.which+')'
               scope.$apply(attrs.keyListener);

         
          return
              
             
          }
          if(event.which== 13){

             $rootScope.ui.selected_range.insert_direction= 'save';
             scope.$parent.section.cursor_at = event.target.selectionEnd;
             $rootScope.ui.current_action = 'saving'

              scope.$apply(attrs.keyListener);

        
             


          }
          
          if($rootScope.ui.selected_range.section_current_length < $rootScope.ui.selected_range.fulltext_length){
             // $rootScope.ui.selected_range.insert_direction= 'expanding';
               $rootScope.ui.current_action = 'expanding'
              concerned_markups(scope,event, 'expanding')

              // scope.$parent.section.end = scope.$parent.section.end+1
               scope.$apply(attrs.keyListener);
               return
             

          }
           
          if($rootScope.ui.selected_range.section_current_length > $rootScope.ui.selected_range.fulltext_length){
                            // $rootScope.ui.selected_range.insert_direction= 'reducing';
                            console.log('reducing log')
                             console.log(event)
                           $rootScope.ui.current_action = 'TLo:'+event.originalTarget.textLength+'TLT:'+event.target.textLength+' //  reducing '+ $rootScope.ui.selected_range.section_current_length+ '>'+$rootScope.ui.selected_range.fulltext_length
                         

                        scope.$apply(attrs.keyListener);

         
          return
             
          }
          if($rootScope.ui.selected_range.section_current_length == $rootScope.ui.selected_range.fulltext_length){
             //$rootScope.ui.selected_range.insert_direction= 'cursor or-';
                                        $rootScope.ui.current_action = 'cursor or-'
                                        
 scope.$apply(attrs.keyListener);

         
          return
             

          }
       // scope.$apply(attrs.keyListener);

         
          return



        });
    };
})

.directive('fluidtexte',   
  function($rootScope) {



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

*/