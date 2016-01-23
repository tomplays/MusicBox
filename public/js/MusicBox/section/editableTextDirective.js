/*  
  MUSICBOX ANGULAR DIRECTIVE
  > bind events in editable textarea ( or section fulltext)
  
  > determine which section and markup to offset 
      (cae key or "delete" )
      > edit()

  if move or edit    
  > apply new selection range (arrow key, click, mouseup, mousedown)
      > move()
  key enter >    
  > apply save action 
      > save()


  for example 

  on "press key",(new char inserted by user) >
                  for each markups: 
                    > if markup has to be offseted 
                         > create an "operation" 
                         >> will be watched by markupController 
                  for each container: 
                    > if container has to be offseted (end+1 or start+1 and end+1)
                         > create an "operation" 
                         >> will be watched by sectionController 



  Directive broadcast changes to ui and with operations 

   1. $rootScope.ui.selected_range.{{}} start and end (watched in doc controllers)
   2. Or doc, section, markup OPERATION object (watched in respectives controllers)

  
  RETURN operation sample=

   var operation_ = {
                            'type': 'offset',
                            'subtype':eventname,
                            'end' : parseInt(o.end),
                            'end_qty': qty,
                            'start':parseInt(o.start),
                            'start_qty' : qty,   
                            'case_' : test_r,
                            'state':'new'     
  } 
  > send to sectionCtrl

*/
  




angular.module('musicBox.section.directive.textarea', [])
.directive('textListener', function($rootScope) {

    return {
      restrict: 'A',
      link:link
    }


    // BINDINGS 

    function link(scope, elem, attrs) { 


      elem.bind("mousedown", function(event){
          move('mousedown', event, scope)
          
          return
      })

      elem.bind("mouseup", function(event){           
            move('mouseup', event, scope)
            return
      })
     /* elem.bind("click", function(event){     
          console.log('click > no action, binded to mouseup')      
      })
      */

      elem.bind("keydown", function(event){ 
               // block "enter" key event
              if(event.which == 13){
                event.preventDefault();
              }
      })

      
      elem.bind("cut", function(event){
            // same as delete but with another "quantity"
            // not featured yet  !!!! 
            event.preventDefault();
          //edit('delete', event, scope)

      })

      elem.bind("paste", function(event){
         event.preventDefault();
         console.log('onpaste ')
         console.log(event)
      })

      /* elem.bind("change", function(event){
           console.log('change ev')
            console.log(event)
      })
      */
      elem.bind("keyup", function(event){ 


      
          if(event.which == 13){
            save(event, scope)
           
            
          }
          else if(event.which == 224){
            // move('key', event, scope)
          }
          else if(event.which== 16 || event.which== 39 || event.which== 37  || event.which== 40 || event.which== 38){
             move('mv', event, scope)   
          }
           else if(event.which == 8){
              if(event.target.textLength !==scope.section.end-scope.section.start){
               // scope.section.end = event.target.textLength;
              }
           edit('delete', event, scope)
            // scope.section.end = scope.section.end - 1;
            //scope.$parent.section.debuggr.push('delete'+event.target.selectionEnd)
      
          }
          else{
             edit('key', event, scope)
          }
          return
        
      });



    }


  //    MAIN FUNCTIONS



   function edit(eventname, event, scope){
        $rootScope.ui.current_action = eventname
        var grp_log = Math.random()*1000

        /// $rootScope.ui.selected_range.working_section        =  scope.$parent.section.sectionin  

        var objs = ['markups','containers']
        if(eventname == 'key'){
              
              var qty = 1;
              // handle paste
              if(event.clipboardData && event.clipboardData.getData('text')){
                var pastedData = event.clipboardData.getData('text')
                var pastedDataLength =  pastedData.length
                qty = pastedDataLength;
              }

             // could use event positions rather than ui memory... but values are differents...
             // alert(event.target.selectionStart+''+event.target.selectionEnd)
        }
         if(eventname== 'delete'){
          
              
                  var qty = -1;
                  // handle cut (Not)
                  if($rootScope.ui.selected_range.multi){
                    qty = -($rootScope.ui.selected_range.size-1)
                   // alert(qty)
                  }
        }



          // Important to memorize current section (mostly the "double-end issue")
          var boundaries =  boundaries_test(scope.section, $rootScope.ui.selected_range)
        //  console.log('boundaries')
        //  console.log(boundaries)


          // tests obj' (container/ markups)
          _.each(objs, function(obj, oi){

             _.each($rootScope.doc[obj], function(o, i){

                //  var endend  = ($rootScope.ui.selected_range.end == parseInt(o.end+1) && $rootScope.ui.selected_range.start == parseInt(o.end+1)  ) ? true : false;
                //  var startstart =  ($rootScope.ui.selected_range.start == o.start && $rootScope.ui.selected_range.end == o.start) ? true : false;
               
                var otype = 'markup'
                if(o.type && o.type == 'container'){
                  var otype = 'container'

                  }
                 

               //   alert(startstart)

                  var test_r = ranges_test($rootScope.ui.selected_range.start,$rootScope.ui.selected_range.end, o.start, o.end,otype,boundaries)
                 


                  // console.log(test_r)
                    var operation = { 'object_': obj, 'before':{'state':'init'}, 'grp_log':grp_log, 'reversable': true }
                    

                    switch (test_r) {
                      case 1:
                         var operation_ = {
                            'type': 'offset',
                            'subtype':eventname,
                            'end' : parseInt(o.end),
                            'end_qty': qty,
                            'start':parseInt(o.start),
                            'start_qty' : qty,   
                            'case_' : test_r,
                            'state':'new'     
                           } 
                      break;
                      case 5:
                       var operation_ = {
                          'type': 'offset',
                          'subtype':eventname,
                          'end' :o.end,
                          'end_qty' : qty,
                          'case_' : test_r,
                          'state':'new'     
                         } 
                        break;
                      case 3:
                       var operation_ = {
                          'type': 'offset',
                          'subtype':eventname,
                          'end' :o.end,
                          'end_qty' : qty,
                          'case_' : test_r,
                          'state':'new'     
                         } 
                        break;
                      default: 
                       var operation_ = {
                          'type': 'offset',
                          'subtype':eventname,
                          'case_' :test_r,
                          'state':'error'     
                         } 


                    } 
                    operation.before =  _.extend(operation.before,  operation_);


                    
                    // SET markup or section operation > toggle controller callback.
                    o.operation = operation;
             })
          })

      // key or delete = 
       console.log('-------------CASE EDIT ONLY')
      $rootScope.ui.selected_range.start = $rootScope.ui.selected_range.start+qty
      $rootScope.ui.selected_range.end   = $rootScope.ui.selected_range.end+qty
      $rootScope.ui.boundaries = boundaries_test(scope.section, $rootScope.ui.selected_range)
      $rootScope.$apply()
   }

   function save(event, scope){
      $rootScope.ui.current_action = 'save'
      event.preventDefault();
      $rootScope.doc.operation  = { 'object': 'document', 'before':{'state':'new', 'type':'save', 'subtype': 'save'}}
      $rootScope.$apply()
   }

    function move(eventname, event, scope){
    
     
      // else if(eventname == 'click'){}
      // else if(eventname== 'mv'){}   
      $rootScope.ui.selected_range.working_section        =  scope.$parent.section.sectionin  

      var rstart  =  parseInt(event.target.selectionStart + scope.section.start)
      var rend    =  parseInt(event.target.selectionEnd + scope.section.start)

      if(rstart > rend){
        var temp_s = rstart;
        rstart  = rend
        rend = temp_s
      }
      
      $rootScope.ui.current_action = eventname
      if(eventname == 'mousedown' ){
        $rootScope.ui.selected_range.wait_ev = true 
      }
      else { // if(eventname == 'mouseup')
        $rootScope.ui.selected_range.wait_ev = false 
      }

      // cursor "UP" > go to start
       if(event.which== 38){
        rstart = scope.section.start
        rend =scope.section.start

       }

if(eventname == 'mousedown' ){}
else{}



      $rootScope.ui.selected_range.start = rstart
      $rootScope.ui.selected_range.end   = rend
      $rootScope.ui.boundaries = boundaries_test(scope.section, $rootScope.ui.selected_range)


      console.log( $rootScope.ui.selected_range)
      $rootScope.$apply()
    }   
})

// UTILS 




function ranges_test(as,ae,ms,me,type, boundaries){
 //  console.log('ranges_test_section')
 //  console.log('range start:'+as+' range end:'+ae+' // '+type+' start:'+ms+' '+type+' end:'+me)
 //  console.log('range boundaries')
 //  console.log(boundaries)
   if(!boundaries){
       boundaries = {'section' : {'start': null, 'end': null} }
   }


        var c = -1
        var f = 0


          /*
            CASE 1 = > RANGES BEFORE MARKUP / OFFSET START AND END
            CASE 3 = > RANGE INTO MARKUP    / ONLY OFFSET END 

          */


          var section_is_current = false
          if(ms == boundaries.section.start && me == boundaries.section.end ){
             //   console.log('working in boudaries section')
                section_is_current = true;
          }

     
         
        if(type =='container'){
              if(section_is_current  == true){
                         c = 3
                         f++
                }
                else{
                       if(as>me){
                          // if(is after > in prev-prev section > do nothing
                       }
                       else{
                            // after all cases/
                            c =1
                            f = 1    
                       }
                }
        } 
        else{
              
 if(as <= ms && ae <= ms){
                c = 1
                f++
          }

          //ends into
          if(as < ms && ae > ms && as < me){
                c = 2
                f++
          }

          // into + case cursor at origin
          if( (as >= ms && as <= me && ae >= ms && ae <= me) ){
               


                if( section_is_current  == false &&  (ae) == ms){
               //    c = 1
                }
                else{
                   c = 3
                     f++
                }


              

          }

          // start into
           if(as > ms && as<=me && ae >= me){
            // console.log('4 : as,ae,ms,me')
             //   console.log(as,ae,ms,me)
                c = 4
                f++
          }

           // strict after
          if(ae>=ms && ae>=me){


              if( section_is_current  == true &&  (ae-1) == me){
                   c = 3
                   f++
                }  
          }
          // over
          if(as<ms && ae > me){
                c = 6
                f++
          }

        }
         
          if(f>1){
             c = -1100
          }
          if(f==0){
             c = -110
          }              
          console.log('RANGE RESULTS for '+type+'='+ c)
          return c
   }




function boundaries_test(s, r){

        s.start = parseInt(s.start)
        s.end   = parseInt(s.end)
        r.start = parseInt(r.start)
        r.end   = parseInt(r.end)

        var boundaries = {
          'section': {'start':s.start, end: s.end},
          'range': {'start':r.start, end: r.end, size: (r.end-r.start) },
          'startAtStart':false,
          'startAtEnd':false,
          'endAtStart':false,
          'endAtEnd':false
        }
        if(r.end == parseInt(s.end+1) ){
         boundaries.endAtEnd=true
        }
        if(r.start == s.start){
          boundaries.startAtStart = true
        }
        if(r.end == s.start){
         boundaries.endAtStart = true
        }
        if(r.start == s.end+1){
          boundaries.startAtEnd= true
        }

    return boundaries;
}




