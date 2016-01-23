'use strict';


/*
		SET base value for section

		GET markups (collection A)
			
			> attribute objects (LAYOUT)
		

		SET FUllTEXT
				> watched in letters directive
					> contruct letters array (base)
						> map classes (ft+ (collection A))

		

		seLEct

		// SAVE / dElEtE



		PUSH Markup
		
		//OPerattions: 	
	

		WATCH: 
			start -> start_or_end
			end   -> start or end

			start or end > stack list


			inrange_markups  : reset inrange for markups 
				> calls markupCTRL 
						-> test range (true | false)


*/



angular.module('musicBox.section.controller', []).controller('SectionCtrl', function($rootScope, $scope, $http, DocumentService, MarkupRest,socket, MarkupService) {

$scope.init_= function (index_) {
	console.log('init_ (section #'+ index_+')')

	/* some variable seting for each container */
	var container_ ={
	
		'sectionin' : index_,
		'selected'  : false,
		'focused'   : '',
		'editing_text': $rootScope.ui.debug ? true : false,
		'modeletters' : $rootScope.ui.debug ? 'single' : 'compiled',
		'section_classes':'', 
        'touched'     : false,
        'objSchemas' : $scope.objSchemas['container'],
        'objSchemas_css': $scope.objSchemas['container_class'],
        'operation': {},
        'operations': [],
        'fulltext' : $scope.init_fulltext($scope.section.start, $scope.section.end),
	}

	// extend this 
	$scope.section = _.extend($scope.section, container_);
	new MarkupService().init($scope.section, 'section')

	/// need for layout 
	$scope.get_markups($scope.section.start, $scope.section.end)

	//$scope.markup.user_options = _markup.apply_object_options('markup_user_options',$scope.markup.user_id.user_options)
	//$scope.section.section_markups_length 	= $scope.section.section_markups.length
	// add to parent scope section count
	// reach letter max test
	if($scope.section.end > $scope.$parent.max_reached_letter){
		$scope.$parent.max_reached_letter = $scope.section.end
	}
	// continous test (prev end match current start)
	/*
	if($rootScope.doc.containers[index-1]){
		var container_prev_end = ($rootScope.containers[index-1].end)+1;
		if(container_prev_end !== container.start){
			console.log('discontinous section found '+container_prev_end+' /vs/'+container.start)
		}
	}
	*/
}


	// contruct temp fulltext, 
	// called at section init only 
	$scope.init_fulltext = function (s,e){
		console.log('init_fulltext (section)')
	    var fulltext = '';
	    var fulltext_block = ''
	    var i_array     =   0;
		for (var i = s; i <= e; i++) {
			// console.log(i)
			if($scope.doc && $scope.doc.content[i]){
				fulltext += $scope.doc.content[i];
				fulltext_block += $scope.doc.content[i];
			}
			else{
				// there is no letter for section !
				fulltext += '-';
				fulltext_block += '-'

			}
		}
		//$scope.section.fulltext = fulltext
		// $scope.section.fulltext__ = fulltext+'llll'
		return fulltext;
		//$scope.compile_fulltext(fulltext_block)

	}
	$scope.attribute_objects = function(){
  			
           var objectsarray = {
				'objects_count' : []

           };
           objectsarray['objects_count']['by_positions'] = [];
           objectsarray['objects_count']['all'] = [];
            // section can have css classes and inlined styles (background-image)
            // $rootScope.containers[index]['classes'] =[];
            // $rootScope.objects_sections[index]['global'] = [];
            _.each($scope.$parent.available_sections_objects, function(o, obj_index){
	              objectsarray['objects_count']['all']						= {'count':0, 'has_object':false}
	             
	              _.each($scope.$parent.available_layouts  , function(op){ // op: left, right, ..
	                objectsarray['objects_count']['by_positions'][op.name] = {'count':0, 'has_object':false}
	              });
            });

		   $scope.section = _.extend($scope.section, objectsarray);    		
  	       
  	       // _.filter($scope.markups, function(m){ return m.start >= $scope.section.start; })
		    _.each($scope.section.section_markups, function(markup){

		    	if(markup.start > markup.end){
		    		var temp =  markup.start
		    		markup.end = markup.start
		    		markup.start = temp
		    	}
		    	
			    if(markup.type !== "" && markup.position){ // > can add it
					$scope.section.objects_count['by_positions'][markup.position].count++;
					$scope.section.objects_count['by_positions'][markup.position].has_object  = true;
				}
		    }); // each markups end.
    		//console.log($scope.section)
	        console.log('SECTION LAYOUT OK (attribute_objects)')
		}


	$scope.get_markups  = function(ss,se){
			var arr_m = []
			_.each($scope.doc.markups, function(m){

					if( !m.deleted && (m.start >= parseInt(ss)) && (m.end <= parseInt(se)) ){
						///m.visible = true
						m.sectionin = $scope.section.sectionin
						m.isolated= 'false'
						arr_m.push(m)
					}
			});
			console.log('get markups> '+ arr_m.length +' markups to map')
			$scope.section.section_markups = arr_m;
			$scope.attribute_objects()
			return arr_m;
	}


	// main filter for markups
	$scope.get_local_markups_by_start_end_position_type  = function(p,t){
			//console.log('markups_by_start_end_position_type (l)')
			var arr_m = []
			_.each($scope.section.section_markups, function(m){
					if( (m.position == p  || p =='any' ) && (m.type == t  || t=='any')  ){
						arr_m.push(m)
					}
			});
			return arr_m;
	}

	// main filter for markups
	$scope.markups_by_start_end_position_type  = function(ss, se , p , t ){
		//console.log('>get local')
		return $scope.get_local_markups_by_start_end_position_type(p,t)
	}



	$scope.delete = function (){
 		var section_count  = _.filter($scope.doc.containers, function(s){ 
 			return s.deleted !==true; 
 		})
 		if(section_count.length==1){
			$rootScope.flashmessage('Can\'t delete last section ', 'bad' , 2000, false)
			return
		}
		
		var promise = MarkupRest.delete( {id:$scope.$parent.doc.slug, mid: $scope.section._id, aid:'delete'}).$promise;
		promise.then(function (Result) {
			
			$scope.section.deleted = true;
			$scope.section.visible = false;
			$rootScope.flashmessage('Section deleted', 'ok' , 2000, false)

		}.bind(this));
		promise.catch(function (response) {  
			$rootScope.flashmessage(response.err, 'bad' , 3000)
		}.bind(this));
		// toggle
		$rootScope.ui.focus_side = ''
	}



	$scope.select_section = function (){

			if(!($scope.doc_owner || $scope.markup.by_me === true)){
				return;
			}
			_.each($scope.doc.containers, function(c, i){

				c.focused  = ''  

				if(c !== $scope.section){
					c.selected 		= false;
					c.editing 		= false;
					c.editing_text 	= false;
				}
				else{
					c.selected 		= !c.selected;
					c.editing 		= !c.editing
					c.editing_text 	= !c.editing_text
					//$rootScope.ui.selected_range.start = parseInt(c.start)
					//$rootScope.ui.selected_range.end = parseInt(c.end)
					$scope.section.modeletters =  'single'
					if(c.selected == true){
						$scope.section.focused  = 'side_right'
					}
					if(c.selected == true){
						$rootScope.render_config.renderAvailable_active =  'editor'	
					}
					else{
						$rootScope.render_config.renderAvailable_active =  'read'
					}
				}
					
			});
			$rootScope.ui.selected_range.start =  $scope.section.start
			$rootScope.ui.selected_range.end   =  $scope.section.end

    }	

	$scope.save = function (save_msg) {

        var data = {
					    'start'			: $scope.section.start,
					    'end'			: $scope.section.end
					};
		// can be null.
		data.secret = $rootScope.ui.secret;
		data.edittype = 'edit_markup'
	    var promise =  MarkupRest.save({id:$scope.$parent.doc.slug, mid:$scope.section._id }, serialize(data) ).$promise;
        promise.then(function (Result) {
            var edited  = Result.edited[0][0]
            if(save_msg){
				$rootScope.flashmessage(save_msg, 'ok' , 3000)
            }
            else{
            	$rootScope.flashmessage(edited.subtype +' saved', 'ok' , 3000)
            }
          }.bind(this));
        promise.catch(function (response) {  
            console.log(response)   
           	$rootScope.flashmessage(response.err.err_code, 'bad' , 3000)
        }.bind(this));
    }

	$scope.apply_operation = function(){

 			 $scope.section.operation.after = {}

			 if( ($scope.section.operation.before.end && $scope.section.operation.before.type == 'offset') ){
			 	$scope.section.end =  parseInt($scope.section.operation.before.end+$scope.section.operation.before.end_qty)
				//$scope.section.operation.after.new_end = $scope.section.end
			 }
			 if( ($scope.section.operation.before.start || $scope.section.operation.before.start == 0) && $scope.section.operation.before.type == 'offset'){
			
			 	$scope.section.start = parseInt($scope.section.operation.before.start)+parseInt($scope.section.operation.before.start_qty)
			    //$scope.section.operation.after.new_start = $scope.section.start
			 }


			 if( $scope.section.operation.before.type == 'push_markup'){
			 			var m = $scope.section.operation.object_
			 			m.deleted = false

						$scope.doc.markups.push(m)
					
						
						$scope.section.redraw = true;
						
					    console.log($rootScope)
						$rootScope.flashmessage($scope.section.operation.object_.type +' inserted', 'ok' , 1400, false)	
			
			 }


 			 $scope.section.operation.before.state= 'done'
 			 $scope.section.operation.after.state= 'done'
			 $scope.section.operations.push($scope.section.operation)
	} 
	$scope.reverse_operation = function(operation){	
			// console.log($scope.section.operation)
			operation.reversable= false;
			alert(operation.grp_log)
	}

	$scope.operations_clear= function(){
		 $scope.section.operations= []
	}

	$scope.apply_ui_inrange_markups = function(){
		if($scope.section.section_markups.length>0){
			 _.each($scope.section.section_markups, function(m, i){
			    // toggle change, call $scope.markup controller watcher
			    m.map_ranges  =  Math.random()
			 })
			console.log('LAYOUT --  SECTION_MARKUP(S) '+$scope.section.section_markups.length+'   REMAPPED INRANGE ')
		}
		else{
			console.log('LAYOUT -- (NONE) SECTION_MARKUP   REMAPPED INRANGE ')
		}	  	
	}

	$scope.$watch('section.operation.before.state', function(newValue, oldValue) {

		if(newValue == 'new'){
			 $scope.apply_operation()

		}
		if(newValue == 'error'){
			$scope.section.operations.push($scope.section.operation)
		}
	})

	$scope.$watch('section.end', function(newValue, oldValue) {
		if(oldValue == newValue){
		}
		else{
			$scope.section.start_or_end = Math.random()
		}
	});

	$scope.$watch('section.start', function(newValue, oldValue) {
		
		if(oldValue && newValue ){
			if(oldValue == newValue){

			}
			else{
				if($scope.section.start < 0 || newValue < 0 || oldValue < 0){
					$scope.section.start = 0;
					//unregister();
					return
				}
			
				//	$scope.section.rebuild = true
				$scope.section.start_or_end = Math.random()
			}
			
		}
	});

	$scope.$watch('section.start_or_end', function(  newValue, oldValue) {
    	if(oldValue == newValue || newValue == false){
			//	console.log(' nothing ')
		}
		else{
				// $scope.section.textlength= $scope.section.end - $scope.section.start
        		$scope.section.touched = true
        }
   	});	
					
	$scope.$watch('section.inrange_markups', function(newValue, oldValue) {
			// remap MARKUP CHILDRENS 
		if(oldValue === newValue || newValue == false){


		}
		else{
			$scope.apply_ui_inrange_markups()

		}
	})

	$scope.$watch('section.redraw', function(newValue, oldValue) {
		if(oldValue === newValue || newValue == false){
		}
		else{
					        $scope.section.section_markups = $scope.get_markups($scope.section.start, $scope.section.end)
				
							//$scope.section.inrange_markups = true;
							// eq
							$scope.apply_ui_inrange_markups()

							// remap classes call watcher
							$scope.section.lettersarray = Math.random()
							$scope.inrange_letters      = Math.random()
			   	            $scope.section.redraw = false;
		}
	})


	/*
	$scope.$watch('section.fulltext', function(newValue, oldValue) {
		// console.log(' [Section] fulltext watched')



		if(!newValue){
			// deleted by user in textarea
			newValue=  ''
			
		}
	   

		else{
			if(oldValue == newValue){
				console.log(' [Section watcher :  fulltext] fulltext same or init value')

			}
			else{
				console.log(' [Section watcher :  fulltext] fulltext change : '+oldValue+' > '+newValue)
			}


		}
	});	
	*/

 
///// TO CLEAN


$scope.merge= function (){
      	alert('merged')
}

$scope.split= function (){


     	//alert($rootScope.ui.selected_range.start+'-'+$rootScope.ui.selected_range.end+' - '+$scope.section.start+' - '+$scope.section.end)
      	

      	if($rootScope.ui.selected_range.start == $rootScope.ui.selected_range.end){
      		alert('split one>two at '+$rootScope.ui.selected_range.start)
      	}


      	var mks = $scope.markups_by_start_end_position_type($rootScope.ui.selected_range.start,$rootScope.ui.selected_range.end, 'any','any')
      	console.log(mks)


      	if($rootScope.ui.selected_range.start == $scope.section.start ){
      	//	alert('start in')
      	
      	}
      	if($rootScope.ui.selected_range.end == $scope.section.end ){
      	//	alert('endin')
      	}
		
		$scope.section.end = $scope.section.end-4
		

		$scope.push.start  		= parseInt($scope.section.end+1)
		$scope.push.end  		= parseInt($scope.section.end+2)
		$scope.push.position  	=  'inline'
		$scope.push.type 		= 'container';
		$scope.push.subtype 	= 'section';	
		$scope.add();


		$scope.push.start  		= parseInt($scope.section.end+3)
		$scope.push.end  		= parseInt($scope.section.end+4)
		$scope.push.position  	=  'inline'
		$scope.push.type 		= 'container';
		$scope.push.subtype 	= 'section';	
		$scope.add();

		$scope.save()
		$scope.init_()

     	// the four in/out points
     	// is first ?
     	// is last ? 
	}


	$scope.integrity_fix = function (){

		//xx$scope.section.fulltext.length)
		//alert($scope.section.end - $scope.section.start - 1)
		if($scope.section.fulltext.length > parseInt($scope.section.end - $scope.section.start)+1){
			$rootScope.flashmessage('size mismatch >', 'bad' , 2000, false)

		}
		if($scope.section.fulltext.length < parseInt($scope.section.end - $scope.section.start)+1){
			$rootScope.flashmessage('size mismatch <', 'bad' , 2000, false)
			$scope.section.end = $scope.section.fulltext.length-1+$scope.section.start

		}
		if($scope.section.fulltext.length == parseInt($scope.section.end - $scope.section.start)+1){
			$rootScope.flashmessage('size match', 'ok' , 2000, false)
		}
	}



	$scope.insert_char = function(c,s,e){
			//alert(c,s,e)
			$scope.section.modeletters = 'single' 
			$scope.section.fulltext= c+''+$scope.section.fulltext
			//for(var p=0,)

			$rootScope.ui.selected_range.start = 4
			// $scope.section.fulltext.length
			$rootScope.ui.selected_range.end = 7
			// $scope.section.fulltext.length

			$scope.section.end++


	}




}); // end controller


/*
angular.module('musicBox.section.controller_b', []).controller('SectionBCtrl', function($scope, $http, DocumentService, MarkupRest,socket, MarkupService) {})
*/
angular.module('musicBox.section.editor_controller', []).controller('SectionEditorCtrl', function($scope, $http, DocumentService, MarkupRest,socket, MarkupService) {

	$scope.section.startt = $scope.section.start
	$scope.$watch('section.start_', function(newValue, oldValue) {
		if(oldValue === newValue || newValue == false){
		}
		else{}
	})
})
