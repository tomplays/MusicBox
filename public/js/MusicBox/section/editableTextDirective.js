function ranges_test(as,ae,ms,me, type){
          var c = -1
          var f = 0

          // strict before

           
           // strict before
          if(as < ms && ae < ms){
                c = 1
                f++
          }

          //ends into
          if(as < ms && ae > ms && as < me){
                c = 2
                f++
          }


          // into 
          if(as > ms && as < me && ae > ms && ae < me){
                c = 3
                f++

          }

          // start into
           if(as > ms && as<me && ae > me){
                c = 4
                f++
          }

           // strict after
          if(ae>me){
                c = 5
                f++
          }

          // over
          if(as<ms && ae > me){
                c = 6
                f++
          }

         

          if(f>1){
             c = -10
          }
                    


          return c
   }



angular.module('musicBox.eDirectives', [])
.directive('textListener', function($rootScope) {



   
  function textarea_running(eventname, event, scope){
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

        if($rootScope.ui.selected_range.start > $rootScope.ui.selected_range.end){
          var temp_s = $rootScope.ui.selected_range.start;
           $rootScope.ui.selected_range.start  = $rootScope.ui.selected_range.end
            $rootScope.ui.selected_range.end = temp_s
        }




      }


      else if(eventname== 'saving'){
        var string  = '';

        _.each($rootScope.containers, function(container){
            string  += container.fulltext;
            console.log(container.fulltext)

        })
        $rootScope.doc.content = string
        //.replace("\n", "");;
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
                      offset.start = offset.start - qty
                      offset.end  = offset.end - qty

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
                  $rootScope.ui.selected_range.debug.push(logevent)            
                  $rootScope.$apply()

                 // console.log($rootScope.ui.selected_range)


      }
       

  else if(eventname == 'paste'){
    $rootScope.ui.selected_range.debug.push('eventname  '+Math.random())


          if(event.clipboardData && event.clipboardData.getData('text')){
           var pastedData = event.clipboardData.getData('text')
           var pastedDataLength =  pastedData.length


                 $rootScope.ui.selected_range.end   =   $rootScope.ui.selected_range.end+pastedDataLength - 1
                 $rootScope.ui.selected_range.start   =   $rootScope.ui.selected_range.start+pastedDataLength - 1

                 scope.section.end = scope.section.end + pastedDataLength - 1
                 //s  $rootScope.ui.selected_range.end = $rootScope.ui.selected_range.end+pastedDataLength-1

                  // $rootScope.ui.selected_range.start = $rootScope.ui.selected_range.start + pastedDataLength-2
                  // $rootScope.ui.selected_range.end = $rootScope.ui.selected_range.start + pastedDataLength-2



          }
          
         // alert('pasted')
       


        $rootScope.$apply()

        
         
        
      }

      else if(eventname == 'key'){
         

          if(event.keyCode == 224){
            // as paste
            
           // return;
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
          //f(markup.type !== 'container'){
                     

                var offset = {'start':0, 'end':0};
                var test_r = ranges_test(logevent.selectionStart, logevent.selectionEnd, markup.start, markup.end, 'markup')
                logevent.ranges_test.push(test_r)
                // only two cases : before or into (1 or 3)
             
               switch (test_r) {
                        case 1:
                                offset.end++
                                offset.start++
                                 markup.touched= true;
                                break;
                       
                        case 3:
                                offset.end++
                                 markup.touched= true;
                                break;
                      
                    } 

                markup.start  =   markup.start+offset.start
                markup.end    =   markup.end+offset.end

        })

        

        _.each($rootScope.containers, function(markup, i){
        
          var offset = {'start':0, 'end':0};
          
      var r_start = $rootScope.ui.selected_range.start //
      //-  scope.section.start
      //    var r_start = parseInt(event.target.selectionStart) + scope.section.start
        var r_end =   $rootScope.ui.selected_range.end 
        //- scope.section.start
        //   var r_end =  parseInt(event.target.selectionEnd) + scope.section.start - 2


           console.log(r_start +'-'+ r_end+'-'+ markup.start+'-'+markup.end)
          logevent.jj = r_start +'-'+ r_end+'-'+ markup.start+'-'+markup.end

          //alert(r_end+''+r_start)

          var test_r = ranges_test(r_start,r_end, markup.start, markup.end+1, 'section')
      

          logevent.ranges_test.push(test_r)
          switch (test_r) {
                      case 1:
                               offset.start++
                               offset.end++

                               scope.section.touched= true;
                                break;
                        case 3:
                               offset.end++
                               scope.section.touched= true;
                               logevent.affected.sections.push(markup.type)
                                break;
                         case 5:

                                // bug here
                                offset.start++
                                offset.end++
                                scope.section.touched= true;
                                logevent.affected.sections.push(markup.type)
                                break;
                        case -1:
                            alert('bug undef')
                             break;

          }
          markup.start    =   markup.start+offset.start
          markup.end      =   markup.end+offset.end
        

          /*
          if( ( event.target.selectionEnd-1 + scope.$parent.section.start-1)  <= markup.end  ){
          }
          if( $rootScope.ui.selected_range.end < markup.start ){
                    console.log('section outmark:#1')  
                    logevent.affected.sections.push('redo 5')
          }
          */

        }) 


        logevent.after_start = $rootScope.ui.selected_range.start
        logevent.after_end = $rootScope.ui.selected_range.end
        $rootScope.ui.selected_range.debug.push(logevent)
        $rootScope.$apply(function(){})
      }
   
  }

  function link(scope, elem, attrs, $rootScope) { 




       elem.bind("click", function(event){

//alert('click')
       })

      elem.bind("mousedown", function(event){
       
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
        textarea_running('paste', event, scope)
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
            textarea_running('saving', event, scope)
            scope.$parent.sync_queue()
           
            
          }
         

          else if(event.which == 224){
  
             textarea_running('key', event, scope)

          }
         



else if(event.which== 16 || event.which== 39 || event.which== 37  || event.which== 40 || event.which== 38){
             textarea_running('mv', event, scope)
             
              
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
            
    //      }

        
          
      });
 // scope.$apply();
            
            //  return
    }


    return {
      restrict: 'A',
      link:link
    }

})