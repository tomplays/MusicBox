'use strict';


/* Angular Directive + controller

// Handle new markup or (section) in document.

// INJECT : 

        $rootScope 
            for doc owner,
            objects configs
            i18n

        MarkupRest (rest api for "add" )
*/  

angular.module('musicBox.section.directive.pusher', [])

.directive("mbPusher", function($rootScope, MarkupRest) {
    var global_active_pusher =true;

    // 
    var pusherCtrl= function($scope ){
         
           $scope.userin      = $rootScope.userin
           $scope.render_config =$rootScope.render_config
           $scope.render =     $rootScope.render
           $scope.objSchemas = $rootScope.objSchemas 
           $scope.push = {
            
           }
           $scope.i18n = $rootScope.i18n;
           
           $scope.init_push = function(){
                    
              var push_set= {
                                      isvisible  : $scope.pusher_isvisible(),
                                      isopen     : $scope.pusher_isopen(),
                                      isvalid    : $scope.pusher_isvalid(),
                                      isanon     : ($scope.$parent.doc.doc_owner) ?  false : true,
                                      isowner    : ($scope.$parent.doc.doc_owner),
                                      start      : ($scope.type=='new_section')  ?   $scope.$parent.section.end+1 : $scope.start,
                                      end        : ($scope.type=='new_section')  ?   $scope.$parent.section.end+9 :  $scope.end,
                                      position   : ($scope.type=='new_section' || $scope.type=='inline_objects') ? 'inline' : 'left',
                                      metadata   : ($scope.type=='new_section') ? '' : 'write your comment here',
                                      username   : ($scope.userin && $scope.userin.username) ? $scope.userin.username : null,
                                      user_id    : ($scope.userin && $scope.userin._id)  ? $scope.userin._id : null,
                                      has_ranges : ($scope.type=='new_section') ? true :false,

              }
  
              if($scope.type=='new_section'){
                    push_set.type=  'container';
                    push_set.subtype =  'section'
                    push_set.available_sections_objects = ['container']
              }
              else if($scope.type=='inline_objects'){
                    push_set.type =  'markup' 
                   push_set.subtype =  'h1' 
                   push_set.available_sections_objects = ['markup', 'hyperlink', 'media']
              }
              else if($scope.type=='container_class'){
                   push_set.type =  'container_class' 
                    push_set.subtype =  'css' 
                    push_set.available_sections_objects = ['container_class']
              }
              else{
                    push_set.type =  'comment' 
                    push_set.subtype =  'comment' 
                    push_set.metadata  = $scope.objSchemas[push_set.type].modes.editor.fields.metadata.label
                    if($scope.$parent.doc.doc_owner == true ){
                      push_set.available_sections_objects = ['comment', 'note', 'media']
                    }
                    else{
                      push_set.available_sections_objects = ['comment']
                    }
              }
              $scope.push = _.extend($scope.push, push_set)
           }

           
          $scope.push_generic_from_ranges= function (type, subtype, position,metadata){
              $scope.push.metadata = (metadata) ? metadata : ''
              $scope.push.type = (type) ? type : 'comment';
              $scope.push.subtype = subtype ? subtype : 'comment';
              $scope.push.position = (position) ? position : 'left';
              if(type !=='hyperlink' && type !=='media'){
                $scope.add();
              }    
          }
          
          $scope.add = function(){
              
                 if(!$scope.push.status) { $scope.push.status   = 'approved' }
                 if(!$scope.push.depth)   { $scope.push.depth    = 1 }
                 if(!$scope.push.doc_id_id) { $scope.push.doc_id_id  = 'null'  }

                 console.log('ready to push')
                 console.log($scope.push)
                 var promise= MarkupRest.new({Id:$scope.$parent.doc.slug}, serialize($scope.push)).$promise;
                  promise.then(function (Result) {
                  if(Result.inserted[0]){
                    var mi = Result.inserted[0]
                    mi.isnew = true
                    mi.operation = {'created':true}  
                  
                    // add to doc containers
                    if(mi.type== 'container'){
                       mi.fulltext = 'Your text' 
                       var operation_ = {
                          'object_': mi, 
                          'before':{'state':'new',  'type': 'push_container',
                          }, 
                          'grp_log': Math.random()*1000, 
                          'reversable': true     
                        }
                        $scope.$parent.doc.operation = operation_
                    }

                    // add to doc markups (and its section as an operation)
                    else{
                        var operation_ = {
                          'object_': mi, 
                          'before':{'state':'new',  'type': 'push_markup',
                          }, 
                          'grp_log': Math.random()*1000, 
                          'reversable': true
                        } 
                        $scope.$parent.section.operation = operation_


                        if($scope.type=="column"){
                         $scope.pusher_toggle()
                        }
                    }
                  }
                  else{
                      alert('err')
                  }
                }.bind(this));
                  promise.catch(function(response) {  
                     console.log(response)   
                  }.bind(this));
           }

          $scope.pusher_isvisible = function(){
              if(global_active_pusher !== true){
                  return false
              }
             // alert($rootScope.doc.doc_owner)
              if($rootScope.doc.doc_owner == true){
               
                  if( $scope.type == 'inline_objects' || $scope.type=='container_class' ){
                       return true
                  }
                  if($scope.type=='new_section' && $scope.last == true){
                     return true
                  }
              }
              if($scope.push.isopen == true && $scope.type == 'column' ){
                     return true
              }

             
              return true;
                      
          }

          $scope.new_section = function(){
            $scope.add()
          }

          $scope.pusher_isopen = function(){

             if(global_active_pusher !== true){
                  return false
              }

              if($rootScope.doc.doc_owner == true){
               
                  if( $scope.type == 'inline_objects' || $scope.type=='container_class' ){
                       return true
                  }
                  else if($scope.type=='new_section' && $scope.last == true){
                     return true
                  }
              }
              if($scope.push.isopen == true && $scope.type == 'column' ){
                  return true
              }
              return false
          }

          $scope.pusher_toggle = function(){
             $scope.push.isopen = !$scope.push.isopen
             if($scope.push.isopen == true){
                $scope.$parent.defocus_containers();
                $scope.$parent.section.focused  = 'side_left'
             }
             else{
                  $scope.$parent.defocus_containers();
             }
             $scope.$parent.section.modeletters = 'single'
          }

          $scope.pusher_isvalid = function(){
               if($scope.type=='new_section' || $scope.type=='container_class'){
                 return true;
                }
                return false;
           }

         /// watch rootscope UI changes
         $scope.$watch('[start,end]', function(newValue, oldValue) {       
            //  if(oldValue == newValue){}
            //  else{
            if($scope.type && $scope.type=='new_section'){}
                
            else{
                $scope.push.start =  $scope.start
                $scope.push.end   =  $scope.end
            }
            //   }

            if($scope.push.start && $scope.push.start!==null && $scope.push.end && $scope.push.end!==null){
              $scope.push.has_ranges =true
            }
            else{
              $scope.push.has_ranges = false
            }
          })

          $scope.$watch('[section.end, section.start]', function(newValue, oldValue) {
              if(oldValue == newValue){}
              else{
                if($scope.type=='new_section'){
                     $scope.push.start     =  parseInt($scope.$parent.section.end)+1
                     $scope.push.end       =  parseInt($scope.$parent.section.end)+9
                     console.log('Pusher (new_section) updated')
                }
                else{               
                }      
              }
          }, true)
       
          $scope.$watch('push.type', function(newValue, oldValue) {
              if(oldValue == newValue){}
              else{
                
                // auto-fix some cases..   
                if($scope.push.type == "container" ){ 
                      $scope.push.subtype = 'section'
                      $scope.push.metadata  = '' 
                      $scope.push.position = 'inline'
                }
                else if($scope.push.type == "container_class" ){ 
                      $scope.push.position = 'inline'
                }
                else if($scope.push.type == "media" ){ 
                       $scope.push.metadata = root_url+':'+PORT+'/img/lorem/400-400.jpg'
                       $scope.push.subtype  = $scope.objSchemas[$scope.push.type].modes.editor.fields.subtype.default
                       $scope.push.position = $scope.objSchemas[$scope.push.type].modes.editor.fields.position.default
                }
                else if($scope.push.type == "hyperlink" ){ 
                      $scope.push.metadata = root_url+':'+PORT
                      $scope.push.subtype  = $scope.objSchemas[$scope.push.type].modes.editor.fields.subtype.default
                }
                else if($scope.push.type == "markup"){
                      $scope.push.metadata  = '' 
                      $scope.push.subtype  = 'h1'
                      $scope.push.position = 'inline'
                } 
                else{
                       $scope.push.position = $scope.objSchemas[$scope.push.type].modes.editor.fields.position.default
                       $scope.push.subtype  = $scope.objSchemas[$scope.push.type].modes.editor.fields.subtype.default
                       $scope.push.metadata  = $scope.objSchemas[$scope.push.type].modes.editor.fields.metadata.label
                       // FALSE //  not defined    $scope.push.subtype  = $scope.objSchemas[$scope.push.type].subtype.available[0]
                }
              }
           })


            $scope.$watch('push', function(newValue, oldValue) {
              if(oldValue == newValue){}
              else{
                  if($scope.push.type && $scope.push.subtype  && $scope.push.start!==null && $scope.push.end!==null){
                    $scope.push.isvalid = true;
                  };
              }
           }, true) 
        
           $scope.init_push()

    }

    /* var link= function(scope){
      //   console.log(' [mbPusher] directive')
    }
    */

    return {
            restrict: "AE", 
            scope: {
                start: "=",
                end: "=",
                type: "@",
                position: "@",
                last: "="
            },
            //require: 'mbRanges',
            // replace : true,
            controller:pusherCtrl,
            templateUrl: function() {
              return "js/MusicBox/section/tpl/pusher.tpl.html";
            }
        };
})


