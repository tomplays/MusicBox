'use strict';

// custom musicBox directives
// not very used.. only for video players in v1.
// some tests for a reafactoring commented

angular.module('musicBox.directives', []).directive('fluid', 

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
}).directive('lt',   function($rootScope) {

  

  function scan(scope, ev){
    /*
    console.log(ev);
    console.log(scope);
    console.log( $rootScope.ui.selected_range.start)
    console.log( $rootScope.ui.selected_range.end)
    console.log( $rootScope.ui.lastover)
    */

    if(ev == 'mousedown'){
           $rootScope.ui.selected_range.start = scope.lt.order
          if($rootScope.ui.selected_range.start == 0){
          //  $rootScope.ui.selected_range.start = 0
          }
         


          if(!$rootScope.ui.selected_range.end){
            $rootScope.ui.selected_range.end = scope.lt.order
          }




    }

    if(ev == 'mouseup'){
      
      


 if(!$rootScope.ui.selected_range.start && $rootScope.ui.selected_range.start !== 0 ){
            $rootScope.ui.selected_range.start = scope.lt.order
          }




        if($rootScope.ui.selected_range.end){
          $rootScope.ui.selected_range.end = scope.lt.order
        }
        else{
           $rootScope.ui.selected_range.end = scope.lt.order;
           console.log('end range set to '+$rootScope.ui.selected_range.end)
        }





    }


    //  reverse ranges if start is not inf. end
    if($rootScope.ui.selected_range.end < $rootScope.ui.selected_range.start){
      var true_end = $rootScope.ui.selected_range.start
      var true_start = $rootScope.ui.selected_range.end
      $rootScope.ui.selected_range.start = true_start
      $rootScope.ui.selected_range.end = true_end
    }

if(ev == 'mouseup'){
  var selected_objects =[]; 
  console.log($rootScope.ui.selected_range.start)
  console.log($rootScope.ui.selected_range.end)       
  // $rootScope.ui.selected_range.start =  scope.lt.order
  _.each($rootScope.doc.markups, function(markup, i){
    //console.log(markup.type)
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
              selected_objects.push(markup)
              console.log('markup stric. in range type: '+markup.type +' from: '+ markup.start +' to: '+ markup.end)
        }
    
    }
    else{
    
    }

  })



  $rootScope.ui.selected_objects = selected_objects
  _.each($rootScope.ui.selected_objects, function(o, i){
         o.selected = true;
  });




  $rootScope.ui.selected_range.textrange = scope.$parent.$parent.textrange();

             // scope.lt.classes.push('selected')
              $rootScope.$apply(function(){
  //console.log(scope.lt)

               //             $rootScope.ui.lastover =  scope.lt.char
                          });

              // console.log(scope.ltLetterorder)
              //alert(attrs.chars)
            //scope.$parent.$parent.over( scope, 'down')


} // mouseup only if


  } 

    function link(scope, elem, attrs) { 

          elem.bind('click', function() {
              if( scope.lt.href){
                  window.location=  scope.lt.href; 
              }
              $rootScope.$apply(function(){
                // console.log(scope.lt)
                // $rootScope.ui.lastover =  scope.lt.char
              });
          });

          elem.bind('dblclick', function() {
             
              $rootScope.$apply(function(){
                // console.log(scope.lt)
                if($rootScope.ui.renderAvailable_active ==  'editor'){
                  $rootScope.ui.renderAvailable_active =  'read'
                }
                else{
                  $rootScope.ui.renderAvailable_active =  'editor'
                }
             
              });
          });

          elem.bind('mousedown', function(e) {
            //  console.log(e)
            scan(scope, 'mousedown')
          });
          elem.bind('mouseup', function(e) {
            scan(scope, 'mouseup')
          });
    }

    return {
     // template: '{{l.char}}',
     transclude :true,
     // replace :true,
      restrict: 'EA',
      link:link,
      scope: {
        lt : '='
      } 
    };
  })
.directive('fluidtext',   
  function($rootScope, $compile) {
   
    function link(scope, elem, attrs) { 
      //   console.log(scope.section.letters);
      
      scope.$watch(attrs.modeletters, function(value,old) {
        //console.log('wtached modeletters')
      });

      elem.bind('click', function() {
        console.log('modeletters toggled')
        
        scope.$apply(function(){

          scope.section.modeletters = 'single';
        });
      })

      console.log('drawing...')
      var text_out = '';
      
      _.each(scope.section.letters, function(lt, w){
           var lt_out = '';
           var lt_classes = ''
          if(_.size(lt.classes)==0){
                lt_out += lt.char
          }
          else{
            _.each(lt.classes, function(ltc, x){
                //console.log(ltc)
                console.log(lt.order+'class count:'+x)
              if(ltc !=='lt'){
               lt_classes += ' '+ltc 
              }
              lt_out = '<span class="lt '+lt_classes+'" >'+lt.char+'</span>'
             });
          }
          //   console.log(lt)
          
          text_out += lt_out
          //text_out += '<span class="'+lt_classes+'" >'+lt.char+'</span>';
        });
       // console.log(text_out)
        elem.html(text_out);
        $compile(elem.contents())(scope);
    }
    return {
            scope: {
              section   : '=',     
            },
            transclude :true,
            restrict: 'EA',
            link: link,
           // template: '<p>{{section.fulltext}}</p>'
        }
})

.directive('fluidtexte',   
  function($rootScope) {
   
    function link(scope, elem, attrs) { 
     
      elem.bind('click', function() {
        // console.log($rootScope.doc_owner)
        // console.log($rootScope.user_in)

        scope.$apply(function(){
          if($rootScope.doc_owner == true){
                      scope.section.modeletters = 'single';

          }
        });
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