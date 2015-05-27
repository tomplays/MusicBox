
angular.module('musicBox.markup_controller', ['musicBox.section_controller']).controller('MarkupCtrl', function($scope, $http, MarkupRest) {
	
	
	$scope.init__= function () {
		//console.log($scope.$parent.section_markups)
		
				
		console.log('     ---- [m] init markup')
		
		if(!$scope.$parent.$parent.objSchemas[$scope.markup.type]){
			console.log('no schematype for markup!')
		//	console.log($scope.markup)
			return false;
		}
		
        markup_ = new Object({
            'offset_start'   : 0,
            'offset_end'     : 0,
            'has_offset'     : false,
         //   'isolated'       : 'true',
            'selected'       : false,
            'editing'        : false,
            'inrange'        : false,
            'uptodate'       : '',
             'deleted'        : false,
            'forced'		 : ($scope.markup.type =='container' || $scope.markup.type =='markup' || $scope.markup.type =='container_class' ) ? true : false,
            'touched'        : false,
            'ready'          : 'init',
            'doc_id_id'      : '', // special cases for child documents (refs as doc_id in markup record)
       		'user_options'	 : $scope.apply_object_options('markup_user_options',$scope.markup.user_id.user_options),
			'by_me' 		 : ( $scope.markup.user_id._id && $scope.$parent.userin._id  && ($scope.$parent.userin._id == $scope.markup.user_id._id ) ) ? true : false,
			'can_approve' 	 : ($scope.$parent.doc_owner) ? true : false,
			'objSchemas' 	 : $scope.objSchemas[$scope.markup.type] ?  $scope.objSchemas[$scope.markup.type] : []     
        })      	

		$scope.markup =  _.extend($scope.markup, markup_);
 
		
			// its own fulltext for section.
			$scope.markup.sectionin = $scope.$parent.section.sectionin
  			$scope.markup.fulltext  = $scope.fulltext()
		


              	
		$scope.markup.visible = false;
		if($scope.markup.deleted !== true && ($scope.markup.status == 'approved' || $scope.markup.by_me ==true || $scope.markup.can_approve == true) ) {
			$scope.markup.visible = true;
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
			if($scope.markup.position == 'background' ){
				$scope.section.section_styles = 'background-image:url('+$scope.markup.metadata+'); ' ;
			}
		}
       	

		
	}

	$scope.fulltext = function (){

	   var fulltext = '';
       var i_array     =   0;
	   for (var i = $scope.markup.start; i <= $scope.markup.end; i++) {
         	// console.log(i)
         	if($scope.$parent.doc.content[i]){
         		fulltext += $scope.$parent.$parent.doc.content[i];
         	}
     	}
     	return fulltext;
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
			//console.log('handle_change_range '+sore+' of markup changes watched')
			//console.log(oldValue+'-->'+newValue)
			//alert($scope.markup.sectionin)
			if(newValue>$scope.section.end || newValue<$scope.section.start ){
				$scope.markup[sore] = oldValue
			}
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
      	      // $scope.markup.fulltext = $scope.fulltext()
 			   $scope.markup.has_offset = true;
 			   //	alert('m end ininit')
	         //  $scope.markup.offset_start = $scope.markup.offset_start - (newValue - oldValue)




			   $scope.stack_markup()
		}	 
   });	

   $scope.$watch('markup.end', function(oldValue, newValue) {
        if(oldValue && newValue && newValue !== oldValue){

       	

	       // $scope.$parent.$parent.ui.selected_range.end  = newValue
	        $scope.markup.has_offset = true;
	    //    $scope.markup.offset_end = $scope.markup.offset_end  - (newValue - oldValue)

	        console.log('new mk end:'+$scope.markup.offset_end)

	  

	        $scope.stack_markup()
		}
   });	

	$scope.stack_markup = function(){
		//console.log('stack_markup')
		//console.log($scope.markup)
		 $scope.$parent.attribute_objects()
		 $scope.markup.touched= true;




		
		if(!_.contains($scope.$parent.$parent.ui.offset_queue, $scope.markup)){
			// $scope.$parent.$parent.ui.offset_queue.push($scope.markup)
     	}


     	//$scope.$parent.section.fulltext = $scope.$parent.section.fulltext+'-'
	}

     $scope.$watch('markup.type', function( oldValue, newValue) {
        if(oldValue && newValue && newValue !== oldValue){

        	if($scope.objSchemas[newValue]){
        		$scope.markup.objSchemas = $scope.objSchemas[newValue]
        	}
        	else{
        		console.log('try to save to undef type')
        	}
			$scope.markup.touched= true;
			$scope.$parent.attribute_objects()
			$scope.stack_markup()
		}
   });	
  
    $scope.$watch('markup.subtype', function( newValue, oldValue) {
        if(oldValue && newValue && newValue !== oldValue){
	       $scope.markup.touched= true;
	       $scope.$parent.attribute_objects()
	       $scope.stack_markup()
	       $scope.save($scope.markup.subtype +' moved to '+newValue)
		}
   });	

    $scope.$watch('markup.position', function( newValue, oldValue ) {
		// only for markups which ranges match container
		if(oldValue && newValue && newValue !== oldValue){

			if($scope.markup.start >= $scope.$parent.section.start && $scope.markup.end <= $scope.$parent.section.end){
				//console.log('watch position trigger>')
				$scope.markup.sectionin = $scope.$parent.section.sectionin  
				//	console.log('markup.sectionin'+$scope.markup.sectionin)				
			}
			if(newValue !== oldValue){
				//$scope.$parent.init_()		
			}
			$scope.markup.touched= true;
			//alert('p ininit')
			$scope.$parent.attribute_objects()
			$scope.stack_markup()
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


         // $scope.$parent.section.fulltext = $scope.$parent.section.fulltext+'-'
          
          


      
    });
	

	/*
    $scope.$watch('markup.selected', function(newValue, oldValue) {
          // only new value check
          if(oldValue !== newValue ){
          	console.log('watch untrigger markup.selected')
          	console.log($scope.markup)
          	console.log($scope.$parent.section.letters)

          	//$scope.$parent.section[letters][$scope.markup.sta]
        	//$scope.toggle_fragment_ranges('single_markup', 'selected', $scope.markup, newValue, true)
          }
          else{
    		// console.log('watch untrigger')
          }
    });
	*/

	/*
	$scope.$watch('markup.inrange', function(newValue, oldValue) {
          // only new value check
           if(oldValue !== newValue ){
           		var s = $scope.ui.selected_range.start - $scope.$parent.section.start
		        var e = $scope.ui.selected_range.end - $scope.$parent.section.start


			for (var pos= s; pos<=e; pos++){ 
				$scope.$parent.section.letters[pos].inrange = true;
			}

           
          }
          else{
            console.log('watch untrigger')
          }

    });
	*/
	



	// used for editing a markup posittion ui.
	// icon click or section select
	$scope.toggle_select_markup = function (event_name){

		///// $scope.$parent.section.objects_ = '';

		$scope.section.modeletters = 'single'

		

		if($scope.markup.isolated == true){
			$scope.markup.editing = !$scope.markup.editing
			return;
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
			$scope.markup.inrange= !$scope.markup.inrange


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



		$scope.ui.selected_range.start =  $scope.markup.start
		$scope.ui.selected_range.end= $scope.markup.end
		

    }	



$scope.$watch('markup.fulltext', function(newValue, oldValue) {
	console.log(' [mk] fulltext watched')

	console.log($scope.markup)

	if($scope.markup.type== 'container'){


	}
	else{

		if(!newValue){
				// deleted by user in textarea
			newValue=  ''
		}
		if(oldValue && newValue && oldValue !== newValue){
			console.log(' [mk] fulltext change : '+oldValue+' > '+newValue)
		}

	}
	

});


// used for editing a markup posittion ui.
	// icon click or section select
	$scope.select_section = function (){



			if($scope.doc_owner || $scope.markup.by_me === true){
			}
			else{
				return;
			}
			_.each($scope.$parent.containers, function(c, i){
				if(c !== $scope.markup){
					// toggle the others
					c.selected = false;
					c.editing = false;
					c.editing_text = false;
				}
				else{
					c.selected = !c.selected;
					c.editing = !c.editing
					c.editing_text = !c.editing_text
				}
			});
    }	
	
	// change and save a single markup attr-value
	$scope.change_value = function(attr, value, save){

		if(attr && value){
			$scope.markup[attr] = value;
		}
		
		if(save){
			if(attr == 'status'){
				$scope.save($scope.markup.type +' set as '+value)
			}
			else if(attr == 'position'){
				$scope.save($scope.markup.type +' moved to '+value)
			}
			else
			{
				$scope.save($scope.markup.type +' changed to '+value)
			}	
		}	
	}

	// toggle a single markup attr-value

	$scope.toggle_attribute= function (attr){
		$scope.markup[attr] = !$scope.markup[attr]
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


     $scope.save = function (save_msg) {

        var thos = this;
        var promise = new Object();
        var data = new Object({
					            'start'			: $scope.markup.start,
					            'end'			: $scope.markup.end,
					            'depth'			: $scope.markup.depth,
					            'status'		: $scope.markup.status
					         });

		if($scope.markup.doc_id_id){
			data.doc_id = $scope.markup.doc_id_id
		}
		// can be null.
		data.secret = $scope.ui.secret;

		// check-forced types_data

		
		data.metadata 	= $scope.markup.objSchemas.modes.editor.fields.metadata.forced ? $scope.markup.objSchemas.modes.editor.fields.metadata.forced : $scope.markup.metadata
		data.position 	= $scope.markup.objSchemas.modes.editor.fields.position.forced ? $scope.markup.objSchemas.modes.editor.fields.position.forced : $scope.markup.position
		data.type       = $scope.markup.objSchemas.modes.editor.fields.type.forced ? $scope.markup.objSchemas.modes.editor.fields.type.forced : $scope.markup.type
		data.subtype 	= $scope.markup.objSchemas.modes.editor.fields.subtype.forced ? $scope.markup.objSchemas.modes.editor.fields.subtype.forced : $scope.markup.subtype
		data.edittype = 'edit_markup'

	    promise.query =  MarkupRest.markup_save({id:$scope.$parent.doc.slug, mid:$scope.markup._id }, serialize(data) ).$promise;
        promise.query.then(function (Result) {
            var edited  = Result.edited[0][0]
            
            if(save_msg){
				$scope.flashmessage(save_msg, 'help' , 3000)
            }
            else{
            	$scope.flashmessage(edited.type +' saved', 'help' , 3000)
            }
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
			$scope.markup.offset_start =  $scope.markup.offset_start+s
			$scope.markup.offset_end =    $scope.markup.offset_end+e

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
		$scope.markup.end 		=  $scope.ui.selected_range.end
		
		$scope.save()
	}

	/**
	* delete a markup on click
	* @function MarkupCtrl#delete_markup
	*/
	$scope.delete = function (){
		if($scope.markup.type=="container" && $scope.sectionstocount == 1){
			$scope.flashmessage('MusicBox can\'t delete last section', 'bad' , 3000)
			return
		}
		else{

				// later re_check
				$scope.markup.deleted = true;
				// instant apply
				$scope.markup.visible = false;

			var promise = MarkupRest.markup_delete( {id:$scope.$parent.doc.slug, mid:$scope.markup._id }).$promise;
			promise.then(function (Result) {
				$scope.flashmessage('Markup deleted', 'ok' , 2000, false)
				// not enough for letter mapping
				
			


			
				// remove markup from reference list
			//	$scope.markups = _.without($scope.markups, $scope.markup)
				
				// retattribute mk's
				$scope.$parent.section.section_classes = ''
								
				console.log($scope.$parent.section)

			//	$scope.$parent.section.objects_ = []
			//	$scope.$parent.init_fulltext($scope.section.start, $scope.section.end)
				$scope.$parent.attribute_objects()

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

		$scope.$watch('markup.isolated', function(oldValue, newValue) {
			if(newValue){
				// alert(newValue)
			}
			

		})

		
		$scope.init__()
}); // end controller
