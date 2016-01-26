
angular.module('musicBox.markup.controller', ['musicBox.section']).controller('MarkupCtrl', function($rootScope, $scope, $http, MarkupRest,socket,ObjectService) {
	var _markup;


	
	$scope.init__= function () {
					
		console.log('   ---- -- [m] init markup type: '+$scope.markup.type)

		if(!$scope.$parent.$parent.objSchemas[$scope.markup.type]){
			console.log('no schematype for markup!')
			return false;
		}


		 _markup = new ObjectService().init($scope.markup, 'markup')

		
		// $scope.markup.user_options = _markup.apply_object_options('markup_user')
		// $scope.markup.options_.user = _markup.apply_object_options('markup_user')


		
		// console.log(_markup.options_array.color.value)
		
		// its own fulltext for section.


		// $scope.markup
		//$scope.markup.fulltext  = $scope.fulltext()
		
 

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
       	
		return _markup
		
	}

	$scope.fulltext = function (){

/// broken		_markup.setFulltext();


/*
		if($scope.markup.objSchemas && $scope.markup.objSchemas.compute_fulltext === false){
		//	console.log('NO ft')
			return
		}
		
		
	   var fulltext = '';
       var i_array     =   0;
	   for (var i = $scope.markup.start; i <= $scope.markup.end; i++) {
         	

         	var y = i-$scope.section.start
         	if($scope.doc.content[i] && $scope.section.letters && $scope.section.letters[i]){
         		//console.log(i)

         		fulltext += $scope.section.letters[i].char;
         	}
         	i_array++;

     	}
     	return fulltext;

     	*/
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

	 // broken var reverse_text = _markup.fulltext();

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
				//console.log('mk end redraw')
			}
			else{

        	 
 			 
			   if($scope.markup.start < $scope.$parent.section.start){
		    		$scope.markup.start = $scope.$parent.section.start
		       }


		       if($scope.markup.end > $scope.$parent.section.end){
	    		$scope.markup.end = $scope.$parent.section.end
	    	   }



			   $scope.stack_markup()
			   // broken ::  _markup.setFulltext();

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

	    //// SHOULD ONLY TRIGGER IN "MANUAL" mode...
 	    //  $scope.$parent.attribute_objects()
		 $scope.markup.touched = true;


	}

	$scope.stack_markup_manual = function(){
 	   $scope.$parent.attribute_objects()
	}

     $scope.$watch('markup.type', function( oldValue, newValue) {
        if(oldValue && newValue && newValue !== oldValue){

        	if($scope.objSchemas[newValue]){
        		$scope.markup.objSchemas = $scope.objSchemas[newValue]
        	}
        	else{
        		console.log('try to save to undef type')
        	}
		
			$scope.$parent.attribute_objects()
			$scope.stack_markup()
		}
   });	
  
    $scope.$watch('markup.subtype', function( newValue, oldValue) {
        if(oldValue && newValue && newValue !== oldValue){
      
	       $scope.$parent.attribute_objects()
	       $scope.stack_markup()
	       $scope.save('Markup subtype '+oldValue+' edited to '+newValue)
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
				if($scope.doc.doc_owner || $scope.markup.by_me === true){
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
			$scope.$parent.defocus_containers()

			$scope.$parent.section.focused = 'side_left'

		}
		else if( ($scope.markup.position=="right" || $scope.markup.position=="inline") && $scope.markup.editing){
			$scope.$parent.defocus_containers()
			$scope.$parent.section.focused  = 'side_right'
		}
		else{
			$scope.$parent.defocus_containers()

		}




		// set or unset range
		if($scope.markup.selected == true){
			$rootScope.ui.selected_range.start =  $scope.markup.start
			$rootScope.ui.selected_range.end   =  $scope.markup.end
		}
		else{
			$rootScope.ui.selected_range.start =  $scope.section.start
			$rootScope.ui.selected_range.end   =  $scope.section.end
			// $rootScope.ui.selected_range.start = null
			// $rootScope.ui.selected_range.end   = null
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

     	
      
       
        var data ={
					            'start'			: $scope.markup.start,
					            'end'			: $scope.markup.end,
					            'depth'			: $scope.markup.depth,
					            'status'		: $scope.markup.status,
					            'secret' 		: $rootScope.ui.secret,
					            'doc_id' 		: $scope.markup.doc_id_id ? $scope.markup.doc_id_id : ''
					         };

		if($scope.markup.doc_id_id){
		//	data.
		}
		// can be null.
		
		// check-forced types_data
		data.metadata 	= $scope.markup.objSchemas.modes.editor.fields.metadata.forced ? $scope.markup.objSchemas.modes.editor.fields.metadata.forced : $scope.markup.metadata
		data.position 	= $scope.markup.objSchemas.modes.editor.fields.position.forced ? $scope.markup.objSchemas.modes.editor.fields.position.forced : $scope.markup.position
		data.type       = $scope.markup.objSchemas.modes.editor.fields.type.forced ? $scope.markup.objSchemas.modes.editor.fields.type.forced : $scope.markup.type
		data.subtype 	= $scope.markup.objSchemas.modes.editor.fields.subtype.forced ? $scope.markup.objSchemas.modes.editor.fields.subtype.forced : $scope.markup.subtype
		data.edittype = 'edit_markup'



	    var promise=  MarkupRest.save({id:$scope.$parent.doc.slug, mid:$scope.markup._id }, serialize(data) ).$promise;
        promise.then(function (Result) {
            
            if(save_msg){
				$rootScope.flashmessage(save_msg, 'help' , 3000)
            }
            else{
            	$rootScope.flashmessage(Result.edited[0][0].type +' saved', 'help' , 3000)
            	console.log(Result.edited[0][0])
            }
          }.bind(this));
          promise.catch(function (response) {  
            console.log(response)   
           	$rootScope.flashmessage(response.err.err_code, 'bad' , 3000)
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
		$scope.markup.start     =  $rootScope.ui.selected_range.start
		$scope.markup.end 		=  $rootScope.ui.selected_range.end
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


		

			$scope.markup.deleted = true;
			$scope.markup.visible = false;

			var promise = MarkupRest.delete( {id:$scope.$parent.doc.slug, mid:$scope.markup._id}).$promise;
			promise.then(function (Result) {
				
				$scope.section.redraw = true;
				$rootScope.flashmessage('Markup deleted', 'ok' , 2000, false)


			}.bind(this));
			promise.catch(function (response) {  
				$rootScope.flashmessage(response.err, 'bad' , 3000)
			}.bind(this));
		// toggle
		$rootScope.ui.focus_side = ''

        

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

		
		
	$scope.$watch('markup.map_ranges', function(newValue, oldValue) {
			

			if(newValue && oldValue && newValue !== oldValue ){
				// console.log('############MARKUP TEST map_ranges='+newValue +'=:'+ oldValue)

				
				var z, z_real, rtest;
			
				rtest = ranges_compare('markup', parseInt($rootScope.ui.selected_range.start) ,parseInt($rootScope.ui.selected_range.end) , $scope.markup.start , $scope.markup.end , parseInt($scope.section.start) , parseInt($scope.section.end) )

				///rtest = ranges_test(parseInt($rootScope.ui.selected_range.start),$rootScope.ui.selected_range.end, $scope.markup.start,$scope.markup.end, 'markup' )
			
				$scope.markup.test_map_r = rtest
				//console.log('rtest:'+rtest+' --- '+$scope.markup.metadata)
				
				$scope.markup.selected = false;
				$scope.markup.inrange  = false;
			
				if(rtest.case == 5 || rtest.case == 2 || rtest.case == 10 || rtest.case == 11 ){
					
				
					$scope.markup.selected = true;
					$scope.markup.inrange  = true;
					// map the markup
					
				}
			}
			

				// finally
				

			
		})


	




		// each time range is modified, each markup compare range with its start and end
		// if in range, 
		//	> set markup as selected == true
		//  > each letters dor markup range are set to inrange = true

		$scope.$watch('markup.redraw', function(newValue, oldValue) {
			if(oldValue == newValue || newValue == false){
				// console.log('mk end redraw')
			}
			else{

				// console.log('############ mk.redraw')

				// $scope.markup.fulltext = $scope.fulltext()
				
			

							// dirty string...
						//	if($scope.markup.type =="container_class"){
						//		$scope.section.section_classes += $scope.markup.metadata+' ';
						//	}

				
				// finally
				$scope.markup.redraw= false;

			}
		})

    $scope.$watch('markup.operation.before.state', function(newValue, oldValue) {
		if(newValue && newValue == 'new'){
			 $scope.apply_operation()
		}
		if(newValue && newValue == 'error'){
			$scope.markup.operations.push($scope.markup.operation)
		}
	})
	$scope.apply_operation = function(){
 			 //$scope.markup.operation.after = {}
			 if($scope.markup.operation.before.end){
			 	$scope.markup.end =  parseInt($scope.markup.operation.before.end+$scope.markup.operation.before.end_qty)
				//$scope.markup.operation.after.new_end = $scope.markup.end
			 }
			 if($scope.markup.operation.before.start){
			 	$scope.markup.start = parseInt($scope.markup.operation.before.start+$scope.markup.operation.before.start_qty)
			 	//$scope.markup.operation.after.new_start = $scope.markup.start
			 } 

 			$scope.markup.operation.before.state= 'done'
 			//$scope.markup.operation.after.state= 'done'
			$scope.markup.operations.push($scope.markup.operation)


						 console.log('----------------------- MARKUP OPERATION DONE')

	}

	$scope.reverse_operation = function(){}

	$scope.operations_clear= function(){
		 $scope.markup.operations= []
	}
	

	$scope.init__()

}).controller('MarkupEditorCtrl', function($scope, $http, MarkupRest,socket,ObjectService) {

//alert($scope.section.end)
//alert($scope.markup.end)

})
	
