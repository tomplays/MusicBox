


/*

triggers / callback


			attribute_objects()->map_letters->



*/




angular.module('musicBox.section_controller', []).controller('SectionCtrl', function($scope, $http, DocumentService, MarkupRest,socket, MarkupService) {




$scope.init_= function () {
	  console.log('init_ (section)')

	console.log()
	/* some variable seting for each container */
	container_ = new Object({
		'selecting' : -1,
		'sectionin' : $scope.$parent.sectionstocount,
		'isolated'  : true,
		'selected'  : false,
		'focused'   : '',
		'editing_text': $scope.ui.debug ? true : false,
		'ready' : 'init',
		'modeletters' : $scope.ui.debug ? 'single' : 'compiled',
		'section_classes':'', 
		'stack': [],
		'rebuild' : false,
		'rebuild_count' : 0, 
		'textlength': 9,
		'objects_count': '0',
		'debuggr' : ['init'],
        'has_offset'     : false,
        'touched'     : false,
        'keepsync'     : true,
        'objSchemas' 	 :   $scope.objSchemas['container'] ?  $scope.objSchemas['container'] : [],
        'objSchemas_css' 	 : $scope.objSchemas['container_class'] ?  $scope.objSchemas['container_class'] : [],
        'servicetype'  	 :'section'

	
	})

	// .. and extend object
	$scope.section = _.extend($scope.section, container_);


	var _section = new MarkupService().init($scope.section)
	//	$scope.markup.user_options = _markup.apply_object_options('markup_user_options',$scope.markup.user_id.user_options)


	$scope.section.section_markups 			= $scope.get_markups($scope.section.start, $scope.section.end)
	$scope.section.section_markups_length 	= $scope.section.section_markups.length



	$scope.init_fulltext($scope.section.start, $scope.section.end)
	
	// add to parent scope section count
	//$scope.$parent.update_section_count('add')


	// reach letter max test
	if($scope.section.end > $scope.$parent.max_reached_letter){
		$scope.$parent.max_reached_letter = $scope.section.end
	}



	
	console.log('$scope.section')


	console.log($scope.section)

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
	$scope.section.fulltext = fulltext
	return fulltext;
	//$scope.compile_fulltext(fulltext_block)

}


$scope.get_markups  = function(ss,se){
		var arr_m = []
		_.each($scope.markups, function(m){
				if( m.deleted !== true && (m.start >= parseInt(ss)) && (m.end <= parseInt(se)) ){
					///m.visible = true
					arr_m.push(m)
				}
		});
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
	/*
		
		console.log('markups_by_start_end_position_type'+ss+se+p+t)

		var arr_m = []
		_.each($scope.section_markups, function(m){
				if( (!m.deleted) && (m.position == p  || p =='any' ) && (m.type == t  || t=='any') && (m.start >= parseInt(ss) || ss == 'any') && (m.end <= parseInt(se) || se =='any' ) ){
					///m.visible = true
					arr_m.push(m)
				}
		});

		
		return arr_m;
		*/
}





$scope.map_letters = function(){
  console.log('map_letters (section)')

 	var fulltext_block = ''

 	if(!$scope.section.letters){
 		//$scope.section.letters = []
 	}

  
	_.each($scope.section.letters, function(l,li){

		l.classes = []
		l.classes_array = ''


		var li_real = li+parseInt($scope.section.start)

		if(li==0){

			$scope.section.letters[li].classes.push('isfirst-section')
			$scope.section.letters[li].isfirst = true

		}
		if(li == $scope.section.letters.length-1){
			$scope.section.letters[li].classes.push('islast-section')
			$scope.section.letters[li].islast = true
		}

//console.log(l)
//console.log($scope.section.letters[li])
       

		//if(($scope.$parent.ui.selected_range.start || $scope.$parent.ui.selected_range.start ==0 )  && $scope.$parent.ui.selected_range.end){
			var index_absolute_start =   $scope.ui.selected_range.start -  parseInt($scope.section.start)
			var index_absolute_end   =   $scope.ui.selected_range.end 	-  parseInt($scope.section.start)

		//}

		l.inrange=false;
		//	console.log(li , index_absolute_start ,index_absolute_end)

		if( 
			//($scope.$parent.ui.selected_range.start || $scope.$parent.ui.selected_range.start == 0 ) 
			//&& 
			//($scope.$parent.ui.selected_range.end || $scope.$parent.ui.selected_range.end ==0) 
			//&& 

			li == index_absolute_start || (li > index_absolute_start && li <= index_absolute_end )  ){

			//console.log('true at '+li+' LR; '+li_real )
			//( (li > index_absolute_start && li < index_absolute_end) ||  li == index_absolute_end ||  li == index_absolute_start) ) {
			l.inrange = true;
		}



		


		if($scope.section.letters[li].char == '&nbsp;'){
			fulltext_block += ' '
		}
		else{
			fulltext_block += $scope.section.letters[li].char;
		}
		

	
	})

	if( $scope.$parent.ui.selected_range.end == $scope.section.end && $scope.section.letters[$scope.section.end]) {
			$scope.section.letters[$scope.section.end].inrange = true;
		}
	if( $scope.$parent.ui.selected_range.start == $scope.section.start) {
			$scope.section.letters[0].inrange = true;
	}


	if( $scope.$parent.ui.selected_range.start == $scope.section.end) {
		if($scope.section.letters[$scope.section.end]){

			$scope.section.letters[$scope.section.end].inrange = true;
		}
		else{
			//// alert('??')
		}
	}
	


	var s_markups  = $scope.section.section_markups
	// $scope.markups_by_start_end_position_type($scope.section.start, $scope.section.end, 'any', 'any')
  	
  	_.each(s_markups, function(markup,k){
  			var m_objSchemas = $scope.$parent.objSchemas[markup.type]

  			var loop_start = parseInt(markup.start) - parseInt($scope.section.start);
			var loop_end   = markup.end 		- $scope.section.start;
												

			if(markup.type=='container_class' ){ // or pos == inlined
				//$scope.section.section_classes += markup.metadata+' ';
			}


			if(!$scope.section.letters[loop_start]){
				alert('test suite no start letter')
			}
			if(!$scope.section.letters[loop_end]){


				//alert('test suite no end letter')
			}
			
			for (var mi = loop_start ; mi <= loop_end;mi++) {


			
				if($scope.section.letters && $scope.section.letters[mi]){


						if(mi ==  loop_start){
							$scope.section.letters[mi].classes.push('isfirst-range')
						}
						if(mi ==  loop_end){
							$scope.section.letters[mi].classes.push('islast-range')
						}

						

						if(markup.type == 'datavalue'){
							$scope.section.letters[mi].classes.push(markup.subtype)
							$scope.section.letters[mi].classes.push(markup.type)

						}
						if(markup.type == 'hyperlink' && markup.metadata){
								console.log('markup.type == hyperlink')
								console.log(markup)
								$scope.section.letters[mi].href = markup.metadata
						}
						
						if(m_objSchemas.map_range === true){
							if(markup.deleted || _.contains($scope.section.letters[mi].classes, markup.subtype )){

							}
							else{
								$scope.section.letters[mi].classes.push(markup.subtype)	
							}
							
						}
				}
			}

  	})




		if($scope.section.modeletters == 'compiled'){
			var out = ''
			$scope.section.fulltext_block = $scope.compile_html(fulltext_block)
			console.log(' block html compiled')
		}
		else{
			console.log('use less compile')
		}

}


// transform a string into a rich "classic html" markup string
// used only at page load, because after click, text is transformed into 'single' letters directives

$scope.compile_html = function(fulltext_block ){
	var out = ''

	for (var i = 0; i < fulltext_block.length; i++) {
					
					

	    			var  prev_class = current_class = next_class  = false;
	    			

	    			/*if($scope.section.letters[i].inrange === true){
						 _.isArray(current_class) ? current_class.push('inrange') : current_class = new Array('inrange')
					}

						if(i==0){
									//		 _.isArray(current_class) ? current_class.push('iss') : current_class = new Array('iss')


						}

						if(i+1 == $scope.section.letters.length ){
																	 _.isArray(current_class) ? current_class.push('issd') : current_class = new Array('issd')

					///	current_class.push('is_last')

						}
						*/
					//console.log('prev next i == '+i)
					if($scope.section.letters[i] && ($scope.section.letters[i].classes.length > 0 ) ){
						current = true	
					//	if(_.isArray())
					//	current_class.push($scope.section.letters[i].classes) : current_class = new Array($scope.section.letters[i].classes)
						
						//if($scope.section.letters[i].href !== '')
						current_class = $scope.section.letters[i].classes


						//current_class.push()


					}
					

					if( $scope.section.letters[i+1] && $scope.section.letters[i+1].classes.length > 0 ){
						 next = true;
						 next_class = $scope.section.letters[i+1].classes;
					}
					
					if($scope.section.letters[i-1] && $scope.section.letters[i-1].classes.length > 0 ){
						 prev = true
						 prev_class = $scope.section.letters[i-1].classes
					}


					
					


					// case letter as at least one class
					if(_.isArray(current_class)){
						//console.log($scope.section.letters[i].classes)
						

						// add to array before compare
						

						// default class
						var classes_flat  = 'lt '
						// flatten 
						 _.each(current_class, function(c,ci){
							classes_flat += c+' ';
						})

						
						var inside = ''
						if($scope.section.letters[i].char == ' '){
							fulltext_block[i] = '&nbsp;'
						}
						if($scope.section.letters[i].href !== ''){


							//inside = '<a href="'+$scope.section.letters[i].href+'">'+fulltext_block[i]+'</a>'
							
							if($scope.section.letters[i-1] && $scope.section.letters[i-1].href !== ''){
								inside += fulltext_block[i]
							}
							else{
								inside += '<a title="hyperlink to '+$scope.section.letters[i].href+'" target="_blank" href="'+$scope.section.letters[i].href+'">'+fulltext_block[i]
							}


							if($scope.section.letters[i+1] && $scope.section.letters[i+1].href == ''){
								inside +='</a>'
							}
							else{
								
							}


						}
						else{
							 inside = fulltext_block[i]

						}

						if(  _.isEqual(prev_class , current_class))  {
							out += inside

						}
						else{
							out += '<span class="'+classes_flat+'">'+inside

						}
						if(_.isArray(next_class) && _.isEqual(next_class , current_class) ) {
						
						}
						else{
							out += '</span>'

						}


						//out += '<span class="'+classes_flat+'">'+inside+'</span>'

						
						//console.log($scope.section.letters[i].classes[])
					}

					// case letter has no classes
					else{
						

						if(_.isArray(prev_class) || i==0 ){
							// prev was a self closing letter or first letter then open span
							out +='<span>'
						}
						
						out += fulltext_block[i]
						
						if(_.isArray(next_class) || i+1 == $scope.section.letters.length){
							// next is a letter or is last letter then close span
							out +='</span>'
						}
				
					}

				}
	return out
}
 $scope.section.section_classes = ''





$scope.attribute_objects = function(){
  			console.log('attribute_objects')


  		   $scope.$parent.mapping_pass()
           var objectsarray = new Object();

          

           objectsarray['objects_count'] = [];
           objectsarray['objects_count']['by_positions'] = [];
           objectsarray['objects_count']['all'] = [];
            // section can have css classes and inlined styles (background-image)
         
            // $rootScope.containers[index]['classes'] =[];
            // $rootScope.objects_sections[index]['global'] = [];
            _.each($scope.$parent.available_sections_objects, function(o, obj_index){
              objectsarray['objects_count']['all']= new Object({'count':0, 'has_object':false})
             
              _.each($scope.$parent.available_layouts  , function(op){ // op: left, right, ..
                objectsarray['objects_count']['by_positions'][op.name] = new Object({'count':0, 'has_object':false})
              });
            

            });

			$scope.section = _.extend($scope.section, objectsarray );
			

    		
  	       var mkr = $scope.section.section_markups

  	       // _.filter($scope.markups, function(m){ return m.start >= $scope.section.start; })
		    


		    _.each(mkr, function(markup){

		    	if(markup.start > markup.end){
		    		var temp =  markup.start
		    		markup.end = markup.start
		    		markup.start = temp
		    	}

		    	// if( $scope.$parent.ui.selected_range.start && $scope.$parent.ui.selected_range.end && markup.start >= $scope.$parent.ui.selected_range.start && markup.end <= $scope.$parent.ui.selected_range.end) {
				//	markup.inrange = true;
				//	markup.selected = true;
				// }
				// else{
				//	markup.inrange = false;
				//	markup.selected = false;
				//}
		        // only for markups which ranges match container

		        if(  markup.start >= $scope.section.start && markup.end <= $scope.section.end){

		        	markup.isolated= 'false'

			        /////  ///
			        if(markup.type !== "" && markup.position){ // > can add it
						$scope.section.objects_count['by_positions'][markup.position].count++;
						$scope.section.objects_count['by_positions'][markup.position].has_object  = true;
					
					}
		    	} // if in-range
		    	

		    }); // each markups end.
console.log($scope.section)
	$scope.map_letters()
}






$scope.$watch('section.fulltext', function(newValue, oldValue) {
	console.log(' [Section] fulltext watched')



	if(!newValue){
		// deleted by user in textarea
		newValue=  ''
	}
	if(oldValue && newValue){


		if(oldValue == newValue){
			console.log(' [Section] fulltext same value')

		}
		else{
			console.log(' [Section] fulltext change : '+oldValue+' > '+newValue)
		}

		

		
		

		// a way to detect multiple chars paste or deletions   (not in angular bindings)

		// delta is sup or inf from 1
		if(oldValue.length - newValue.length > 1){
			//alert('A' + (oldValue.length - newValue.length))
			//$scope.section.end = newValue.length
		}
		if(oldValue.length - newValue.length  < -1){
			//$scope.section.end = newValue.length
			//alert('B' + (oldValue.length - newValue.length))
		}
	


		//newValue = newValue.replace("\n", "");
		var temp_letters = new Array();
		var i;
		var i_array     =   0;
		var fulltext    =   '';
		var str_start   =   0;
		var str_end     =   _.size(newValue)-1;
		// confing could be a option/mode feature
		var content_string  = $scope.doc.content
		var classes_arr = new Array()
		// classes_arr.h1 = {}
		// classes_arr.h2 = {}
	     var fulltext_block = ''



	    var at_least_one = false



		//alert(str_end)
	    for (i = str_start; i <= str_end; i++) {

	    	
			var letter_arr = new Object({
			
			  'classes_flat': '',
			  'order': i,
			  'inrange':false,
			  'href':'',
			  'absolute_order': $scope.section.start+i,

			});
				    	///console.log(letter_arr)


				if(!newValue[i]){
					
				}
				else{
					at_least_one = true
					if(newValue[i] === " ") {

	            		letter_arr.char = '&nbsp;'
	            		fulltext_block += ' '
	         		}
	         		else{
	         			letter_arr.char = newValue[i]
	         			fulltext_block += newValue[i]
	         		}

				}


	        	
				letter_arr.isfirst = false
				letter_arr.islast = false
	         	if(str_start == i)
				{
				//	letter_arr.char = '>'+letter_arr.char 
					letter_arr.isfirst = true
				}

				if(i == str_end)
				{
					//letter_arr.char += '<'
				
					letter_arr.islast = true
				}

		  	temp_letters[i_array]  = letter_arr;

		  	i_array++;
		}
		

		if( at_least_one === false){
			alert('no letter ')
		}



		$scope.section.letters  = temp_letters;
		$scope.attribute_objects()
		




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
			
		 	if(o && markup){
				console.log(markup)
				console.log('section.has_offset'+o+markup)
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



	$scope.delete = function (){
 		var section_count  = _.filter($scope.containers, function(s){ 
 			return s.deleted !==true; 
 		})
 		if(section_count.length==1){
			$scope.flashmessage('Can\'t delete last section ', 'bad' , 2000, false)
			return
		}
		
		var promise = MarkupRest.delete( {id:$scope.$parent.doc.slug, mid: $scope.section._id, aid:'delete'}).$promise;
		promise.then(function (Result) {
			
			$scope.section.deleted = true;
			$scope.section.visible = false;
			$scope.flashmessage('Section deleted', 'ok' , 2000, false)

		}.bind(this));
		promise.catch(function (response) {  
			$scope.flashmessage(response.err, 'bad' , 3000)
		}.bind(this));
		// toggle
		$scope.ui.focus_side = ''
	}



	$scope.select_section = function (){

			if(!($scope.doc_owner || $scope.markup.by_me === true)){
				return;
			}
			_.each($scope.containers, function(c, i){

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
					//$scope.ui.selected_range.start = parseInt(c.start)
					//$scope.ui.selected_range.end = parseInt(c.end)
					$scope.section.modeletters =  'single'
					if(c.selected == true){
						$scope.section.focused  = 'side_right'
					}
					if(c.selected == true){
						$scope.ui.renderAvailable_active =  'editor'	
					}
					else{
						$scope.ui.renderAvailable_active =  'read'
					}
				}
			});

    }	


$scope.push_generic_from_ranges= function (type, subtype, position,metadata){
		$scope.$parent.push.metadata = (metadata) ? metadata : ''
		$scope.$parent.push.type = (type) ? type : 'comment';
		$scope.$parent.push.subtype = (subtype) ? subtype : 'comment';
		$scope.$parent.push.position = (position) ? position : 'left';
		$scope.$parent.push.sectionin = $scope.section.sectionin
		$scope.add();
	}
	// short function to push a comment

$scope.add= function (){
	
		if(!$scope.$parent.push.start)	{	$scope.$parent.push.start	= parseInt($scope.$parent.ui.selected_range.start)  	}
		if(!$scope.$parent.push.end)	{	$scope.$parent.push.end	    = parseInt($scope.$parent.ui.selected_range.end)	}


		if(!$scope.$parent.push.position)	{	$scope.$parent.push.position 	= 'left'	}
		if(!$scope.$parent.push.type)		{	$scope.$parent.push.type 		= 'comment' }
		if(!$scope.$parent.push.subtype)	{	

				if($scope.$parent.push.type == "media" ){ 
					$scope.$parent.push.subtype = 'img'
				}
				else if($scope.$parent.push.type == "link" ){ 
					$scope.$parent.push.subtype = 'hyperlink'
				}
				else{
					$scope.$parent.push.subtype 	= 'comment'	

				}	
			

		}
		if(!$scope.$parent.push.metadata)	{	

			
				if($scope.$parent.push.type == "media" ){ 
					$scope.$parent.push.metadata = root_url+':'+PORT+'/img/lorem/400-400.jpg'
				}
				else if($scope.$parent.push.type == "link" ){ 
					$scope.$parent.push.metadata = root_url+':'+PORT
				}
				else{
					$scope.$parent.push.metadata	= '' 

				}		


		}
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

        promise.query = MarkupRest.new({Id:$scope.$parent.doc.slug},promise.data).$promise;
        promise.query.then(function (Result) {
				if(Result.inserted[0]){
					var mi = Result.inserted[0]
				
					if(mi.type== 'container'){
						$scope.$parent.containers.push(mi)
					}
					else{
						$scope.markups.push(mi)
					}
					//console.log(mi)
            	    $scope.flashmessage(mi.type +' inserted', 'ok' , 1400, false)
					$scope.close_pusher()
					


					$scope.section.section_markups = $scope.get_markups($scope.section.start, $scope.section.end)
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



	// short function to push a section
	$scope.new_section= function (){
		// $scope.section.fulltext  = $scope.section.fulltext
		var string  = '';
        _.each($scope.$parent.containers, function(container){
            string  += container.fulltext;
        })
		$scope.doc.content = string+'Your text'
		$scope.sync_queue()
			

		$scope.push.start  		= parseInt($scope.section.end+1)
		$scope.push.end  		= parseInt($scope.section.end+9)
		$scope.push.position  	=  'inline'
		$scope.push.type 		= 'container';
		$scope.push.subtype 	= 'section';	
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
	

	////$scope.section_markups = new Object({'all':0, 'visible':0});

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


	$scope.insert_char = function(c,s,e){
			//alert(c,s,e)
			$scope.section.modeletters = 'single' 
			$scope.section.fulltext= c+''+$scope.section.fulltext
			//for(var p=0,)

			$scope.ui.selected_range.start = 4
			// $scope.section.fulltext.length
			$scope.ui.selected_range.end = 7
			// $scope.section.fulltext.length

			$scope.section.end++


	}
	 $scope.save = function (save_msg) {

        var thos = this;
        var promise = new Object();
        var data = new Object({
					            'start'			: $scope.section.start,
					            'end'			: $scope.section.end
					         });

		// can be null.
		data.secret = $scope.ui.secret;
		data.edittype = 'edit_markup'

	    promise.query =  MarkupRest.save({id:$scope.$parent.doc.slug, mid:$scope.section._id }, serialize(data) ).$promise;
        promise.query.then(function (Result) {
            var edited  = Result.edited[0][0]
            
            if(save_msg){
				$scope.flashmessage(save_msg, 'ok' , 3000)
            }
            else{
            	$scope.flashmessage(edited.subtype +' saved', 'ok' , 3000)
            }
          }.bind(this));
          promise.query.catch(function (response) {  
            console.log(response)   
           	$scope.flashmessage(response.err.err_code, 'bad' , 3000)
          }.bind(this));

      }

$scope.merge= function (){
      	alert('merged')
		}

     $scope.split= function (){


     	//alert($scope.ui.selected_range.start+'-'+$scope.ui.selected_range.end+' - '+$scope.section.start+' - '+$scope.section.end)
      	

      	if($scope.ui.selected_range.start == $scope.ui.selected_range.end){
      		alert('split one>two at '+$scope.ui.selected_range.start)
      	}


      	var mks = $scope.markups_by_start_end_position_type($scope.ui.selected_range.start,$scope.ui.selected_range.end, 'any','any')
      	console.log(mks)


      	if($scope.ui.selected_range.start == $scope.section.start ){
      	//	alert('start in')
      	
      	}
      	if($scope.ui.selected_range.end == $scope.section.end ){
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
				console.log('section.start')
				console.log(oldValue+'->-'+newValue)
				$scope.section.textlength= $scope.section.end - $scope.section.start

			//	$scope.section.rebuild = true
				$scope.section.touched = true

			}
			
		}
	});

	
	
	$scope.$watch('section.end', function(newValue, oldValue) {
		
			if(oldValue == newValue){

			}
			else{
				console.log('section.e')
				console.log(newValue)
				$scope.section.textlength= $scope.section.end - $scope.section.start
				//$scope.section.fulltext = $scope.section.fulltext+'-'

			//	$scope.section.rebuild = true;
				$scope.section.touched = true
			}

	});
/*
	$scope.$watch('section.objects_count.all', function(newValue, oldValue) {
		
			if(oldValue == newValue){

			}
			else{
				console.log('section.objects_count.all')
				console.log(newValue)
				

				//$scope.section.rebuild = true;
			}

	});
*/
	/*
	$scope.$watch('section.textlength', function(newValue, oldValue) {
		
		if(oldValue && newValue ){
			if(oldValue == newValue){

			}
			else{
				console.log('section.textlength')
				console.log(oldValue+'->-'+newValue)
				$scope.section.rebuild = true;
			//	alert('textlength')
			}
			
			
		}
	});
*/

	$scope.$watch('section.redraw', function(newValue, oldValue) {
	if(oldValue == newValue || newValue == false){


	}else{
		console.log('############ section.redraw')
			     _.each($scope.section.letters, function(l, i){
						l.inrange = false;
						l.inselection = false;

				})

				// map the range			
				for (var j = $scope.ui.selected_range.start; j <= $scope.ui.selected_range.end; j++) {
					
					j_real = j - $scope.section.start;
					if($scope.section.letters[j_real]){
						$scope.section.letters[j_real].inselection = true;
					}
				}


		    $scope.section.section_markups = $scope.get_markups($scope.section.start, $scope.section.end)
			$scope.attribute_objects()
			$scope.section.redraw= false;

			_.each($scope.section.section_markups, function(m, i){

					m.selected = false;
	  				m.inrange = false;
					m.redraw = true;

			})


	}
		


	})
/*

	$scope.$watch('ui.selected_range.redraw', function(newValue, oldValue) {
		
			if(oldValue == newValue || newValue == false){
					console.log('redraw section NO')

			}
			else{
				console.log('redraw section')
				// $scope.section.rebuild = false;
				$scope.section.rebuild_count++ 
				var j_real;
	  				
				_.each($scope.section.letters, function(l, i){
						l.inrange = false;
						l.inselection = false;

				})

				// map the range			
				for (var j = $scope.ui.selected_range.start; j <= $scope.ui.selected_range.end; j++) {
					
					j_real = j - $scope.section.start;
					if($scope.section.letters[j_real]){
						$scope.section.letters[j_real].inselection = true;
					}
				}

				console.log('ui.selected_range.redraw count mks A:'+$scope.section.section_markups.length)

				//$scope.section_markups = $scope.get_markups($scope.section.start, $scope.section.end)
				//console.log('ui.selected_range.redraw count mks B:'+$scope.section_markups.length)

			    $scope.attribute_objects()

				
			}
		
						
	})
*/

	

	$scope.init_()










$scope.integrity_fix = function (){

	//xx$scope.section.fulltext.length)
	//alert($scope.section.end - $scope.section.start - 1)
	if($scope.section.fulltext.length > parseInt($scope.section.end - $scope.section.start)+1){
		$scope.flashmessage('size mismatch >', 'bad' , 2000, false)

	}
	if($scope.section.fulltext.length < parseInt($scope.section.end - $scope.section.start)+1){
		$scope.flashmessage('size mismatch <', 'bad' , 2000, false)
		$scope.section.end = $scope.section.fulltext.length-1+$scope.section.start

	}
	if($scope.section.fulltext.length == parseInt($scope.section.end - $scope.section.start)+1){
		$scope.flashmessage('size match', 'ok' , 2000, false)
	}
}
	
}); // end controller




angular.module('musicBox.sectionpusher_controller', ['musicBox.section_controller']).controller('SectionPushCtrl', function($scope, $http, DocumentService, MarkupRest,socket) {
$scope.open_pmusher = function (){
	console.log($scope.section)
}
})

