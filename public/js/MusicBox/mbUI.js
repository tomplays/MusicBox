
angular.module('musicBox.ui', [])

.factory('mb_ui', function ($rootScope, $http, $routeParams, $locale) {
   
      return function (inf) {
       var self = {


             

             init: function () {
               $rootScope.ui = {
                      'selected_range': {
                                                      'wait_ev' : false,
                                                      'set': false, 
                                                      'start':null, 
                                                      'end':null, 
                                                      'textrange':'',
                                                      'debug' : []
                                                  },
                      'boundaries' : {},
        

        };



    





      

        //$rootScope.ui.selected_range.markups_to_offset = new Array();
        //$rootScope.ui.selected_range.insert = null;
        //$rootScope.ui.offset_queue = new Array()
             

        $rootScope.ui.selected_objects        = [];
        





       
      
        // ?mode=

        // ?secret=  
        $rootScope.ui.secret  =  $routeParams.secret ? $routeParams.secret : false
        var doc_secret = $rootScope.ui.secret 
        // ? debug
        $rootScope.ui.debug   = $routeParams.debug ? true : null;
       

     






$rootScope.$watch('ui.selected_range.end', function(newValue, oldValue) {

      if(newValue==null){
        
      }
      else{
          if($rootScope.ui.selected_range.wait_ev !== true){
            console.log('ui end changed')
             $rootScope.ui.selected_range.redraw=true
          }
            else{
              console.log('ui end NOTchanged')
          }
      }
          
  });




          $rootScope.$watch('ui.selected_range.redraw', function(newValue, oldValue) {
              console.log('<<<<<<<<<< ui.selected_range.redraw n:'+newValue+' o:' +oldValue)


              if(!oldValue  || !newValue || newValue == false){
                   $rootScope.ui.selected_range.redraw = false;
                   console.log('NO oldVlaue for UI chnages')
                
                

              }
             
           

            //  if(newValue && newValue ==true){
             
          

              //console.log(newValue, oldValue)
            //if( newValue==null || newValue ==false){
            
           // }

         //     else{
              
                  console.log('ui chnages')
                  //console.log('reset all document markups to selected = false')
                  //  _.each($scope.markups, function(m, i){      
                  //  })

             // if( $rootScope.ui.selected_range.wait_ev == true   ){
                       
                     

                        // stop redraw loop (each section)
                      
                        $rootScope.ui.selected_range.set=true
                        $rootScope.ui.selected_range.size = $rootScope.ui.selected_range.end - $rootScope.ui.selected_range.start


                        // at least one char
                        if($rootScope.ui.selected_range.size == 0){
                          $rootScope.ui.selected_range.size = 1
                        }
                        $rootScope.ui.selected_range.multi =  ($rootScope.ui.selected_range.size) > 1 ? true : false
                      
if($rootScope.doc){
      _.each($rootScope.doc.containers, function(c,i){
                          console.log($rootScope.doc.containers)
                          c.inrange_letters  = Math.random()
                          c.inrange_markups  =  Math.random()
                          console.log('-------------CASE UI ONLY')
                        })
}
                    
                       
                        // set to false, it's ok.

                      //  $scope.ui.selected_range.redraw = false



              //  }
//}
           
            })















                      
             }
         }

          return self;
        }
  
    
})


.directive('mbRanges', function($rootScope, $routeParams, $locale){
/**
      * @description 
      * Show a message to user
      *
      *  @param {String} msg - message to show
      *  @param {String} classname - a css class ('ok'/ 'bad' / ..)
      *  @param {Number/Time} timeout - 

      *  @return -
      * 
      * @function docfactory#flash_message
      * @link docfactory#flash_message
      * @todo --
      */


  var rangesCtrl = function($scope, $rootScope){


   
  }


    return {
        restrict: 'AE',
        controller: rangesCtrl,
        link: function(scope, elem, attrs){
         
        },
      //   scope:{},
     scope: true,
     templateUrl: function() {
        return "js/MusicBox/document/tpl/ranges.tpl.html";
      }
    
   
    };
})

