function ranges_test(as,ae,ms,me, type){
          var c = -1
          var f = 0

          // strict before
          if(as < ms && ae <= ms){
                c = 1
                f++
          }

          //ends into
          if(as < ms && ae > ms && as < me){
                c = 2
                f++
          }

          // into + case cursor at origin
          if( (as >= ms && as < me && ae >= ms && ae < me) ){
                c = 3
                f++

          }

          // start into
           if(as > ms && as<=me && ae >= me){
                c = 4
                f++
          }

           // strict after
          if(ae>ms && ae>me){
                c = 5
                f++
          }

          // over
          if(as<ms && ae > me){
                c = 6
                f++
          }

          if(f>1){
            // c = -10
          }
                    


          return c
   }



angular.module('musicBox.eDirectives', [])
.directive('textListener', function($rootScope) {

   return {
      restrict: 'A',
      link:link
    }

  function textarea_running(eventname, event, scope){

      console.log(eventname, event)

      $rootScope.ui.current_action = eventname

      var logevent = {directive:'textListener', name:eventname, time:Math.random(), before_start:$rootScope.ui.selected_range.start,before_end:$rootScope.ui.selected_range.end}
      logevent.ranges_test = []
     


      if(eventname== 'mv'){
                logevent = {directive:'', name:eventname, time:'', before_start:$rootScope.ui.selected_range.start,before_end:$rootScope.ui.selected_range.end}
                
                $rootScope.ui.selected_range.end   =   parseInt(event.target.selectionEnd)    + scope.section.start
                $rootScope.ui.selected_range.start =   parseInt(event.target.selectionStart)  + scope.section.start
               
              
              if($rootScope.ui.selected_range.end == scope.section.end+1){
               
                $rootScope.ui.selected_range.end = scope.section.end
                $rootScope.ui.selected_range.start= scope.section.end

               }

/*
               if($rootScope.ui.selected_range.end == scope.section.end+1){
                $rootScope.ui.selected_range.end = scope.section.end+1
               }
               */
                $rootScope.ui.selected_range.debug.push(logevent)     
                

                //if()
                $rootScope.$apply()
          
      }

      else if(eventname == 'mousedown' || eventname == 'mouseup' ){
        
        $rootScope.ui.selected_range.start  = parseInt(event.target.selectionStart + scope.section.start)
        $rootScope.ui.selected_range.end    = parseInt(event.target.selectionEnd + scope.section.start -1)

        if($rootScope.ui.selected_range.end == -1){
            $rootScope.ui.selected_range.end=0
        }
        if($rootScope.ui.selected_range.start == -1){
            $rootScope.ui.selected_range.start=0
        }


              // #FIXVAL : if click after last letter
              if(parseInt(event.target.selectionStart + scope.section.start)  == parseInt(scope.section.end+1)){
                 
                  $rootScope.ui.selected_range.end = parseInt(scope.section.end)
                  $rootScope.ui.selected_range.start= parseInt(scope.section.end)

               }
               else{
               //   $rootScope.ui.selected_range.end    = parseInt(event.target.selectionStart + scope.section.start) 
                //  $rootScope.ui.selected_range.start  = parseInt(event.target.selectionStart + scope.section.start) 
               }



        if($rootScope.ui.selected_range.start > $rootScope.ui.selected_range.end){
          var temp_s = $rootScope.ui.selected_range.start;
           $rootScope.ui.selected_range.start  = $rootScope.ui.selected_range.end
            $rootScope.ui.selected_range.end = temp_s
        }



        console.log($rootScope.ui.selected_range)




      }

      else if(eventname== 'saving'){
        var string  = '';

        _.each($rootScope.containers, function(container){

          // remove line breaks
         //  container.fulltext =  container.fulltext.replace(/(\r\n|\n|\r)/gm,"");
          
            string  += container.fulltext;
            console.log(container.fulltext)

        })
        $rootScope.doc.content = string
        //
      }
      else if(eventname== 'delete'){
    
            /*
            console.log(event.target)
            console.log(event)
            console.log(event.target.selectionStart)
            console.log(event.target.selectionEnd)
            $rootScope.ui.selected_range.start  = scope.section.end + scope.section.start
            $rootScope.ui.selected_range.end    = scope.section.end + scope.section.start
            */

            var qty = 1;
            var offset = {'start':0, 'end':0};


            if($rootScope.ui.selected_range.multi){
              qty = $rootScope.ui.selected_range.size-1
            }

            logevent.sizedelte = qty

            _.each($rootScope.containers, function(s, i){

              console.log('section #'+i+' '+s.start +'-'+s.end)
              console.log('delete cursor @'+$rootScope.ui.selected_range.start+'-'+$rootScope.ui.selected_range.end)

              // 3 cases :
              //before
              //before A / before B
              //after

                var test_r = ranges_test( $rootScope.ui.selected_range.start, $rootScope.ui.selected_range.end, s.start, s.end, 'section')
                logevent.ranges_test.push(test_r)
                switch (test_r) {
                              case 3:
                                      offset.end = offset.end - qty
                                      break;
                              case 4:
                                      offset.end = offset.end - qty
                                      break;       
                          } 

              if(s.start <= $rootScope.ui.selected_range.start){
                 if(s.end < $rootScope.ui.selected_range.end-1){
                      console.log('case one A for section #'+i)
                      // nothing to do 
                 }
                 else{
                      console.log('case one B for section #'+i)
                          // means current section end.
                         
                }
              }
              if(s.start > $rootScope.ui.selected_range.end && s.end > $rootScope.ui.selected_range.end){
                  console.log('case two for section #'+i)

                  // means every sections after the current one
               //   offset.start = offset.start - qty
               //   offset.end  = offset.end - qty

              }
            
              //  if(!_.contains($rootScope.ui.offset_queue, s)){
              //     $rootScope.ui.offset_queue.push(s)
               //}


               s.start = s.start + offset.start
               s.end = s.end +  offset.end


            })
       
                 
                

              //scope.section.end--
             _.each($rootScope.markups, function(m, i){


                //onsole.log('before')
               // console.log(markup)
                  
                  // handle delete if markup range are in selection..
                   if($rootScope.ui.selected_range.multi){
                     // if(markup.start )
                     // qty = $rootScope.ui.selected_range.size
                   }



                    if(m.start > $rootScope.ui.selected_range.start && m.end<$rootScope.ui.selected_range.end){
                      //alert('into delete')
                      m.deleted=true
                    }

                     if(m.start >= $rootScope.ui.selected_range.start){
                      // reduc both
                      m.start--
                      m.end--
                    }

                console.log('after')
                console.log(m.start+'' +m.end)

              //  console.log(scope.section)

              });


              $rootScope.ui.selected_range.start= $rootScope.ui.selected_range.start - qty
              $rootScope.ui.selected_range.end = $rootScope.ui.selected_range.end - qty
               
              logevent.after_start = $rootScope.ui.selected_range.start
              logevent.after_end = $rootScope.ui.selected_range.end


              if( scope.section.end- scope.section.start == 0){
                alert('d')
                
              }

              $rootScope.ui.selected_range.debug.push(logevent)            
              $rootScope.$apply()

             // console.log($rootScope.ui.selected_range)


      }
       

 
   else if(eventname == 'click'){
              
              // #FIXVAL : if click after last letter
              if(parseInt(event.target.selectionStart + scope.section.start)  == parseInt(scope.section.end+1)){
                 
                  $rootScope.ui.selected_range.end = parseInt(scope.section.end)
                  $rootScope.ui.selected_range.start= parseInt(scope.section.end)

               }
               else{
                  $rootScope.ui.selected_range.end    = parseInt(event.target.selectionStart + scope.section.start) 
                  $rootScope.ui.selected_range.start  = parseInt(event.target.selectionStart + scope.section.start) 
               }


          $rootScope.$apply()






        // parseInt(event.target.selectionStart + scope.section.start)


   }

 


if(eventname == 'paste'){
      //$rootScope.ui.selected_range.debug.push('eventname  '+Math.random())
      


    
      // alert('pasted')


      // $rootScope.$apply()
  }

if(eventname == 'key'){
    var qty = 1;
    if(event.clipboardData && event.clipboardData.getData('text')){
          var pastedData = event.clipboardData.getData('text')
          var pastedDataLength =  pastedData.length
          
         // $rootScope.ui.selected_range.end   =   $rootScope.ui.selected_range.end+pastedDataLength - 1
         // $rootScope.ui.selected_range.start   =   $rootScope.ui.selected_range.start+pastedDataLength - 1
         // scope.section.end = scope.section.end + pastedDataLength - 1
          
          //s  $rootScope.ui.selected_range.end = $rootScope.ui.selected_range.end+pastedDataLength-1
          // $rootScope.ui.selected_range.start = $rootScope.ui.selected_range.start + pastedDataLength-2
          // $rootScope.ui.selected_range.end = $rootScope.ui.selected_range.start + pastedDataLength-2
         $rootScope.ui.selected_range.debug.push('pasted  '+pastedDataLength)
      
         qty = pastedDataLength;
      }

          logevent.pressd = event.keyCode
          logevent.affected = {}
          logevent.affected.markups = []
          logevent.affected.sections = []

          logevent.selectionStart =  $rootScope.ui.selected_range.start
          //event.target.selectionStart-1
          logevent.selectionEnd  =    $rootScope.ui.selected_range.end


          //event.target.selectionEnd-1
       
        _.each($rootScope.markups, function(markup, i){
    
              var offset = {'start':0, 'end':0};
              var test_r = ranges_test(logevent.selectionStart, logevent.selectionEnd, markup.start, markup.end, 'markup')
              logevent.ranges_test.push(test_r)
               
              // only two cases : before or into (1 or 3)
              switch (test_r) {
                case 1:
                        offset.end = offset.end+qty
                        offset.start= offset.start+qty

                        markup.touched= true;
                        break;
                case 3:
                 offset.end = offset.end+qty
                  markup.touched= true;
                  break;
              } 

              markup.start  =   markup.start+offset.start
              markup.end    =   markup.end+offset.end
        })

         logevent.jj = []

        _.each($rootScope.containers, function(section, i){
        
          var offset = {'start':0, 'end':0, 'r_start': $rootScope.ui.selected_range.start, 'r_end':  $rootScope.ui.selected_range.end };
         // logevent.jj.push('section#'+i+'   '+offset.r_start +'-'+ offset.r_end+'-'+section.start+'-'+parseInt(section.end+1))
          var test_range = ranges_test(offset.r_start,offset.r_end, section.start, parseInt(section.end+1), 'section')
          switch (test_range) {
              case 1:
                    offset.start= offset.start+qty
                                           offset.end = offset.end+qty

                    scope.section.touched = true;
                    break;
              case 3:
                                         offset.end = offset.end+qty

                    scope.section.touched = true;
                    logevent.affected.sections.push(section.type)
                    break;
               case 5:

                     logevent.ranges_test.push(test_range)
                    scope.section.touched = true;
                    logevent.affected.sections.push(section.type)
                    break;
              case -1:
                      logevent.ranges_test.push(test_range)
                    break;

          }
          section.start    =   section.start + offset.start
          section.end      =   section.end   + offset.end

        }) 

        $rootScope.ui.selected_range.start= $rootScope.ui.selected_range.start+qty
        $rootScope.ui.selected_range.end = $rootScope.ui.selected_range.end+qty

        logevent.after_start      = $rootScope.ui.selected_range.start
        logevent.after_end        = $rootScope.ui.selected_range.end

      //  $rootScope.ui.selected_range.debug.push(logevent)

        $rootScope.$apply(function(){})
      }
   
  }

  function link(scope, elem, attrs, $rootScope) { 

       /*elem.bind("click", function(event){
         textarea_running('click', event, scope)
           scope.$apply();
          return
       })
*/


      elem.bind("mousedown", function(event){
            event.MB = scope
            textarea_running('mousedown', event, scope)
            // scope.$parent.section.debuggr.push('md')
            scope.$apply();
            return
      })

      elem.bind("mouseup", function(event){
            //alert('mup')
            textarea_running('mouseup', event, scope)
            // scope.$parent.section.debuggr.push('up--'+ event.target.selectionStart+'-'+event.target.selectionEnd)
            scope.$apply();
            return
      })
      
      elem.bind("cut", function(event){
            // same as delete but with another "quantity"
            alert('no cut ')
            textarea_running('delete', event, scope)

      })

      elem.bind("paste", function(event){
        textarea_running('key', event, scope)
         console.log('onpaste ')
         console.log(event)
        // textarea_running('key', event, scope)
      })

      /* elem.bind("change", function(event){
           console.log('change ev')
            console.log(event)
      })
      */
      elem.bind("keyup", function(event){ 
      
          if(event.which == 13){
             //event.preventDefault();


             //alert(' e.preventDefault();')
            textarea_running('saving', event, scope)
            scope.$parent.sync_queue() 
          }
          else if(event.which == 224){
            // textarea_running('key', event, scope)
          }
          else if(event.which== 16 || event.which== 39 || event.which== 37  || event.which== 40 || event.which== 38){
             textarea_running('mv', event, scope)   
             scope.$apply();
          return

          }
           else if(event.which == 8){
              if(event.target.textLength !==scope.section.end-scope.section.start){
               // scope.section.end = event.target.textLength;
              }
            textarea_running('delete', event, scope)
            // scope.section.end = scope.section.end - 1;
            //scope.$parent.section.debuggr.push('delete'+event.target.selectionEnd)
      
          }
          else{
              textarea_running('key', event, scope)
          }
          scope.$apply();
          return

          //    scope.$apply();
          //   return
          //  scope.$parent.section.debuggr.push('hey'+event.which+'--'+ event.target.selectionStart+'-'+event.target.selectionEnd)
            
      });
      // scope.$apply();      
      //  return
    }
   
})