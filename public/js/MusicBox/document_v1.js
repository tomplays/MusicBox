'use strict';
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
*/

// TODO
// doc_options
// "virtual" collections cf $scope.virtualize



// ** GLOBAL MISC VARS
var inheriting = {};
var GLOBALS;
var render;
var doc;


 /**
 * Represents a document.
 * @class DocumentCtrl
 * @param {Object} $scope - angular service
 * @param {Object} $http -  angular service
 * @param {Object} $location -  angular service
 * @param {Object} $routeParams -  angular service
 * @param {Factory} renderfactory -  angular custom factory for render
  * @param {Factory} docfactory -  angular custom factory for document 

 */





function DocumentCtrl($scope, $http , $sce, $location, $routeParams, renderfactory,socket,docfactory) {
		
		console.log('DocumentCtrl on');

		socket.on('news', function (data) {
			console.log(data);
		})
		socket.on('newsback', function (data) {
			console.log('newsback')
			console.log(data);
		})

		/**
		* init a document.
	    * @function DocumentCtrl#init
		*/
		$scope.init = function (){
			console.log('DocumentCtrl init');

		
			render = renderfactory();
			$scope.render = render.init();
			doc =  docfactory();
			doc.init();
			
		}


// util flatten array to string
var flatten= function (n) {
		//console.log(n);
		var out = '';
			_.each(n, function(c, i){out +=  n[i]+' ';});
		return out;
}	




	/**
	* construct virtual collection	
	*  use case : summarization
	*  @params collection_name (header, name , auto{}, implicit{}, explicit{})
	*  @return text string
	*  A. auto : use h1>h6
	*  B  implicit : subtype using corresponding ranges of text (implicit)
	*  C  explicit : subtype collection . > using markup metavalue (explicit)

	*/ 
$scope.virtualize = function(collection){
	//	doc.virtualize(collection)
}



$scope.switch_editing = function (origin){

/*
console.log($scope.inserttext[origin.sectionin])
console.log(origin)

console.log('editing in section'+ origin.sectionin)
console.log('editing from'+ origin.rindex)

var left_text = ''
var right_text = ''

for (var i = 0; i <  origin.rindex; i++) {
	left_text += $scope.doc.content[i]
}
for(var i = origin.rindex; i <  $scope.doc.content.length; i++){
	right_text  += $scope.doc.content[i]
}
$scope.doc.content = left_text+' '+ $scope.inserttext[origin.sectionin] +' '+right_text
// reindex markups



$scope.$emit('docEvent', {action: 'fulltext', type: 'edit', collection_type: 'document', collection:$scope.doc});
*/

}
	

$scope.textarea_event= function( event){
		
			//alert(event)

}


$scope.$watch('doc.content', function(newValue, oldValue) {
	//console.log(newValue +'-'+ oldValue)
if(newValue !==undefined  && oldValue !==undefined && (newValue !== oldValue) )
{
	

		

					var diff = 99999999999999;
					

					for (var i = 0; i <= _.size(newValue); i++) {
							//console.log( newValue[i] )
							//console.log( oldValue[i] )
							//console.log('at index #'+i+'|newletter|'+newValue[i]+' |oldletter|'+oldValue[i])
							if(newValue[i] !== oldValue[i]){
									if(i < diff){
										diff = i;
									}
							}
					}
					//console.log('mini diff at '+diff)



	//console.log(_.size(oldValue))
	//console.log(_.size(newValue))

	$scope.ui.selected_range.diff_old_size  = _.size(oldValue)
	$scope.ui.selected_range.diff_new_size  = _.size(newValue)

	$scope.ui.selected_range.diff_at  = diff

	if(_.size(oldValue) > _.size(newValue) ){
		//console.log('old > new (text is shorter) ')
		//console.log('diff'+ ( _.size(newValue) - _.size(oldValue)) )
		$scope.ui.selected_range.diff_qty=  _.size(newValue) - _.size(oldValue)
		$scope.ui.selected_range.diff_dir= 'reduced'


	} 
	if(_.size(oldValue) < _.size(newValue) ){
		//console.log('old < new (text is longer) ')
		//console.log('diff'+ ( _.size(newValue) - _.size(oldValue)) )
		$scope.ui.selected_range.diff_qty= _.size(newValue) - _.size(oldValue)
		$scope.ui.selected_range.diff_dir= 'expanded'

	} 
	if(_.size(oldValue) == _.size(newValue) ){
		//console.log('same size ')
		$scope.ui.selected_range.diff_qty= 0;
		$scope.ui.selected_range.diff_dir= 'inplaced';
	} 

	// each markup concerned by edit (text was edited before or into a markup range)
	
	$scope.ui.selected_range.markups_to_offset = []

	$scope.ui.selected_range.diff_objects_concerned_count = 0;
	

	if($scope.ui.selected_range.diff_dir == 'expanded' || $scope.ui.selected_range.diff_dir =='reduced'){
		_.each($scope.doc.markups, function(mk, i){

			var touched = false;
			// nothing to to if after range
			if(  diff >  mk.end) {
					
			}
			// means "on" the left of range
			else{

					// means between the range
					if(  diff >=  mk.start) {
							// offset end only
							mk.offset_end = mk.offset_end+$scope.ui.selected_range.diff_qty
							touched = true;

					}
					// means before both start and end..
					else{
						
						// offset both
	 					mk.offset_start = mk.offset_start+$scope.ui.selected_range.diff_qty
	 					mk.offset_end   = mk.offset_end+$scope.ui.selected_range.diff_qty;

						touched = true;


					}



			}


			if(touched){
				console.log(mk.type)
				$scope.ui.selected_range.markups_to_offset.push(mk)
			}


		






		});
	}







}

});




	$scope.doc_sync = function(){
		doc.docsync();
	}


	$scope.sync_section_next = function(section, index){
		//alert(index)
		//alert(index+1)
		//alert('d')
		console.log(index)
		$scope.containers[index+1].start = $scope.containers[index+1].start+1;
	}

	// re set a markup to "safe" place {O,1,comment,left}
	$scope.reset_markup = function(markup){
		markup.start = 0;
		markup.end= 1;
		markup.type = 'comment';
		markup.position = 'left';
		doc.markup_save(markup)
	}


$scope.allo = 's'
$scope.over= function(position, event){

		console.log('over ctrl '+position, event);
		$scope.allo = 'ds'
 		
 	//	var start_range = position;
 	//	var end_range  =  position+10
		$scope.selectingd = 'd'


	}
$scope.over= function(position, event){

		console.log('over ctrl '+position, event);

 		
 	//	var start_range = position;
 	//	var end_range  =  position+10
	



		// scan markups in range.
		_.each($scope.doc.markups, function(c, i){
					//	c.selected= true;
						//c.selected = true;
						if(c.start == 5){
							$scope.letters[c.sectionin][5]['classes'].push('selected')
							c.selected = true;
						//	console.log(c.selecting );
						}
						
							/*

						if(c.end<= end_range || c.start == start_range  || c.start <= start_range ){
							console.log('container:'+c.type+' ('+c.start+' -- '+c.end+')');
							c.selected= true;




													for (var i = c.start; i <= c.end; i++) {
													//	console.log(i)
													var _classes = $scope.letters[c.sectionin][i]['classes'];

												
												if(_.contains(_classes, 'selected')  ){
													 $scope.letters[c.sectionin][i]['classes'] = _.without( _classes,'selected')

												}
												else{
													$scope.letters[c.sectionin][i]['classes'].push('selected')

												}
												console.log(_classes)

											}

						

						}
						*/

						// console.log(c.objects)










		});
	
	



}
	$scope.over_= function(letter, event){
		
		var down_at;
		var up_at;
		down_at  = $scope.ui.selected_range.start
		up_at	 = $scope.ui.selected_range.end

		console.log(event)

		//console.log(letter)


		var event_at = letter;
		

		if(event == 'down'){
			down_at = event_at;

			if(down_at < $scope.ui.selected_range.end){
				$scope.ui.selected_range.start = down_at
			}
			else{
				$scope.ui.selected_range.start = down_at
			}

		}
		if(event == 'up'){
			var up_at =  event_at;
			$scope.ui.selected_range.end = up_at
		}
		if(event == 'click'){
			
			$scope.ui.selected_range.end = letter;
			$scope.ui.selected_range.start = letter;


			console.log(letter)

		}


		// if end < start inf case:
		// var true_end = start
		// start = end
        // end = true_end

		
		$scope.ui.selected_range.textrange = doc.text_range($scope.ui.selected_range.start, $scope.ui.selected_range.end)   


		

///

/*

		if(event == 'click'){
			if(letter.href !==''){
				//console.log(letter)
				//alert(letter.href)
				window.location = letter.href
			}
		}
*/

		//if(event_at <= $scope.ui.selected_range.start){
		//	$scope.ui.selected_range.start = event_at;
		//}
		//else{
			//$scope.ui.selected_range.start =  event_at;
		//}

		//if(event_at > $scope.ui.selected_range.end){
		//	$scope.ui.selected_range.end= event_at;
		//}
		//else{
			//$scope.ui.selected_range.start =  event_at;
		//}
		//console.log(letter)
		//$scope.ui.selected_range.start  = letter.rindex
		//$scope.ui.selected_range.end = letter.rindex
		

		// apply selected to objects in ranges

	
		$scope.objects_in_range('containers');



	}
	

	$scope.edit_doc = function(field){


		if(field == 'content'){
			//alert('content change without api offset!')
		}	
		if($scope.userin.username ==''){
			return false;
		}


			if($scope.ui['editing_'+field] === true){
				$scope.ui['editing_'+field] = false;
				doc.save_doc(field)
			}
			else{
				$scope.ui['editing_'+field]= true;
			}
	}

	$scope.edit_doc_option = function(field){
		if($scope.userin.username ==''){
			return false;
		}
		if($scope.ui['editing_'+field] === true){
				$scope.ui['editing_'+field] = false;
				doc.save_doc_option(field)
				//alert($scope.doc_options[field].value)
			}
			else{
				$scope.ui['editing_'+field]= true;
			}

				
	}

	$scope.switch_focus_side = function(side){

		$scope.ui.focus_side = side;
	}


	$scope.newDm = function (){
		doc.create_doc_option();
	}
	$scope.deleteDm = function (opt_name){	
		doc.delete_doc_option(opt_name);
	}
	// save to api 
	$scope.saveDm = function (opt_name){
		doc.save_doc_option(opt_name);
	}



	$scope.toggle_select_markup = function (markup, event_name){
			markup.selected = true
			markup.editing= true

			//alert(markup.type)
			console.log(markup)
			//return;
			var source = $scope.doc.markups;
		
	
		
	

				var start_range = markup.start 	- $scope.containers[markup.sectionin].start 
				var start_range  = markup.end 	- $scope.containers[markup.sectionin].start



			// match from an object and its range.
			//if(markup.type !== 'container'){
					for (var i = markup.start; i <= markup.end; i++) {

						var _classes = $scope.letters[markup.sectionin][i]['classes'];

						//$scope.letters[markup.sectionin][i]['classes'].push("editing")
						//$scope.letters[markup.sectionin][i]['classes'].push("selected")
						//console.log($scope.letters[markup.sectionin][i]['classes'])

						if(_.contains(_classes, 'selected')  ){
							 $scope.letters[markup.sectionin][i]['classes'] = _.without( _classes,'selected')

						}
						else{
							$scope.letters[markup.sectionin][i]['classes'].push('selected')

						}

					}
			//}

			// match
			if(markup.type == 'container'){
						console.log('rangeing section')

			}



			$scope.containers[markup.sectionin].selecting = Math.random()
			return;





	/*
		if(!start_range || !end_range){
			var start_range = $scope.ui.selected_range.start
			var end_range = $scope.ui.selected_range.end
		}
		
*/
      

		var objects_in_range = []


		_.each(source, function(c, i){

				// should be later test.

				//if(start_range < c.end || start_range < c.start){
				//	if(end_range > c.end  || end_range > c.start ){
						
					if(c.type !== 'container'){


							// single select a mk.
							console.log('mk');









					}

					if(c.type == 'container'){
						console.log(c.objects)
						console.log('container:'+c.type+' ('+c.start+' -- '+c.end+')');


						console.log(_.keys(c.objects))
							// loop types
							_.each(_.keys(c.objects), function(key, u){
								

								var pos_keys = _.keys(c.objects[key])

									// loop positions
									_.each(pos_keys, function(skey, u){
										//	console.log(c.objects[key][skey])
												
										// loop objects at type _ position
										var objs = c.objects[key][skey];
										_.each(objs, function(ob, w){


											ob.selected = false;
											



											if(start_range < ob.end || start_range < ob.start){
												if(ob.type !== 'container' && (end_range > ob.end  || end_range > ob.start) ){

													ob.selected = true;
													console.log(ob.type)
													objects_in_range.push(ob);









												}
												else{
													
												}
											}
											
											//ob.selected = true;
										})



									})

								//console.log(c.objects[key])
							});

}

						

					//}
				//}




		});


		
		console.log(objects_in_range);
		_.each(objects_in_range, function(o, us){ console.log(o) });



// triger
// 	








    }

	$scope.toggle_select_markupP = function (markup, event_name){
		if(!event_name){
			var event_name = 'click'
		}


 	//	alert(markup.sectionin)


 	//	alert($scope.containers[markup.sectionin].selecting)
		var real_start = markup.start 	- $scope.containers[markup.sectionin].start 
		var real_end   = markup.end 	- $scope.containers[markup.sectionin].start


		

		if(markup.selected===true && event_name == 'click'){
			markup.selected = false
		}
		else if(markup.selected===false && event_name == 'click'){
			markup.selected =true
		}
		
		// cant edit if not a 'by_me' markup
		if( ($scope.doc_owner == true  ||  $scope.ui.secret ||  markup.by_me == 'true') && markup.editing===true && event_name == 'dblclick'){
			markup.editing = false
		}
		else if( ($scope.doc_owner == true  ||  $scope.ui.secret ||  markup.by_me == 'true')  && markup.editing===false && event_name == 'dblclick'){
			markup.editing = true
		}
		console.log(markup)


		$scope.ui.selected_range.start = real_start
		$scope.ui.selected_range.end 	= real_end
		$scope.ui.selected_section_index = markup.sectionin




		if(markup.editing == true){
			$scope.ui.editing_objects.push(markup)
		}
		if(markup.editing == false){
			$scope.ui.editing_objects = _.without($scope.ui.editing_objects, markup)
		}

		if(markup.selected == true){
			$scope.ui.selected_objects.push(markup)
			$scope.$emit('docEvent', {action: 'selection', type: 'select' });
		}
		if(markup.selected == false){
			$scope.ui.selected_objects = _.without($scope.ui.selected_objects, markup)
			$scope.$emit('docEvent', {action: 'selection', type: 'unselect' });
		}




	}


	$scope.match_selection = function (markup){
		// apply selection to mk
		//alert('e')

		markup.start = $scope.ui.selected_range.start
		markup.end = $scope.ui.selected_range.end
		doc.markup_save(markup)

	}


	$scope.open_comment_push = function (container_index){
		
	// this way only one menu can me open.. and persistent
		var cur = $scope.ui.menus.push_comment.open;
		if(cur == container_index.sectionin){
			cur = -1	
			$scope.ui.focus_side = ''
		}
		else{
			cur = container_index.sectionin;
			$scope.ui.focus_side = 'left'
		}
		$scope.ui.menus.push_comment.open = cur;
		return;
	}

    $scope.push = new Object;


	$scope.push_section= function (){

		$scope.push.start  = (_.last($scope.containers).end)+1
		$scope.push.end  = (_.last($scope.containers).end)+10
		$scope.push.type = 'container';
		$scope.push.subtype = 'container';		
		$scope.push.position = 'inline';
		$scope.push_markup();
	}



	$scope.push_generic_from_ranges= function (type, subtype,position){

				$scope.push.type = type;
				$scope.push.subtype = subtype;
				$scope.push.start= $scope.ui.selected_range.start;
				$scope.push.end = $scope.ui.selected_range.end;
				$scope.push.position = position

				$scope.push_markup();



	}

	// change and save a single value of a markup
	$scope.replace_markup = function(markup, field, value){
		markup[field] = value;
		doc.markup_save(markup)
	}


	$scope.push_comment= function (section){

		// console.log(section.start +'c++'+section.end)
		$scope.push.type = 'comment';
		$scope.push.subtype = 'comment';

		$scope.push.start= section.start;
		$scope.push.end = section.end;
		
		$scope.push.position = 'left';

		$scope.push_markup();

		// close form.
		$scope.ui.menus.push_comment.open  = -1
		$scope.ui.focus_side = ''

	}


	$scope.push_markup = function (){
			console.log($scope.push)
			

			// sure to set up
			if(!$scope.push.depth){
				$scope.push.depth = 1;
			}
			if(!$scope.push.start){
				$scope.push.start = 0;
			}
			if(!$scope.push.end){
				$scope.push.end = 1;
			}
			if(!$scope.push.type){
				$scope.push.type = 'markup';
			}
			if(!$scope.push.metadata){
				$scope.push.metadata= '-';
			}
			if(!$scope.push.status){
				$scope.push.status= '-';
			}
			if(!$scope.push.subtype){
				$scope.push.subtype = 'h1';
			}
            if(!$scope.push.position){
				$scope.push.position = 'inline';
			}
			if(!$scope.push.doc_id_id){
				$scope.push.doc_id_id = 'null';
			}
			// force autoset
			if($scope.push.type=="markup"){$scope.push.position = 'inline'}
			if($scope.push.type=="container"){$scope.push.position = 'inline'}
			if($scope.push.type=="container_class"){$scope.push.position = 'inline'}


			//call service
			doc.push_markup($scope.push)

		

	}
	$scope.offset_markups = function (){
		doc.offset_markups()
	}
	
	$scope.offset_markup = function (markup, start_qty, end_qty){
		doc.offset_markup(markup, start_qty, end_qty)
	}


	$scope.markup_save = function (markup){
		doc.markup_save(markup)
	}


	// open tools for markup or section 
	$scope.object_tools = function (object){
		if(object.object_tools && object.object_tools === true){
			return object.object_tools = false;
		}
			return object.object_tools = true;
	}

	$scope.objects_in_range = function(select_by, start_range, end_range){
		var source = $scope.doc.markups;
		
	
		

		if(select_by == 'containers'){
			var source = $scope.containers;

		}
	
		if(!start_range || !end_range){
			var start_range = $scope.ui.selected_range.start
			var end_range = $scope.ui.selected_range.end
		}

      

		var objects_in_range = []


		_.each(source, function(c, i){

				// should be later test.

				//if(start_range < c.end || start_range < c.start){
				//	if(end_range > c.end  || end_range > c.start ){
						console.log('ok:'+c.type+' ('+c.start+' -- '+c.end+')');
						

						console.log(c.objects)

						console.log(_.keys(c.objects))
							// loop types
							_.each(_.keys(c.objects), function(key, u){
								

								var pos_keys = _.keys(c.objects[key])

									// loop positions
									_.each(pos_keys, function(skey, u){
										//	console.log(c.objects[key][skey])
												
										// loop objects at type _ position
										var objs = c.objects[key][skey];
										_.each(objs, function(ob, w){


											ob.selected = false;
											



											if(start_range < ob.end || start_range < ob.start){
												if(ob.type !== 'container' && (end_range > ob.end  || end_range > ob.start) ){

													ob.selected = true;
													console.log(ob.type)
												}
												else{
													
												}
											}
											
											//ob.selected = true;
										})



									})

								//console.log(c.objects[key])
							});



						objects_in_range.push(c)

					//}
				//}




		});
		console.log(objects_in_range);



/*

		_.each(source, function(mk, i){

			if( mk.type !== 'container'){
				if(start_range < mk.end || start_range < mk.start){
					if(end_range > mk.end  || end_range > mk.start ){
						//console.log('ok:'+ mk.type+' ('+mk.start+' -- '+mk.end+')');
						objects_in_range.push(mk)
					}
				}
			}

		});
		console.log(objects_in_range);
		_.each(objects_in_range, function(o, i){
		

		});
*/
$scope.containers[0].selecting = Math.random()

		return objects_in_range;




	}

	$scope.wrapin_section = function(){
		
			$scope.objects_in_range('containers');
			//$scope.objects_in_range('markups');


			$scope.push.type = 'container';
			$scope.push.subtype = 'container';
			$scope.push.start = $scope.ui.selected_range.start
			$scope.push.position = 'inline';
			$scope.push.end = $scope.ui.selected_range.end
		//	$scope.push_markup();

	}

	/**
	* delete a markup on click
	* @function DocumentCtrl#delete_markup
	* @param  {Object} markup - markup to delete
	*/
	$scope.markup_delete = function (markup){
		 if(markup.type=="container"){
			 //alert('can hold objects!')
			 //return;
			 if($scope.sectionstocount == 1){
			 	alert('can\'t delete last section')
			 	return
			 }
			 doc.markup_delete(markup)
		 }
		else{
			doc.markup_delete(markup)
		}
	}

	/**
	* turn links clickable out of angular routing
	* @function DocumentCtrl#external_link
	* @param  {String} link - redirect link
	*/
	$scope.external_link = function (link){
		window.location = link;
	}

	$scope.expand_tools = function(name){

		//$scope.ui.menus[name].open = $scope.ui.menus[name].open * -1;
		if($scope.ui.menus[name].open == 'no'){
			$scope.ui.menus[name].open = 'yes'
		}
		else{
			$scope.ui.menus[name].open = "no"
		}
		//return;
		//alert('d')
	}

	$scope.toggle_render = function(r){
		$scope.ui.menus['quick_tools'].open = "no"
		$scope.ui.renderAvailable_active = r
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
				$scope.upload_file_image.fullpath = root_url+'/uploads/'+m[0].path+m[0].basename


				$scope.push.metadata = $scope.upload_file_image.fullpath


			}).error(function(err){
				console.log(err)
		})


	}



	/**
	*  EVENTS 
	* 
	* Get broadcasted events
	* @function DocumentCtrl#events
	*/

	$scope.$on('doc', function(event, args) {
		if(args.action){
			console.log('EVENT logger '+args.action)
			

			if(args.action == 'reload'){
				//alert('d')
			}

			if(args.action == 'fulltext'){
				doc.init_containers()
			}
			if(args.action == 'selection'){

					// NOT STABLE
					// loop each  $scope.ui.selected_objects.

					for (var i = $scope.ui.selected_range.start; i <= $scope.ui.selected_range.end; i++) {
						if(args.type == 'select'){
							$scope.letters[$scope.ui.selected_section_index][i]['classes'].push('selected');
						}
						if(args.type == 'unselect'){
							$scope.letters[$scope.ui.selected_section_index][i]['classes'] = _.without($scope.letters[$scope.ui.selected_section_index][i]['classes'], 'selected')
						}

					}
				//	socket.emit('news', {doc_id: $scope.doc.title, action: args.action , type: args.type });
					console.log($scope.ui);


			}
			if(args.action == 'doc_ready'){	
				doc.init_containers()
				if(args.type !== 'load'){
				//	socket.emit('news', {doc_id: $scope.doc.title, action: args.type, collection_type: args.collection_type, collection: args.collection });
				}
			}
			if(args.action == 'containers_ready'){
				doc.distribute_markups()
			}
			if(args.action == 'dispatched_objects'){
				$scope.ui.loaded = 'loaded'


			}

			


		}

	});

$scope.init()

//alert(API_SERVER_URL)
} // CTRL

/** 
* list all socketed events
* @class SocketsListCtrl
**/
function SocketsListCtrl($scope, $http , $location, $routeParams, socket) {
		//$scope.docs = DOCS;
		console.log('SocketsListCtrl')
		$scope.stack = [];
		socket.on('newsback', function (data) {
			//console.log('newsback')
			//console.log(data);
			$scope.stack.push(data)
		})
		$scope.delete_markup = function (markup,doc_id){
		
		 $http.get(root_url+'/api/v1/doc/'+doc_id+'/markups/delete/'+markup._id).success(function(m) {
			//console.log(m)
			alert('job done')
			//$scope.doc = m;
			//$scope.$emit('docEvent', {action: 'doc_ready' });
		 })
		}
}
/** 
* @class DocumentsListCtrl
**/
function DocumentsListCtrl($scope, $http , $location, $routeParams, socket) {
		$scope.docs = DOCS;
		console.log($scope.docs)

}


// used to test jasmine test technique..
function  DocumentCtrlJasmine($scope, $http , $sce, $location, $routeParams, renderfactory,socket,docfactory){
			return 'hello';
} 


var newdoc_service;

function DocumentNewCtrl($scope, $http , docfactory) {
console.log('DocumentNewCtrl')



	$scope.init_new_doc = function (){
       	 	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

			 newdoc_service =  docfactory();
			 newdoc_service.init_new();
			//alert('A')
	}

	$scope.create_doc = function(){
		console.log($scope.newdoc)
		 newdoc_service.newdoc();
	}

	$scope.init_new_doc()
	//alert('0')

}


// MISC UTILS
function urlencode(str) {
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%');
}

function serialize(obj, prefix) {
  var str = [];
  for(var p in obj) {
    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
    str.push(typeof v == "object" ?
      serialize(v, k) :
      encodeURIComponent(k) + "=" + encodeURIComponent(v));
  }
  return str.join("&");
}



DocumentNewCtrl.$inject = ['$scope', '$http' , 'docfactory'];

