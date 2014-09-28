'use strict';
//console.log('DocumentCtrl @ /public/js/MusicBox/document.js');
/*
 ____________________
|*      * *    * *  *|
|*      M *    M    M|
|       * u    *    *|
|      s  *       s *|
|         *    i     |
|   c   * c    *    *|
| B   *   *         *|
| *    o  o         *|
|     *   x         *| 
|*||||*||||||||||||*||
|||||||||v.1||||||||||  
||o                o||      
||  Boite à musique ||______|
||o  ~ MusicBox    o||______| 
||||||||||||||||||||||  


Welcome here ! 
//
Functions (angularJS) to load and render a documents.
*/


// ** GLOBAL MISC VARS
var inheriting = {};
var GLOBALS = new Array();
GLOBALS.facebook_page_url = '';
GLOBALS.fonts_api = 'gfonts';
GLOBALS.load_section_style = true;
GLOBALS.show_section_size = false;

var rendrf;



// MAIN document controller
// require files "filters.js" and "services.js" for CTRLs
function DocumentCtrl($scope, $http , $location, $routeParams,renderfactory,socket, translations, userinfo, docsfactory) {
	
	

	var force_user = new Object({'islogged':'true', 'user_username': 'system_bot','user_id':1})
	$scope.userlogged = new Object({'islogged':'true'})
	if(force_user && USER_USERNAME ==''){
		$scope.userlogged = force_user;
	}	
	if(USER_USERNAME !==''){

		$scope.userlogged = new Object({'islogged':'true', 'user_username': USER_USERNAME,'user_id':USER_ID})
	}

 	// for document load and editing
	

	var docf = docsfactory();

	// for render view 
	var render = renderfactory();
	$scope.render = render;


	// register some controllers vars 
	// (not to reload on doc change)
	docf.init_first();
    //render.init_first();
    render.init();


	// trigger dom function.. could/should be all exectuted from service, how ? 
	// load a doc here, from first time
	


 // load a doc 

	if(!$routeParams.doc_id){
		$routeParams.doc_id = 1;
		$routeParams.render_layout = 'read'
	}
   	// basic vars for a doc
	docf.init();
	// routes params + determine doc id to load
	docf.load($scope.doctoload);



// order textdatas by start and filter by type 
// ($scope.textdatas > $scope.sorted_sections)
// broadcast 'sections_prepared' event 



// init sections arrays
// order // filter // sort // count 
// retruns normalized sections arrays and count
// > but doesnt loop each section.

$scope.prepare_sections = function(){	
 	// order // filter // sort // count cf function
	$scope.sectionstocount = 0;
	//$scope.sorted_sections = new Array()
	$scope.textdatas  = _.sortBy($scope.textdatas,function (num) {
      return num.start;
    });
	//if($scope.render_layout !=='debug' && !$scope.richtext && $scope.render_layout !=='summarize'){}
    $scope.sorted_sections = _.filter($scope.textdatas, function(td){ return  td.type == 'section'; });
	$scope.sectionstocount = _.size($scope.sorted_sections);
	$scope.sections_to_count_notice = ($scope.sectionstocount == 0) ? true : false;

	// maybe no section ?
    // init "out the sections" objects array 

	$scope.objects_sections = new Array();
	$scope.objects_sections['global_by_type'] = new Array();
	_.each($scope.available_sections_objects, function(o, obj_index){
		$scope.objects_sections['global_by_type'][o] = new Array();
	});


	


	$scope.objects_sections['all'] = new Array();
	$scope.$emit('docEvent', {action: 'sections_prepared' });
}


// sub loop _a
// fill arrays of letters for each section
// required init : 
$scope.fill_chars = function (section, section_count){
	var temp_letters = new Array(); 
	var i;
	var i_array 		= 	0;
	var fulltext 		= 	'';
	var str_start 		= 	section.start;
	var str_end 		= 	section.end;
	var content_string  = 	$scope.doc.content;

	for (i = str_start; i <= str_end; i++) {
		var letter_arr = new Object();
		var ch = '';
		ch = content_string[i];
		
		if (ch === " ") {
          ch = ' ';

    	}
    	if (!content_string[i]) {
          ch = ' ';
    	}
        fulltext += ch;
		letter_arr['char'] = ch;

		//letter_arr['fi_nd'] = new Object({'fi': false, 'nd':false/*, 'md':false*/});
		letter_arr.fi_nd = new Object({'fi': false, 'nd':false/*, 'md':false*/});
		letter_arr.classes = new Array();



		letter_arr.order = i;
		letter_arr.action = '';
		letter_arr.rindex = i_array;
		letter_arr.lindex= i;
		
		//unsued a heavy	letter_arr.objects = new Array();
		letter_arr.href= new Array();
		letter_arr.sectionin = section_count;
		letter_arr.mode= 'display';


		letter_arr.state = new Object({ 'statemode' : 'loading','select' : false,'clicked' : false,'inrange' : false , 'flat': {}  });
	


		letter_arr.sel = false;
		
		temp_letters[i_array]  = letter_arr;
		i_array++;
	}
	 
	 if(!fulltext){
	 	fulltext = '-';
	 }


	$scope.letters[section_count]= temp_letters;

	
	var ftsize= _.size(fulltext)
	$scope.sorted_sections[section_count].fulltext = fulltext;
	$scope.sorted_sections[section_count]['text_content'] = new Array();
	$scope.sorted_sections[section_count]['text_content']['cwidth']= new Array();
	$scope.sorted_sections[section_count]['text_content']['cwidth']['origin'] = ftsize;
	$scope.sorted_sections[section_count]['text_content']['cwidth']['cur'] = ftsize;
	$scope.sorted_sections[section_count]['text_content']['fulltext'] = new Array();
	$scope.sorted_sections[section_count]['text_content']['inserted'] = '0'
	$scope.sorted_sections[section_count]['text_content']['fulltext']['origin'] = fulltext;
	$scope.sorted_sections[section_count]['text_content']['fulltext']['cur']  =  fulltext;
	$scope.sorted_sections[section_count]['text_content']['status'] = new Array('init_origin');
}




/* loop _b
// Push right objects in right sections (distribution in arrays of objects by sections)

// REQUIRED INITs: 
  - loaded tds
  - prepared sections
	
  - overview: 

	each(sorted_sections,s)
		
		init globals objects
		fill_chars()
		init type-position arrays
		
		each(textdatas,td)
			if in s.ranges 
				dispacth in array(type, position)

				if markup 
					dispatch in array(position = inline)

					loop from s.start to s.end 
						add td.type, td.classes,.. to letters
			 	
		push to "all" objects
		push to "global' objects
					



 return 
 > emit event 'dispatched_objects'

*/




$scope.dispatch_obj = function () {

	
	//	
	// START Looping each SECTION
	// 
	_.each($scope.sorted_sections, function(s, index){
		
		// add props to section first
		// letters init ! 
		$scope.fill_chars(s,index);


		
		if(s.css && s.css !=="none"){
			$scope.objects_sections[index]['classes'].push(s.css);
		}
		
		$scope.objects_sections[index] = new Array();
			//$scope.objects_sections[index]['global'] = new Array();
		
		_.each($scope.available_sections_objects, function(o, obj_index){
			$scope.objects_sections[index][$scope.available_sections_objects[obj_index]] = new Array();
				// and each subs objects an array of each positions
				_.each(render.posAvailable() , function(op){ // op: left, right, ..
					$scope.objects_sections[index][$scope.available_sections_objects[obj_index]][op.name] = new Array();
				});
		});

		//
		// START Looping each TEXTDATAS
		//
		_.each($scope.textdatas, function(td){

 				var i_array = 0;	
				//Only if textdata is in sections ranges
			if(td.start >= s.start && td.end <= s.end){

				// some commons attributes
				td.sectionin = index;
				if(!td.isselected){td.isselected = 'false';}
				td.formatedcreatedAt = moment(td.createdAt).fromNow();
				td.status = 'dispatched';
				td.explicit_string  = 	'';
				var i;
				for (i = td.start; i < td.end; i++) {
					var j = i - $scope.sorted_sections[index].start;
					td.explicit_string += $scope.sorted_sections[index]['text_content']['fulltext']['cur'][j];
				}
				
				
				if(td.type && td.position && (td.type=='img' || td.type =='player'  || td.type =='child_section' ) ){
					$scope.objects_sections[index]['classes'].push('has_o has_o_type_'+td.type+' has_o_position_'+td.position);	
				}
				if(td.socketed =='true'){ // not implemented
					//console.log('socketed td in loop');
				}
				// ext ref calls for medias (for exemple, not otehr use yet)
				if(td.docRef && td.docRef.title !==null){
 					//console.log(td.docRef)
					td.ext_doc_array_doc = td.docRef;
								
				}
				if(td.position && (td.type=='child_section')){
				      //incase, could be usefull
				      //$scope.objects_sections[index]['classes'].push('ischild');
				}
				if(td.type && td.position && (td.type=='img' || td.type =='player' || td.type=='child_section') ){
				     $scope.objects_sections[index][td.type][td.position].push(td); 
				   
				}
				if(td.metadata && td.type=='section_class'){
					$scope.objects_sections[index]['classes'].push(td.metadata);	
				}
				
				if(td.type=='markup'){ // or pos == inlined
							var j_arr=0;
							var into_for = 0;
							//console.log('section end:'+section.end)
							//console.log('fc:'+ parseInt(section.end) - parseInt(section.start) );
							var size_object = parseInt(td.end) - parseInt(td.start) -1;
							//console.log('soze'+size_object)
							for (var pos= td.start; pos<=td.end; pos++){ 

								// pushing class to each letter..
								var delta = parseInt(td.start) - parseInt(s.start) + j_arr;
								
								if( pos == td.start  && (td.subtype== 'list-item' || td.subtype== 'h1'  || td.subtype== 'h2' || td.subtype== 'h3'  || td.subtype== 'h4'  || td.subtype== 'h5'  || td.subtype== 'h6' || td.subtype== 'cite' || td.subtype== 'code'   )  )   {
									$scope.letters[index][delta].fi_nd.fi = true; 

								}

								//console.log(size_object +'/'+ j_arr)
								//console.log(delta+ '-' +section.start+'--'+a.start+'--'+deltaz+'?end'+into_for+' / '+j_arr +'/'+i_array)
								if( ( size_object ==  j_arr ) && (td.subtype== 'list-item' || td.subtype== 'h1'  || td.subtype== 'h2' || td.subtype== 'h3'  || td.subtype== 'h4'  || td.subtype== 'h5'  || td.subtype== 'h6' || td.subtype== 'cite' || td.subtype== 'code'  )  )   {
									$scope.letters[index][delta+1].fi_nd.nd = true; 
								}
								//$scope.letters[section_count][delta]['char'] =  j_arr;
								//if(ztype && ztype== 'note'){
								//	$scope.letters[section_count][delta]['classes'].push(a.subtype);
								//	$scope.letters[section_count][delta]['classes'].push(ztype);

								//}
								//else{
									$scope.letters[index][delta]['classes'].push(td.subtype);
									//$scope.letters[section_count][delta]['objects'].push(a);
							        //	    $scope.letters[section_count][delta]['classes'].push('c-'+a.id);

								//}
								if(td.subtype == 'link' && td.metadata){
									$scope.letters[index][delta]['href'].push(td);
								}
								i_array++;
								j_arr++
							}


					$scope.objects_sections[index][td.type]['inline'].push(td);	
					//console.log($scope.objects_sections[index][td.type])
				}	
				if(td.type=='section_column_class'){
					// ?$('#section_from_'+td.start+'_to_'+td.end +' .text-col').addClass(td.metadata);
				}
				if(td.type=='section_style'){
					var styles = new Array();
					styles['prop'] =  td.subtype
					styles['attribute'] =  td.metadata;
					styles['tdid'] =  td.id;
					$scope.objects_sections[index]['css_styles'].push(styles);
				}
				if(td.type=='data'){
					//$scope.objects_sections[index][td.type][td.position].push(td);
				}
				if(td.type=='note' || td.subtype=='place' || td.type=='data' || td.type=='semantic') {		
					if( !td.position || td.position == 'undefined'||  td.position == null || td.position == 'null' ){
						//$scope.objects_sections[index][td.type]['unknown'].push(td);
						console.log('unknown td type:')
					    console.log(td)
					}
					else{

						$scope.objects_sections[index][td.type][td.position].push(td);
					}
				}


				if(td.type && td.position && td.position == 'global'){
					//$scope.objects_sections['global'].push(td)
					$scope.objects_sections['global_by_type'][td.type].push(td)

				
				}
			}
		}) // each textdatas


     	$scope.sorted_sections[index].objects = $scope.objects_sections[index]    
		$scope.sorted_sections[index].letters = $scope.letters[index]
		

		// TEST precompile as string
		
		$scope.sorted_sections[index].precompiled = '';
		for (var ps = s.start; ps<=s.end; ps++){ 

			if($scope.sorted_sections[index].letters[ps] && $scope.sorted_sections[index].letters[ps].classes){
				var flatten_classes = flatten($scope.sorted_sections[index].letters[ps]['classes'])
				$scope.sorted_sections[index].precompiled += '<span class="'+flatten_classes+'" >'+$scope.sorted_sections[index].letters[ps]['char']+'</span>'
		

			}
		}
		
		

	}) // each sections

	//console.log($scope.objects_sections['global_by_type'])
	//console.log($scope.objects_sections['global'])
	// $scope.objects_sections['all'] = all_td 



	$scope.$emit('docEvent', {action: 'dispatched_objects' });
	
}


var flatten= function (n) {
		//console.log(n);
		var out = '';
			_.each(n, function(c, i){out +=  n[i]+' ';});
		return out;
	}
	
// sub loop _d (not really musicbox, rather document's option)
function apply_docmetas(docmetas){	
	console.log('apply_docmetas')
	$scope.docmetas.docfragments 	= new Array();
	$scope.docmetas.doc_notices 	= new Array();
	$scope.docmetas.share_fragment_atindex 	= new Array(); 
 	//works but > V2.. new Array('first', 1, 3,  'last', 'each');
	var googlefonts_loadlist  = new Array();
	//? 
	// no load if predifined?????
	_.each($scope.docmetas , function(dm){
		var dmmk = dm.meta_key;
		var dmmv = dm.meta_value;
		if(dmmk == 'headings_typo' || dmmk == 'text_typo'){
			googlefonts_loadlist.push(dmmv);
			$scope.docmetas[dmmk] = google_unfontize(dmmv);
		}
		else if(dmmk == 'nodes_fragment'){
			$scope.nodes = $scope.working_doc.nodes;
		}
		// note: could be (and), not (else) to fill anyway
		else{
			$scope.docmetas[dmmk] = dmmv;
		}
	});
	 if($scope.globals.fonts_api =='gfonts'){
		_.each(googlefonts_loadlist , function(tfont){
			WebFont.load({
	      	  google: {
	        	 families: [tfont]
	       	 	}
	     	});
		});
	}
}



$scope.click_summarize= function (content) {
	$scope.text_summarize(content);
}

$scope.text_summarize = function(content){
	alert(content)
		$(".mt").toggleClass('summary_isvisible');
		
		if($scope.ilc['summarize_toggle'] == 'true'){
			$scope.ilc['summarize_toggle'] = 'false';
		}
		else{		
			$scope.ilc['summarize_toggle'] = 'true';
			$scope.text_summary = '<h3 class="summarize_title">'+$scope.ilc['summarized_title']+'</h3>';
			_.each($scope.textdatas, function(t){
				console.log(t)
				//// CHECK ORDER !!!!
				if(t.type == 'markup' && (t.subtype =='h1' || t.subtype =='h2' || t.subtype =='h3' || t.subtype =='h4' || t.subtype =='h5') ){
					$scope.text_summary += '<'+t.subtype+'>';
					for (var i=t.start;i<=t.end;i++){ 
						if(content[i]){
							$scope.text_summary += content[i];		
						}
						
					}
					$scope.text_summary += '</'+t.subtype +'>'
				}
				if(t.subtype == 'summary'){
					$scope.text_summary += ' ';
					for (var i=t.start;i<=t.end;i++){ 
						// $scope.text_summary += content[i];	
					}
				    $scope.text_summary += '';
				}
				if(t.subtype == 'summary_block'){
					$scope.text_summary += '<p>'+t.metadata+'</p>';
				}		
			});
		}
}	
// pure load end.

// Ui to watcher
	$scope.godoc = function (doctarget) {
		//console.log(doctarget)
		if(doctarget){
			window.location = '/doc/'+APP_VERSION+'/'+doctarget.renderas+'/'+doctarget.slug
			//	$scope.doctoload.id = doctarget.id
		//	$location.path('/doc/'+doctarget.renderas+'/'+doctarget.slug)
		}
		else{
						window.location = '/';

			//$scope.doctoload.id = '1';
		//	$location.path('/')
		}
				

	}

	// show a fragment at side, index, position..
	// return true or false
	$scope.show_at = function (fragment ,side, index, first, last){	
		var value;
		//	console.log(fragment+'_'+side+'_'+index+'_'+first+'_'+last);
		//	return true;
		if(fragment == 'share'){
			value = $scope.docmetas['share_fragment'];
			if(side =='after_box_right' && last === true  && (value == 'after_title_and_content')  ){
				return true;	
			}
			if(side =='title' && (value == 'after_title_and_content')   ){
				return true;	
			}
			if( side =='left' && first === true){
				//return true;	
			}
			if( side =='right' && last === true){
				//return true;	
			}
		}
		return false;
	}

	$scope.show_share = function (side, index, last){	
		console.log(side+'_'+index+'_'+first+'_'+last)
		if( ($scope.docmetas.share_fragment == side)  &&  (index) ){return true;}
		else if(  ($scope.docmetas.share_fragment == 'after_title' || $scope.docmetas.share_fragment == 'after_title_and_content') &&  (side== 'before_after_before') && (index===true) ) {return true;}
		else if(  ($scope.docmetas.share_fragment == 'after_content' || $scope.docmetas.share_fragment == 'after_title_and_content') &&  (side== 'before_after_after') && (index===true) ) {return true;	}
		return false;
	}

	$scope.toggled_addsomething = function (n) {
		$scope.addsomething = n;
	}



	// used for image slide (fragmentCTRL?)
	$scope.iterator_count = function (index) {$scope.iteratorcounter++;	return 'c'+index;}

	$scope.save_prop_attribute = function(style, section_index, section){
		_.each($scope.objects_sections[section_index]['css_styles'], function(s, i){
				
			if(s.prop == style.prop){
				console.log('td'+s.tdid);
				var data = {id:s.tdid,  css: 'none' , type: 'section_style', subtype: style.prop, metadata :style.attribute, start: section.start, end:section.end};
				$http.post('/apis/textdata/update', serialize(data)).
				success(function(textdata) {
					//console.log(textdata);		
				});			
				//css_obj[style.prop] = style.attribute;
			}	
		});
	}

	$scope.push_prop_attribute = function(section_index, section){
		
		    	var data =  {css: 'none' , type: 'section_style', subtype: 'color', metadata : 'red', start: section.start, end: section.end}
				$http.post('/apis/textdata/'+$scope.working_doc.doc.id+'/create', serialize(data)).
					success(function(textdata) {});
		/*
		_.each($scope.sectionsclass[section_index]['css_styles'], function(s, i){	
			if(s.prop == style.prop){
				console.log('td'+s.tdid);
				var data = {id:s.tdid,  css: 'none' , type: 'section_style', subtype: style.prop, metadata :style.attribute, start: section.start, end:section.end};
				$http.post('/apis/textdata/update', data).
				success(function(textdata) {
					//console.log(textdata);		
				});			
				//css_obj[style.prop] = style.attribute;
			}	
		});
		*/
		
	}
	// push_prop_attribute($parent.$index,sorted_section )
	$scope.section_styles_string = function(section_index){
		//console.log(section_index+'::bug///:');
		var css_obj  = new Object();
		_.each($scope.objects_sections[section_index]['css_styles'], function(style, i){
			css_obj[style.prop] = style.attribute;
		});
		return css_obj;
	}

	// used to return right object(s) at right side in the right section index
	$scope.objects_section_array = function(object_type, section_index, side){	
		//console.log(side)
		var source_array;
		var objects_section;	

		// default side "right"
		if(!side || side ==''){
			var side = 'right';
		}
		if(	
			object_type	=='markup' || 
			object_type	=='comment' || 
		  	object_type	=='note' ||
		  	object_type	=='data' ||
		  	object_type	=='player' ||
		  	object_type	=='semantic' ||
		  	object_type=='img' || 
		  	object_type=='child_section' ||
		  	object_type=='classes'
		){
			// using different $scope._array if global 
			if(side=='global'){
				objects_section = $scope.objects_sections['global_by_type'][object_type];		
			}
			else{
				// in a section, for a type, at side
				
				// version independent array : 
				// objects_section = $scope.objects_sections[section_index][object_type][side];
				
				// version 'section[object]' array
				//console.log($scope.sorted_sections[section_index]['objects'])
				objects_section = $scope.sorted_sections[section_index].objects[object_type][side];
			}		
		}
		else{
			console.log(object_type+' not returned.')
		}
		return objects_section;
	}


// pretty FX on col's
function resize_layout(){
	/// RIGHT (-1 offset)
	// expand col right
		$(".hasimage_right .col-right").removeClass('three')
		$(".hasimage_right .col-right").addClass('four')
	// reduce col text	
		$(".hasimage_right .col-text").removeClass('six')
		$(".hasimage_right .col-text").addClass('five')
	
	/// LEFT	 (-2 offset hihi)
	// expand col left 
		$(".hasimage_left .col-left").removeClass('three')
		$(".hasimage_left .col-left").addClass('five')
	// reduce col text	
		$(".hasimage_left .col-text").removeClass('six')
		$(".hasimage_left .col-text").addClass('four')	
	// IN CASE OF BOTH : 
	//section_text hasimage hasimage_center hasimage_right
}

// used to show author card, date, etc...

$scope.editing_fields = new Array();

$scope.alt= function (action, field, value){

	// change scope-doc values
	/*
	PARAMS : action, field, value
	USE :
	actions/states : 

				First :
				* init 
					create a temp array decalring the field (onthefly)
					return state : init

				Then, if something changed (input action)

				* change
				  return state of field as changed
		
				Both actions:
				* click
				* leave
					IF state is "changed"
					return state "saving"
						IF docmeta 
							save docmeta from array OR create it
						IF "doc fields"
						    save 

						return "saved" state
					
	*/
	if(value && value !==''){

	}
	else{
		value= ' ';
	}
	//console.log('try to'+action);
	if(action == 'init'){
		$scope.editing_fields[field] = new Array();
		$scope.editing_fields[field]['state'] = 'init';

	}

	else if(action == 'change') {
		$scope.dockeys.needed = "true";
		if($scope.dockeys.valid !== "true"){
					return;
				}
		$scope.editing_fields[field]['state'] = 'changed';
	}
	else if(action == 'click' || action == 'leave') {
		if($scope.dockeys.valid !=="true"){
					return;
				}
		if($scope.editing_fields[field]['state'] == 'changed'){
			if($scope.dockeys.valid !== "true"){
					return;
				}
			$scope.editing_fields[field]['state'] = 'saving';
			if(field == 'subtitle' || field == 'doc_notices_after_title' || field == 'doc_notices_before_title' || field == 'footer_center_html'){	
				var datap = {};
				datap.key = $scope.dockeys.key;
				_.each($scope.docmetas , function(dm){
					if(dm.meta_key == field){	
						datap.id = dm.id;
					}
				});
				if(!datap.id){
					datap.meta_key   = field;
					datap.meta_value   = value;
					addPmeta(datap);
				}
				else{
					datap.meta_key   	= field;
					datap.meta_value   	= value;
					console.log(datap);


					$http.post(API_URL+'/apis/docmetas/update', serialize(datap)).
						success(function(docmetas) {
						//	$scope.editing_fields[field]['state'] = 'saved';
							console.log('saved'+field);
					});
				}
			}
			else{
				var key;
				key = $scope.dockeys.key;
				if($scope.dockeys.valid !== "true"){
					return;
				}
				if(field == 'content'){
					var data = {action: 'save_content', 'field':field, 'value':value , 'key':key };
				}
				else{
					// encodeURIComponent(
					var data = {action: 'save_document_field', 'field':field, 'value': value , 'key':key};
				}
				docf.save_doc($scope.doc.id, data);
				$scope.editing_fields[field]['state'] = 'saved';
			}
		}
		else{console.log('...')}
	}
}



function addPmeta  (data){
	if($scope.dockeys.valid !=="true"){
		return;
	}
	$http.post(API_URL+'/apis/docmetas/'+$scope.doc.id+'/create', serialize(data)).
			success(function(docmeta) {
					console.log(docmeta)
					$scope.docmetas.push(docmeta);
	});
}


	///????
	$scope.addTd = function (){
		$http.post(API_URL+'/apis/textdata/'+docid+'/create').
			success(function(textdata) {
				console.log(textdata)
				$scope.textdatas.push(textdata);
		});
	}

	$scope.deleteTd = function (index_delete){	
		console.log(index_delete);
		$http.post(API_URL+'/apis/textdata/'+docid+'/'+index_delete+'/delete').
				success(function(textdatas) {
					console.log(textdatas);
					$scope.textdatas = textdatas;			
		});
	}


	

	$scope.show_side_tabs = function(parent, tab) {
			var si = $scope.cur_sel['section_index'];
			if($scope.toggles[parent][tab][si]){
				console.log(obj+'-'+parent+'on')
			}
			//console.log(t);
	}

	$scope.toggleilc = function (){
		if(obj =='editing_side_left_box'){
				
		}
	    var tedit_mode = $scope.objects_sections[section_toggle_index]['edit_mode'];
		console.log($scope.objects_sections[section_toggle_index])
		//console.log(obj)

		if(	obj == 'editing_side_left_commenting' || 
			obj == 'editing_side_left_markup' || 
			obj == 'editing_side_left_summary'  || 
			obj == 'editing_side_left_hyperlink' || 
			obj == 'editing_side_left_styles' || 
			obj == 'editing_side_left_styles_extend'  || 
			obj == 'editing_side_left_notes' || 
			obj == 'editing_side_left_media'  
			){

	

			$scope.objects_sections[section_toggle_index]['edit_mode'] = new Array('edititable_side_left_box', 'editing_side_left_box');
		}

		if(_.contains(tedit_mode, obj)){
		    $scope.objects_sections[section_toggle_index]['edit_mode'] = _.without($scope.objects_sections[section_toggle_index]['edit_mode'], obj);
		}
		else{
			$scope.objects_sections[section_toggle_index]['edit_mode'].push(obj);
		}



	
	}
$scope.toggle_side_editor = function(obj, zindex) {
			if($scope.toggles[obj][zindex]  && $scope.toggles[obj][zindex]['zindex'] == 'true'){
				
				$scope.toggles[obj][zindex]['zindex'] = 'false'
		  	    $scope.toggles[obj][zindex]['comments'] = 'false'
		  	    $scope.toggles[obj][zindex]['editor_left_start_ranges'] = 'false'
		  	    $scope.toggles[obj][zindex]['editor_left_end_ranges'] = 'false'
		  	    $scope.toggles[obj][zindex]['editor_left_sideofobj'] = 'false'

			}
			else{
				var tarr = new Array();
				tarr['zindex'] = 'true';
				tarr['comments'] = 'true';
				/*tarr['editor_left_tools'] = 'true';

				tarr['editor_left_start_ranges'] = 'true';
				tarr['editor_left_end_ranges'] = 'true';
				tarr['editor_left_sideofobj'] = 'true';
				*/
		  	    $scope.toggles[obj][zindex]= tarr
		  	     
			}
	}

	$scope.shozeditor = function (obj, indexz){
		if($scope.toggles[obj][indexz] && $scope.toggles[obj][indexz]['zindex'] == 'true'){
			return true
		}
		return false;
	}
	$scope.showtabs = function (obj, parent, indexz){
		//console.log(obj+''+parent+'++'+indexz)
		if($scope.toggles[parent][indexz] && $scope.toggles[parent][indexz]['zindex'] == 'true' && $scope.toggles[parent][indexz][obj] == 'true'){
			return true
		}
		return false;
		
	}
	$scope.toggletabs = function (obj, parent, zindex){	
		var tarr = new Array();
		
		if($scope.toggles[parent][zindex] && $scope.toggles[parent][zindex][obj]  && $scope.toggles[parent][zindex][obj] == 'true'){
				$scope.toggles[parent][zindex] = new Array();
				tarr['zindex'] = 'true';
				tarr[obj] = 'false';

				if(obj=='comments' || obj=='markup' || obj=='links' || obj=='images' || obj=='notes'  ){
					tarr['editor_left_tools'] = 'false';
					tarr['editor_left_start_ranges'] = 'false';
					tarr['editor_left_end_ranges'] = 'false';
					tarr['editor_left_sideofobj'] = 'false';
					tarr['editor_left_subtypeofobj'] = 'false';

				}

	  	   		$scope.toggles[parent][zindex] = tarr
		}
		else{
			$scope.toggles[parent][zindex] = new Array();
			tarr['zindex'] = 'true';
			tarr[obj] = 'true';
			
			if(obj=='comments'|| obj=='links' || obj=='images' || obj=='notes'  ){
					tarr['editor_left_tools'] = 'true';

					tarr['editor_left_start_ranges'] = 'true';
					tarr['editor_left_end_ranges'] = 'true';
					tarr['editor_left_sideofobj'] = 'true';
					tarr['editor_left_subtypeofobj'] = 'false';

			}
			if( obj=='markup'   ){ // not side
					
					tarr['editor_left_tools'] = 'true';
					tarr['editor_left_start_ranges'] = 'true';
					tarr['editor_left_end_ranges'] = 'true';
					tarr['editor_left_sideofobj'] = 'false';
					tarr['editor_left_subtypeofobj'] = 'false';


			}
			if(obj=='notes'  ){
					tarr['editor_left_tools'] = 'true';

					tarr['editor_left_start_ranges'] = 'true';
					tarr['editor_left_end_ranges'] = 'true';
					tarr['editor_left_sideofobj'] = 'true';
					tarr['editor_left_subtypeofobj'] = 'true';
			}


	  	    $scope.toggles[parent][zindex] =  tarr 
		}	
	}

	$scope.toggle_side_editor = function(obj, zindex) {
			if($scope.toggles[obj][zindex]  && $scope.toggles[obj][zindex]['zindex'] == 'true'){
				$scope.toggles[obj][zindex]['zindex'] = 'false'
		  	    $scope.toggles[obj][zindex]['comments'] = 'false'
			}
			else{
				var tarr = new Array();
				tarr['zindex'] = 'true';
				tarr['comments'] = 'true';
				tarr['editor_left_start_ranges'] = 'true';
				tarr['editor_left_end_ranges'] = 'true';
				tarr['editor_left_sideofobj'] = 'true';
		  	    $scope.toggles[obj][zindex]= tarr		  	     
			}
	}

	// rewritten in docsfactory...
	// doclog CRUD
	$scope.addDl = function (){
		
		$http.post(API_URL+'/apis/doclogs/'+$scope.working_doc.doc.id+'/create').
			success(function(doclog) {
				console.log(doclog)
				$scope.doclogs.push(doclog);
			});
	}

	// docmetas CRUD
	$scope.newDm = function (){
		var key;
		$scope.dockeys.needed = "true";
		key = $scope.dockeys.key;
		if($scope.dockeys.valid !== "true"){
			return;
		}
		var arr = new Object({ key:key, doc_id : $scope.working_doc.doc.id, meta_key: 'your_key',meta_value: 'your_val' })
		docf.create_dm(arr);
		
	}

	$scope.deleteDm = function (id){	
		var key;
		$scope.dockeys.needed = "true";
		key = $scope.dockeys.key;
		if(!id || $scope.dockeys.valid !== "true"){
			return;
		}
		var data_delete = new Object({ key:key, docid : $scope.working_doc.doc.id,docmetaid: id })
		docf.delete_dm(data_delete);
	}


	// save to api 
	$scope.saveDm = function (mkid,mkn,mkv){
		var key;
		$scope.dockeys.needed = "true";
		key = $scope.dockeys.key;
		if($scope.dockeys.valid !== "true"){
			return;
		}

		if(mkn == "" || mkv == ""){
			alert('please remove docmeta rather than save empty..')
			return;
		}
		var datap = {id:mkid, doc_id :$scope.working_doc.doc.id, meta_key:mkn, meta_value:mkv, key:key};
		docf.save_dm(datap);
	}


	/*editor scopes */
	$scope.basic_dm = function (){
			var  basic_array= new Array(
				/*
				{meta_key: 'doc_notices_after_title',meta_value: '' },
				{meta_key: 'footer_center_html',meta_value: '-' },
				{meta_key: 'image_thumb',meta_value: '' },
				{meta_key: 'short_doc_model',meta_value: 'image_left_title_excerpt' },
				{meta_key: 'short_excerpt',meta_value: 'jjhj jhj h jgh' },
				{meta_key: 'use_authorcard', meta_value: 'full_last' },
				{meta_key: 'share_fragment', meta_value: 'last_full_right' },
				{meta_key: 'share_notice', meta_value: 'Partager' },
				{meta_key: 'nodes_fragment', meta_value: 'last_full' },
				{meta_key: 'text_class', meta_value: 'high_fat' },
				{meta_key: 'text_typo', meta_value: 'Esteban::latin' },
				{meta_key: 'headings_typo', meta_value: '' },
				*/
				{meta_key: 'branding_class', meta_value: 'sa white_bg' }
			);
			_.each(basic_array, function(arr){
				arr.doc_id = $scope.working_doc.doc.id;
				docf.create_dm(arr);
			});
	}

	


	


	// OLD // COMMENTED to clean
	$scope.slide_render_layout= function () {
		
		// #slide pattern
		$scope.current_renders_index++;

		var renders = render.renderAvailable()

		if($scope.current_renders_index == _.size(renders)){
			$scope.current_renders_index=0;
		}

		if($scope.current_renders_index == _.size(renders)-1){
			$scope.render_layout_next = renders[0];
		}
		else{
			$scope.render_layout_next = renders[$scope.current_renders_index+1];
		}
		$scope.render_layout = renders[$scope.current_renders_index];

			$scope.dockeys.needed = "false";
	}

	$scope.filter_dataset_available = new Array('any','section', 'data', 'data:x', 'note', 'markup','child_section','any');
	$scope.filter_subdataset_available = new Array('h1','h2');

	$scope.filter_dataset_by = $scope.filter_dataset_available[0];
	$scope.filter_dataset_by_next = $scope.filter_dataset_available[1];
	
	$scope.filter_subdataset_by = $scope.filter_subdataset_available[0];
	$scope.filter_subdataset_by_next = $scope.filter_subdataset_available[1];

	$scope.slide_filter_dataset_by= function (name) {
		if(name == 'filter_dataset_available'){
			var obj = $scope.filter_dataset_available
		}
		var index_cur =_.indexOf(obj , $scope.filter_dataset_by );
		if(index_cur == _.size(obj )  + 1 ){
			$scope.filter_dataset_by = obj[0]
			$scope.filter_dataset_by_next = obj[1]
		}
		else{
			if(index_cur + 1 == _.size(obj ) -1 ){
				$scope.filter_dataset_by = obj[0]
				$scope.filter_dataset_by_next = obj[1]

			}
			else{
				$scope.filter_dataset_by = obj[index_cur+1]
				$scope.filter_dataset_by_next = obj[index_cur+2]
			}
		}
		//$scope.filter_dataset_by = $scope.filter_dataset_available[1];
	}
	//

	// handle direct switch to (ng-click use)
	$scope.switch_render_layout= function (render) {
		$scope.render_layout = render;
	}

	// push a text string to doc.content (raw)..
	$scope.addtocontent = function (text) {
		var key;
		$scope.doc.content += text+'  ';
		$scope.dockeys.needed = "true";	
		var key = $scope.dockeys.key;
		var data = { 'dockey': key, 'field':'content', 'value': $scope.doc.content };
		console.log(data)
		$http.post(API_URL+'/apis/doc/'+$scope.working_doc.doc.id+'/edit/content/o', serialize(data)).
			success(function(doc_updated) {
				console.log(doc_updated);
		});
	}

	$scope.change_textarea_range = function (cstart, cend, cside){
		   	console.log('changing ranges')          	
			 $scope.rangemarkup.start = cstart;
			 $scope.rangemarkup.end = cend;
			 $scope.rangemarkup.changed = Math.random(0,100);	
	}

	$scope.editing_object_range = function (object, ostart, oend){
		   	console.log('changing ranges')
		   	 $scope.rangemarkup.start = ostart;
			 $scope.rangemarkup.end = oend;
			 $scope.rangemarkup.changed = object.id+'/'+Math.random(0,100)+'-'+oend;		
	}

	$scope.each_td_step_index= function (direction, index) {
			var tds = new Array()
			_.each($scope.textdatas, function(td,td_i){
				console.log(td.id);
				td.start= td.start + 1;
				td.end = td.end + 1;
				//var textdata = {type: p_type, subtype: p_subtype, position :p_position, depth:p_depth, metadata : p_metadata, css: p_css, start: p_start , end: p_end};
				tds.push(td);
			    $scope.$emit('fragmentEvent', {fragment: td, action:'save_object_index'});
			});
			$scope.textdatas = tds
			//$scope.$emit('fragmentEvent', {list: tds, action:'save_object_index'});
	}

	$scope._select_all_objects = function () {
		var nr = new Array();
		if($scope.allselected == 'true'){
			$scope.allselected = 'false';
			 nr['start'] 	= -1;
			 nr['end'] 		= -1;
		}
		else{
			$scope.allselected = 'true';
			 nr['start'] = 0;
		     nr['end'] = _.size($scope.doc.content);
		}
    	nr['changed'] 		=nr['end']+'ssq'+nr['start'] ;
		$scope.rangemarkup = nr;
	};


// misc 
	/* not used, even in api v1. */
	/* function get_me(){
		if( $scope.render_layout !=='debug' ){
			$http.get('/apis/me').
				success(function(me) {
				 $scope.me = me;
				//console.log(me);
			});
		}
	}
	$scope.hideDialog = function (i) {
			$scope.dialogIsHidden = $scope.dialogIsHidden+1;
			alert('hideDialog-'+i+' - total'+$scope.dialogIsHidden)
	};


	//objects_global_array()
	// new in angular rc 2..? returns an "auto array"
	// "unsplits" classes of each letter
	
	$scope.classes_sections_array= function (index) {
		var source_arr = $scope.objects_sections[index]['classes'];
		var out = '';
		///console.log(source_arr);
		_.each(source_arr , function(c, i){
			out +=  c+' ';	
		});
		//console.log(out)
		return out;
	}


	//	 Post a new comment.
	// 	 post to api from form field

	$scope.addDc = function (){
		// resets notice state
		$scope.ilc['comment_state_notice'] = '';
		var comment_data = {comment_text: $scope.comment_model['comment_text'], comment_name: $scope.comment_model['comment_name'], comment_mail: $scope.comment_model['comment_mail'] };
		$http.post(API_URL+'/apis/doccomments/'+$scope.working_doc.doc.id+'/create', serialize(comment_data)).
			success(function(doccomment) {
				if(doccomment.status == 'approved' || doccomment.status == 'pending'){
					socket.emit('news', { action: 'post_comment', comment_text: doccomment.text,  comment_name: $scope.comment_model['comment_name'], comment_status: doccomment.status,  doc_id: $scope.working_doc.doc.id });
					doccomment.commenter = new Array(); // kind of fix..
					doccomment.commenter.createdAt = $scope.ilc[$scope.p_lang]['just-now']
					doccomment.commenter.username = $scope.comment_model['comment_name'];
					$scope.doccomments.push(doccomment);
				}
				if(doccomment == 'missing_fields'){
					$scope.ilc['comment_state_notice'] =   $scope.ilc[$scope.p_lang]['post_comment_missing_fields'];
				}
				else if(doccomment.status == 'approved'){
					$scope.ilc['comment_state_notice'] =  $scope.ilc[$scope.p_lang]['post_comment_approved'];	
				}
				else if(doccomment.status == 'pending'){
					$scope.ilc['comment_state_notice'] =  $scope.ilc[$scope.p_lang]['post_comment_pending'];	
				}
				else{}
		});
	}
	*/



function map_user(userid, kind){
    var user = userinfo();
    var user_obj = user.load(userid, kind);
}

// bug ": :: //"
function google_unfontize(typo){
		var n =typo.replace(/:latin/gi,""); 

	var n =typo.replace(/::latin/gi,""); 
	n = n.replace(/\+/gi, ""); 
	n = n.replace(/ /g,"");
	return n;
}


	//////////////
	//			//			
	// WATCHERS	//
	//			//	
	//////////////
	


	$scope.$watch('doctoload.id', function(value,varz) {
        if ( value !== varz ) {
          console.log('watcher : new doc preload')
          $routeParams.doc_id  = value;
          $scope.doctoload.id = value
          init();
        }
	});


	$scope.$watch('msgflashqueue', function(value,varz) {
	 	 // if ( value !== varz ) {
		var sizeofqueue  = _.size($scope.msgflashqueue)
		$scope.msgflash.push( _.last($scope.msgflashqueue) )
		var asyncmsg= function() {
			$scope.msgflash = new Array();
		}
		setTimeout(asyncmsg,10);         
		//  }
	},true);


/*
	$scope.$watch('cur_sel.section_index', function(newValue, oldValue){
			if (newValue !== oldValue) {
				console.log('section_index change watched');
				// auto close on section change
				// $scope.toggles['editor_left'] = new Array();
			}
	});


	$scope.$watch("cur_range_markups", function(n,o) {
			//if(n !==o){//	}

	});

	$scope.$watch('cur_sel.section_action', function(value, old){
		if(value){
			//alert(value) 
		}
		if(value ) {
		 $scope.fts = _.size($scope.cur_sel.fulltext_n);
			
		}
	});
	// edited "local content", then recompose complete content


 	$scope.$watch('doc_load_status', function(value){
		console.log('doc_load_status:'+value)
		if(value=="loaded"){
			console.log('watcher : doc_loaded:')
			console.log($scope.working_doc)
		}
	});
*/
 
	$scope.$watch("rangemarkup.changed", function(n,o) {
		if(n /*!== oldValue*/) {
		//	switch_letters_classes_by_range($scope.rangemarkup.start, $scope.rangemarkup.end, 'ez', 1)

			$scope.cranges.start =  $scope.rangemarkup.start
			$scope.cranges.end   =  $scope.rangemarkup.end;

			if(n == 'section_toggle'){
				return;
			}

			console.log('range markup watcher: (Array) : ')
			console.log($scope.rangemarkup);
			_.each($scope.sorted_sections, function(se, ids){

				//console.log($scope.sorted_sections[ids])
				var obj_s =  $scope.objects_sections[ids];

				// console.log(obj_s['markup'])
				_.each($scope.available_sections_objects, function(sea, ido){
					_.each(render.posAvailable(), function(op){ // op: left, right, ..
						if($scope.objects_sections[ids][sea][op.name]){
							var of = $scope.objects_sections[ids][sea][op.name];
							_.each(of, function(o,ze){
								//console.log(of)
								// maybe not full...


	var i;
	for (i = o.start; i < o.end; i++) {
var i_r = i - $scope.sorted_sections[ids].start + 1;

								if(o.start >= $scope.rangemarkup.start && o.end <= $scope.rangemarkup.end){										
									$scope.objects_sections[ids][sea][op.name][ze].isselected ='true';
									o.isselected = true;
								//	console.log($scope.letters[ids][o.start]['char'])
								
										
										//$scope.letters[ids][i_r].classes.push('object_selected');
										$scope.letters[ids][i_r]['state'].select = true;
									
								}
								else{
									$scope.letters[ids][i_r]['state'].select = false;
									$scope.objects_sections[ids][sea][op.name][ze].isselected ='false';
								}


}


							}); 
						}
					});
				});
			});
			_.each($scope.sorted_sections, function(sez, idz){
				_.each($scope.letters[idz],function(word, ir){
							var rstart = word.lindex;
							if( ($scope.cur_sel['section_index']  == idz) && rstart >= $scope.rangemarkup.start && rstart <= $scope.rangemarkup.end) {
								word.classes.push('markup_sel_range');
							}
							else{
								word.classes = _.without(word.classes, 'markup_sel_range');
							}
				});
			});

		}
	});

	$scope.$watch('render_layout', function(newValue, oldValue){
		if (oldValue && newValue && (newValue !== oldValue) ) {
			//console.log('render_layout watched:'+$scope.render_layout);
			 // resets selection ranges
			 var nr = new Array();
			 nr['start'] 	= -1;
	 		 nr['end'] 		= -1;
		 	 nr['changed'] 		=nr['end']+'~:~'+nr['start'] ;
	 		 $scope.rangemarkup = nr;
	 		// $scope.doctoload.id = $scope.working_doc.doc.id;
	 		$routeParams.render_layout = newValue;
	 	    $scope.msgflashqueue.push({text:'View mode changed to '+newValue});

	 		// $location.path('/doc/'+newValue+'/'+$scope.working_doc.doc.slug)

		}
	});


	// raw mode // edit/change
	/*
	$scope.$watch('doc.content', function(newValue, oldValue){
		console.log('doc.content watched, doing nothing')
	});
	$scope.$watch('cur_sel.fulltext_n', function(value, old){
		if( value && (value !== old) ){
			console.log('cur_sel.fulltext_n, doing nothing')
		}
 	});
	*/
	

	//////////////
	//			//			
	// 	EVENTS 	//
	//			//	
	//////////////
	

	// DOC 


	$scope.$on('doc', function(event, args) {
		if(args.action){
			if(args.action == 'docmetas_ready'){
				//if($scope.render_layout !==''){
					// fill docmetas used, typo, theming, ..
					apply_docmetas();
				//}
			}
			else if(args.action == 'users_ready'){
				//if( $scope.render_layout !=='summarize'){
					_.each($scope.working_doc.creator, function(creator){map_user(creator, 'creator');});
		            _.each($scope.working_doc.editor, function(editor){map_user(editor, 'editor');});
				//}
			}
			else if( args.action == 'textdatas_ready'){
				$scope.prepare_sections();
			}


			else if( args.action == 'sections_prepared'){
				//fill_loops();
				$scope.dispatch_obj();
			}
			else if( args.action == 'letters_prepared'){
				$scope.dispatch_obj(); // dispatch class, sections, etc..;	
			}
			else if( args.action == 'dispatched_objects'){
				console.log('AR')
			}
	


			else if( args.action == 'section_touched'){
				//fill_loops();
				$scope.dispatch_obj();
			}

			else if (args.action == 'fulltext_update'){
				console.log(args)
				var i;
				var newcontent = '';
				for (i = 0; i < _.size($scope.sorted_sections); i++) {
					if(i ==  args.index){
						newcontent += args.section.text_content.fulltext.cur;
					}
					else{
						newcontent += $scope.sorted_sections[i].text_content.fulltext.origin;
					}
				}
				// $scope.sorted_sections[args.index]['text_content']['fulltext']['origin'] = $scope.sorted_sections[args.index]['text_content']['fulltext']['cur']
				//$scope.sorted_sections[section_count]['text_content']['fulltext']['cur']  =  fulltext;
				var key = $scope.dockeys["key"];
				var data = { 'key': key, 'field':'content', 'value': newcontent };
					docf.save_doc($scope.doc.id, data )
					$scope.sorted_sections[args.index]['text_content']['status'].push('saved to global doc');
					$scope.sorted_sections[args.index]['text_content']['fulltext']['origin'] = $scope.sorted_sections[args.index]['text_content']['fulltext']['cur']
			}
			//alert(args.doc.doc.content)
			else if( args.action == 'saved_doc_content'){
				console.log('doc content UP')
				$scope.doc.content = args.doc.doc.content
			}
			else{
					alert('else doc event (unknown) ')
			}
		}
		else{
			alert('no action set')
		}
	});

	// SECTION EVENTS
	$scope.$on('section', function(event, args) {


		// bug cause triple events
		// todo use massive TD method
		if(args.action &&  args.action == 'enclosed_fragment'){
		    console.log('reload')
		  	 $scope.prepare_sections();
		}
		if(args.action &&  args.action == 'created_section'){
			console.log('created s')
			console.log(args.section)
			$scope.textdatas.push(args.section);
			$scope.prepare_sections();
		}
		if(args.action &&  args.action == 'saved_section'){
			console.log('saved: (array)')
			console.log(args.textdatas)
			_.each($scope.textdatas, function(td,td_i){
				if(td.id == args.textdatas.id){
					console.log('ffffound')
					console.log(td);
					$scope.textdatas[td_i]= args.textdatas;
					$scope.prepare_sections();
				}
			})
		}
		if(args.action &&  args.action == 'fulltext_update'){
			$scope.offset_count = 0;
			console.log(args)	
			// update all after : args.section ..
			$scope.sorted_sections[args.index]['text_content']['status'] = new Array()
			$scope.sorted_sections[args.index]['text_content']['status'].push('saved local text at'+args.inserted+'//'+args.inserted_at+':di'+args.direction +'//'+args.size);
			var tds = new Array();
			var tds_update_list = new Array()
			var insert_at = args.inserted;
			// reindexing each td 
			_.each($scope.textdatas, function(td,td_i){
				var tdtochange ='false';
				if(td.start > args.inserted){
					console.log('update start+1')
					td.start = td.start+args.size;
					td.tochange = 'true'
					//alert('A'+td.start)
					//alert(td.start *100)
					tds_update_list.push(td);
				}
				if(td.end >= args.inserted   ){
					//	$scope.sorted_sections[args.index].end = $scope.sorted_sections[args.index].end +1;
					td.end = td.end+args.size;
					td.tochange = 'true'
					tds_update_list.push(td);
					// tds.push(td);
					//	console.log('update end+1')
				
				}
				if(td.start < insert_at){//	console.log('NOT update start+1')
				}
				if(td.end < insert_at){//	console.log('NOT update end+1')
				}
				// if(td.type == 'markup'){
					/*
					var explicit_string  = 	td.start+'-'+td.end //$scope.doc.content;
					var i;
					for (i = td.start; i < td.end; i++) {
							explicit_string += $scope.sorted_sections[args.index]['text_content']['fulltext']['cur'][i-1];
					}

					td.explicit = explicit_string;
				   }
				*/
				tds.push(td);
				$scope.offset_count = _.size(tds_update_list)
				//console.log(insert_at + ' / '+td.start +' - '+td.end);
				});
				var gindex = $scope.cur_sel['section_index'];
				$scope.$emit('fragmentEvent', {textdatas: tds_update_list , index: gindex, action:'save_massive_object_index'});
				$scope.textdatas = tds;				
		}

       	if(args.action &&  args.action == 'deleted_section'){
       			// can be call  directly in service 'docEvent:textdatas_ready'
       	 		$scope.textdatas = args.textdatas;
        		$scope.prepare_sections();
       	}
		
       	if(args.action &&  args.action == 'added_section'){
       	  //$scope.textdatas.push(args.textdata);
       	  alert('section added, please refresh doc');
         // $scope.sorted_sections.push(args.textdata);
         // $scope.dispatch_obj();
       	}

 		// silent 'services only use'
        /*
       		if(args.action &&  args.action == 'ranges_update'){	//console.log(args.index + '___ranges_update doc___');}
		*/

    }); 


	$scope.$on('fragment', function(event, args) {
		if(args.action){

        //console.log(args)
        // a fragment has moved 		
        if(args.action == 'toggled_position'   ){
			$scope.dispatch_obj()
			// alert('main 1')
        }
		if( args.action == 'saved_object'){
			$scope.dispatch_obj()
			$scope.offset_count=0;	
        }
		if(args.action == 'touched_sections'){
			$scope.textdatas = args.textdatas;
			$scope.prepare_sections();
		}

		if(args.action == 'saved_massive_object_index'){
			$scope.offset_count = 0;
			var tt = $scope.cur_sel['section_index'];
  			_.each($scope.textdatas, function(td,i){
            	 td.tochange = ''; // css3 fx..
       	   });
		   // sub loop
		  // refill_chars($scope.sorted_sections[tt], tt);
       	   // $scope.apply_chars_classes($scope.sorted_sections[tt], tt)
		   $scope.dispatch_obj()
        }
        if( args.action == 'deleted_markup' ){
        	
			$scope.textdatas = args.textdatas;
			$scope.prepare_sections();
        }
        if( args.action == 'pushed_fragment'){	
        		// back from services
        		$scope.textdatas.push(args.textdata);

        		if(args.refresh && args.refresh == false){

        		}
        		else{
        			//fill_chars($scope.sorted_sections[args.index], args.index);
					//apply_chars_classes($scope.sorted_sections[args.index], args.index, 'note')
					//apply_chars_classes($scope.sorted_sections[args.index], args.index, 'markup')
					//$scope.dispatch_obj()
					//$rootScope.$emit('docEvent', {action: 'textdatas_ready' });

					$scope.prepare_sections();
        		}
    			
        }
        if( args.action == 'deleted_fragment'){
			
			// back from services
        	$scope.textdatas = args.textdatas;
        	$scope.prepare_sections();
        	//$rootScope.$emit('docEvent', {action: 'textdatas_ready' });

        	//fill_loops()
			//fill_chars($scope.sorted_sections[args.index], args.index, 'false')	
        	//apply_chars_classes($scope.sorted_sections[args.index], args.index, 'note')
        	//apply_chars_classes($scope.sorted_sections[args.index], args.index, 'markup')	
			//$scope.dispatch_obj()
        }
        // silent 'services only use'
        /*
		if( (args.action == 'delete_markup')  ){}
		if( (args.action == 'push_fragment')  ){}
		if( (args.action == 'create_fragment')  ){}
 		if( (args.action == 'push_markup')  ){}
 		if( (args.action == 'save_dm' )  ){}
 		if( (args.action == 'saved_dm' )  ){}
 		*/
 	}

    });  
	
	

	// "KEY" EVENTS
	// not used.
	//$scope.$on('key', function(event, args) {
		//if(args.action &&  args.action == 'something'){
			//alert('bar')
		//}
	//});


	//tweets and sockets.
	/// W.I.P 
	$scope.tweets = new Array();
	socket.on('news', function (data) {
		//console.log(data);

		if($scope.working_doc.doc.id &&  ( data.action =='socket_to_docTd') && (data.doc_id == $scope.working_doc.doc.id) ){
			$scope.msgflashqueue.push({text:'Incoming live data: '+data.fk});
			console.log('hello server')

		}
		/*
		if( (data.action =='textdata_refresh') && (data.doc_id == $scope.working_doc.doc.id) ){
			console.log('textdata socketed'+data.textdata[0]);
			data.textdata.socketed = true;
			$scope.textdatas.push(data.textdata);
			$scope.dispatch_obj();
		}
		if( (data.action =='tweet') && (data.doc_id == $scope.working_doc.doc.id) ){
			//console.log(data.socketer_name);
			//$scope.doc.content= data.socketer_name;
			//document.title = data.fv;
			//console.log($scope.letters[0][0].char)// = data.fv;
			//$scope.weather  = data.fv
			if($scope.tweets.length > 22){
				$scope.tweets = new Array();
			}

			$scope.tweets.push(data);
			$scope.doc.content += data.fv+'  ';
			var data = {'field':'content', 'value': $scope.doc.content };
				$http.post('/apis/doc/'+$scope.working_doc.doc.id+'/edit/content/'+$scope.doc.content, serialize(data)).
					success(function(doc) {
						
				});
		}
		*/
	});

	/*  
		- SCOPES
	 	- WATCHERS
	*/

	// - SCOPES

	// send input field to API and broadcast results.
	// Only ui handler, use services
	$scope.check_dockey= function () {
			var data = {action: 'testkey', 'dockey': $scope.dockeys["key"] , 'docid': $scope.doc.id };
			$scope.msgflashqueue.push({text:'testing key'});
			$scope.$emit('keyEvent', data);
	}
	// - WATCHERS
	/*
	$scope.$watch('dockeys', function(value,varz) {
				if ( value !== varz ) {
					console.log('dockeys watcher value')
					console.log(value)
				}
	});
	*/

} // </crtl>

//DocumentCtrl.$inject = ['$scope', '$http' , '$location', '$routeParams', 'socket', 'translations', 'userinfo', 'docsfactory'];
