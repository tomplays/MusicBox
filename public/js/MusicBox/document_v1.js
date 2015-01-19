'use strict';

/*

AngularJs controllers 
	
	Controllers are used to communicate between user interactions in views (load, clicks, changes) 
	and the document services (factory) located in ./angular-modules/document_services.js
	
	Main : 

	- DocumentCtrl :
	  
	  * document to service communication,
	  * document editing
	  * markup handlers (push, delete, ...) 
	  * document/ranges / events listeners, 
	  * global document UI

	 	- sub-controller :
			
			- FragmentCtrl 
				* markup-object level controller

	Other controllers : 

	- DocumentNewCtrl
		* new document 
    - DocumentsListCtrl
    	* list
    - DocumentCtrlJasmine
    	* jasmine (tests)
    - SectionCtrl
    	* not used
    - SocketsListCtrl
    	* sockets debugger view

*/

/**
*
* 	GLOBAL MISC VARS
*
*/

var inheriting = {};
var GLOBALS;
var render;
var doc;

var app = angular.module('musicBox', []);

// musicBox.controller('DocumentCtrl', DocumentCtrl);
// musicBox.controller('DocumentNewCtrl', DocumentNewCtrl);

//console.log(musicBox)

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


function DocumentCtrlRo($scope, $http , $sce, $location, $routeParams, renderfactory,socket,docfactory, $anchorScroll) {
	console.log('DocumentCtrlRo')
}



function DocumentCtrl($scope, $http , $sce, $location, $routeParams, renderfactory,socket,docfactory, $anchorScroll) {
		
	
	/**
	* initialization for document and render factory (services)
    * @function DocumentCtrl#init
	*/
	$scope.init = function (){

		console.log('DocumentCtrl')
		render        	= renderfactory()
		doc           	= docfactory()
		$scope.render 	= render.init()
		
		// call doc api with complete init.
		doc.load(true)
		return
	}
	
	// like ng-init
	// "direct" call
	$scope.init()

	/**
	*  UI
	* 
	* handle user interactions (click, change, add, save, delete....)
	* can call the factory.
	* @function DocumentCtrl#events
	*/


	/**
	*
	* Document level
	*
	*/
	
	$scope.edit_doc = function(field){
		if(field == 'content'){
			//alert('content change without api offset!')
		}
		// return if not logged
		if($scope.userin.username ==''){
			return false;
		}
		if($scope.ui['editing_'+field] === true){
			doc.save_doc(field)
		}
		
		$scope.ui['editing_'+field]= !$scope.ui['editing_'+field];
		
	}

	$scope.doc_sync = function(){
		doc.docsync();
	}

	// when user doubleclick an option (edit in place)
	// used for footer option and before/after title
	// since functions are commented in views, not used and commented here too.
	/*
	$scope.edit_doc_option = function(field){
		if($scope.ui['editing_'+field] === true){
			doc.save_doc_option(field)
		}
		$scope.ui['editing_'+field] = !$scope.ui['editing_'+field]	
	}
	*/
	

	/*
	* "save doc options" click event. 
	* @use_service True
	* @params 
	*/
	$scope.doc_options_save = function (value, id){
		doc.doc_option_edit(value, id);
	}

	
	
	$scope.doc_options_new = function (){
		doc.doc_option_new();
	}
	
	
	
	$scope.doc_options_delete = function (opt_id){	
		doc.doc_option_delete(opt_id);
	}
	


	/**
	*
	* Markup Level
	*
	*/

	$scope.push_markup = function (){
		
		// sure to set up
		if(!$scope.push.start)		{	$scope.push.start 		= 0 }
		if(!$scope.push.end)		{	$scope.push.end 		= 0 }
		if(!$scope.push.position)	{	$scope.push.position 	= 'left'	}
		if(!$scope.push.type)		{	$scope.push.type 		= 'comment' }
		if(!$scope.push.subtype)	{	$scope.push.subtype 	= 'comment'	}
		if(!$scope.push.metadata)	{	$scope.push.metadata	= '-' 		}
		if(!$scope.push.status)		{	$scope.push.status		= 'pending' }
		if(!$scope.push.depth)		{	$scope.push.depth 		= 1 }
		if(!$scope.push.doc_id_id)	{	$scope.push.doc_id_id 	= 'null'	}
		
		// force autoset / force-correct
		if($scope.push.type == "markup" || $scope.push.type == "container" || $scope.push.type == "container_class" ){ $scope.push.position = 'inline'}
		// object is clean
		doc.markup_push($scope.push)	 // call document service
	}
 	

 	// short function to push a section
	$scope.push_section= function (){	
		// auto set
		$scope.push.start  = (_.last($scope.containers).end)+1
		$scope.push.end  = (_.last($scope.containers).end)+10
		$scope.push.type = 'container';
		$scope.push.subtype = 'container';		
		$scope.push_markup();
	}
	
	// short function to push a comment
	$scope.push_comment= function (section){
		// console.log(section.start +'c++'+section.end)
		$scope.push.type = 'comment';
		$scope.push.subtype = 'comment';
		// use range
		if($scope.ui.selected_range.start){
			$scope.push.start = $scope.ui.selected_range.start;
		}
		else{
			$scope.push.start = section.start;
		}
		if($scope.ui.selected_range.end){
			$scope.push.end = $scope.ui.selected_range.end;
		}
		else{
			$scope.push.end= section.start;
		}	
		// should use
		$scope.push.position = 'left';

		$scope.push_markup();
		// close form.
		$scope.ui.menus.push_comment.open  = -1
		$scope.ui.focus_side = ''
	}

	// reset a markup to a "safe" position and to a safe type {O,1,comment,left}
	// doesnt change else values.
	$scope.reset_markup = function(markup){
		markup.start = 0;
		markup.end= 1;
		markup.type = 'comment';
		markup.position = 'left';
		doc.markup_save(markup)
	}


	// todo refactor to replace_markup
	$scope.markup_type = function(markup, t){
		markup.type = t;
		return;
	}
	
	// todo refactor to replace_markup
	$scope.markup_subtype = function(markup, t){
		console.log(t)
		markup.subtype = t;
		return;
	}
	
	// todo refactor to replace_markup
	$scope.markup_position = function(markup, t){
		console.log(t)
		markup.position = t;
		return;
	}
	
	// change and save a single markup value-field
	$scope.replace_markup = function(markup, field, value){
		markup[field] = value;
		doc.markup_save(markup)
	}

	$scope.push_generic_from_ranges= function (type, subtype,position){
		$scope.push.type = type;
		$scope.push.subtype = subtype;
		$scope.push.start= $scope.ui.selected_range.start;
		$scope.push.end = $scope.ui.selected_range.end;
		$scope.push.position = position
		$scope.push_markup();
	}
	$scope.markup_moderate = function (markup, status){
		console.log('approving..')
		console.log(markup)
		markup.status =status;
		//markup.start = (markup.start)+1
		doc.markup_save(markup)




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
			 	doc.flash_message('can\'t delete last section', 'bad' , 3000)
			 	return
			}
			doc.markup_delete(markup)
		}
		else{
			doc.markup_delete(markup)
		}
		// toggle
		$scope.ui.focus_side = ''
	}

	$scope.offset_markups = function (){
		doc.offset_markups()
	}
	
	$scope.offset_markup = function (markup, start_qty, end_qty){
		doc.offset_markup(markup, start_qty, end_qty)
	}

	// section && markup
	$scope.markup_save = function (markup){
		$scope.ui.focus_side = ''
		doc.markup_save(markup)
	}
	
	$scope.scrollToAnchor= function(anchorID){
		// from : https://docs.angularjs.org/api/ng/service/$anchorScroll
		  var newHash = 'anchor' + anchorID;
    	  if ($location.hash() !== newHash) {
        // set the $location.hash to `newHash` and
        // $anchorScroll will automatically scroll to it
        $location.hash('anchor' + anchorID);
      } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
      }
	}      

	// open "sub-tools" tabs editor for markup or section 

	$scope.markup_editor_tabs= function (tab, markup){

		markup.editor_tab  = tab;
	}


	$scope.object_tools = function (object){

		if(object.object_tools && object.object_tools === true){
			return object.object_tools = false;
		}
		return object.object_tools = true;
	}

	$scope.wrapin_section = function(){
			$scope.objects_in_range('containers');
			//$scope.objects_in_range('markups');
			$scope.push.type = 'container';
			$scope.push.subtype = 'container';
			$scope.push.start = $scope.ui.selected_range.start
			$scope.push.position = 'inline';
			$scope.push.end = $scope.ui.selected_range.end
			$scope.push_markup();
	}

	/**
	*
	* selection / focus
	*
	*/
	

	// open close the comment box.
	$scope.open_comment_push = function (container_index){
		
	    // this way only one menu can me open.. and persistent
		var cur = $scope.ui.menus.push_comment.open;
		if(cur == container_index.sectionin){
			cur = -1	
			$scope.ui.focus_side = ''
		}
		else{
			cur = container_index.sectionin;
			$scope.ui.focus_side = 'side_left'
		}
		$scope.ui.menus.push_comment.open = cur;
		$scope.containers[container_index.sectionin].modeletters = 'single'

		return;


	}

	
	// apply active selection ranges to a markup then save it.
	$scope.match_selection = function (markup){
		// todo: should check notnull
		markup.start    = $scope.ui.selected_range.start
		markup.end 		= $scope.ui.selected_range.end
		// and save (automatic)	
		doc.markup_save(markup)
	}


	$scope.toggle_render = function(r){
		$scope.ui.menus['quick_tools'].open = "no"
		$scope.ui.renderAvailable_active = r
	}

	$scope.switch_focus_side = function(side){
		$scope.ui.focus_side = side;
	}

	/**
	*
	* Utils / misc
	*
	*/


	/* turn links clickable out of angular routing
	* @function DocumentCtrl#external_link
	* @param  {String} link - redirect link
	*/
	$scope.external_link = function (link){
		window.location = link;
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

	/* */
	

	$scope.sync_section_next = function(section, index){
		console.log(index)
		$scope.containers[index+1].start = $scope.containers[index+1].start+1;
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
			}).error(function(err){
				console.log(err)
		})
	}

	// icon click or section select
	$scope.toggle_select_markup = function (markup, event_name){
		console.log(markup)
		if(markup.sectionin || markup.sectionin == 0){
			$scope.containers[markup.sectionin].modeletters = 'single'
		}

		if(markup.isolated == true){
			markup.editing = !markup.editing
			return;
		}
		if(markup.type == 'container'){
			_.each($scope.containers, function(c, i){
				if(c !== markup){
					// toggle the others
					c.selected = false;
				}
			});

		}
		if(event_name == 'dblclick'){
			markup.editing = !markup.editing
		}
		
		if(event_name == 'click'){
				
			markup.selected = !markup.selected


		}


		// focus'
		if(markup.position=="left" && markup.editing){
			$scope.ui.focus_side = 'side_left'
		}
		else if(markup.position=="right" && markup.editing){
			$scope.ui.focus_side = 'side_right'
		}
		else{
			$scope.ui.focus_side = ''
		}
    }	

    // transform ranges to string
    // limited to 70 chars

	$scope.textrange =  function(){
		var start 				= $scope.ui.selected_range.start
		var end 				=  $scope.ui.selected_range.end
        var content_string  	= $scope.doc.content
        var text_range 			= '"';
        if(end-start > 70){ 
          // a.b.c ... x.y.z
          text_range 			= content_string[start]+content_string[start+1]+content_string[start+2]+content_string[start+3]+' ..('+ (end-start) +' letters)..'+content_string[end-3]+content_string[end-2]+content_string[end-1]+content_string[end]
        }
        else{
            for (var i = start; i <= end; i++) {
            	text_range 		+= content_string[i];
          	}
         }
         text_range				 +='"'
         return text_range;
  	}

	$scope.toggle_fragment_ranges = function (kind,classname, markup, value, trigger){
		console.log('toggle_fragment_ranges'+kind)
		var source = $scope.doc.markups;
		

		if(kind=='single_markup'){

			if(markup.type == 'mediarrr'){


			}
			else{
				for (var i = markup.start; i <= markup.end; i++) {
					var delta =  i  - $scope.containers[markup.sectionin].start;
					//console.log(delta)
					if($scope.containers[markup.sectionin].letters[delta]){
						var _classes = $scope.containers[markup.sectionin].letters[delta]['classes'];
						//$scope.letters[markup.sectionin][i]['classes'].push("editing")
						
						//console.log($scope.letters[markup.sectionin][i]['classes'])
						if(_.contains(_classes, classname)  ){
							//alert('s')
							$scope.containers[markup.sectionin].letters[delta]['classes'] = _.without( _classes,classname)
						}
						else{
							$scope.containers[markup.sectionin].letters[delta]['classes'].push(classname)
						}
					}
				}

			}
			
		}


		if(kind=='by_range'){
 			//	console.log('apply '+classname+' from '+$scope.ui.selected_range.start+ ' to: '+ $scope.ui.selected_range.end)
			for (var i = $scope.ui.selected_range.start; i <= $scope.ui.selected_range.end; i++) {
				//if($scope.containers[markup.sectionin].start){
					// - $scope.containers[markup.sectionin].start;
				if(markup.sectionin && $scope.letters[markup.sectionin][i]){
					var delta =  i
					//console.log('delta;'+delta+ ' cs/'+ markup.start)
					//			var _classes = $scope.letters[markup.sectionin][delta]['classes'];
					/*
					if(_.contains(_classes, classname)  ){
						//	$scope.letters[markup.sectionin][delta]['classes'] = _.without( _classes,classname)
					}
					else{
						//	$scope.letters[markup.sectionin][delta]['classes'].push(classname)
					}
					*/
				}
				//}
			}
		}

        // trigger 
		//	console.log('TRIGGER ?'+trigger)

		if(trigger){
		///	$scope.containers[markup.sectionin].selecting = Math.random()
		}
		/*
		if($scope.containers[markup.sectionin].start ){
			var start_range =   markup.start - $scope.containers[markup.sectionin].start 
			var end_range  	= 	markup.end 	 - $scope.containers[markup.sectionin].start
		}
		*/
		return;
		// match from an object and its range.
		//if(markup.type !== 'container'){
			//for (var i = 0; i <= 100; i++) {
			//}
		// match
		
		if(markup.type == 'container'){
			console.log('range--in-g section')
		}
		return;
	}
		
	/**
	*  WATCHERS
	* 
	* Get broadcasted events
	* @function DocumentCtrl#events
	*/
	

	// act as a debugger to count watched count.
	// performances logging.

	/*
	var tttt = 0;
	$scope.$watch('containers', function(newValue, oldValue) {
	   tttt++;
	   // if(oldValue){
	   // 	console.log('////////'+tttt)
	   // }
	});
	*/


    // watch the textarea content.

	$scope.$watch('doc.content', function(newValue, oldValue) {
		//console.log(newValue +'-'+ oldValue)
		if(newValue !==undefined  && oldValue !==undefined && (newValue !== oldValue) ){
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
			$scope.ui.selected_range.diff_old_size  	= _.size(oldValue)
			$scope.ui.selected_range.diff_new_size  	= _.size(newValue)
			$scope.ui.selected_range.diff_at  = diff
			if(_.size(oldValue) > _.size(newValue) ){
				//console.log('old > new (text is shorter) ')
				//console.log('diff'+ ( _.size(newValue) - _.size(oldValue)) )
				$scope.ui.selected_range.diff_qty		=  _.size(newValue) - _.size(oldValue)
				$scope.ui.selected_range.diff_dir		= 'reduced'
			} 
			if(_.size(oldValue) < _.size(newValue) ){
				//console.log('old < new (text is longer) ')
				//console.log('diff'+ ( _.size(newValue) - _.size(oldValue)) )
				$scope.ui.selected_range.diff_qty		= _.size(newValue) - _.size(oldValue)
				$scope.ui.selected_range.diff_dir		= 'expanded'

			} 
			if(_.size(oldValue) == _.size(newValue) ){
				//console.log('same size ')
				$scope.ui.selected_range.diff_qty					= 0;
				$scope.ui.selected_range.diff_dir					= 'inplaced';
			} 

			// each markup concerned by edit (text was edited before or into a markup range)
			
			$scope.ui.selected_range.markups_to_offset 				= []

			$scope.ui.selected_range.diff_objects_concerned_count 	= 0;
		
			if($scope.ui.selected_range.diff_dir == 'expanded' || $scope.ui.selected_range.diff_dir =='reduced'){
				_.each($scope.doc.markups, function(mk, i){
					var touched = false;
					// nothing to to if after range
					if(  diff >  mk.end) {}
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
	}); // watcher


	/**
	*  EVENTS 
	* 
	* Get broadcasted events
	* @function DocumentCtrl#events
	*/
	/*
	$scope.$on('doc', function(event, args) {
		if(args.action){
			console.log('EVENT logger '+args.action)
		}
	});
	*/

	/**
	*  SOCKETS
	* 
	* Get broadcasted events
	* @function DocumentCtrl#events
	*/

	socket.on('news', function (data) {
		console.log(data);
	})
	socket.on('newsback', function (data) {
		console.log('newsback')
		console.log(data);
	})


} // end DocumentCtrl

/** 
* list all socketed events
* @class SocketsListCtrl
**/
function SocketsListCtrl($scope, $http , $location, $routeParams, socket) {


		//$scope.docs = DOCS;
		console.log('SocketsListCtrl')
		$scope.stack = [];
		
     
		socket.on('connection', function (data) {
			console.log('data connecion')
			//socket.join('homepage');

		});


		socket.on('newsback', function (data) {
			console.log('newsback')
			//console.log(data);
			$scope.stack.push(data)
		});
		$scope.fake_socket = function (){
		    //socket.emit('news', {doc_id:'homepage', action: 'fake_action' , type: 'fake' });
		    //alert("-")
		}

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

function SectionCtrl($scope, $http , $sce, $location, $routeParams, renderfactory,socket,docfactory){
	//console.log($scope.section)
	retrun;
}

// seems this syntax works.
// it's a documentCtrl sub-controller

angular.module('musicBox.controller', []).controller('FragmentCtrl', function($scope) {

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

	var autosave = false;
    
    $scope.$watch('markup.position', function(newValue, oldValue) {
          // only new value check
          //console.log(newValue)
         // console.log(oldValue)

          if(oldValue !==newValue && oldValue && oldValue !=='' &&  newValue && newValue !==''){
            $scope.markup.position = newValue;
            	// no toggle $scope.ui.focus_side = ''
              if(autosave){
              	doc.markup_save($scope.markup)
              }  
            //  alert('s')
          }
          else{
            //console.log('watch position untrigger')
          }
      
    });

    $scope.$watch('markup.selected', function(newValue, oldValue) {
          // only new value check
          if(oldValue !== newValue ){
          
        	$scope.toggle_fragment_ranges('single_markup', 'selected', $scope.markup, newValue, true)
          }
          else{
    		// console.log('watch untrigger')
          }
    });

	/*
	$scope.$watch('markup.inrange', function(newValue, oldValue) {
          // only new value check
          if(newValue !==''){
            //console.log(newValue)
            //console.log(oldValue)
            $scope.toggle_fragment_ranges('single_markup', 'selected', $scope.markup, newValue, true)
          }
          else{
            console.log('watch untrigger')
          }
    });
	*/

}); // end controller




var newdoc_service;
function DocumentNewCtrl($scope, $compile, $http , $sce, $location, $routeParams, renderfactory,socket,docfactory, $timeout) {


	$scope.init_new_doc = function (){
		console.log('DocumentNewCtrl')
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"
		newdoc_service =  docfactory()
		newdoc_service.init_new()
		document.title = 'Create a new document'	
	}
	
	$scope.create_doc = function(){
		/*
		console.log($scope.newdoc)
		var thiselem;
		thiselem = document.createElement('div');
		thiselem.innerHTML = $scope.newdoc.raw_content
		document.body.appendChild(thiselem)
		var elem = thiselem
		$scope.serialization = new Serialize(elem)
		console.log($scope.serialization)
		thiselem.remove()
		*/
		newdoc_service.newdoc();
	}
	
	$scope.init_new_doc();
	
} // end controller
//DocumentNewCtrl.$inject = ['$scope', '$http' ,'docfactory', '$timeout'];


// MISC UTILS
function urlencode(str) {
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%')
}
function serialize(obj, prefix) {
  var str = [];
  for(var p in obj) {
    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p]
    str.push(typeof v == "object" ?
      serialize(v, k) :
      encodeURIComponent(k) + "=" + encodeURIComponent(v))
  }
  return str.join("&")
}
