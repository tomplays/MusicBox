'use strict';

angular.module('musicBox.SectionPusherDirectives', [])

.directive("mbPusher", function($rootScope,MarkupRest, renderfactory) {
    var global_active_pusher =true;

    var link= function(scope){
       //   console.log(' [mbPusher] directive')
    }
    var controller= function($scope){
          /*
             console.log($scope.$parent.section)
             console.log($scope.$parent.$parent.doc)
             console.log($rootScope.userin.username)
             console.log($rootScope.doc_owner)
          */

           $scope.userin  = $rootScope.userin
           $scope.render_config =$rootScope.render_config
           $scope.objSchemas = $rootScope.objSchemas 
           $scope.ui = $rootScope.ui
           $scope.push = {}
           
           $scope.preset_push = function(){
                    
                    var push_set= {
                                      isanon : true,
                                      isowner: $rootScope.doc_owner,
                                      start: ($scope.type=='new_section') ? $scope.$parent.section.end+1 : $rootScope.ui.selected_range.start,
                                      end: ($scope.type=='new_section') ? $scope.$parent.section.end+9 :  $rootScope.ui.selected_range.end,
                                      position   : ($scope.type=='new_section' || $scope.type=='inline_objects') ? 'inline' : 'left',
                                      metadata : ($scope.type=='new_section') ? '' : 'write your comment here',
                                      username : $scope.userin.username,
                                      user_id : $scope.userin._id

                   }
                   $scope.push = _.extend($scope.push, push_set)
           }


          if($scope.type=='new_section'){
              $scope.available_sections_objects = ['container']
              $scope.push.type=  'container';
              $scope.push.subtype =  'section' 
          }
           else if($scope.type=='inline_objects'){
                $scope.push.type =  'markup' 
                $scope.push.subtype =  'h1' 
                $scope.available_sections_objects = ['markup', 'hyperlink', 'media']

            }
            else if($scope.type=='container_class'){
                $scope.push.type =  'container_class' 
                $scope.push.subtype =  'css' 
                $scope.available_sections_objects = ['container_class']

            }
            else{
                $scope.push.type =  'comment' 
                $scope.push.subtype =  'comment' 
                $scope.push.metadata  = $scope.objSchemas[$scope.push.type].modes.editor.fields.metadata.label
                $scope.available_sections_objects = $rootScope.available_sections_objects
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

                 var push = $scope.push
                 if(!$scope.push.status) { $scope.push.status   = 'approved' }
                 if(!$scope.push.depth)   { $scope.push.depth    = 1 }
                 if(!$scope.push.doc_id_id) { $scope.push.doc_id_id  = 'null'  }
                 console.log('ready to push')
                 
                 var promise= MarkupRest.new({Id:$scope.$parent.doc.slug}, serialize($scope.push)).$promise;
                  promise.then(function (Result) {
                  if(Result.inserted[0]){
                    var mi = Result.inserted[0]
                  
                    if(mi.type== 'container'){
                      $scope.$parent.doc.content = $scope.$parent.doc.content+'Your text' 
                      $scope.$parent.doc.containers.push(mi)
                    }
                    else{
                      mi.isnew = true
                      mi.operation = {'created':true}
                      $scope.$parent.doc.markups.push(mi)
                      $scope.$parent.section.redraw = true;
                      
                    }
                    $scope.$parent.add(mi)
                

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
              if($scope.type=='new_section' && $rootScope.doc_owner == true && $scope.$parent.$parent.$parent.$parent.$last){
                return true
              }
              if( $scope.type=='inline_objects' && $rootScope.doc_owner == true){
                 return true
               }
              if( $scope.type=='container_class' && $rootScope.doc_owner == true && $scope.$parent.$parent.$parent.$parent.$last){
                 return true
              }
              return true;
           
            
           }

           $scope.new_section = function(){
             $scope.add()
           }


            $scope.pusher_isopen = function(){

              if( $scope.type=='new_section' && $rootScope.doc_owner == true && $scope.$parent.$parent.$parent.$parent.$last){
                 return true
              }
               if( $scope.type=='inline_objects' && $rootScope.doc_owner == true){
                 return true
              }

              if( $scope.type=='container_class' && $rootScope.doc_owner == true){
                 return true
              }

              return false
           }

           $scope.pusher_toggle = function(){
             $scope.isopen = !$scope.isopen         
           }

          $scope.pusher_isvalid = function(){
               if($scope.type=='new_section' || $scope.type=='container_class'){
                 return true;
                }
                return false;
           }

           /// watch rootscope UI changes
          $rootScope.$watch('ui.selected_range.redraw', function(newValue, oldValue) {
              if(oldValue == newValue){}
              else{
                if($scope.type=='new_section'){

                 
                }
                else{
                  $scope.push.start =  $rootScope.ui.selected_range.start
                  $scope.push.end   =  $rootScope.ui.selected_range.end
                }      
              }
          })

    
          $scope.$watch('[$parent.section.end, $parent.section.start]', function(newValue, oldValue) {
              if(oldValue == newValue){}
              else{
                if($scope.type=='new_section'){

                     $scope.push.start     =  parseInt($scope.$parent.section.end)+1
                     $scope.push.end   =  parseInt($scope.$parent.section.end)+9
                    console.log($scope.push)
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
                    $scope.isvalid = true;
                  };
              }
           }, true) 


           $scope.isvisible   = $scope.pusher_isvisible()
           $scope.isopen      = $scope.pusher_isopen()
           $scope.isvalid     = $scope.pusher_isvalid()
           $scope.preset_push()

    }
        return {
        restrict: "AE", 
        scope: {
            type: "@",
            position: "@"
        },
        replace : true,
        controller: controller,
        link:link,
          templateUrl: function() {
                return "js/MusicBox/section/tpl/pusher.tpl.html";
          }
        };
})


