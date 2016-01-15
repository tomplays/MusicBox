'use strict';


/*

triggers / callback
attribute_objects()->map_letters->


>> MAIN FUNCTIONS/LOGIC 

	base section : {
					start: 0
					end: n
	}

	>> INIT()
		> 

*/

angular.module('musicBox.section_controller', []).controller('SectionCtrl', function($scope, $http, DocumentService, MarkupRest,socket, MarkupService) {

$scope.init_= function (index_) {
	console.log('init_ (section #'+ index_+')')

	/* some variable seting for each container */
	var container_ = new Object({
		'selecting' : -1,
		'sectionin' : index_,
		'isolated'  : 'true',
		'selected'  : false,
		'focused'   : '',
		'editing_text': $scope.ui.debug ? true : false,
		'ready' : 'init',
		'modeletters' : $scope.ui.debug ? 'single' : 'compiled',
		'section_classes':'', 
		'stack': [],
	//	'rebuild' : false,
		'rebuild_count' : 0, 
		'textlength': null,
	//	'objects_count': '0',
	//	'debuggr' : ['init'],
        'has_offset'     : false,
        'touched'     : false,
        'keepsync'     : true,
        'objSchemas' : $scope.objSchemas['container'],
        'objSchemas_css': $scope.objSchemas['container_class'],
        'servicetype'  	 :'section',
        'operation': {},
        'operations': [],
        'fulltext' : $scope.init_fulltext($scope.section.start, $scope.section.end),
        'section_markups' : $scope.get_markups($scope.section.start, $scope.section.end),
        'section_markups_ready' : 'false',
        'section_fulltext_ready' : 'false',
        
	
	})

	// extend this 
	$scope.section = _.extend($scope.section, container_);


	new MarkupService().init($scope.section)
	//	$scope.markup.user_options = _markup.apply_object_options('markup_user_options',$scope.markup.user_id.user_options)


	//$scope.
	//$scope.section.section_markups_length 	= $scope.section.section_markups.length

	
	
	// add to parent scope section count
	


	// reach letter max test
	if($scope.section.end > $scope.$parent.max_reached_letter){
		$scope.$parent.max_reached_letter = $scope.section.end
	}



	
	// console.log('$scope.section')


	// console.log($scope.section)

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
		_.each($scope.doc.markups, function(m){

				if( !m.deleted && (m.start >= parseInt(ss)) && (m.end <= parseInt(se)) ){
					///m.visible = true
					m.sectionin = $scope.section.sectionin
					arr_m.push(m)
				}
		});
		console.log('get markups>')
		console.log(arr_m)
		$scope.section_markups_ready = 'true';

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
			//	alert('test suite no start letter')
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
							$scope.section.letters[mi].classes.push('islast-range islast-range--')
						}

						

						if(markup.type == 'datavalue'){
							$scope.section.letters[mi].classes.push(markup.subtype)
							$scope.section.letters[mi].classes.push(markup.type)

						}
						if(markup.type == 'hyperlink' && markup.metadata){
							//	console.log('markup.type == hyperlink')
							//	console.log(markup)
								$scope.section.letters[mi].href = markup.metadata
						}
						
						if(m_objSchemas.map_range === true){
							if(_.contains($scope.section.letters[mi].classes, markup.subtype )){

$scope.section.letters[mi].classes.push(markup.subtype)	
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
					
					

	    			var  prev_class = false
	    			var current_class = false
	    			var next_class  = false;
	    			

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
						var current = true	
					//	if(_.isArray())
					//	current_class.push($scope.section.letters[i].classes) : current_class = new Array($scope.section.letters[i].classes)
						
						//if($scope.section.letters[i].href !== '')
						current_class = $scope.section.letters[i].classes


						//current_class.push()


					}
					

					if( $scope.section.letters[i+1] && $scope.section.letters[i+1].classes.length > 0 ){
						 var next = true;
						 next_class = $scope.section.letters[i+1].classes;
					}
					
					if($scope.section.letters[i-1] && $scope.section.letters[i-1].classes.length > 0 ){
						 var prev = true
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

							if(fulltext_block[i] == ' '){
							inside = '&nbsp;'
						
						}
						else{
							inside = fulltext_block[i]
						}
							
							
								
							

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
						
						

						if(fulltext_block[i] == ' '){
							out += '&nbsp;'
						
						}
						else{
							out += fulltext_block[i]
						}

						
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
			console.log('O A')
			console.log(objectsarray)

    		
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
		        	markup.sectionin= $scope.section.sectionin

			        /////  ///
			        if(markup.type !== "" && markup.position){ // > can add it
						$scope.section.objects_count['by_positions'][markup.position].count++;
						$scope.section.objects_count['by_positions'][markup.position].has_object  = true;
					
					}
		    	} // if in-range
		    	

		    }); // each markups end.
    //console.log($scope.section)
	
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
	            		fulltext_block += '&nbsp;'
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
	
		$scope.section.section_fulltext_ready =Math.random();
		$scope.map_letters()

		
	}
});	



$scope.$watch('section.section_markups_ready',function(newValue, oldValue) {
	if(  newValue == 'true'){
		$scope.attribute_objects()
		$scope.section.section_markups_ready = 'done';
		

	}
	else{

	}
});

$scope.$watch('section.section_fulltext_ready',function(newValue, oldValue) {
	//if(newValue == 'true'){
		
		
		

		
		
		
	//	$scope.section.section_fulltext_ready = 'done';
		

	//}
	//else{

	//}
});



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
 		var section_count  = _.filter($scope.doc.containers, function(s){ 
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
			alert('old')
		}
			// short function to push a comment

		$scope.add= function (push){
			$scope.flashmessage(push.type +' inserted', 'ok' , 1400, false)	
		}


$scope.alert_= function (){
	// alert('alert_')
}

// short function to push a section
$scope.new_section= function (){
		// $scope.section.fulltext  = $scope.section.fulltext
		$scope.push.start  		= parseInt($scope.section.end+1)
		$scope.push.end  		= parseInt($scope.section.end+9)
		$scope.push.position  	=  'inline'
		$scope.push.type 		= 'container';
		$scope.push.subtype 	= 'section';	

		$scope.$parent.sync_queue()
		$scope.add();
		
}



$scope.defocus = function (){
			// call parent CTRL > to move in documentCtrl
		  _.each($scope.$parent.doc.containers, function(container){
            	container.focused  = ''          
		  })
}
// todo > move to PusherCtrl
$scope.close_pusher = function (){
	$scope.defocus()
	$scope.$parent.ui.focus_side 				= ''
	$scope.$parent.ui.menus.push_comment.open 	= -1
	$scope.$parent.push.metadata 				= '';
	$scope.$parent.push.start 					=	null;
	$scope.$parent.push.end 					=	null;
}


	// todo > move to PusherCtrl

	$scope.open_pusher = function (){
		// open close the pusher box.

		
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
		alert('old')
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

	
$scope.$watch('section.operation.before.state', function(newValue, oldValue) {

		if(newValue == 'new'){
			 $scope.apply_operation()

		}
		if(newValue == 'error'){
			$scope.section.operations.push($scope.section.operation)
		}
})

$scope.apply_operation = function(){

 			 $scope.section.operation.after = {}

			 if($scope.section.operation.before.end){
			 	$scope.section.end =  parseInt($scope.section.operation.before.end+$scope.section.operation.before.end_qty)
				//$scope.section.operation.after.new_end = $scope.section.end
			 }
			 if($scope.section.operation.before.start || $scope.section.operation.before.start == 0){
			
			 	$scope.section.start = parseInt($scope.section.operation.before.start)+parseInt($scope.section.operation.before.start_qty)
			 //	$scope.section.operation.after.new_start = $scope.section.start
			 }

 			 $scope.section.operation.before.state= 'done'
 			 $scope.section.operation.after.state= 'done'
 			 $scope.section.operation.after.ss= $scope.section.start
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
				console.log(' nothing ')
			}
			else{

				$scope.section.textlength= $scope.section.end - $scope.section.start
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


$scope.apply_ui_inrange_letters = function(){

	_.each($scope.section.letters, function(l, i){
	    // 
	    var c_real = i + $scope.section.start;
	    // map the range	
	    if(c_real>=$scope.ui.selected_range.start && c_real <= $scope.ui.selected_range.end){
	   
	    	l.inrange = true;

	    }
	    else{
	    	l.inrange = false;
	   		
	    }
  	})
  	console.log('############ section MAPPED RANGES.')
}



$scope.apply_ui_inrange_markups = function(){

	_.each($scope.section.section_markups, function(m, i){
		// toggle change, call $scope.markup controller watcher
		m.map_ranges 	= true;
	})
  	console.log('############ section MAPPED RANGES.')
}


					
$scope.$watch('section.inrange_letters_and_markups', function(newValue, oldValue) {
	if(oldValue == newValue || newValue == false){


	}else{
			console.log('############ section MAP inrange_letters_and_markups (both trigger)')
			
			$scope.apply_ui_inrange_letters()
			$scope.apply_ui_inrange_markups()
			$scope.section.inrange_letters_and_markups = false;
	}
		


})









//OLD way

	$scope.$watch('section.redraw', function(newValue, oldValue) {
	if(oldValue === newValue || newValue == false){


	}else{
		
		console.log('############ section.redraw')

		    $scope.section.section_markups = $scope.get_markups($scope.section.start, $scope.section.end)
			$scope.map_letters()
			$scope.section.inrange_letters_and_markups = true;
			$scope.section.redraw = false;
	}
		


	})

	



$scope.inserted = function(l){
	alert(l)
}


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



angular.module('musicBox.sectionB_controller', []).controller('SectionBCtrl', function($scope, $http, DocumentService, MarkupRest,socket, MarkupService) {



$scope.init_= function () {
	var container_ = new Object({
			'section_index' : $scope.$parent.$index, 
			'map' : {
				'fulltext':true,
				'letters':false,
				'objects':true,
				'layout': false,
			}

	})
	$scope.section = _.extend($scope.section, container_);
}

$scope.fire_map= function (map) {
	$scope.section.map[map] = true;
}



$scope.$watch('section.map.fulltext', function(newValue, oldValue) {
	if( newValue == true){
		
		$scope.section.map.fulltext = false;
		$scope.section.fulltext = 'fsdfsdf';
		$scope.section.map.letters = true;



	}
	else{

	}
});

$scope.$watch('section.map.objects', function(newValue, oldValue) {
	if( newValue == true){
		
		$scope.section.map.objects = false;
		$scope.section.objects = [];


	}
	else{

	}
});


$scope.$watch('section.map.letters', function(newValue, oldValue) {
	if( newValue == true){
		
		$scope.section.map.letters = false;
		$scope.section.letters = [];


	}
	else{

	}
});






$scope.init_()


})
