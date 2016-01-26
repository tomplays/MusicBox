/*

ui

Includes : 

  - Angular factory
      
      mb_ui (Class)
      

        Functions 

          __ init
              set ui. object base.

          __ redraw_textcontent
              reset doc_content

          __ textrange() (wait doc.content)
              selected ranges text

          __ remap_sections()
              remap selected sub objects (letters, markups)


          
        Watchers

            __ ui.selected_range.end, ui.selected_range.start

            __ ui.selected_range.redraw_content
            
            __ ui.selected_range.redraw

        
        Directives

            > mbRanges 


*/
angular.module('musicBox.ui', [])

.factory('mb_ui', function ($rootScope, $http, $routeParams, $locale) {

  return function (inf) {


    $rootScope.$watch('ui.selected_range.end', function(newValue, oldValue) {
      
 $rootScope.ui.selected_range.redraw = true;
 /*
        if(!oldValue || !newValue || newValue==null){}
        else if(newValue==0){
              $rootScope.ui.selected_range.redraw = true;
        }
        else{

          //if($rootScope.ui.selected_range.wait_ev !== true){
             //console.log('ui end changed')
            
          //}

         
        }  
        */                
    });
       $rootScope.$watch('ui.selected_range.start', function(newValue, oldValue) {


          $rootScope.ui.selected_range.redraw = true;
        /*
console.log('SET?')
        if(  (!oldValue || !newValue || newValue==null) && newValue !==0 && oldValue !==0 ){

          console.log('NO SET')
        

        }
        else if(newValue==0){
            
        }
        else{
console.log('SET !')

          //if($rootScope.ui.selected_range.wait_ev !== true){
             //console.log('ui end changed')
             $rootScope.ui.selected_range.redraw = true;
          //}

         
        }     
        */             
    });

    // flat doc.content 
    $rootScope.$watch('ui.selected_range.redraw_content', function(newValue, oldValue) {
          if(newValue==true){
             
              self.redraw_textcontent()      
              $rootScope.ui.selected_range.redraw_content = false
          }
          else{
        
          }
    })

    $rootScope.$watch('ui.selected_range.redraw', function(newValue, oldValue) {
       
        console.log('UI REDRAW')
        if(newValue == false ){
           //    console.log('NO oldVlaue for UI chnages')
        }
        else{

            // if( $rootScope.ui.selected_range.wait_ev == true   ){             
            // stop redraw loop (each section
            self.textrange()
            self.remap_sections()
            $rootScope.ui.selected_range.redraw = false;
        }
                
    })   


    var self = {

      init: function () {
        $rootScope.ui = { 
            'selected_range'    : {

                                    'wait_ev'   : null,
                                    'set'       : false, 
                                    'start'     :($routeParams.range_start) ? parseInt($routeParams.range_start) : null,  // can be preset 
                                    'end'       : ($routeParams.range_end)  ? parseInt($routeParams.range_end) : null,    // can be preset
                                    'debug'     : [],
                                    'size'      : 0,
                                    'multi'     : false,
                                    'redraw_content' :false,
                                    'redraw' : false,
                                    'floppy': false

                                    },
            'boundaries'        :  {},
            'selected_objects'  :  [],
            'secret'            :  $routeParams.secret ? $routeParams.secret : false,
        };
        console.log('Mb.ui init')
      },
      redraw_textcontent : function(){
              var string = ''
               _.each($rootScope.doc.sections, function(s){
                    // remove line breaks
                    //  container.fulltext =  container.fulltext.replace(/(\r\n|\n|\r)/gm,"");
                    // console.log(container.fulltext)
                    //OR _edit ??? 
                     string  += s.fulltext_edit;
                     s.fulltext_to_array =   s.fulltext_edit; 
                      // maybe the same ????
                     console.log('------ fulltext_to_array >  --- ')
              })
              $rootScope.doc.content = string
              console.log('------doc.content ready --- ')
              //console.log(string)

               self.textrange()
      },
      textrange: function() {
        console.log('--- EARLY --- text range or after text edit')
            var textrange = ''
            for (var i = $rootScope.ui.selected_range.start; i <= $rootScope.ui.selected_range.end; i++) {
              if($rootScope.doc && $rootScope.doc.content && $rootScope.doc.content[i] ){
                textrange +=  $rootScope.doc.content[i]
              }
            }
            $rootScope.ui.selected_range.textrange = textrange

              $rootScope.ui.selected_range.size = $rootScope.ui.selected_range.end - $rootScope.ui.selected_range.start

              // at least one char
              if($rootScope.ui.selected_range.size == 0){
              $rootScope.ui.selected_range.size = 1
              }
              $rootScope.ui.selected_range.multi =  ($rootScope.ui.selected_range.size) > 1 ? true : false
      },
      remap_sections: function(){
          _.each($rootScope.doc.sections, function(c,i){
            c.inrange_letters  = Math.random()
            c.inrange_markups  = Math.random()
            // console.log('-------------CASE UI ONLY')
          })
      },
      insertText : function(){
        
         

      }
    }
    return self;
  }
})

.directive('mbRanges', function($rootScope, $routeParams, $locale){
  var rangesCtrl = function($scope, $rootScope){



   // alert($scope.section.start)
//       $rootScope.ui.selected_range.floppy = (scope.section.end+1  == rend) ? true : false


      $scope.reverse_text = function(){
           // 
           // alert($scope.$parent.section.start)
            //$rootScope.ui.selected_range
          console.log(mb_ui_)
          console.log($rootScope)
          mb_ui_.insertText()

         //   $scope.section.fulltext = 'sdsd'
          //  alert($rootScope.ui.selected_range.textrange)
      }

  }
  return {
    restrict: 'AE',
     controller: rangesCtrl,
    // link: function(scope, elem, attrs){},
   scope: true,
   templateUrl: function() {
      return "js/MusicBox/document/tpl/ranges.tpl.html";
    }
  };
})

