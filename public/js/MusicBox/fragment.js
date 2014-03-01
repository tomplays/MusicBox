'use strict';
//console.log('FragmentCtrl @ /public/js/MusicBoxfragment.js')

function FragmentCtrl($scope, $http , $location, $routeParams) {
	/*
		AngularJs controller for fragments' (img, notes, comments,..) actions (save, edit, move, ..)
		using cross controller events/broadcasting to DocumentCtrl (its parent) and services calls
		In some cases (toggle_position), textdatas fragments and docmetas-driven fragments like author, nodes, share, date block, are using same functions.		
		functions : 
				_save
				_lookup_obj
				_setref_obj
				update_fragment_select_mode
				_select_object
				_remove_object
				_toggle_position (td or dm)
				subfield_fragment
				push_fragment
		
		TODO : move functions, select fix., indentation, remove "_ prefix", use "slide-array patterns", always use services.js

	*/

	$scope._save  = function (textdata){
		var key;
		$scope.dockeys.needed = "true";
		key = $scope.dockeys.key;
		if($scope.dockeys.valid !== "true"){return}
		var gindex = $scope.cur_sel.section_index;
		$scope.$emit('fragmentEvent', {index: gindex, textdata: textdata, action:'save_object'});		
	}

	$scope._lookup_obj = function (a){
		var data = {metadata:a.metadata }
		$http.post(API_URL+'/apis/findtarget/', serialize(data)).
			success(function(arr_bg) {
				console.log(arr_bg.IdocId);
				a.extref = arr_bg.IdocId;
				return a;
		});
	}

	$scope._setref_obj= function (doc_id, a_id, a_extref){
		var key;
		$scope.dockeys.needed = "true";
		key = $scope.dockeys.key;
		console.log(doc_id, a_id, a_extref);
		$http.get(API_URL+'/apis/reftextdata/'+doc_id+'/'+a_id+'/'+a_extref).success(function(textdata) {
				alert('textdata set as ref ');										
		});		
	}

	// adds classes into text from clicked object (comment, markup...)
	$scope.update_fragment_select_mode  = function(mode){
		$scope.cur_sel['fragment_select_mode'] = mode;
	}

	$scope.extend_date = function(){
		//alert('rr')
	}

	$scope.dbc_object = function(a){	
		if(a.status == 'editing'){
			a.status= 'unselected';
		}
		else{
			a.status= 'editing';
		}
		return a;
	}

	$scope._select_object = function (object,side,sorted_section,sw){
		/*
		from underscore doc
			 findWhere_.findWhere(list, properties)
			Looks through the list and returns the first value that matches all of the key-value pairs listed in properties.

			If no match is found, or if list is empty, undefined will be returned.

			_.findWhere(publicServicePulitzers, {newsroom: "The New York Times"});
			=> {year: 1918, newsroom: "The New York Times",
			  reason: "For its public service in publishing in full so many official reports,
			  documents and speeches by European statesmen relating to the progress and
			  conduct of the war."}

		*/
		if(sorted_section == 'auto'){
			sorted_section = $scope.sorted_sections[object.sectionin];
		}	
		console.log(object);
		//console.log(object.isselected);
		
		var ci , objectisselected, swr;
		// not woking for ssections (indexof itself)
		var object_section_index  =  object.sectionin;

		var real_index_start 	  =  object.start 	- 	parseInt(sorted_section.start)
		var real_index_end 		  =  object.end 	- 	parseInt(sorted_section.start)
		
		if(sw == 2){
			var key;
			$scope.dockeys.needed = "true";
			//	object.status = 'editing';
			objectisselected = 'true';
			return;
		}
		else{
			if(object.isselected == 'true' ){
				objectisselected = 'false';
				//	object.status = 'disselected';
				swr = 0;
			}
			else if(object.isselected == 'false'){
				objectisselected = 'true';
				if($scope.render_layout == 'fragments'){
				//	object.status = 'editing';
				}
				swr = 1;
			}
		}
		// swicth array of object (objects_sections) foreach sections
		//  + swicth array of words foreach sections
		_.each($scope.sorted_sections, function(se, ids){
			
			if(!object.type){
				return;
			//	var b = $scope.objects_sections[ids]['markup']['inline'];
			}
			else if(object.type && object.type == 'markup'){
				var b = $scope.objects_sections[ids]['markup']['inline'];
			}

			// false ! to check all sides...
			else{
				var b = $scope.objects_sections[ids][object.type][side];
				
			}
	
			// on objects
			_.each(b, function(ma, ida){
					if( (object.id == b[ida].id) && (swr == 1) ){
						b[ida].isselected = 'true';
						if($scope.render_layout == 'fragments'){
						//	object.status = 'editing';
						}
						else{
							b[ida].status = 'selected';					
						}
					}
					else{
						b[ida].status = 'unselected';
						b[ida].isselected = 'false';
					}
			});
			// and on letters
		});
		switch_letters_classes_by_range(object.start, object.end, 'selected', 1)
	}

	// standalone function.

	function switch_letters_classes_by_range(start, end, class_sw, switch_sw){
		_.each($scope.sorted_sections, function(se, ids){
			var g = $scope.letters[ids];
				_.each(g, function(letterz, idr){ 					
					//var real_index_idr =   idr + sorted_section.start;
					//console.log(letter.id)
					//console.log(letter.rindex)
					if(  (letterz.lindex >= start) && (letterz.lindex <  end)  && (switch_sw == 1)  ) {
							g[idr].state.select = true;
						    g[idr].classes.push(class_sw);
					}
					else{
						g[idr].state.select = false;
						g[idr].classes =  _.without(g[idr].classes,class_sw);
					}
				});
		});
	}
	
	// RF : side params is useless
	$scope._remove_object = function (object,side,sorted_section){
		var key;
		$scope.dockeys.needed = "true";
		key = $scope.dockeys.key;

		if($scope.dockeys.valid !== "true"){return;}

		if(!sorted_section || sorted_section == 'auto'){
				sorted_section = $scope.sorted_sections[object.sectionin];
		}	
		var gindex = $scope.cur_sel.section_index;


		if(object.type =='data' ||  object.type =='img' || object.type =='child_section' ||  object.type =='note' ){
			$scope.$emit('fragmentEvent', { index : gindex, textdata: object , action:'delete_fragment'});				
		}
		if(object.type =='markup'  ){
			$scope.$emit('fragmentEvent', {textdata : object, index: gindex, action:'delete_markup'});		
		}
		if(object=='section'){
			$scope.sorted_sections[index].start = 0;
			$scope.sorted_sections[index].end = -1;
			
			if($scope.sorted_sections[index+1]){
				$scope.sorted_sections[index+1].start = sorted_section.start;
			}
					
			if(index==0){
				console.log('removing first section');
			}
			$http.post(API_URL+'/apis/textdata/'+$scope.working_doc.doc.id+'/'+$scope.sorted_sections[index].id+'/delete').success(function(textdata) {
				console.log('textdata deleted ');
				//$scope.textdatas = textdatas;
				console.log('Broadcasting fragment action')
				$scope.$emit('fragmentEvent', {fragment: a, action:'remove_object'});				
			});	

			// if has a next
			if($scope.sorted_sections[index+1]){
				
				$http.post(API_URL+'/apis/textdata/update',$scope.sorted_sections[index+1] ).
					success(function(textdata) {
					console.log('textdata up!');
					//renderTextdatas()			
					console.log('Broadcasting fragment action')
					$scope.$emit('fragmentEvent', {fragment: a, action:'remove_object'});	
				});	
			}
		}
		if(object=='author_card'){
			 $scope.docmetas.use_authorcard ='removed_1';
		}	
	}

	// moving fragment from a position to another
	// depends on type of fragment (Textdata OR docmetas fragment)
	$scope._toggle_position = function (a) {
		var key;
		$scope.dockeys.needed = "true";
		key = $scope.dockeys.key;
		if(!key){return;}
		var n = '';
		// for notes and datas, position depends on type.. (no image in global , . etc//)
		if( (a.type== 'data' ||  a.type== 'note' ) && a.position == 'left'  ){n= 'under';}
		if( (a.type== 'data' ||  a.type== 'note' ) && a.position == 'under' ){n= 'right';}
		if( (a.type== 'data' ||  a.type== 'note' ) && a.position == 'right' ){n= 'global';}
		if( (a.type== 'data' ||  a.type== 'note' ) && a.position == 'global'){n= 'left';}

		// for images and child
		if( (a.type== 'img' || a.type== 'child_section' || a.type== 'player' ) && a.position == 'left'){n= 'center';}
		if( (a.type== 'img' || a.type== 'child_section' || a.type== 'player' ) && a.position == 'right'){n= 'wide';}
		if( (a.type== 'img' || a.type== 'child_section' || a.type== 'player' ) && a.position == 'wide'){n= 'left';}
		if( (a.type== 'img' || a.type== 'child_section' || a.type== 'player' ) && a.position == 'center'){n='right';}

		if(a.type== 'note' || a.type== 'data' || a.type== 'img' || a.type== 'player'  || a.type== 'child_section'){
			a.position=n;
			$scope.$emit('fragmentEvent', {index : a.sectionin, textdata: a, action:'toggle_position'});
			return;
		}
		// for doc level fragments (date, author, nodes, ...)
		if(a == 'use_authorcard' || a =='date_fragment' || a == 'nodes_fragment' || a== 'share_fragment'){
			var odm = $scope.docmetas[a]; // Original DocMeta
			

			if(a == 'use_authorcard'){
				if(odm 			== 'full_last'){		n	= 'full_first';}
				else if(odm 	== 'full_first'){		n	= 'left_text_first';}
 				else if(odm 	== 'left_text_first'){	n	= 'right_text_first';}
				else if(odm 	== 'right_text_first'){	n	= 'full_last';}
 				else{n 		=  'full_last';}
			}
					
			if(a == 'nodes_fragment' ){
		 		if(odm			== 'right_text_first'){	n 		= 'right_text_last';}
				else if(odm 	== 'right_text_last'){	n  		= 'full_last';}
		 		else if(odm 	== 'full_last'){		n 		= 'right_text_first';}
			}
			if(a == 'share_fragment' ){                                    
		 		if(odm 			== 'after_title'){		n 		= 'left';}
		 		else if(odm 	== 'left'){				n 		= 'right';}
		 		else if(odm 	== 'right'){			n 		= 'after_content';}
				else if(odm 	== 'after_content'){	n 		= 'after_title_and_content';}
		 		else if(odm 	== 'after_title_and_content'){	n 		= 'after_title';}	
			}
			if(a == 'date_fragment' ){
				if(odm == 'full_first'){				n  		= 'left_text_first';}
				else if(odm		== 'left_text_first'){	n 		= 'right_text_first';}
				else if(odm 	== 'right_text_first'){	n  		= 'full_last';}
				else if(odm 	== 'full_last'){		n  		= 'full_first';}
			}
			// warning > empty docmetas avoid to move
			// todo : use _.find
			_.each($scope.docmetas , function(dm){
				if(dm.meta_key == a){	
					dm.meta_value = n;
					$scope.$emit('fragmentEvent', {doc_id: $scope.doc.id , key:key , meta_key:a, meta_value: tdm, id: dm.id, action:'save_dm'});	
					return;
				}
			});
		}
	}

	// display some extra fields for links and image in editor
	$scope.subfield_fragment = function (p_subtype, p_metadata){
		$scope.dockeys.needed = "true";
		if(	$scope.dockeys.valid !== "true"){return;}

		if(p_subtype == 'link'){
			if( $scope.cur_sel['html_editor']['link_field'] == false ){
					$scope.cur_sel['html_editor']['link_field'] = true;
			}
		}
		else{
			$scope.cur_sel['html_editor']['link_field'] =false;
		}
		if(p_subtype == 'img'){
			if( $scope.cur_sel['html_editor']['img_field'] == false ){
					$scope.cur_sel['html_editor']['img_field'] = true;
					return
			}
		}
		else{
			$scope.cur_sel['html_editor']['img_field'] =false;
		}
		return
	}




	// transform selection into a new section
	// > save "left" "old" section
	// > create a new section (~ middle)
	// > create a new "right" old section
	// TODO : - check end/start "hit" to avoid a 0;0 ghost section or a section.end;section.end saving...
	// 		  - create an special event ? to be sure to reload only once..
	//		  - remove classes 
	
	$scope.enclose_fragment = function (){
			var key;
			$scope.dockeys.needed = "true";
			if(	$scope.dockeys.valid !== "true"){return;}
		
			var cur_index   		= $scope.cur_sel['section_index'];
			var or_section  	    = $scope.sorted_sections[cur_index];

			var or_section_start  	= or_section.start;
			var or_section_end  	= or_section.end;

			var range_start 		= $scope.cranges['start'];
			var range_end 			= $scope.cranges['end'];


			// adding some class before/inrange/after
			switch_letters_classes_by_range(or_section_start,range_start , 'enclose_before', 1)
			switch_letters_classes_by_range(range_start ,range_end+1,'enclose_neo', 1)
			switch_letters_classes_by_range(range_end+1 , or_section_end+1,'enclose_after', 1)


			// why switch_letters_classes ranges are differents from sections.. (<= // < // =).. ? ^^#@@#.
			var left_textdata = {type: 'section', id: or_section.id, subtype: 'section', position : 'inline', depth:1, metadata : 'text', css: 'section_lvl', start: or_section_start  , end: range_start-1};
			
			var neo_textdata = {type: 'section', subtype: 'section', position : 'inline', depth:1, metadata : 'text', css: 'section_lvl', start: range_start  , end: range_end};
			var right_textdata = {type: 'section', subtype: 'section', position : 'inline', depth:1, metadata : 'text', css: 'section_lvl', start: range_end+1  , end: or_section_end+1};
			/*
				console.log('left_textdata, neo_textdata, right_textdata');
				console.log(left_textdata)
				console.log(neo_textdata)
			 	console.log(right_textdata)
			*/
			// triple event + one ... thinking about a better method.
			$scope.$emit('sectionEvent', {index: cur_index, textdata: left_textdata, object : 'section',action:'save_section'});		
			$scope.$emit('sectionEvent', {index: cur_index, textdata: neo_textdata,object : 'section', action:'create_section'});	
			$scope.$emit('sectionEvent', {index: cur_index, textdata: right_textdata, object : 'section', action:'create_section'});
			//$scope.$emit('sectionEvent', {action:'enclosed_fragment'});
	}


	// create a new fragment (textdata) from params (called in html editor, add comment)
	// 
	$scope.push_fragment = function (p_type, p_subtype, p_position, p_depth, p_metadata, p_css, p_start, p_end, ss){	
		if(!p_start || p_start == ''){
			p_start = $scope.cranges['start']
		}
		if(!p_end || p_end == ''){
			p_end = $scope.cranges['end']
		}
		if(!ss || ss == ''){
			ss = $scope.cur_sel['section_index']
		}
		var key;
		// no key for comments
		if(p_subtype !=="comment"){
			$scope.dockeys.needed = "true";
			if(	$scope.dockeys.valid !== "true"){return;}
		}
		var p_section = $scope.cur_sel.section_index;
		var textdata = {type: p_type, subtype: p_subtype, position :p_position, depth:p_depth, metadata : p_metadata, css: p_css, start: p_start , end: p_end};
		// broadcast to services
		$scope.$emit('fragmentEvent', {index: p_section, textdata: textdata, action:'push_fragment'});	
	}
	//
} // </CRTL>

// and $inject
FragmentCtrl.$inject = ['$scope', '$http' , '$location', '$routeParams'];
