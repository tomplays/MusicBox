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
      elem.bind("click", function(event){
          move('mouseup', event, scope)
          
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
       
        var grp_log = Math.random()*1000

        var objs_touched = 0
        var objs = ['sections', 'markups']
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
         
          // memorize 
          var ss =  parseInt(scope.section.start)
          var se =  parseInt(scope.section.end)

          // short vars
          var rs = parseInt($rootScope.ui.selected_range.start)
          var re = parseInt($rootScope.ui.selected_range.end)

          // tests obj' (container/ markups)
          _.each(objs, function(obj, oi){
              var obj_name = objs[oi]

             _.each($rootScope.doc[obj], function(o, i){
                var rc = ranges_compare(obj_name, rs , re , o.start , o.end , ss , se )
                if(rc.touched._end){
                  o.end =  o.end+qty
                }
                if(rc.touched._start){
                  o.start = o.start+qty
                }

                      /*
                       if(otouched == true){
                          //     console.log('AFTER '+ obj_name+' --obj loop count = '+i+' ---OPERATION for '+otype+ ' -- '+o.subtype+' >>start: '+o.start)

                        }
                        else{
                          //  console.log('NO CHANGE FOR OBJECT')
                        }


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
                             //     console.log('-----OPERATION')
                             //     console.log(operation)

                           // o.operation = operation;



                           */
             })
          })
  

      // key or delete = 
      $rootScope.ui.current_action = eventname      
     // console.log('TEXTAREA MOVE AND EDIT! > count:'+objs_touched)
      $rootScope.ui.selected_range.redraw_content    = true;



     // $rootScope.ui.selected_range.start = $rootScope.ui.selected_range.start+qty
     // $rootScope.ui.selected_range.end   = $rootScope.ui.selected_range.end+qty
    //  $rootScope.ui.boundaries = boundaries_test(scope.section, $rootScope.ui.selected_range)

    

      $rootScope.$apply()
   }

   function save(event, scope){
      $rootScope.ui.current_action = 'save'
      event.preventDefault();
      $rootScope.doc.operation  = { 'object': 'document', 'before':{'state':'new', 'type':'save', 'subtype': 'save'}}
      $rootScope.$apply()
   }

    function move(eventname, event, scope){
       console.log('TEXTAREA MOVE ! ')



       if(event.which== 39){

       }

      // else if(eventname == 'click'){}
      // else if(eventname== 'mv'){}   

      var rstart  =  parseInt(event.target.selectionStart+scope.section.start)
      var rend    =  parseInt(event.target.selectionEnd+scope.section.start)

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
        rstart  = scope.section.start
        rend    = scope.section.start

       }

      if(eventname == 'mousedown' ){}
      else{}


      $rootScope.ui.selected_range.start = rstart
      $rootScope.ui.selected_range.end   = rend
      $rootScope.ui.selected_range.floppy  = is_floppy_($rootScope.ui.selected_range.start, $rootScope.ui.selected_range.end, scope.section.start, scope.section.end)
  //    $rootScope.ui.selected_range.floppy = (scope.section.end+1  == rend) ? true : false
//

     
//      $rootScope.ui.boundaries = boundaries_test(scope.section, $rootScope.ui.selected_range)


      console.log($rootScope.ui.selected_range)
      $rootScope.$apply()
    }   
})

// UTILS 



 function is_floppy_(rs, re, ss, se){
           var  floppy = {'_floppy': false, 'floppy_':false}

            if(re == parseInt(se+1)  ){
                 floppy.floppy_ = true;
            }
            if( (re == parseInt(ss))  ){
                  // at start of a section (really)
                   floppy._floppy = true;
            }
            console.log(floppy)
            return floppy;

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


function ranges_compare(type, rs , re , os , oe , ss , se ){

               
      var otouched = false
      var otested = false    
      var otype = (type == 'sections') ? 'section' : 'markup'
                

                var test_r = -1; 


                var otest = {
                         'case'     : -1, 
                         'floppy_'   : false,
                         '_floppy'   : false,
                         'is_into'  : false,
                         'is_before': false,
                         'is_after' : false,
                         'otype'    : otype,
                         'touched': {}
                }

              
   

            var f = 0
            

            // the "both" cases 
 
                        /*-
            s          e
            |          |
            -----------------------
           |           |    into_  |
           |    into   |  floppy_  | before 
            -----------------------
                       |                            |
                       s                            e
                       -----------------------------------------
                       |   _into  |                 |           | 
              after    |  _floppy |                 |  floppy   | 
                       -----------------------------------------
                                                    |                        |
                                                    s                        e
                                                    -----------------------------
                                                    |          |                 |
                                                    |  _floppy |                 |
                                                     ----------------------------
          
          


          ------------------------------------------------------------------------
         
                                          |        | 
                                          |        | 

      6 !floppy_/4      >>|---------------|>>      |   
      10                >>|---------------|==      |    
      10b               >>|---------------|-----|==|    
      11 'overflow'     >>|---------------|--------|---------------|>>

      4 floppy_/6                         |>>|--|>>|  
      2                                   |>>|--|<=|  
      3 _floppy/5                         |==|--|<=|   
      11?                                 |>>|--|<<|  
      12? _floppy                         |==|--|==|  

      19                                  |??|--|??|  
      9                                   |??|-----|----------------|
                                        
      1                                   |        |<<|---------------|<<
      5 !_floppy/3                        |        |==|---------------|<<

          ------------------------------------------------------------------------



           */
           
          /*
           // rs  before o.start && re before  oend   >>> 6 (non flopy into exception)
           // rs  before ostart but  re  after rstart but re before o.end >> not tested yet >> 7
           // rs  before o start but  re  after r start and re after o.end  >> not tested yet >> 8


           // start into, end into  
              //  >>> 4 (into_ : at floppy end
                  >>> 2, _into_ (strict)
                  >>> 3 _into : at start of section

           // start into BUT end after >> 9 not tested yet.


           // end after () >> 1 (strict.) OR 5 (non floppy into) 


           // ALL cases are tested BUT there can be more sub cases to determine

           */


            if(re == parseInt(se+1)   &&    (oe == se) ){
                  // at "extra" end of a section
                   otest.floppy_ = true;
            }

            if( (re == parseInt(ss))  &&   (os == ss) ){
                  // at start of a section (really)
                   otest._floppy = true;
            }



            otest.tt = false;
            otest.c  = false 
            otest.case_  = false 

            /*
            */

            if(rs < os && re < os && rs< oe && re <oe){
          
                 otest.c  = '|after'
                 otest.case_  = 1
                 otest.tt = true

            }


            else if(rs > os && re > os && rs<= oe && re <=oe){
              // SUB CASE : RE < OE 10
               otest.case_  = 2
               otest.c  = '|into|'  
               otest.tt = true

            }

           // 10 case ? MK sure.
           // check boundaries..
           
          // rs:41 os:53 re:64 oe:72  
            else if(rs < os && re > os && rs<= oe && re <=oe){
               otest.case_  = 10
               otest.c  = '|start before, ends in|'  
               otest.tt = true

            }

            // 11 case

            // rs:48 os:53 re:81 oe:72 
              else if(rs < os && re > os && rs< oe && re >oe){
               otest.case_  = 11
               otest.c  = '|overflow|'  
               otest.tt = true

            }

             else if(rs == os && re == os && rs<= oe && re <=oe){
              // otest.into = true;
               
              if(otest._floppy == true){
                  otest.c  = '___into'
                  otest.case_  = 3

               }
               else{
                  otest.c  = '_after'
                  otest.case_  = 5

               }
               otest.tt = true

            }


            else if(rs > os && re > os && rs> oe && re > oe){
               if(otest.floppy_ == true){
                  otest.c  = 'into_'
                  otest.case_  = 4

               }
               else{
                  otest.c  = 'before'
                  otest.case_  = 6

               }
               //otest.after = true ;
               otest.tt = true

            }

            
            /*
            */



            if(otest.case_  == false){
           
            }


            else if(otest.case_  == 6){
               

            }



            else if(otest.case_  == 4 || otest.case_  == 2 || otest.case_  == 3  || otest.case_  == 10 ){
                // into
                otest.touched = {
                    '_end': true
                }
              //  oe = oe+1
               
            }

            else if(otest.case_  == 1 || otest.case_  == 5  ){
                // after
                otest.touched = {
                    '_start':true,
                    '_end': true
                }

            //    os = os+1
            //    oe = oe+1

            }






        //    console.log('>>><< section #'+i+' at start:'+ section_is_current_at_start+' at end'+section_is_current_at_end+'into'+section_is_current_at_into)
            /// Boundaries OKS.

            //check cases...
           // stric.after > 0 > do nothing
           
           // 1 : stric before offeset start and end.

           // into > 3  > offset end

           //
         

         // otested = true


         if( otest.case_ == false){
          //ss:'+ss+' se:'+se+ 
               otest.case_ = 'type:'+type+' rs:'+rs+' os:'+os+' re:'+re+' oe:'+oe+' floppy_: '+otest.floppy_+ ' _floppy: '+otest._floppy;
         }
              





         var test_results = { 
                'case'    : otest.case_,
                'type'    : otype,
                'touched' : otest.touched
        }
       
      console.log(test_results)
      return test_results;
}


