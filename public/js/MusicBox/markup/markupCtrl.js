


/**
init_()




**/


angular.module('musicBox.markup_controller', ['musicBox.section_controller']).controller('MarkupCtrl', function($scope, $http, MarkupRest,socket,MarkupService) {
	
	$scope.init__= function () {
		//console.log($scope.$parent.section_markups)
					
		console.log('   ---- -- [m] init markup'+$scope.markup.type)



       
		
		
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
       		//'user_options'	 : $scope.apply_object_options('markup_user_options',$scope.markup.user_id.user_options),
			'by_me' 		 : ( $scope.markup.user_id._id && $scope.$parent.userin._id  && ($scope.$parent.userin._id == $scope.markup.user_id._id ) ) ? true : false,
			'can_approve' 	 : ($scope.$parent.doc_owner) ? true : false,
			'objSchemas' 	 : $scope.objSchemas[$scope.markup.type] ?  $scope.objSchemas[$scope.markup.type] : [],
			'servicetype'  	 :'markup'
       

        })      	

		$scope.markup =  _.extend($scope.markup, markup_);


		var _markup = new MarkupService().init($scope.markup)
		$scope.markup.user_options = _markup.apply_object_options('markup_user_options',$scope.markup.user_id.user_options)
		// console.log(_markup.options_array.color.value)
		
		// its own fulltext for section.


		$scope.markup.sectionin = $scope.$parent.section.sectionin
		$scope.markup.fulltext  = $scope.fulltext()
		
  		


  		if($scope.markup.type=='container_class' ){ // or pos == inlined
			$scope.section.section_classes += $scope.markup.metadata+' ';
		}
		     
		$scope.markup.visible = false;
		if($scope.markup.deleted !== true && ($scope.markup.status == 'approved' || $scope.markup.by_me ==true || $scope.markup.can_approve == true) ) {
			//$scope.markup.visible = true;
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

		if($scope.markup.objSchemas && $scope.markup.objSchemas.compute_fulltext === false){
			console.log('NO ft')
			return
		}
		
		
	   var fulltext = '';
       var i_array     =   0;
	   for (var i = $scope.markup.start; i <= $scope.markup.end; i++) {
         	

         	var y = i-$scope.section.start
         	if($scope.doc.content[i]){
         		//console.log(i)

         		fulltext += $scope.section.letters[i].char;
         	}
         	i_array++;

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
 $scope.reverse = function(){

	 	var reverse_text = $scope.fulltext();

	 	console.log($scope.markup)
	 	alert('deleted:'+reverse_text)
	 	alert('matadata:'+$scope.markup.metadata)
	 	alert('loop:'+$scope.markup.start+' >'+parseInt($scope.markup.start+$scope.markup.metadata.length))

	 	// for (var i = $scope.markup.start; i <= $scope.markup.end; i++) {
	 }
	 /*
	$scope.$watch('markup.metadata', function(newValue, oldValue) {
		
	});
	*/

	$scope.$watch('markup.start_or_end', function(  newValue, oldValue) {


      if(oldValue == newValue || newValue == false){
				console.log('mk end redraw')
			}
			else{

        	   $scope.markup.fulltext = $scope.fulltext();
 			   $scope.markup.has_offset = true;
			  
			   if($scope.markup.start < $scope.$parent.section.start){
		    		$scope.markup.start = $scope.$parent.section.start
		       }
		       if($scope.markup.end > $scope.$parent.section.end){
	    		$scope.markup.end = $scope.$parent.section.end
	    	   }



			   $scope.stack_markup()

        	  // $scope.markup.start_or_end = false

        }
		
   

   });	
	
	$scope.$watch('markup.start', function(  newValue, oldValue) {
		
        if(oldValue && newValue && newValue !== oldValue){
      	      
        	   $scope.markup.start_or_end = Math.random()
		}
		
   });	

   $scope.$watch('markup.end', function(oldValue, newValue) {
   
        if(oldValue && newValue && newValue !== oldValue){
			$scope.markup.start_or_end = Math.random()

		}
		
   });

	$scope.stack_markup = function(){
		console.log('stack_markup')

	     $scope.$parent.attribute_objects()
		 $scope.markup.touched = true;


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
			
			$scope.$parent.attribute_objects()
			$scope.stack_markup()
		}
		
      
    });
	
	// used for editing a markup posittion ui.
	// icon click or section select
	$scope.toggle_select_markup = function (event_name){

		///// $scope.$parent.section.objects_ = '';

		if($scope.section.modeletters !== 'single'){
			$scope.section.modeletters = 'single'
		}

		
		if(event_name == 'dblclick'){
				if($scope.doc_owner || $scope.markup.by_me === true){
					$scope.markup.editing = !$scope.markup.editing
				}
				if($scope.markup.by_me === false){
					return
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




		// set or unset range
		if($scope.markup.selected == true){
			$scope.ui.selected_range.start =  $scope.markup.start
			$scope.ui.selected_range.end   =  $scope.markup.end
		}
		else{
			$scope.ui.selected_range.start = null
			$scope.ui.selected_range.end   = null
		}

		// apply its range
		//$scope.$parent.map_letters()
		

    }	

$scope.$watch('markup.fulltext', function(newValue, oldValue) {

		// console.log($scope.markup)
		if(!newValue){
			newValue =  ''
		}
		if(oldValue && newValue && oldValue !== newValue){
			console.log(' [mk] fulltext watched')
		}
});


// used for editing a markup posittion ui.
	// icon click or section select
	
	
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

	    var promise=  MarkupRest.save({id:$scope.$parent.doc.slug, mid:$scope.markup._id }, serialize(data) ).$promise;
        promise.then(function (Result) {
            var edited  = Result.edited[0][0]
            
            if(save_msg){
				$scope.flashmessage(save_msg, 'help' , 3000)
            }
            else{
            	$scope.flashmessage(edited.type +' saved', 'help' , 3000)
            }
          }.bind(this));
          promise.catch(function (response) {  
            console.log(response)   
           	$scope.flashmessage(response.err.err_code, 'bad' , 3000)
          }.bind(this));

      }

     $scope.offset= function (s,e){
     		$scope.markup.start = $scope.markup.start+s
     		$scope.markup.end 	= $scope.markup.end+e
			// touched true
     }

     // apply active selection ranges to a markup then save it.
	

	$scope.match_selection = function (markup){
		// todo: should check notnull / section limits
		$scope.markup.start     =  $scope.ui.selected_range.start
		$scope.markup.end 		=  $scope.ui.selected_range.end
		


		$scope.save()
	}
	$scope.apply_reverse =function(){
	

		console.log($scope.markup)
		//alert($scope.markup.end)


		 for (var i = $scope.markup.start; i <= $scope.markup.end; i++) {
         	// console.log(i)
         	if($scope.section.letters[i]){
         		// $scope.section.letters[i].char = '-';
         		// $scope.doc.content[i] = 'jklj'

         	}
     	}


		

	}
	/**
	* delete a markup on click
	* @function MarkupCtrl#delete_markup
	*/
	$scope.delete = function (){


		var ttft = $scope.get_markups($scope.section.start, $scope.section.end)
		
		console.log('$scope.section_markups.length before'+ttft.length)

			$scope.markup.deleted = true;
			$scope.markup.visible = false;

			var promise = MarkupRest.delete( {id:$scope.$parent.doc.slug, mid:$scope.markup._id}).$promise;
			promise.then(function (Result) {
				
				// not enough for letter mapping
				// remove markup from reference list
				//	$scope.markups = _.without($scope.markups, $scope.markup)
				// retattribute mk's
				$scope.$parent.section.section_classes = ''	
				
				console.log($scope.$parent.section)
				//	$scope.$parent.section.objects_ = []
				//	$scope.$parent.init_fulltext($scope.section.start, $scope.section.end)





				$scope.section.section_markups = $scope.get_markups($scope.section.start, $scope.section.end)
				console.log('$scope.section_markups.length after'+$scope.section.section_markups.length)


				$scope.ui.selected_range.redraw = true;
				$scope.$parent.attribute_objects()



				$scope.flashmessage('Markup deleted', 'ok' , 2000, false)


			}.bind(this));
			promise.catch(function (response) {  
				$scope.flashmessage(response.err, 'bad' , 3000)
			}.bind(this));
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


		// each time range is modified, each markup compare range with its start and end
		// if in range, 
		//	> set markup as selected == true
		//  > each letters dor markup range are set to inrange = true

		$scope.$watch('markup.redraw', function(newValue, oldValue) {
			if(oldValue == newValue || newValue == false){
				console.log('mk end redraw')
			}
			else{
				console.log('############ mk.redraw')

				$scope.markup.fulltext = $scope.fulltext()
				var z, z_real, rtest;
				rtest = ranges_test($scope.ui.selected_range.start,$scope.ui.selected_range.end, $scope.markup.start,$scope.markup.end )
				console.log('rtest:'+rtest+' --- '+$scope.markup.metadata)
				
				// apply range if at least one part of markup is into
				// excerpt for container class

							// dirty string...
							if($scope.markup.type =="container_class"){
								$scope.section.section_classes += $scope.markup.metadata+' ';
							}

				if(rtest !==1 && rtest !==5 && $scope.markup.type !=="container_class"){


					//console.log('rtest select')
					$scope.markup.selected = true;
					$scope.markup.inrange  = true;
					// map the markup
					for (z = $scope.markup.start; z <= $scope.markup.end; z++) {
						z_real = z - $scope.section.start
						if($scope.section.letters[z_real]){
							$scope.section.letters[z_real].inrange = true;


							// direct injection test
							// $scope.section.letters[z_real]['classes'].push($scope.markup.subtype);

						}
						else{
							console.log('no letter for position (array index)'+z_real+'(markup pos:'+z+')')


						}
					}
				}

				// finally
				$scope.markup.redraw= false;

			}
		})

		
		

}); // end controller
