'use strict';
//console.log('SectionCtrl  @ /public/js/MusicBox/section.js')

/*   
	 todos : 
		 - sectionenter/reverse states 
		 - to clean, a lot is no used ..
		 - remove non-service calls
*/

function SectionCtrl($scope, $http) {
	

	/*  section-classes editor */
	
	// look in array for checkbox 
	$scope.section_has_class = function(icon, pi){
		var source_arr = $scope.objects_sections[pi]['classes'];
		if(_.contains(source_arr, icon)){return true;}
		return false;
	}
	// editor part
	// add or remove a section_class (css) to a section
	$scope.section_toggle_class = function(classa, pi){
			$scope.dockeys.needed = "true";
			if($scope.dockeys.valid !== "true"){return}
			// console.log('$scope.section_push_class'+ classa.icon + pi)
			// console.log($scope.sorted_sections[pi])
			var source_arr = $scope.objects_sections[pi]['classes'];
			// if already contains 
			if(_.contains(source_arr, classa.icon)){		
				$scope.objects_sections[pi]['classes'] = _.without($scope.objects_sections[pi]['classes'], classa.icon);
					// loop textdatas to find the good one and delete it
					_.each($scope.textdatas, function(td){
							if(td.metadata == classa.icon  && td.start == $scope.sorted_sections[pi].start ){
								$scope.$emit('fragmentEvent', { index: pi, textdata: td , refresh: false, action:'delete_fragment'});				
							}
					});
			}
			else{
				// add to sections_classes
				$scope.objects_sections[pi]['classes'].push(classa.icon);
				// create and save section_class
				var data = { css: 'none' , type: 'section_class', subtype: '', metadata : classa.icon, start: $scope.sorted_sections[pi].start, end: $scope.sorted_sections[pi].end}
				$scope.$emit('fragmentEvent', {index: pi, textdata: data, refresh: false,  action:'push_fragment'});	
			}
	}
	


	/* sections display */
	$scope.show_section_edit = function (obj, section_toggle_index){
		console.log($scope.toggles.sides_editors[side].push(si))
		var tedit_mode = $scope.objects_sections[section_toggle_index]['edit_mode']
		if(_.contains(tedit_mode, obj))
			return true;	
		return;
	}

	$scope.section_toggler = function (obj){
		console.log(obj)
		console.log($scope.objects_sections_toggle[obj])
		if($scope.objects_sections_toggle[obj] == 'true'){$scope.objects_sections_toggle[obj] = 'false';}
		else{$scope.objects_sections_toggle[obj] = 'true';}
		
	}

	$scope.section_toggler_show = function (obj){
		if($scope.objects_sections_toggle[obj] == 'true'){return true}
		else{return false;}
	}

	/// misc. for user.
	$scope.has_icon = function (icon, user){
		if(user.icons[icon] && user.icons[icon][0] == "true" ){return true;}
		return;
	}

	// REFACTOR  = use show_at
	$scope.active_section_only_index = function (a, only_index, index){	
		var show_author_card_at_index = 2;
		var date_fragment_at_index = 0;

		if( (index == 0) && a=='author_card_left_text_first' && $scope.docmetas.use_authorcard =='left_text_first'){return true;}
		else if( (index == 0) && a=='author_card_right_text_first' && $scope.docmetas.use_authorcard =='right_text_first'){return true;}
		else if( ( index == 0) && a=='author_card_full_first' && $scope.docmetas.use_authorcard  =='full_first'){return true;}
		else if( (only_index === true) && a=='author_card_full_last' && $scope.docmetas.use_authorcard  =='full_last'){return true;}
		else if( (index == 0) && a=='date_fragment_right_text_first' && $scope.docmetas.date_fragment  =='right_text_first'){return true;}
		else if( (index == 0) && a=='date_fragment_left_text_first' && $scope.docmetas.date_fragment  =='left_text_first'){return true;}
		else if( (only_index === true) && a=='date_fragment_full_first' && $scope.docmetas.date_fragment  =='full_first'){return true;}
		else if( (only_index === true) && a=='date_fragment_full_last' && $scope.docmetas.date_fragment  =='full_last'){return true;}
		else if( only_index === true  && a=='nodes_block_right_text_first' && $scope.docmetas.nodes_fragment =='right_text_first'){return true;}
		else if( only_index === true  && a=='nodes_block_left_text_first' && $scope.docmetas.nodes_fragment =='left_text_first'){return true;}
		else if( only_index === true  && a=='nodes_block_full_last' && $scope.docmetas.nodes_fragment =='full_last'){return true;}
		else if( only_index === true  && a=='nodes_block_left_text_last' && $scope.docmetas.nodes_fragment =='left_text_last'){return true;}
		else if( only_index === true  && a=='nodes_block_right_text_last' && $scope.docmetas.nodes_fragment =='right_text_last'){return true;}
		else if( (only_index == 0 || only_index == "any") && a=='left_share_fragment' && $scope.docmetas.share_fragment  =='left'){return true;}
		else if( only_index === true  && a=='nodes_right_side_last' && $scope.docmetas.nodes_fragment =='right_side_last'){return true;}
		else{return false;}
	}

	// change  cur_sel values on enter
	$scope.sectionenter = function (index) {

		$scope.cur_sel['editorsmodes'] = '';

	_.each($scope.sorted_sections, function(td,idx){

		if(index == idx){


		$scope.cstart = $scope.sorted_sections[index].start;
		$scope.cend =   $scope.sorted_sections[index].end;
		$scope.cur_sel['section_start']  =  	$scope.sorted_sections[index].start;
		$scope.cur_sel['section_end']    =		$scope.sorted_sections[index].end;
		$scope.cur_sel['section_index']  =		index; 
		$scope.cur_sel['fulltext_n']  	 = 		'';
		// $scope.cur_sel['fulltext_o']  	 = 		$scope.sorted_sections[index].fulltext;
		$scope.cur_sel['fulltext']  	 = 		$scope.sorted_sections[index].fulltext;
		//  $scope.cur_sel['r']  	 = 		$scope.sorted_sections[index].fulltext;
		$scope.cranges['start']		= $scope.sorted_sections[index].start;
		$scope.cranges['end']		= $scope.sorted_sections[index].start+1;
		$scope.rangemarkup.changed = 'section_index';
		$scope.rangemarkup.start 	= -1;
		$scope.rangemarkup.end 	    =  -1;
		$scope.sorted_sections[index].is_current =  'true';
		$scope.sorted_sections[index].mode =  'hovered';
		}
		else{
		//	$scope.sorted_sections[idx].is_current =  'false';
		//	$scope.sorted_sections[idx].mode =  'display';
		}


	})
		

		//$scope.sorted_sections[index].state.select = 'true';

		//$scope.cranges['end']		= $scope.sorted_sections[index].end;
		// var tt;
		// tt.start =  $scope.sorted_sections[index].start;
		//tt.end=	 $scope.sorted_sections[index].end;
		// $scope.cranges = tt;
		//$scope.cend = $scope.sorted_sections[index].end;
		// todo : end_each
	}

	// check calls ?
	$scope.click_section= function (is) {
		$scope.cur_sel['working_index'] = is;
		console.log(is)
	}
	
	// add a section to document
	$scope._add_section = function (section_prev, last){
				// todo tests for insert/before/end,etc...
				if(last === true){
					console.log(_.size($scope.sorted_sections))
					console.log(_.last($scope.sorted_sections));
					console.log(section_prev.end);
						if($scope.working_doc.doc.content[section_prev.end+1]) {
							console.log('got to fill new section')

						}
						else{
							console.log('content has no letter//  out of range.. clear..or..')
						}

					var data =  {css: 'none' , type: 'section', subtype: 'text', metadata : '', start: (section_prev.end)+1, end: (section_prev.end)+2}
					$scope.$emit('sectionEvent', {textdata: data, action:'add_section'});	
				}
				else{
					/* todo : like insert if not last */
					return;
				}	
	}

	// old but working (without save)

	

	$scope._remove_section = function (object,side,sorted_section,index){
		console.log(index,sorted_section)
		// just emit :-) #V+
		$scope.$emit('sectionEvent', {index: index, textdata: sorted_section, action:'delete_section'});
	}

	//// lot of todo...
	// old
	$scope._cut_section= function(section, section_index, direction, step){
		var adhoc_letters = $scope.letters[section_index];
		var adhoc_letters_size = adhoc_letters.length;
		//alert(section_index);
		//alert($scope.letters[section_index].length)
		console.log($scope.letters[section_index]);
		console.log($scope.letters[section_index+1]);
		$scope.letters[section_index][adhoc_letters_size-1].classes.push('sectionlast');
		$scope.letters[section_index][adhoc_letters_size-2].classes.push('sectionantelast');
		$scope.letters[section_index+1][0].classes.push('sectionfirst');
		$scope.letters[section_index+1][1].classes.push('sectionsecond');
	}
	// old
	$scope.cut_section= function(section, section_index, direction, step){
		console.log('section:'+section+' - section_index:'+section_index+' - direction:'+direction+' - step:'+step);
		console.log($scope.sorted_sections.length);
		console.log('reste avant: '+ (section_index))
		console.log('reste apres: '+ (($scope.sorted_sections.length) - 1  - section_index));
		
		/* DEBUG...
				//console.log('next letter to include in this section ::'+$scope.letters[section_index+1][0][0]['char'])
				var push_array = $scope.letters[section_index+1][0];
				//var rm_array =   $scope.letters[section_index][1]; // faux
				$scope.letters   =  $scope.letters[section_index].push(push_array);
				$scope.letters   = '';
				//$scope.letters[section_index+1]   = _.without($scope.letters[section_index+1], push_array);
				//$scope.letters   = '';
				fill_chars(section, section_index);
				var sec_next = $scope.sorted_sections[section_index+1];
				console.log(sec_next)
				//old_array[section_index].push($scope.letters[section_index][0][0]);
				//
				// works but not the way
				//console.log($scope.sorted_sections[section_index+1].fulltext[1]);
		*/
		if(direction=='left'){
				if(section.start - step == 0){
					return;
				}
				//$scope.sorted_sections[section_index]['start'] = section.start-1;

				for(var b = 0; b < section_index; b++) {
   						console.log('need to reindex before'+b);
   						//$scope.sorted_sections[b]['end'] = $scope.sorted_sections[b]['end']-1;	
				}

				if(section_index>0){
						console.log('need to reindex'+section_index);
   					
						// shift - push
						$scope.sorted_sections[section_index]['start'] = section.start-step;

						console.log('END/'+$scope.sorted_sections[section_index-1]['end']);
						var minus = $scope.sorted_sections[section_index-1]['end'];
						$scope.sorted_sections[section_index-1]['end'] = minus-1;	

						$http.post(API_URL+'/apis/textdata/update', $scope.sorted_sections[section_index-1]).
									success(function(textdata) {
									console.log('textdata up!');
											
						});		
						$http.post(API_URL+'/apis/textdata/update', $scope.sorted_sections[section_index]).
									success(function(textdata) {
									console.log('textdata up!');				
						});
						//	if(_.size($scope.letters[section_index+1]) > 0 ){
						//var new_lt_from_prev = _.last($scope.letters[section_index-1]); 
						//new_lt_from_prev[0].classes.push('next-neo-section');
						$scope.letters[section_index-1].pop()
						
						//var new_lt_from_prev = $scope.letters[section_index-1][0];
						//$scope.letters[section_index].unshift(new_lt_from_prev);
						//console.log(new_lt_from_prev);
						//$scope.letters[section_index].shift();
						//}	
				}
				else{
						console.log('cant go left on first section');
				}
				for(var a = section_index+1; a < $scope.sorted_sections.length; a++) {
   					console.log('need to reindex after'+a);	
   					//$scope.sorted_sections[a]['start'] = $scope.sorted_sections[a]['start']-1;	
				}
		}
		else{
				for(var b = 0; b < section_index; b++) {
   						console.log('need to reindex before'+b);
   						//$scope.sorted_sections[b]['end'] = $scope.sorted_sections[b]['end']-1;	
				}
   				console.log('need to reindex'+section_index);

   				$scope.sorted_sections[section_index]['end'] = section.end+step;
   				// in any case update "current" range
				$http.post(API_URL+'/apis/textdata/update', $scope.sorted_sections[section_index]).
							success(function(textdata) {
							console.log('textdata up!');

							$scope.cstart = $scope.sorted_sections[section_index].start;
							$scope.cend =   $scope.sorted_sections[section_index].end;
							$scope.cur_sel['section_start']  =  	$scope.sorted_sections[section_index].start;
				        	$scope.cur_sel['section_end']    =		$scope.sorted_sections[section_index].end;
				});	
				// if no section after, do nothing, else, update next one
   				if( (($scope.sorted_sections.length) - 1  - section_index) ==0){
					// looking for next letter....to fill
					console.log($scope.working_doc.doc.content[$scope.sorted_sections[section_index]['end']])
   					console.log($scope.working_doc.doc.content[$scope.sorted_sections[section_index]['end']+1])
   					console.log($scope.working_doc.doc.content[$scope.sorted_sections[section_index]['end']+2])
   					console.log($scope.working_doc.doc.content[$scope.sorted_sections[section_index]['end']+3])
   				}
   				else{
   					console.log('D after');
					 $scope.sorted_sections[section_index+1]['start'] = $scope.sorted_sections[section_index+1]['start']+step;
					$http.post(API_URL+'/apis/textdata/update', $scope.sorted_sections[section_index+1]).
							success(function(textdata) {
							console.log('textdata up!');
							//renderTextdatas()			
					});
					//for(var a = section_index+1; a < $scope.sorted_sections.length; a++) {
   						//console.log('need to reindex after'+a);	
   						//$scope.sorted_sections[a]['start'] = $scope.sorted_sections[a]['start']+1;	
					//}
				if(_.size($scope.letters[section_index+1]) > 0 ){
						// shift - push
						//  #non-empty-arrays-issue
						// pick first letter of the next section... 
						// push in current
						// delete old array (should be splice if array where sync..)
						var new_lt_from_prev = $scope.letters[section_index+1][($scope.sorted_sections[section_index+1]['start'])-1]
						///	new_lt_from_prev[0].classes.push('next-neo-section');
						$scope.letters[section_index].push(new_lt_from_prev);
						//console.log($scope.letters[section_index+1][($scope.sorted_sections[section_index+1]['start'])-1])
						$scope.letters[section_index+1][($scope.sorted_sections[section_index+1]['start'])-1] = new Array();
						///					//alert(new_lt_from_prev[0].char);
						//$scope.letters[section_index+1].splice(0, 1);
					}  
   				}		
		}
	}


	/* commented cause not used
	$scope.$on('section', function(event, args) {
		if(args.action &&  args.action == 'ranges_update'){
        	//console.log(args.index + '___ranges_update__section_')
       	 }
       	 if(args.action &&  args.action == 'add_section'){
        	//console.log(args.index + '___add_section_')
       	 }
    }); 
    */

} // </ctrl>
//DocumentCtrl.$inject = ['$scope', '$http' , '$location', '$routeParams','socket', 'translations', 'userinfo', 'docsfactory'];
SectionCtrl.$inject = ['$scope', '$http'];
