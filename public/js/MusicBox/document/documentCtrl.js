'use strict';

/*


	DocumentCtrl :
	  
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
    - SocketsListCtrl
    	* sockets debugger view

*/

/**
*
* 	GLOBAL MISC VARS
*
*/

var inheriting = {},
GLOBALS,
render,
mb_ui_,
doc;

angular.module('musicBox.document.controller', []);


function DocumentCtrl($rootScope, $scope, $http , $sce, $location, $routeParams ,socket,renderfactory, DocumentService, $anchorScroll, $timeout, ObjectService, mb_ui) {
			
	render = new renderfactory()
	render.init('document')

	


    doc = new DocumentService()
	doc.Load($routeParams.docid ? $routeParams.docid : 'homepage')

	/**
	* initialization for document and render factory (services)
    * @function DocumentCtrl#init
	*/
	$scope.sectionstocount=0;
	$scope.markup_total_count = 0;
	$scope.mapping_passes = 0;
	$scope.letters = [];
    $scope.max_reached_letter = 0;


	$scope.mapping_pass = function(){
		$scope.mapping_passes++
	}
  

	$scope.update_section_count = function(direction){
		if(direction=='add'){
			$scope.sectionstocount = $scope.sectionstocount+1;
		}
		else{
			$scope.sectionstocount = $scope.sectionstocount-1;
		}
		//	alert($scope.sectionstocount)
		//	return $scope.sectionstocount
	}

	$scope.update_markup_count = function(direction){
		if(direction=='add'){
			$scope.markup_total_count++;
		}
		else{
			$scope.markup_total_count--;
		}
	}
	
    $scope.defocus_containers = function (){
		// call parent CTRL > to move in documentCtrl
		_.each($scope.doc.sections, function(section){
           section.focused  = ''
		})
	}

	$scope.SetSlug = function (slug) {
	    if(!slug){
	        $scope.slug= 'homepage';
	        // using it's route (defined in app.js routers)
	        if($routeParams.docid){
	          $scope.slug = $routeParams.docid
	        }
	    }
	    else{
	       $scope.slug      = slug;
	    }
	    return $scope.slug;
	 };


	$scope.inserted = function(l){
			alert(l)
	}
		
	
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
	
	// reset a markup to a "safe" position and to a safe type {O,1,comment,left}
	// doesnt change else values.
	$scope.reset_markup = function(markup){
		markup.start = 0;
		markup.end= 1;
		markup.type = 'comment';
		markup.position = 'left';
		doc.markup_save(markup)
	}

	$scope.offset_markups = function (){
		doc.offset_markups()
	}
	
	$scope.offset_markup = function (markup, start_qty, end_qty){
		doc.offset_markup(markup, start_qty, end_qty)
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
		alert("old ??")
		markup.editor_tab  = tab;
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

	$scope.insert_new_container = function(mi){
		  $scope.doc.sections.push(mi)
		  doc.docsync();
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
   		/*
	    $rootScope.virtuals= new Array();
	    var virtual_summary = new Object({'slug': 'summary', 'header': 'Text summary', 'auto': {'bytype': 'h1-h6'} , 'implicit': {'bytype': 'summary'} } )
	    var virtual_data_x = new Object({'slug': 'data_x', 'header': 'data serie (x)', 'explicit': {'bysubtype': 'x'} } )
	    var virtual_data_y = new Object({'slug': 'data_y', 'header': 'data serie (y)', 'explicit': {'bysubtype': 'y'} } )
	    var virtual_data = new Object({'slug': 'data', 'header': 'data serie (any)', 'explicit': {'bytype': 'data'} } )


	    $rootScope.virtuals.push(virtual_summary)
	    $rootScope.virtuals.push(virtual_data_x)
	    $rootScope.virtuals.push(virtual_data_y)
	    $rootScope.virtuals.push(virtual_data)
	    */
	  

	    // var virtual_containers = new Object({'slug': 'sections', 'header': 'containers ', 'auto': {'bytype': 'h1-h6'} , 'implicit': {'bytype': 'container'} } )
	    // $rootScope.virtuals.push(virtual_containers)

	    // no need yet but works. 
	    // self.virtualize()
	}
	/* */
	
	$scope.sync_section_next = function(section, index){
		console.log(index)
		$scope.doc.sections[index+1].start = $scope.doc.sections[index+1].start+1;
	}

	// use renderService Shared with UserCtrl
	$scope.expand_tools = function(name){
		render.expand_tools(name)
  	}

  	$scope.toggle_render = function(r){
		render.toggle_render(r)
	}
	
	$scope.Grabcollection = function (by){
		$scope.collection = []
		_.each($scope.doc.markups, function(m, i){
			if(m.selected == true){
				$scope.collection.push(m)
			}
		})
	}

	$scope.test_draft = function (value){
		if(!value){
			return false;
		}
		var n = value.search("draft #");
		if(n==0){
			return true
		}
		return false;
	}





    // transform ranges to string
    // limited to 70 chars

	$scope.textrange =  function(){
		var start 				=  $scope.ui.selected_range.start
		var end 				=  $scope.ui.selected_range.end
        var content_string  	=  $scope.doc.content
        var text_range 			= '"';
        if(end-start > 70){ 
          // a.b.c ... x.y.z
          text_range 			= content_string[start]+content_string[start+1]+content_string[start+2]+content_string[start+3]+' ..('+ (end-start) +' letters)..'+content_string[end-3]+content_string[end-2]+content_string[end-1]+content_string[end]
        }
        else{
        	var ci = 0
            for (var i = start; i <= end; i++) {
            	text_range 		+= content_string[i];
          	}
         }
         text_range				+='"'
         return text_range;
  	}

  	// ** Atomic operation(s)

	$scope.apply_operation = function(){

 			//  $scope.doc.operation.after = {}
 			if($scope.doc.operation.before.type == 'save'){
				doc.docsync();
 			}
 			if($scope.doc.operation.before.type == 'push_container'){
 				var c = $scope.doc.operation.object_
				$scope.doc.sections.push(c)
				$scope.doc.content += c.fulltext
				doc.docsync();
 			}
			
 			$scope.doc.operation.before.state= 'done'
 			// $scope.doc.operation.after.state= 'done'
 			// should be in service-promise 
 			$scope.push_to_operations()

 						 console.log('----------------------- DOCUMNT OPERATION DONE')

			
	} 

	$scope.push_to_operations = function(){
	 	$scope.doc.operations.push($scope.doc.operation)
	}

	$scope.reverse_operation = function(){			
		console.log($scope.doc.operation)
	}


	$scope.operations_clear= function(){
		 $scope.doc.operations= []
	}

	$scope.expand_operation = function(op){
		op.expanded = op.expanded ? !op.expanded : true
	}


	/**
	*  WATCHERS
	* 
	*/
		
	$scope.$watch('doc.operation.before.state', function(newValue, oldValue) {
		if(newValue == 'new'){
			$scope.apply_operation()
		}
		if(newValue == 'error'){
			$scope.doc.operations.push($scope.doc.operation)
		}
	})

	$scope.$watch('doc.title', function(newValue, oldValue) {
		if(newValue){
			console.log('- Document level')
			console.log('- title change watched')
			document.title = newValue
		}
	});

	$scope.$watch('doc.updated', function( newValue,oldValue) {
		if(newValue){
			console.log('- Document level')
			console.log('- content change watched'+newValue)
			$scope.doc.formated_date = moment(newValue).calendar() +', '+moment(newValue).fromNow(); 
		}
	});
	
	/*

	$scope.$watch('doc.markups', function(oldValue, newValue) {
		//
	},true);
	
	$scope.$watch('doc.published', function(newValue, oldValue) {
	  	if(oldValue && newValue && newValue !== oldValue){
			if(newValue == 'public'){
				/////$scope.ui.menus.quick_tools_published.open='no'
			}
	 	}
	});
	
	$scope.$watch('doc.content', function(newValue, oldValue) {
		if(oldValue && newValue && newValue !== oldValue){
			console.log('- Document level')
			console.log('- content change watched')
		}
	});

	$scope.$watch('loaded_markups', function( newValue,oldValue) {
			console.log('[doc] - loaded_markups watched ')		
	}, true);
	
	$scope.$watch('markups', function( newValue,oldValue) {			
				console.log('- Document level')
				console.log('- containers filtered after markups change watched')
	          	// filter markups > only if markup.type ==  "container"
	}, true);
	*/

	

	
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
		console.log($scope.doc)
		
		if(!$scope.markups_pushed){
			$scope.markups_pushed = []
		}
		console.log($scope.markups_pushed)
		if(data.identifier && data.identifier == $scope.doc.slug && data.markups_pushed){
			_.each(data.markups_pushed, function(m){
				    //	m.user_id = {'_id':m.user.user_id}
					$scope.doc.markups.push(m)
				    //  console.log($scope.markups_pushed.length)
				    //	$scope.markups_pushed.push(m)
			})
			$scope.ui.selected_range.redraw= true
		}
		if(data.identifier && data.identifier == $scope.doc.slug && data.content_pushed){
			$scope.doc.content = data.content_pushed
			_.each($scope.doc.sections, function(c,i){
				console.log(c)
				c.redraw = true;
			})
		}
	})


} // end DocumentCtrl

/** 
* list all socketed events
* @class SocketsListCtrl
**/

function SocketsListCtrl($scope, $http , $location, $routeParams, socket) {

			console.log(ROOM)
			$scope.room = ROOM;
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

function DocumentCtrlRo($scope, $http , $sce, $location, $routeParams ,socket,renderfactory, DocumentService, $anchorScroll) {
	console.log('DocumentCtrlRo')
}

// seems this syntax works.
// it's a documentCtrl sub-controller

//musicBox.controller('musicBox.controller.section', ['SectionCtrl']);



var newdoc_service;
function DocumentNewCtrl($scope, $compile, $http , $sce, $location, $routeParams, renderfactory,socket,DocumentService, $timeout) {

	
} // end controller
//DocumentNewCtrl.$inject = ['$scope', '$http' ,'docfactory', '$timeout'];

function DocumentCtrlCompiled($scope, $http , $sce, $location, $routeParams ,socket,renderfactory, DocumentService,DocumentRest,$anchorScroll,  $timeout) {
 	
	//some setup 
	$scope.doc = {slug:$routeParams.docid, mode:'compiled'}
	$scope.cursor = {}
	var cursor = function(letter,action){
			$scope.cursor.start_relative = letter.position.relative
			$scope.cursor.start_absolute = letter.position.absolute
			$scope.cursor.start_local = letter.position.local
			$scope.cursor.action = action

	}
 	var promise = DocumentRest.get({Id:$scope.doc.slug},{  }).$promise;
    promise.then(function (Result) {
       if(Result){
       	console.log(Result)
       	       	$scope.docresult = Result

       //	$scope.doc.compiled_doc = Result.doc.compiled_full
       }
      });

    $scope.la = function(action, letter){
    	
    	console.log(letter)
    	cursor(letter, action) 
    }
}




