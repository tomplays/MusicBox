
angular.module('musicBox.controller', []).controller('MarkupCtrl', function($scope, $http, MarkupRest) {
	
		$scope.unmap_letters = function(oldValue, sore){
			_.each($scope.$parent.section.letters, function(l){
				l.classes = _.without(l.classes, $scope.markup.subtype )
			})
		}
	$scope.map_letters = function( newValue, oldValue){
		var loop_start = $scope.markup.start 	- $scope.$parent.section.start;
		var loop_end   = $scope.markup.end 		- $scope.$parent.section.start;
	
		for (var mi = loop_start ; mi <= loop_end;mi++) {


			if($scope.$parent.section.letters && $scope.$parent.section.letters[mi]){
				
				if($scope.markup.type == 'container'){

				}
				else{

					//console.log('rm classes')
					//$scope.$parent.section.letters[mi].classes = _.without($scope.$parent.section.letters[mi].classes,$scope.markup.subtype )
					$scope.$parent.section.letters[mi].classes.push($scope.markup.subtype)
					///$scope.$parent.section.letters[mi].classes.push('muddp')
					//$scope.$parent.section.letters[mi].classes.push($scope.markup.type)

				}
				
				//$scope.section.letters[mr].classes_array[markup.subtype] = true;
				//$scope.section.letters[mr].char = mr;
			}
		}
	}


	$scope.init__= function () {

		$scope.$parent.update_markup_section_count('add')

		console.log(' - init markup start')
		/*
		
		console.log($scope.markup)
		console.log('parent ctrl')
		console.log($scope.$parent)
		console.log($scope.section)
		console.log('mk index'+$scope.$parent.$index)
		
		*/
		if(!$scope.$parent.$parent.objSchemas[$scope.markup.type]){
			console.log('no schematype for markup!')
			console.log($scope.markup)
			return false;
		}
		
        markup_ = new Object({
            'offset_start'   : 0,
            'offset_end'     : 0,
            'has_offset'     : false,
            'isolated'       : false,
            'selected'       : false,
            'editing'        : false,
            'inrange'        : true,
            'uptodate'       : '',
            'forced'		 : ($scope.markup.type =='container' || $scope.markup.type =='markup' || $scope.markup.type =='container_class' ) ? true : false,
            'touched'        : false,
            'ready'          : 'init',
            'sectionin' 	 :  $scope.$parent.$index,
         //   'sectionin'			:,
            'doc_id_id'      : '', // special cases for child documents (refs as doc_id in markup record)
       		'user_options'	 : $scope.apply_object_options('markup_user_options',$scope.markup.user_id.user_options),
			'by_me' : ( $scope.markup.user_id._id && $scope.$parent.userin._id  && ($scope.$parent.userin._id == $scope.markup.user_id._id ) ) ? true : false,
			'can_approve' : ($scope.$parent.doc_owner) ? true : false
		        
        })
       	

		$scope.markup=  _.extend($scope.markup, markup_);
       	
  		
				console.log('attribute_objects')
				if($scope.markup.type =='container'){
					 console.log('attribute_objects self container')
				}
              
          


				
		       	 $scope.markup.visible = false;
				 if($scope.markup.status == 'approved' || $scope.markup.by_me ==true || $scope.markup.can_approve == true){
				    $scope.markup.visible = true;
				 }
		       



				 /*
		        // using "memory" of ui.
		        _.each( $scope.$parent.ui.selected_objects, function(obj){
		          //console.log('keep opn'+obj._id)
		          if($scope.markup._id == obj._id){
		               $scope.markup.selected = true;
		            // should select ranges too..
		          }
		        })
		         _.each( $scope.$parent.ui.editing_objects, function(obj){
		          //console.log('keep opn'+obj._id)
		          if($scope.markup._id == obj._id){
		            $scope.markup.editing = true;
		          }
		        })

				*/


				if($scope.markup.type=='container_class' ){ // or pos == inlined
				   $scope.section.section_classes += $scope.markup.metadata+' ';
				}

		        if($scope.markup.type =='child'){ 
		          // to keep doc_id._id (just id as string) in model and not pass to post object later..
		          if($scope.markup.doc_id){ 
		             $scope.markup.doc_id_id = $scope.markup.doc_id._id;
		             if($scope.markup.doc_id.doc_options){
		               // m.$scope.markup.child_options = [];
		               var  options_array =  [];
		                $scope.markup.child_options = [];
		                _.each($scope.markup.doc_id.doc_options , function(option){
		                  options_array[option.option_name] = option.option_value
		                });
		                $scope.markup.child_options = options_array
		              }
		          }
		          //console.log('children call ...')
		        }
		       	/*
		        if($scope.markup.type =='data'){} 
       		 	if( ($scope.$parent.objSchemas[$scope.markup.type].map_range && $scope.$parent.objSchemas[$scope.markup.type].map_range==true && $scope.markup.visible == true)  || ($scope.markup.subtype=='share_excerpt' && $scope.markup.visible == true)  ){
       		 	} 
				*/
      

			
			if($scope.markup.type == 'media' || $scope.markup.subtype == 'simple_page' ||  $scope.markup.subtype == 'doc_content_block' ){
			    $scope.section.section_classes += 'has_image ';
			    if($scope.markup.position){
			          $scope.section.section_classes += ' focus_side_'+$scope.markup.position +' ';
				}

				if($scope.markup.position == 'background'){
					$scope.section.section_styles = 'background-image:url('+markup.metadata+'); ' ;
				}
			}

		

       	console.log(' - init markup end > next > map_letters')

		$scope.map_letters()
	}

	



  	//console.log($scope.section)
    /*
    $scope.$watchCollection('[markup.start, markup.end]', function(newValue, oldValue) {
        //console.log($scope)
        //console.log(newValue)
        //console.log(oldValue)
        // can call parent..
        //doc.init_containers()
        if(oldValue !==newValue && oldValue && oldValue !=='' &&  newValue && newValue !==''){
        }
    });
	*/

	var autosave = false;



	$scope.handle_change_range = function(oldValue,newValue, sore){
			console.log('handle_change_range '+sore+' of markup changes watched')
			console.log(oldValue+'-->'+newValue)

			//alert($scope.markup.sectionin)

			if(newValue>$scope.section.end || newValue<$scope.section.start ){
			
				$scope.markup[sore] = oldValue

			}

			_.each($scope.$parent.section.letters, function(l,i){

					l.classes= new Array()
			})
			//$scope.markup.$parent.letters = new Array()
			//console.log($scope.markup)
					//	console.log($scope.markup.$parent)
			//console.log($scope.$parent.section.letters)
                _.each($scope.$parent.section.letters, function(l){
                	l.classes = new Array();
				})

            var st_at = $scope.markup.start-$scope.$parent.section.start

			for (var pos= st_at; pos<=newValue; pos++){ 
				//if($scope.markup.type !== 'container'){
					
					if($scope.$parent.section.letters[pos]){
						//console.log($scope.$parent.section)
						//console.log(pos)
						//$scope.$parent.section.letters[pos].classes.push('mup')
					//	$scope.$parent.section.letters[$scope.markup.end].classes.push('mup')

					//	$scope.$parent.section.letters[pos].classes.push($scope.markup.subtype)
					}
					else{
										//		console.log(pos)

					}
					//$scope.markup.$parent.section.letters[pos].classes = []
					//$scope.markup.$parent.section.letters[pos].classes.push($scope.markup.subtype)

			//	}
			}

			$scope.$parent.$parent.update_markup_count('add')
			$scope.$parent.update_markup_section_count('add')
		


	}
	




	$scope.$watch('markup.start', function(  newValue, oldValue) {
		
        if(oldValue && newValue && newValue !== oldValue){
      	//$scope.handle_change_range(oldValue,newValue,  'start')
      	       $scope.unmap_letters( oldValue, 'start')

      	    	$scope.map_letters( newValue, oldValue, 'start') 	
		}	 
   });	

   $scope.$watch('markup.end', function(  newValue, oldValue) {
        if(oldValue && newValue && newValue !== oldValue){
       // $scope.handle_change_range(oldValue, newValue,  'end')
       $scope.unmap_letters( oldValue, 'start')
         	$scope.map_letters(newValue, oldValue, 'end') 	
		}
   });	
     $scope.$watch('markup.type', function(  newValue, oldValue) {
        if(oldValue && newValue && newValue !== oldValue){
       // $scope.handle_change_range(oldValue, newValue,  'end')
       $scope.unmap_letters( oldValue, 'start')
         	$scope.map_letters(newValue, oldValue, 'end') 	
		}
   });	
  
    $scope.$watch('markup.subtype', function(  newValue, oldValue) {
        if(oldValue && newValue && newValue !== oldValue){
       // $scope.handle_change_range(oldValue, newValue,  'end')
	       $scope.unmap_letters( oldValue, 'start')
	       $scope.map_letters(newValue, oldValue, 'end') 	
		}
   });	

    $scope.$watch('markup.position', function( newValue, oldValue ) {
				        // only for markups which ranges match container
				        if($scope.markup.start >= $scope.$parent.section.start && $scope.markup.end <= $scope.$parent.section.end){
				                //console.log('watch position trigger>')
								$scope.markup.sectionin = $scope.$parent.section.sectionin  
					        //	console.log('markup.sectionin'+$scope.markup.sectionin)				

					  
					   }
						if(newValue !== oldValue){
						  	//$scope.$parent.init_()		
						}
	        
		


	      //    

	       

	        //$scope.$parent.section.hello= new Object($scope.markup)

	           // $scope.markup.position = newValue;
	            //no toggle 
	           // $scope.ui.focus_side = ''
		

		/*		if(!$scope.$parent.section.objects_[$scope.markup.type]){
					$scope.$parent.section.objects_[$scope.markup.type] = new Array()
					if(!$scope.$parent.section.objects_[$scope.markup.type][newValue]){
						$scope.$parent.section.objects_[$scope.markup.type][newValue] = new Array()
					}
				    $scope.$parent.section.objects_[$scope.markup.type][newValue].push($scope.markup)

				}
		*/
			///	console.log($scope.markup)
			//	console.log($scope.$parent.section)
			//	$scope.$parent.section.objects_[$scope.markup.type][oldValue] = _.reject($scope.$parent.section.objects_[$scope.markup.type][oldValue], function(mk){ return mk._id = $scope.markup._id; });



				//console.log($scope.$parent.objects_[$scope.markup.type][oldValue])
			//	$scope.$parent.section.objects_[$scope.markup.type][oldValue] = _.without($scope.$parent.section.objects_[$scope.markup.type][oldValue], $scope.markup)
	            /// doc.markup_save($scope.markup)

        
//}


         // $scope.$parent.section.fulltext = $scope.$parent.section.fulltext+'-'
          
          


      
    });

    $scope.$watch('markup.selected', function(newValue, oldValue) {
          // only new value check
          if(oldValue !== newValue ){
          	
          	//$scope.$parent.section[letters][$scope.markup.sta]
        	//$scope.toggle_fragment_ranges('single_markup', 'selected', $scope.markup, newValue, true)
          }
          else{
    		// console.log('watch untrigger')
          }
    });

	/*
	$scope.$watch('markup.inrange', function(newValue, oldValue) {
          // only new value check
          if(newValue !==''){
            //console.log(newValue)
            //console.log(oldValue)
            $scope.toggle_fragment_ranges('single_markup', 'selected', $scope.markup, newValue, true)
          }
          else{
            console.log('watch untrigger')
          }
    });
	*/



	// used for editing a markup posittion ui.
	// icon click or section select
	$scope.toggle_select_markup = function (event_name){
		//console.log($scope.markup)
		if($scope.markup.sectionin || $scope.markup.sectionin == 0){
			$scope.$parent.modeletters = 'single'
		}

		if($scope.markup.isolated == true){
			$scope.markup.editing = !$scope.markup.editing
			return;
		}
		if($scope.markup.type == 'container'){
			_.each($scope.$parent.$parent.containers, function(c, i){
				if(c !== $scope.markup){
					// toggle the others
					c.selected = false;
				}
			});

		}
		// event 
		if(event_name == 'dblclick'){

			if($scope.doc_owner || $scope.markup.by_me === true){
				$scope.markup.editing = !$scope.markup.editing
			}
			if($scope.markup.by_me === false){
				// alert('not by me')
			}
		}
		if(event_name == 'click'){
			

			$scope.markup.selected = !$scope.markup.selected
if($scope.markup.type == 'container'){
$scope.markup.editing = !$scope.markup.editing 

}

		}
		if($scope.markup.editing === true){
			$scope.markup.selected = true;
		}

		// focus'
		if($scope.markup.position=="left" && $scope.markup.editing){
			$scope.$parent.defocus()

			$scope.$parent.section.focused = 'side_left'

		}
		else if( ($scope.markup.position=="right" || $scope.markup.position=="inline") && $scope.markup.editing){
			$scope.$parent.defocus()
			$scope.$parent.section.focused  = 'side_right'
		}
		else{
						$scope.$parent.defocus()

		}
    }	


	
	// change and save a single markup value-field
	$scope.change_value = function(field, value, save){
		$scope.markup[field] = value;
		if(save){
			$scope.save()
		}
		
	}

/**
      * @description 
      * Save a markup (attributes)
      *
      * @param {object} markup - markup to save
      * @return {Function} init and/or flash
      * 
      * @function docfactory#markup_save
      * @link docfactory#markup_save
      * @todo ---
      */


      $scope.savebk = function () { 


      }
     $scope.save = function () {


       // var r = new MarkupService($scope.markup)
       // r.save()
     // console.log(r.markup)
      


        var thos = this;
        var promise = new Object();
        var data = new Object({
            'metadata':$scope.markup.metadata,
            'start':$scope.markup.start,
            'end':$scope.markup.end,
            'depth':$scope.markup.depth,
            'status':$scope.markup.status,
            'type':$scope.markup.type,
            'subtype':$scope.markup.subtype
          });
          if($scope.markup.doc_id_id){
            data.doc_id = $scope.markup.doc_id_id
          }
          // can be null.
          data.secret = $scope.ui.secret;

          // check-force data
          if($scope.markup.type == 'markup' || $scope.markup.type == 'container'  || $scope.markup.type == 'container_class' ){
             data.position = 'inline'
          }
          else{
            data.position = $scope.markup.position
          }

        
          

          promise.query =  MarkupRest.markup_save({id:$scope.$parent.doc.slug, mid:$scope.markup._id }, serialize(data) ).$promise;
          



          promise.query.then(function (Result) {
            var edited  = Result.edited[0][0]
            console.log(edited)
           	$scope.flashmessage(edited.type +' saved', 'help' , 3000)
             
          }.bind(this));
          promise.query.catch(function (response) {  
            console.log(response)   
           $scope.flashmessage(response.err.err_code, 'bad' , 3000)
          }.bind(this));

      }

     $scope.offset= function (s,e){




     		// from array if already present
     		if(_.contains($scope.ui.offset_queue, $scope.markup)){
				$scope.ui.offset_queue = _.without($scope.ui.offset_queue,$scope.markup )
     		}

     		// update s/e
     		$scope.markup.has_offset = true
			$scope.markup.offset_start = $scope.markup.offset_start+s
			$scope.markup.offset_end = $scope.markup.offset_end+e

     		$scope.markup.start = $scope.markup.start+s
     		$scope.markup.end 	= $scope.markup.end+e
			
     		// add to queue
			$scope.ui.offset_queue.push($scope.markup)


		//	



     }


     // apply active selection ranges to a markup then save it.
	$scope.match_selection = function (markup){
		// todo: should check notnull / section limits
		$scope.markup.start     =  $scope.ui.selected_range.start
		$scope.markup.end 		= $scope.ui.selected_range.end
		$scope.save()
	}

	/**
	* delete a markup on click
	* @function MarkupCtrl#delete_markup
	*/
	$scope.delete = function (){
		
		if(markup.type=="container" && $scope.sectionstocount == 1){
			$scope.flashmessage('MusicBox can\'t delete last section', 'bad' , 3000)
			return
		}
		else{
			var promise = MarkupRest.markup_delete( {id:$scope.$parent.doc.slug, mid:$scope.markup._id }).$promise;
			promise.then(function (Result) {
				$scope.flashmessage('Markup deleted', 'ok' , 2000, false)
				// not enough for letter mapping
				$scope.markup.visible = false;
			}.bind(this));
			promise.catch(function (response) {  
				$scope.flashmessage(response.err, 'bad' , 3000)
			}.bind(this));
		}
		// toggle
		$scope.ui.focus_side = ''
	}


	$scope.upload_file_image = new Object({'uploaded': false});
	$scope.preuploadFile = function(files){
		$scope.upload_file_image.file = files[0];
		return;
	}

	$scope.uploadFile = function(){	
			var fd = new FormData();
			fd.append("image", $scope.upload_file_image.file);
			$http.post(api_url+'/media/upload', fd, 
				{ 
					withCredentials: true,
	        		headers: {'Content-Type': undefined },
	        		transformRequest: angular.identity 
	        	}
	        	).success(function(m) {
					$scope.upload_file_image.uploaded = true;
	        		$scope.upload_file_image.basename = m[0].basename
					$scope.upload_file_image.path = m[0].path
					$scope.upload_file_image.type = m[0].type
					$scope.upload_file_image.fullpath = root_url+':'+PORT+'/uploads/'+m[0].path+m[0].basename
					//$scope.push.metadata = $scope.upload_file_image.fullpath
					$scope.markup.metadata        = $scope.upload_file_image.fullpath
					// could autosave : doc.markup_save($scope.markup)

					
				}).error(function(err){
					console.log(err)
			})
		}


$scope.init__()


}); // end controller