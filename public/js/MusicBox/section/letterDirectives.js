'use strict';

// custom musicBox directives

/*


"textListener" directive :

> handle the section's editable textarea

"lt" (letter) directive 

> the letter element.

*/


angular.module('musicBox.section.directive.letters.letters_controller', ['musicBox.section']).controller('LettersCtrl', function($scope, $rootScope) {

//console.log($rootScope)
//console.log($scope)

/*
$scope.f = $scope.section.fulltext
$scope.fl = $scope.section.inrange_letters_and_markupsllll
$scope.mks = $scope.section.section_markups
console.log($scope.fff)
console.log($scope.mks)
*/

/*
 $scope.$watch('section.fulltext_edit', function(newValue, oldValue) {
     // console.log( $rootScope.letters_edit)
 })
*/




  // triggered whan : 
  //                  doc.content clean
  //                  scope.section.fulltext_edit is OK ()
  //                  mks ans sections ok (no way to check...)
 


  $scope.$watch('section.fulltext_to_array', function(newValue, oldValue) {
      if(newValue){

         if(newValue == 'init'){
            console.log('contruct letters array')

         }
         else{
              console.log('RE -- contruct letters array')

         }
         //console.log('----B-------------- call LETTER ARRAY')
       
     
            // IT 's local !! >> good :)

           //   console.log('FT FT EDIT VALUE;' +$scope.section.fulltext_edit)

           $scope.section.letters_edit = []



             var str_start   =   0;
             //  console.log($scope.section.fulltext)
              var str_end     =   _.size($scope.section.fulltext_edit)-1;




               for (var i = str_start; i <= str_end; i++) {  
                    




                    var c = $scope.section.fulltext_edit[i]
               //      console.log(i+' '+c)
                       var letter_arr = {
                          'order': i,
                          'inrange':false,
                          'href':'',
                          'absolute_order': $scope.section.start+i,
                       }
                        if(!c){
                          
                        }
                        else{
                         
                          if(c === " ") {
                                  letter_arr.char = '&nbsp;'
                                //  fulltext_block += '&nbsp;'
                              }
                              else{
                                letter_arr.char = c
                              //  fulltext_block +=$scope.section.fulltext[i]
                              }

                        }



                          letter_arr.isfirst = false
                          letter_arr.islast = false
                              if(str_start == i)
                          {
                          //  letter_arr.char = '>'+letter_arr.char 
                            letter_arr.isfirst = true
                          }

                          if(i == str_end)
                          {
                            //letter_arr.char += '<'
                          
                            letter_arr.islast = true
                          }

            
                      $scope.section.letters_edit.push(letter_arr)
              }
            $scope.section.letters = $scope.section.letters_edit;
            console.log('------ letters_array ready --- ')
           // console.log($scope.section.fulltext_edit)
        

            // trigger remap classes
             console.log('>> ------ trigger letters_to_classes --- ')
            $scope.section.letters_to_classes = newValue

      } 
   })

   $scope.$watch('section.letters_to_classes', function(newValue, oldValue) {
      if(newValue){

          if(newValue == 'init'){
             console.log('------ contruct letters_to_classes --- ')

         }
         else{
              console.log('RE -- contruct letters_to_classes ')

         }

        
         console.log('------ map_letters call --- ')

          $scope.map_letters()
      } 
   })
     
   /*
      $scope.$watch('section.remap_fulltext_block', function(newValue, oldValue) {


              if(newValue == true){
                console.log(' compile fulltext_block (ONLY ONCE )')
                  $scope.section.fulltext_block  = 'undef...';
                  $scope.section.remap_fulltext_block = false
              }

      })
   */


      $scope.$watch('section.inrange_letters', function(newValue, oldValue) {
       
       
                                   
         if(newValue){
           

    _.each($scope.section.letters, function(l, i){
                  l.inrange = false;
                  var c_real = i + $scope.section.start;
                  // map the range  
                  
                 
                                                                            
                    if(c_real>=$rootScope.ui.selected_range.start) {
                     
                        // testing cases
                        // kind of "floppy"_mode.

                                // ==                                                                           collapsed
                        if(c_real == $rootScope.ui.selected_range.end && $rootScope.ui.selected_range.collapsed == true){
                          l.inrange = true;
                        }
                                // <
                        if(c_real < $rootScope.ui.selected_range.end ){
                          l.inrange = true;
                        }


                    }
                    else{
                     

                    }
                 
                  })
           
        console.log('-- call MAPS INRANGE ')   
        $scope.section.inrange_letters= false    

          }       

    })

$scope.map_letters = function(){
  console.log('map_letters() ')

  var fulltext_block = ''

  

  
  _.each($scope.section.letters, function(l,li){

    l.classes = []
    l.classes_array = ''


    var li_real = li+parseInt($scope.section.start)

    if(li==0){

      $scope.section.letters[li].classes.push('isfirst-section')
      $scope.section.letters[li].isfirst = true

    }
    if(li == $scope.section.letters.length-1){
      $scope.section.letters[li].classes.push('islast-section')
      $scope.section.letters[li].islast = true
    }

//console.log(l)
//console.log($scope.section.letters[li])
       

    //if(($scope.$parent.ui.selected_range.start || $scope.$parent.ui.selected_range.start ==0 )  && $scope.$parent.ui.selected_range.end){
      var index_absolute_start =   $rootScope.ui.selected_range.start -  parseInt($scope.section.start)
      var index_absolute_end   =   $rootScope.ui.selected_range.end   -  parseInt($scope.section.start)

    //}

    //l.inrange=false;
    //  console.log(li , index_absolute_start ,index_absolute_end)

    if( 

      // li == 3 || 
      //($scope.$parent.ui.selected_range.start || $scope.$parent.ui.selected_range.start == 0 ) 
      //&& 
      //($scope.$parent.ui.selected_range.end || $scope.$parent.ui.selected_range.end ==0) 
      //&& 

      li == index_absolute_start || (li > index_absolute_start && li <= index_absolute_end )  ){

      //console.log('true at '+li+' LR; '+li_real )
      //( (li > index_absolute_start && li < index_absolute_end) ||  li == index_absolute_end ||  li == index_absolute_start) ) {
    //  l.inrange = true;
    }



    


    if($scope.section.letters[li].char == '&nbsp;'){
      fulltext_block += ' '
    }
    else{
      fulltext_block += $scope.section.letters[li].char;
    }
    

  
  })

  if( $scope.$parent.ui.selected_range.end == $scope.section.end && $scope.section.letters[$scope.section.end]) {
      //$scope.section.letters[$scope.section.end].inrange = true;
    }
  if( $scope.$parent.ui.selected_range.start == $scope.section.start) {
     // $scope.section.letters[0].inrange = true;
  }


  if( $scope.$parent.ui.selected_range.start == $scope.section.end) {
    if($scope.section.letters[$scope.section.end]){

     // $scope.section.letters[$scope.section.end].inrange = true;
    }
    else{
      //// alert('??')
    }
  }
  


  var s_markups  = $scope.section.section_markups
  // console.log(s_markups)
  // $scope.markups_by_start_end_position_type($scope.section.start, $scope.section.end, 'any', 'any')
    
    _.each(s_markups, function(markup,k){
        var m_objSchemas = $scope.$parent.objSchemas[markup.type]

        var loop_start = parseInt(markup.start) - parseInt($scope.section.start);
      var loop_end   = markup.end     - $scope.section.start;
                        

      if(markup.type=='container_class' ){ // or pos == inlined
        //$scope.section.section_classes += markup.metadata+' ';
      }


      if(!$scope.section.letters[loop_start]){
      //  alert('test suite no start letter')
      }
      if(!$scope.section.letters[loop_end]){


        //alert('test suite no end letter')
      }
      
      for (var mi = loop_start ; mi <= loop_end;mi++) {


      
        if($scope.section.letters && $scope.section.letters[mi]){


            if(mi ==  loop_start){
              $scope.section.letters[mi].classes.push('isfirst-range')
            }
            if(mi ==  loop_end){
              $scope.section.letters[mi].classes.push('islast-range islast-range--')
            }

            

            if(markup.type == 'datavalue'){
              $scope.section.letters[mi].classes.push(markup.subtype)
              $scope.section.letters[mi].classes.push(markup.type)

            }
            if(markup.type == 'hyperlink' && markup.metadata){
              //  console.log('markup.type == hyperlink')
              //  console.log(markup)
                $scope.section.letters[mi].href = markup.metadata
            }
            
            if(m_objSchemas.map_range === true){
              if(_.contains($scope.section.letters[mi].classes, markup.subtype )){

             $scope.section.letters[mi].classes.push(markup.subtype) 
              }
              else{
                $scope.section.letters[mi].classes.push(markup.subtype) 
              }
              
            }
        }
      }

    })




    if($scope.section.modeletters == 'compiled'){
      var out = ''
      
/// could trigger a watcher
      $scope.section.fulltext_block = $scope.compile_html(fulltext_block)
      console.log(' block html compiled')
    }
    else{
      console.log('use less compile')
    }


}






// transform a string into a rich "classic html" markup string
// used only at page load, because after click, text is transformed into 'single' letters directives

$scope.compile_html = function(fulltext_block ){
  var out = ''

  for (var i = 0; i < fulltext_block.length; i++) {
          
          

            var  prev_class = false
            var current_class = false
            var next_class  = false;
            

            /*if($scope.section.letters[i].inrange === true){
             _.isArray(current_class) ? current_class.push('inrange') : current_class = new Array('inrange')
          }

            if(i==0){
                  //     _.isArray(current_class) ? current_class.push('iss') : current_class = new Array('iss')


            }

            if(i+1 == $scope.section.letters.length ){
                                   _.isArray(current_class) ? current_class.push('issd') : current_class = new Array('issd')

          /// current_class.push('is_last')

            }
            */
          //console.log('prev next i == '+i)
          if($scope.section.letters[i] && ($scope.section.letters[i].classes.length > 0 ) ){
            var current = true  
          //  if(_.isArray())
          //  current_class.push($scope.section.letters[i].classes) : current_class = new Array($scope.section.letters[i].classes)
            
            //if($scope.section.letters[i].href !== '')
            current_class = $scope.section.letters[i].classes


            //current_class.push()


          }
          

          if( $scope.section.letters[i+1] && $scope.section.letters[i+1].classes.length > 0 ){
             var next = true;
             next_class = $scope.section.letters[i+1].classes;
          }
          
          if($scope.section.letters[i-1] && $scope.section.letters[i-1].classes.length > 0 ){
             var prev = true
             prev_class = $scope.section.letters[i-1].classes
          }


          
          


          // case letter as at least one class
          if(_.isArray(current_class)){
            //console.log($scope.section.letters[i].classes)
            

            // add to array before compare
            

            // default class
            var classes_flat  = 'lt '
            // flatten 
             _.each(current_class, function(c,ci){
              classes_flat += c+' ';
            })

            
            var inside = ''
            
            if($scope.section.letters[i].href !== ''){


              //inside = '<a href="'+$scope.section.letters[i].href+'">'+fulltext_block[i]+'</a>'
              
              if($scope.section.letters[i-1] && $scope.section.letters[i-1].href !== ''){
                inside += fulltext_block[i]
              }
              else{
                inside += '<a title="hyperlink to '+$scope.section.letters[i].href+'" target="_blank" href="'+$scope.section.letters[i].href+'">'+fulltext_block[i]
              }


              if($scope.section.letters[i+1] && $scope.section.letters[i+1].href == ''){
                inside +='</a>'
              }
              else{
                
              }


            }
            else{

              if(fulltext_block[i] == ' '){
              inside = '&nbsp;'
            
            }
            else{
              inside = fulltext_block[i]
            }
              
              
                
              

            }

            if(  _.isEqual(prev_class , current_class))  {
              out += inside

            }
            else{
              out += '<span class="'+classes_flat+'">'+inside

            }
            if(_.isArray(next_class) && _.isEqual(next_class , current_class) ) {
            
            }
            else{
              out += '</span>'

            }


            //out += '<span class="'+classes_flat+'">'+inside+'</span>'

            
            //console.log($scope.section.letters[i].classes[])
          }

          // case letter has no classes
          else{
            

            if(_.isArray(prev_class) || i==0 ){
              // prev was a self closing letter or first letter then open span
              out +='<span>'
            }
            
            

            if(fulltext_block[i] == ' '){
              out += '&nbsp;'
            
            }
            else{
              out += fulltext_block[i]
            }

            
            if(_.isArray(next_class) || i+1 == $scope.section.letters.length){
              // next is a letter or is last letter then close span
              out +='</span>'
            }
        
          }

        }
  return out
}





})


angular.module('musicBox.section.directive.letters', [])
.directive('lt',   function($rootScope) {
 // var use_markup = 'h1'


  var use_markup = 'span'

  var logevent = {'directive':'lt', 'event':'none','count':0,'waiting':null}



  function selection_ends(scope,e){
      // $rootScope.ui.selected_range.end = scope.lt.order+scope.$parent.section.start // 'end' is last event..
      

      console.log(e)
      $rootScope.ui.selected_range.end   =  scope.lt.absolute_order+1
      $rootScope.ui.selected_range.start =  scope.lt.absolute_order
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

  function sets(scope, log){

      $rootScope.ui.selected_range.current_action =  log.current_action 
      $rootScope.ui.selected_range.wait_ev        =  log.wait_ev 
      $rootScope.ui.selected_range.start          =  log.start
      $rootScope.ui.selected_range.end            =  log.end

      if(log.switchrender !==false){
         $rootScope.ui.renderAvailable_active     =  log.switchrender
        

         logevent.switchrender = false;
         
      }
     
      console.log(log)




  //  logevent.started = $rootScope.ui.selected_range.start
   // logevent.ended   =   $rootScope.ui.selected_range.end

   // console.log(logevent)

    // $rootScope.ui.selected_range.debug.push(logevent)
    $rootScope.$apply(function(){});
    console.log('waiting '+$rootScope.ui.selected_range.wait_ev)
    //if($rootScope.ui.selected_range.wait_ev == false){
     
    //}
    console.log('sets')

  }  // SCAN /

    function link(scope, elem, attrs) { 

     //  console.log(scope.lt)


          if(scope.lt.islast){}
          if(scope.lt.isfirst){}
          /*
          */
          elem.bind('click', function(event) {
        
              if(scope.lt.href){
                  // window.location=  ; 
                  window.open(scope.lt.href,'_blank');
              }
              else{
                  /*
                  if($rootScope.doc.doc_owner == true){
                    alert('e')
                      $rootScope.ui.renderAvailable_active =  'editor'
                      scope.$parent.section.editing_text = true;
                      scope.$parent.section.editing = true;
                  }
                  */  
              }
             

              logevent.wait_ev = false
              logevent.current_action = 'click'
              sets(scope,logevent)
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
             
             
            

              scope.$parent.section.editing_text = true;
              scope.$parent.section.editing = true;
             
             
              logevent.switchrender  =  'editor'
              logevent.wait_ev=false
              logevent.current_action = 'dblclick'

              //alert('char: '+scope.lt.char+'scope.absolute_order:'+scope.lt.absolute_order+'  scope.order:'+scope.lt.order)
              sets(scope, logevent)
          });
        

          elem.bind('mousedown', function(e) { // restarting a selection
              //selection_starts(scope)
logevent.start =  $rootScope.ui.selected_range.start
logevent.end=  $rootScope.ui.selected_range.end
             
              if(!$rootScope.ui.selected_range.end){
                if(scope.lt.order==0){
                      logevent.end= 0
                    }
                    else{
                      logevent.end= scope.lt.absolute_order
                    }
               }
               else{
                  logevent.end= scope.lt.absolute_order

               }
                if(!logevent.start){

                   if(scope.lt.order==0){
                      logevent.start = 0
                    }
                    else{
                       logevent.start= scope.lt.absolute_order
                    }
               }
               else{
                 logevent.start= scope.lt.absolute_order
               }


   
              if( logevent.start >  logevent.end){
                var temp_s = logevent.start+1;
                logevent.start  = logevent.end
                logevent.end = temp_s

              }



              logevent.wait_ev = true// now waiting mouseup!
              logevent.current_action = 'md'
              sets(scope, logevent)
          });

          elem.bind('change', function(e) { // selection ends
              logevent.wait_ev = false// now waiting mouseup!
              logevent.current_action = 'change'
              sets(scope, logevent)
          })

          elem.bind('mouseup', function(e) { // selection ends

           


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
                 var temp_s = rstart;
                 rstart  = rend
                 rend = temp_s
                 logevent.current_action_sub = 'mouseup-reversed'
              }
              
              if(rend<0){
                rend=0
              }

             logevent.wait_ev    = false  // now waiting mouseup!
             logevent.start      = rstart 
             logevent.end        = rend
             logevent.current_action = 'mup'

              sets(scope, logevent)
          });
          /*
           elem.bind('mouseover', function(e) {  // while selection is active
             //selection_running(scope) 
             sets()
          });
          */
         
    }

    return {
          template: '<span contenteditable_  class="lt" ng-class="lt.classes" inrange="{{lt.inrange}}" ng-bind-html="lt.char"><span>',
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