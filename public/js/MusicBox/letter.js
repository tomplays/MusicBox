'use strict';
//console.log('LetterCtrl   @ /public/js/MusicBox/letter.js')

/*   
	 todos : 
		 - clean
*/


function LetterCtrl($scope) {

	// fired on double click on text/section/
	// toggle various editing modes
    //  text_edit > section_edit > markup_edit > display > hovered
    
	$scope.dbc_text = function (section){
		// section.mode = 'section_edit';
		// return;
		$scope.cur_sel['editorsmodes'] = 'editing_mode';
		
	//	$scope.objects_sections[$scope.cur_sel['section_index']]['state']['selected'] = 'qsd'


		if(section.mode == 'markup_edit'){
			section.mode = 'text_edit';


		}
		else if(section.mode == 'text_edit'){
				section.mode = 'section_edit'

		}
		else if(section.mode == 'section_edit'){
				section.mode = ''
				$scope.cur_sel['editorsmodes'] = '';

		}
		else {
			section.mode = 'markup_edit';

		}

	}


	// raw text of a section as change (textarea event)

	$scope.updateFulltext = function () {
 		$scope.dockeys['needed'] = "true";
 		var real_index = 0;
 		if($scope.dockeys['valid'] !== 'true'){
 			$scope.msgflashqueue.push({text:'need a key !'});
 			 console.log($scope.dockeys);
 			// $scope.sorted_sections[$scope.cur_sel.section_index]['text_content']['status'].push('edit returned');
 			 $scope.sorted_sections[$scope.cur_sel.section_index]['text_content']['fulltext']['cur'] = $scope.sorted_sections[$scope.cur_sel.section_index]['text_content']['fulltext']['origin']
 			return;
 		}
 		else{
			var isset = 'false';
			var e;
			var string_new = $scope.sorted_sections[$scope.cur_sel.section_index]['text_content']['fulltext']['cur'];
			var string_old = $scope.sorted_sections[$scope.cur_sel.section_index]['text_content']['fulltext']['origin']
				for (e = 0; e <= _.size(string_new)	 ; e++) {
					var letter_new = string_new[e];
					var letter_old = string_old[e];
					if(!letter_new || !letter_new ){
				//		console.log('nothing at'+e);
					}	
					if(!letter_old  && isset == 'false'){
						isset = e;
						var real_index = isset + $scope.sorted_sections[$scope.cur_sel.section_index].start;
					}
				//	console.log(letter_old+' > '+letter_new +'@'+e )
					if(letter_old !== letter_new && isset == 'false'){
						console.log('dif at'+e);
						$scope.sorted_sections[$scope.cur_sel.section_index]['text_content']['inserted'] = e;
						isset = e;
						var real_index = isset + $scope.sorted_sections[$scope.cur_sel.section_index].start;
					}
				}
				/*
					var letter_arr = new Array(); 		
				*/
				// $scope.letters[$scope.cur_sel.section_index].push(letter_arr);
				if(real_index >= $scope.sorted_sections[$scope.cur_sel.section_index].end){
					//alert('sup '+real_index+'/'+$scope.sorted_sections[$scope.cur_sel.section_index].end)

					//return;
				}
 				var s = $scope.sorted_sections[$scope.cur_sel.section_index]
 				var s_size= _.size(s) 
				var fto_size= _.size( $scope.sorted_sections[$scope.cur_sel.section_index]['text_content']['fulltext']['origin'] )
 				var ftc_size= _.size($scope.sorted_sections[$scope.cur_sel.section_index]['text_content']['fulltext']['cur'] )

 					var edit_direction = 'same';
 					var edit_size = 0;

 					if(fto_size > ftc_size){
 						edit_direction = 'right';
 						edit_size = fto_size - ftc_size;
 						$scope.msgflashqueue.push({text:'<'});
 					//	$scope.$emit('sectionEvent', { index: $scope.cur_sel.section_index, section: $scope.sorted_sections[$scope.cur_sel.section_index],  action: 'fulltext_update' , direction: edit_direction ,size: edit_size,inserted_at:isset, inserted:real_index});	
		 	//	$scope.$emit('docEvent', { index: $scope.cur_sel.section_index, section: $scope.sorted_sections[$scope.cur_sel.section_index],  action: 'fulltext_update' , direction: edit_direction ,size: edit_size, inserted_at:isset, inserted:real_index});				
				//$scope.$emit('letterEvent', { index: $scope.cur_sel.section_index, section: $scope.sorted_sections[$scope.cur_sel.section_index],  action: 'fulltext_update' , direction: edit_direction ,size: edit_size, inserted:real_index , inserted_at:isset});				
				return;

 					}
 					if(fto_size < ftc_size){



 						edit_direction = 'left';
 						edit_size = ftc_size - fto_size;
 						$scope.msgflashqueue.push({text:'>'});
 						$scope.$emit('sectionEvent', { index: $scope.cur_sel.section_index, section: $scope.sorted_sections[$scope.cur_sel.section_index],  action: 'fulltext_update' , direction: edit_direction ,size: edit_size,inserted_at:isset, inserted:real_index});	
		 		$scope.$emit('docEvent', { index: $scope.cur_sel.section_index, section: $scope.sorted_sections[$scope.cur_sel.section_index],  action: 'fulltext_update' , direction: edit_direction ,size: edit_size, inserted_at:isset, inserted:real_index});				
				//$scope.$emit('letterEvent', { index: $scope.cur_sel.section_index, section: $scope.sorted_sections[$scope.cur_sel.section_index],  action: 'fulltext_update' , direction: edit_direction ,size: edit_size, inserted:real_index , inserted_at:isset});				
				return;
 					}
 					if(fto_size == ftc_size){
 						//alert('same')
 						$scope.msgflashqueue.push({text:'='});
 					}		
 		}
 	
		return;
	}




	$scope.action_letter= function (levent,letter) {
		//console.log(levent,letter);
		//console.log(letter);
		$scope.current_letteraction 	= levent;
		$scope.current_letter 			= letter;
		/*
		if(levent =='click'){
			//$scope.action_letter = letter;
		}
		if(levent =='mouseover'){
			// $scope.current_letter = send_letter;
			//$scope.current_letter = letter;
			var out_title = '';
			if(_.isArray(letter.classes) && (letter.classes).length > 0  ){
				_.each(letter.classes, function(cll){
					//   out_title += '('+cll+')';
				});
			}
			if(_.isArray(letter.href) && (letter.href).length > 0  ){
				out_title += ' external link to '+letter.href;
				alert('link')
			}	
			//a.classes.push(add_class);
			// $('.thesections span:eq('+a.order+')').attr('title', out_title);
			// alert(a.href);
			//
		}
		*/
	}


	/*
	lots of todos here
	watchers :
	functions : 
		lt_input_changed : special model if 'implicit'-input of letter change
		toggle_all_letters_classes
	*/
	
	/*
	$scope.$watch('words', function(a){
		console.log(a);
		changeonsole.log('word touched');
		//	$scope.words = $scope.old_words;
		// renderTextdatas()	
	});
	*/
	
	
	

	///console.log()
	//	$scope.current_letters_selected.push(letter);
	//alert($scope.current_letters['char'])
	//letter.mode= 'clicked';

	//$scope.dockeys['needed'] = "true";
	//var key = $scope.dockeys["key"]

	//	console.log($scope.current_letters_selected)
	// ** need dockeys
	// only one letter replace mode is working
	// trigger : input change (user)
	/*
	$scope.lt_input_changed= function (a) {
			alert('lt_input_changed')

			console.log($scope.dockeys)
			$scope.dockeys['needed'] = "true";
			var key = $scope.dockeys["key"]

			console.log('editing a letter input..')
			console.log(a)
			//console.log(a.order)
			var o_letter = $scope.working_doc.doc.content[a.order];
			//var o_letter = $scope.working_doc.doc.content[a.order];
			var t_section = $scope.sorted_sections[a.sectionin]; 
			//console.log(t_section);
			//console.log('size a_char')
			//console.log(_.size(a['char']) )
			if(a['char'] == $scope.working_doc.doc.content[a.order]){
				console.log('should nt happens.. // case typed same letter...')
			}
			// size of array ?
			// == 0   > empty, remove from words, upadte section..
			// == 1   > just update words
			// == 2   > is it first or second ???
			
			if(!a['char'] ){
				console.log('a.char empty')
			}

			if(_.size(a['char']) == 1){
				var char_unique = a['char']
				console.log('unique input'+char_unique+' vs version original'+o_letter)

				//compare:
				if(char_unique == o_letter ){
					console.log('nothing to do..')
				}
				else{
					console.log('changed unique')
					// construct new content from start to end..
					var newcontent = '';
					var i;
					for (i = 0; i < _.size($scope.working_doc.doc.content); i++) {
							console.log(i)
							// ... and find the a.order between 
							if(i == a.order){
								//console.log('inject letter @'+i)
								newcontent += char_unique;
							}
							else{
								//console.log('no inject letter @'+i)
								newcontent += $scope.working_doc.doc.content[i]
							}

					}
					
					// query run on doc.
					$scope.working_doc.doc.content = newcontent;
					var data = { 'dockey': key, 'field':'content', 'value': newcontent };
					$http.post(API_URL+'/apis/doc/'+$scope.working_doc.doc.id+'/edit/content/o', serialize(data)).
						success(function(doc) {
							//$scope.editing_fields[field]['state'] = 'saved';
							//if(field == 'title'){}
							console.log('saved (epic)');
					});
				}
			}
			else if(_.size(a['char']) == 2){
				var char_left = a['char'][0]
				var char_right = a['char'][1]
				console.log('two in input'+char_left +'>'+char_right+' version original'+o_letter)
				//compare:
				if(char_left == o_letter ){
					var n_letter = char_left;
					// need to push a new complete letter object t index...
					var new_order = (a.order)+1;
					console.log('left match')
					var newcontent = '';
					var i;
					for (i = 0; i < _.size($scope.working_doc.doc.content); i++) {
							//console.log(i)
							// ... and find the a.order between 
							newcontent += $scope.working_doc.doc.content[i];
							// PlUS & inject
							// in right match would invers e order of injection 
							if(i == a.order){
								console.log('inject letter @'+i)
								// !!!!!! better TODO right match
								if(char_left == o_letter ){
									newcontent += a['char'][1];
								}
							}
					}
					// query run on doc.
					$scope.working_doc.doc.content = newcontent;
					// dirty!
					//$scope.words[0][0] = letter_arr;
					//$scope.working_doc.doc.content = '*'+$scope.working_doc.doc.content
					//$scope.words[a.sectionin][new_order] = letter_arr;
					//console.log($scope.words[a.sectionin])
					// event emit	
					$scope.$emit('letterEvent', {section:a.sectionin, content: newcontent });	
					return;	

				}
				else if(char_right == o_letter ){
					alert('char right')
					var n_letter = char_right;
					console.log('right match')
				}
				else{
					console.log('else/mismatch case')
				}
			}
			else if(_.size(a['char']) == 3){
				console.log('should not happen')
			}
			else{
					console.log('else cases')
					console.log(a)
					console.log('original was'+o_letter)
			}
	}
	*/

	function toggle_all_letters_classes(n, tclass){
		var t_section = $scope.sorted_sections[n];	
		//	console.log(t_section)
		// loop each section, 
		//each letters_array
		// if the one, add class
		// else remove class
		_.each($scope.sorted_sections , function(section, is){
			_.each($scope.letters[is] , function(letter,iw){
				if(section == t_section ){
					$scope.objects_sections[is]['classes'].push('active_section')
					if(_.contains(letter.classes, tclass)){}
					else{
						letter.classes.push(tclass);	
						letter.sel = true
					}
				}
				else{
					$scope.objects_sections[is]['classes'] = _.without($scope.objects_sections[is]['classes'], 'active_section');
					if(_.contains(letter.classes, tclass)){
						letter.classes = _.without(letter.classes, tclass);
						letter.sel = false
					}
					else{}
				}
			});
		});
	}

	// Misc / internal use
	// toggle each letters of a given section to a letters-mode (display|editing)
	$scope.toggle_display = function(section_index, mode) {
		var t_letters = $scope.letters[section_index]; 
		_.each(t_letters, function(w){
			w.mode = mode;
		});
	}
	/*
	$scope._push_letter_test= function (a) {
			$scope.sorted_sections[a.sectionin].end = ($scope.sorted_sections[a.sectionin].end)+1;
			console.log($scope.sorted_sections[a.sectionin])
					var letter_arr = new Array();
			        //fulltext = 'e';
			        letter_arr['mode'] = 'display';
					letter_arr['char'] = '1';
					letter_arr['order'] = a.order+1
					letter_arr['rindex'] =a.rindex+1
					letter_arr['classes'] = new Array();
					letter_arr['href'] = new Array();
					letter_arr['sectionin'] = a.sectionin;
					$scope.letters[a.sectionin].push(letter_arr);
					console.log($scope.letters[a.sectionin])
	}
	*/

	
 ///// OLD 
	$scope._click_letter= function (a) {
		//alert('clicked');
		console.log(a);
		$scope.current_letter = a;
		if( _.isArray(a.href) && (a.href).length > 0  ){
			console.log(a.href);
			$scope.doc_load_status = 'redirecting';
				setTimeout(function() {
					alert(a.href[0].metadata)
					//$scope.doctoload.id = 2; // INTERNAL :-) 
	      			//window.location = a.href[0].metadata;
				}, 1);
		}
		/*
		$scope.sorted_sections[a.sectionin]
		console.log(a);
		var e = a;
		e.order = a.order+1;
		e.mode = 'display';
		$scope.sorted_sections[a.sectionin]['end'] = 120;
		console.log($scope.sorted_sections[a.sectionin])
		//console.log($scope.letters[a.sectionin])
		//console.log($scope.cur_sel);			
		$scope.cur_sel['status'] = 'updating_string';
		$scope.cur_sel['string'] = '';
		//a.mode ='edist';
		if($scope.cur_sel['start'] ==-1){
			$scope.cur_sel['status'] = 'selection_empty';
			$scope.cur_sel['classes'] = new Array();
			$scope.cur_sel['start'] = a.order;
			$scope.cur_sel['end']  =  a.order;
			$scope.cur_sel['string'] = a['char'];
			_.each(a.classes, function(cs){
					$scope.cur_sel['classes'].push(cs);
			
				});
			a['classes'].push('cur_sel');
			$scope.cur_sel['working_index'] = a.sectionin;
			//  console.log('set init');
			//	console.log($scope.cur_sel);
			$scope.cur_sel['status'] = 'selection_set_first';
		}

		if( $scope.cur_sel['working_index'] !== a.sectionin){

			$scope.cur_sel['status'] = 'rc1';
			$('.mt lt').removeClass('cur_sel');
			$scope.cur_sel['working_index'] = a.sectionin;
			$scope.cur_sel['classes'] = new Array();
			_.each(a.classes, function(cs){
				$scope.cur_sel['classes'].push(cs);
			});
			a['classes'].push('cur_sel');
			$scope.cur_sel['start']   = a.order;
			$scope.cur_sel['end'] = a.order+1;
			$scope.cur_sel['string'] = a['char'];			
		}


		/// NEXT TWO CASE :
		   A : > && > (both greater than start and end range)
		   B : < && < (both small than range)
		//  
	    if( (a.order > $scope.cur_sel['end']) && (a.order > $scope.cur_sel['start']) ) {

			console.log('scase 1');
			for(var c = $scope.cur_sel['start']; c <= a.order; c++) {
				//console.log('need to reindex before'+c);
				//$scope.sorted_sections[b]['end'] = $scope.sorted_sections[b]['end']-1;
				//a['classes'].push('cur_sel');	
				$('.mt lt:eq('+(c)+')').addClass('cur_sel');
				$scope.cur_sel['string'] += $('.mt lt:eq('+(c)+')').html();
			//	$scope.cur_sel['start'] = a.order;
				$scope.cur_sel['end'] = a.order;
				$scope.cur_sel['working_index'] = a.sectionin;
				_.each(a.classes, function(cs){
					$scope.cur_sel['classes'].push(cs);
				});	
				$scope.cur_sel['classes'] = _.uniq($scope.cur_sel['classes']);
				//$scope.cur_sel['start'] = a.order;
			}

		}	
		// clicking on "the left, a lefter than start.."		
		else if(a.order < $scope.cur_sel['end'] && a.order < $scope.cur_sel['start']){
			$scope.cur_sel['working_index'] = a.sectionin;

			for(var c = a.order; c <= $scope.cur_sel['end']; c++) {
				//console.log('need to reindex before'+c);
				//$scope.sorted_sections[b]['end'] = $scope.sorted_sections[b]['end']-1;
				//a['classes'].push('cur_sel');	
				$scope.cur_sel['start'] = a.order;
				$scope.cur_sel['string'] += $('.mt lt:eq('+(c)+')').html();
				
				_.each(a.classes, function(cs){
					$scope.cur_sel['classes'].push(cs);
		
				});	
				$scope.cur_sel['classes'] = _.uniq($scope.cur_sel['classes']);
				$('.mt lt:eq('+c+')').addClass('cur_sel');
			}
		}

		// click link
		
		//console.log(a.classes);

		if(  _.contains(a.classes, 'comment') ){
	 			console.log('has comment');
	 			//$(".commentstdinfos").toggleClass('current-comment')
		}
		setTimeout(function() {
	     $scope.cur_sel['status'] = 'ready';
		}, 1000);	
		*/  
	}
	// create a range of letters..

	$scope.$watch("current_letter", function(letter,o) {
		if(o && letter && letter !== o){
				if($scope.current_letteraction == 'click'){
				// $scope.msgflashqueue.push({text:'clicksssed '+$scope.current_letter.char+ $scope.current_letter.order});
				$scope.current_letter['action'] = $scope.current_letteraction
				var clicked_range = $scope.current_letter.lindex;
				//alert('e')
				//$scope.current_letter['classes'].push(actionz);
				var oldranges = $scope.rangemarkup;
				var newranges = oldranges;
				if( !$scope.rangemarkup.start || !$scope.rangemarkup.end || (oldranges.start == -1 && oldranges.end == -1) ){
					newranges['start']	= clicked_range;
					newranges.end		= clicked_range;	
				}
				if(clicked_range > oldranges.start ){
					//console.log('clicked_range > oldranges.start')
					newranges.end		= clicked_range;
				}
				if(clicked_range < oldranges.start){
					//console.log('clicked_range < oldranges.start')
					newranges.start	= clicked_range;
				}
				if(clicked_range > oldranges.end){
					//console.log('clicked_range > oldranges.end')
					newranges.end 	= clicked_range;
				}
				// transfert , fake watcher with string..
				newranges.changed = Math.random(0,1000);
				$scope.rangemarkup = newranges;
				}
				///console.log()
				//	$scope.current_letters_selected.push(letter);
				//alert($scope.current_letters['char'])
				//letter.mode= 'clicked';
				//$scope.dockeys['needed'] = "true";
				//var key = $scope.dockeys["key"]
				//	console.log($scope.current_letters_selected)
		}	
	});

	/*
	$scope.$watch("current_letteraction", function(actionz,o) {
		//if(actionz !== o){
			//console.log('action changed '+o+'>'+actionz)
			//console.log($scope.cur_range_markup);
			if(actionz == 'click'){}

		//}	
	});

	$scope.$watch("cur_sel.section_index", function(n,o) {
		if(n !== o){
			//	alert('ee')
			
		   $scope.cur_sel['range_markup'] = new Array();
		   $scope.cur_sel['range_markup']['start'] = $scope.sorted_sections[n].start;
		   $scope.cur_sel['range_markup']['end'] = $scope.sorted_sections[n].end
			
			//  console.log('cur_sel.index')
			//console.log(n)
		

			//	$scope.objects_sections[$scope.cur_sel['section']]['classes'].push('h1')
			//toggle_all_letters_classes(n, 'cur_sell')
		}
	});
	*/


} // </ctrl>
LetterCtrl.$inject = ['$scope'];
