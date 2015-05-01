
angular.module('musicBox.section_controller', []).controller('SectionCtrl', function($scope, $http, DocumentService, MarkupRest) {

// contruct temp fulltext
$scope.to_fulltext = function (s,e){
    var fulltext = '';
    var fulltext_block = ''
    var i_array     =   0;
	   for (var i = s; i <= e; i++) {
         	// console.log(i)
         	if($scope.$parent.doc.content[i]){
         		fulltext += $scope.$parent.doc.content[i];
         		fulltext_block += $scope.$parent.doc.content[i];

         	}
     	}
     	$scope.section.fulltext = fulltext
     	return fulltext;
     	//$scope.compile_fulltext(fulltext_block)

    }

$scope.init_= function () {

	/*
	console.log('init section')
	console.log($scope.section)
	console.log('parent ctrl')
	console.log($scope.$parent)
	console.log('section index'+$scope.$parent.$index)
	*/

	/* some variable seting for each container */
	container_ = new Object({
		'selecting' : -1,
		'sectionin' : $scope.$parent.sectionstocount,
		'isolated'  : false,
		'selected'  : false,
		'focused'   : '',
		'editing_text':false,
		'ready' : 'init',
		'modeletters' : 'compiled',
		'section_classes':'',
		'stack': [],
		'debuggr' : ['init']

	})
	// .. and extend object
	$scope.section = _.extend($scope.section, container_);

	$scope.to_fulltext($scope.section.start, $scope.section.end)
	
	// add to parent scope section count
	$scope.$parent.update_section_count('add')


	// reach letter max test
	if($scope.section.end > $scope.$parent.max_reached_letter){
		$scope.$parent.max_reached_letter = $scope.section.end
	} 



	// continous test (prev end match current start)

	/*
	if($rootScope.containers[index-1]){
	var container_prev_end = ($rootScope.containers[index-1].end)+1;
	if(container_prev_end !== container.start){
	console.log('discontinous section found '+container_prev_end+' /vs/'+container.start)
	}
	}
	*/
}

/*
$scope.sectionmarkups = function(attr, value){
	_.each($scope.$parent.markups, function(m,y){
		if(m.sectionin == $scope.$parent.$index && m.type !=='container'){
			m[attr] = value;
		}
		else{
			m[attr] = !value;
		}            
	})
}
*/
$scope.sections_objects_arrays = function(){
			var objectsarray = new Object();

           objectsarray.section_styles  = '';
           //new Array('objects', 'objects_')
          // objectsarray['objects'] = [];
           objectsarray['objects_'] = [];
 		   objectsarray['objects_'].flat = [];


           objectsarray['objects_count'] = [];
           objectsarray['objects_count']['by_positions'] = [];
           objectsarray['objects_count']['all'] = [];
            // section can have css classes and inlined styles (background-image)
         
            // $rootScope.containers[index]['classes'] =[];
            // $rootScope.objects_sections[index]['global'] = [];
            _.each($scope.$parent.available_sections_objects, function(o, obj_index){
              objectsarray['objects_'][$scope.$parent.available_sections_objects[obj_index]] = [];
              // and each subs objects an array of each positions
              objectsarray['objects_count']['all']= new Object({'count':0, 'has_object':false})
              _.each($scope.$parent.available_layouts  , function(op){ // op: left, right, ..
                objectsarray['objects_count']['by_positions'][op.name] = new Object({'count':0, 'has_object':false})
                objectsarray['objects_'][$scope.$parent.available_sections_objects[obj_index]][op.name] =[];
              });
              // set to "1" for title include.
              // $rootScope.containers[0]['objects_count']['by_positions']['center'].count = 1;
            });

			$scope.section = _.extend($scope.section, objectsarray );
			console.log(objectsarray)

}


$scope.map_letters = function(){
  console.log('map_letters (section)')

 	var fulltext_block = ''

  
	_.each($scope.section.letters, function(l,li){

		if(($scope.$parent.ui.selected_range.start || $scope.$parent.ui.selected_range.start ==0 )  && $scope.$parent.ui.selected_range.end){
			var index_absolute_start =   $scope.$parent.ui.selected_range.start -  $scope.section.start
			var index_absolute_end   =   $scope.$parent.ui.selected_range.end -  $scope.section.start

		}
		
		l.inrange=false;
		if( ($scope.$parent.ui.selected_range.start || $scope.$parent.ui.selected_range.start ==0 ) && $scope.$parent.ui.selected_range.end && li >= index_absolute_start && li <= index_absolute_end ) {
			l.inrange = true;
		}

		if($scope.section.letters[li].char == '&nbsp;'){
			fulltext_block += ' '
		}
		else{
			fulltext_block += $scope.section.letters[li].char;
		}
		

	
	})

	if( $scope.$parent.ui.selected_range.end == $scope.section.end && $scope.section.letters[$scope.section.end-1]) {
			$scope.section.letters[$scope.section.end-1].inrange = true;
		}
	if( $scope.$parent.ui.selected_range.start == $scope.section.start) {
			$scope.section.letters[0].inrange = true;
	}
															
  
  	_.each(Object.keys($scope.section.objects_), function(o,k){
  		//console.log($scope.section.objects_[o])
  		_.each(Object.keys($scope.section.objects_[o]), function(o_,k_){
				if(_.isArray($scope.section.objects_[o][o_]) ){
					_.each( $scope.section.objects_[o][o_] , function(markup,k__){
							

													var loop_start = markup.start 		- $scope.section.start;
													var loop_end   = markup.end 		- $scope.section.start;
													for (var mi = loop_start ; mi <= loop_end;mi++) {




														if($scope.section.letters && $scope.section.letters[mi]){


															

															
															
															if(markup.type == 'container'){

															}
															if(markup.type == 'hyperlink'){
																	console.log('markup.type == hyperlink')
																	console.log(markup)
																	$scope.section.letters[mi].href = markup.metadata
															}
															if(markup.type=='container_class' ){ // or pos == inlined
													  			$scope.section.section_classes += markup.metadata+' ';
															}

															if(markup.type !== 'container'){

																if(_.contains($scope.section.letters[mi].classes,markup.subtype )){

																}else{
																	$scope.section.letters[mi].classes.push(markup.subtype)
																}
																
															}

																//console.log('rm classes')
																//$scope.section.letters[mi].classes = _.without($scope.section.letters[mi].classes,markup.subtype )
																
																	
																///$scope.section.letters[mi].classes.push('muddp')
																//$scope.section.letters[mi].classes.push(markup.type)

															
															
															//$scope.section.letters[mr].classes_array[markup.subtype] = true;
															//$scope.section.letters[mr].char = mr;
														}
													}



					})
					
				}
				else{
				//	
				}
				


  		})


  	})

    

/*

  console.log('letters debug(section)')
  console.log($scope.section.letters)
  		var loop_start = markup.start 	- $scope.section.start;
		var loop_end   = markup.end 		- $scope.section.start;
	
		

		*/
		var out = ''
		var open = false
		var opened = false
		var close = false
		var closed = false

    		for (var i = 0; i < fulltext_block.length; i++) {
				
				

    			



				console.log('prev next i == '+i)
				if($scope.section.letters[i] && $scope.section.letters[i].classes.length > 0 ){
					console.log('has class:')
					  //close = true
					  open = true

					
				}
				else{
							console.log(' has NOT class ')

					}


if($scope.section.letters[i+1] && $scope.section.letters[i+1].classes.length > 0 ){
						console.log('(next) has class ')
						// > close to end of <>___</>*****<>___</>

						 close = true

					
					}
					else{
							console.log('(next) has NOT class ')

					}
					if($scope.section.letters[i-1] && $scope.section.letters[i-1].classes.length > 0 ){
						console.log('has class (prev):')
						 open  = false

					
					}
					else{
							console.log('(prev) has NOT class ')
							// means was open

					}

					if(i==0){
    				console.log('first letter')
    					 open = true
    			}

				if($scope.section.letters[i] && $scope.section.letters[i].classes.length > 0 ){
					console.log($scope.section.letters[i].classes)
					var classes_flat  = 'lt '
					 _.each($scope.section.letters[i].classes, function(c,ci){
						classes_flat += c+' ';
					})
					if($scope.section.letters[i].inrange == true){
						classes_flat += 'inrange '
					}
					if($scope.section.letters[i].href !== ''){
						out += '<span class="'+classes_flat+'"><a href="'+$scope.section.letters[i].href+'">'+fulltext_block[i]+'</a></span>'
					}
					else{
						out += '<span class="'+classes_flat+'">'+fulltext_block[i]+'</span>'

					}
					//console.log($scope.section.letters[i].classes[])
				}
				else{

				
					if(close === true){
					//	out += '</span>';
					//	open = false
					//	opened = true
					}
					
					if(open === true){
					//		out += '<span>';
					}
					out += fulltext_block[i]
				
					
				}

			}

		$scope.section.fulltext_block = out
		//$scope.compile_fulltext(fulltext_block)	

}

$scope.attribute_objects = function(){
  console.log('attribute_objects')

  	$scope.$parent.mapping_pass()
  	$scope.sections_objects_arrays()


    		

    _.each($scope.$parent.markups, function(markup){


    	if( $scope.$parent.ui.selected_range.start && $scope.$parent.ui.selected_range.end && markup.start >= $scope.$parent.ui.selected_range.start && markup.end <= $scope.$parent.ui.selected_range.end) {
			markup.inrange = true;
			markup.selected = true;
		}
		else{
			markup.inrange = false;
			markup.selected = false;
		}
           


        // only for markups which ranges match container
        if(markup.start >= $scope.section.start && markup.end <= $scope.section.end){

        	

	        ///// •¿¿ ///
	        if(markup.type !== "" && markup.position){ // > can add it

				// adding to the global collection
				if(markup.position == 'global'){
					$scope.$parent.objects_sections['global_all'].push(markup)
				}
				
				// add markup to container objects (container::index::type::position) 
				$scope.section.objects_[markup.type][markup.position].push(markup) 
				//$scope.section.objects_.flat.push(markup) 



				if(markup.type !=='container'){
					//temp_letters[mr].classes.push(markup.subtype)
					$scope.section.objects_count['all'].count++;
					$scope.section.objects_count['all'].has_object  = true;
					$scope.section.objects_count['by_positions'][markup.position].count++;
					$scope.section.objects_count['by_positions'][markup.position].has_object  = true;
				}
			}
			
			//   console.log('wraped')
			// console.log(markup)
    	} // if in-range

    }); // each markups end.
	$scope.map_letters()
	// console.log($scope.section.objects_)
}






$scope.$watch('section.fulltext', function(newValue, oldValue) {
	console.log(' [Section] fulltext watched')

	if(oldValue && newValue){
		console.log(' [Section] fulltext change : '+oldValue+'>'+newValue)
		console.log('section fulltext watched with changes: '+oldValue+'>'+newValue)
		var temp_letters = new Array();
		var i;
		var i_array     =   0;
		var fulltext    =   '';
		var str_start   =   0;
		var str_end     =   _.size(newValue);
		// confing could be a option/mode feature
		var content_string  = $scope.$parent.doc.content
		var classes_arr = new Array()
		// classes_arr.h1 = {}
		// classes_arr.h2 = {}
	     var fulltext_block = ''




	    for (i = str_start; i < str_end; i++) {
			var letter_arr = new Object({
			  'classes':[], 
			  'classes_array': '', 
			  'classes_flat': '',
			  'order':i,
			  'inrange':false,
			  'href':'',
			  'absolute_order':$scope.section.start+i,

			});

			
	        	if (newValue[i] === " ") {
	            	letter_arr.char = '&nbsp;'
	            	fulltext_block += ' '
	         	}
	         	else{
	         		letter_arr.char = newValue[i]
	         		fulltext_block += newValue[i]
     	
	         	}

		  	temp_letters[i_array]  = letter_arr;

		  	i_array++;
		}
		$scope.section.letters  = temp_letters;
		$scope.attribute_objects()
		//console.log($scope.section.objects_)
		//$scope.section.end = $scope.section.end+1
		//$scope.section.start = $scope.section.start+1
	}
});	



/*
$scope.$watch('section.start', function(o, markup) {})
$scope.$watch('section.end', function(o, markup) {})
$scope.$watch('section.objects_', function(o, n) {
	console.log('oBJECT SECTION')
},true)

*/

$scope.$watch('section.has_offset', function(o, markup) {

		 	if(markup){
				console.log(markup)
		 		if(!$scope.section.objects_[markup.type]){
					$scope.section.objects_[markup.type] = new Array()
					if(!$scope.section.objects_[markup.type][markup.position]){
						$scope.section.objects_[markup.type][markup.position] = new Array()
					}
				}
				$scope.section.objects_[markup.type][markup.position].push(markup)
console.log('markup pushed')

		 		//$scope.ui.selected_range.insert_applied=true;
		 	} 

});	



$scope.$watch('ui.selected_range', function(o,b,a) {
	console.log('ui.selected_range')
	//console.log(o)
	//console.log(b)
	//console.log(a)
	$scope.attribute_objects()
		 // alert('ds')

},true);	



$scope.push_generic_from_ranges= function (type, subtype, position,metadata){
		$scope.$parent.push.metadata = (metadata) ? metadata : '-'
		$scope.$parent.push.type = (type) ? type : 'comment';
		$scope.$parent.push.subtype = (subtype) ? subtype : 'comment';
		$scope.$parent.push.position = (position) ? position : 'left';
		$scope.$parent.push.sectionin = $scope.section.sectionin
		$scope.add();
	}
	// short function to push a comment

$scope.add= function (){
		// sure to set up

/*
		if($scope.$parent.ui.selected_range.start && !$scope.$parent.push.start){
			$scope.$parent.push.start   = $scope.$parent.ui.selected_range.start
		}
		else{
			$scope.$parent.push.start 		= 0
		}
	

	if($scope.$parent.ui.selected_range.end && !$scope.$parent.push.end){
		$scope.$parent.push.end   = $scope.$parent.ui.selected_range.end
	}
	else{
		$scope.$parent.push.end   = 1

	}
	*/
		if(!$scope.$parent.push.start)	{	$scope.$parent.push.start	= $scope.$parent.ui.selected_range.start	}
		if(!$scope.$parent.push.end)	{	$scope.$parent.push.end	    = $scope.$parent.ui.selected_range.end	}


		if(!$scope.$parent.push.position)	{	$scope.$parent.push.position 	= 'left'	}
		if(!$scope.$parent.push.type)		{	$scope.$parent.push.type 		= 'comment' }
		if(!$scope.$parent.push.subtype)	{	$scope.$parent.push.subtype 	= 'comment'	}
		if(!$scope.$parent.push.metadata)	{	$scope.$parent.push.metadata	= '-' 		}
		if(!$scope.$parent.push.status)		{	$scope.$parent.push.status		= 'approved' }
		if(!$scope.$parent.push.depth)		{	$scope.$parent.push.depth 		= 1 }
		if(!$scope.$parent.push.doc_id_id)	{	$scope.$parent.push.doc_id_id 	= 'null'	}
		
		// force autoset / force-correct
		if($scope.$parent.push.type == "markup" || $scope.$parent.push.type == "container" || $scope.$parent.push.type == "container_class" ){ 
			$scope.$parent.push.position = 'inline'
		}

		

	
        var promise = new Object();
        var data = new Object($scope.$parent.push);



        data.username = $scope.userin.username;
        data.user_id = $scope.userin._id;
        promise.data = serialize(data);

        console.log('ready to push')
        console.log(promise.data)
        var thos = this;
        // this.Markup_pre();

        promise.query = MarkupRest.markup_push( {Id:$scope.$parent.doc.slug},promise.data).$promise;
        promise.query.then(function (Result) {
				if(Result.inserted[0]){
					var mi = Result.inserted[0]


					$scope.$parent.markups.push(mi)
					
					//console.log(mi)
            	    $scope.flashmessage(mi.type +' inserted', 'ok' , 1400, false)
					
					$scope.close_pusher()

            	    if(!$scope.section.objects_){
            	    	$scope.section.objects_ = new Array()	
            	    }
					if(!$scope.section.objects_[mi.type] || !$scope.section.objects_[mi.type][mi.position] ){
						if(!$scope.section.objects_[mi.type]){
								console.log('no old array type')
								$scope.section.objects_[mi.type] = new Array()						
						}
						if(!$scope.section.objects_[mi.type][mi.position] ){
							console.log('no old array type')
							$scope.section.objects_[mi.type][mi.position] = new Array()
						}
					}
					
					$scope.section['objects_count']['by_positions'][mi.position].count++



					$scope.section.objects_[mi.type][mi.position].push(mi)
					console.log($scope.section.objects_)

					if(mi.type== 'container'){
						console.log('need to refresh container orders')
					}
					$scope.attribute_objects()
				}
        		else{
        			alert('err')
        		}
			// $scope.$parent.push = new Object()
	    }.bind(this));
        promise.query.catch(function(response) {  
           console.log(response)   
        }.bind(this));
	}

$scope.save_section= function (){}


// short function to push a section
	$scope.new_section= function (){
		$scope.fulltext  = $scope.fulltext+'-'
		var string  = '';
                _.each($scope.$parent.containers, function(container){
                    string  += container.fulltext;
                    console.log(container.fulltext)

                })



            $scope.doc.content = string;


			
					$scope.sync_queue()

		$scope.push.start  = $scope.section.end+1
		$scope.push.end  =   $scope.section.end+1
		$scope.push.position  =   'inline'
		$scope.push.type = 'container';
		$scope.push.subtype = 'section';	
		$scope.add();	
	}

	$scope.defocus = function (){

		  _.each($scope.$parent.containers, function(container){
            	container.focused  = ''          
		  })
	}


	


	$scope.close_pusher = function (){
		 $scope.defocus()
		$scope.$parent.ui.focus_side 				= ''
		$scope.$parent.ui.menus.push_comment.open 	= -1
		$scope.$parent.push.metadata 				= '';
		$scope.$parent.push.start 					=	null;
		$scope.$parent.push.end 					=	null;

	}

	// open close the pusher box.
	$scope.open_pusher = function (){
		
		$scope.defocus()
		
		if($scope.$parent.ui.menus.push_comment.open == $scope.$parent.$index){
			$scope.$parent.ui.menus.push_comment.open =-1
		}
		else{
			$scope.$parent.ui.menus.push_comment.open = $scope.$parent.$index
			$scope.section.focused  = 'side_left'
		}
		

	
		if(!$scope.push.type){
			$scope.push.type = 'comment'
		}
		if(!$scope.push.subtype){
			$scope.push.subtype = 'comment'
		}	
		if(!$scope.push.position){
			$scope.push.position = 'under'
		}
		
		
		$scope.section.modeletters = 'single'

		return
	}

	$scope.section_markups = new Object({'all':0, 'visible':0});

	$scope.update_markup_section_count = function(direction){
		if(direction=='add'){
			$scope.section_markups.visible++;
			$scope.section_markups.all++;

		}
		else{
			$scope.section_markups.visible--;
			$scope.section_markups.all--;

		}
	}

	$scope.init_()
	

}); // end controller

















/*
$scope.$watch('section.cursor_at', function(oldValue, newValue) {



	if(oldValue){

	
			if($scope.section.letters && $scope.section.letters[oldValue]){
					_.each($scope.section.letters, function(letter,y){
						if(letter.classes){
												    letter.classes = _.without(letter.classes, 'cursor_at')

						}
					                
		            })
					
			}



		 	//if(oldValue !==newValue ){
		 		if(oldValue && newValue && $scope.section.letters && $scope.section.letters[newValue])
		 			{
		 			///	$scope.flashmessage('section.cursor_at '+newValue, 'help',2000, true )

		 				if($scope.section.letters[newValue].classes){
		 						$scope.section.letters[newValue].classes.push('cursor_at')
console.log('section.cursor_at'+newValue+' was'+oldValue)

		 				}
		 			

		 		//		alert(oldValue)

		 			}
		 			
		 		

				// $scope.section.fulltext = $scope.section.fulltext.replace("\n", "")
 				var string  = '';
                _.each($scope.$parent.containers, function(container){
                    string  += container.fulltext;
                    console.log(container.fulltext)

                })



            $scope.doc.content = string;


			if( $scope.ui.selected_range.insert_direction == 'save'){
					$scope.sync_queue()

			}
					
					//$scope.section.letters[$scope.ui.selected_range.insert].classes.push('h1')
					
		//	}

	}
})
*/

/*

*/
/*

$scope.distribute_arrays = function(){
	 //console.log($scope.section.objects_)
	 $scope.section.objects_  = _.groupBy($scope.section.objects_, function(item){return item.position;});
        _.each( $scope.section.objects_, function(value, key, list) {
       	 list[key] = _.groupBy(value, function(item){return item.type;});
   	 }); 
}

*/




/*

*/