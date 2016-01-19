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




angular.module('musicBox.document.controller', []);



 /**
 * controller for document.
 * @class DocumentCtrl
 * @param {Object} $scope - angular service
 * @param {Object} $http -  angular service
 * @param {Object} $location -  angular service
 * @param {Object} $routeParams -  angular service
 * @param {Factory} renderfactory -  angular custom factory for render
 * @param {Factory} docfactory -  angular custom factory for document 
 */


function DocumentCtrl($scope, $http , $sce, $location, $routeParams ,socket,renderfactory, DocumentService, $anchorScroll, $timeout, MarkupService) {
		

	doc = new DocumentService()



			
	 $scope.inserted = function(l){
		alert(l)
	}
	
	/**
	* initialization for document and render factory (services)
    * @function DocumentCtrl#init
	*/

	$scope.sectionstocount=0;
	$scope.markup_total_count = 0;




	$scope.mapping_passes = 0;
	$scope.mapping_pass = function(){
		$scope.mapping_passes++
	}
  
	$scope.letters = [];
    $scope.max_reached_letter = 0;


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
	/**
      * @description 
      * Show a message to user
      *
      *  @param {String} msg - message to show
      *  @param {String} classname - a css class ('ok'/ 'bad' / ..)
      *  @param {Number/Time} timeout - 

      *  @return -
      * 
      * @function docfactory#flash_message
      * @link docfactory#flash_message
      * @todo --
      */

      $scope.flashmessage = function (msg,classname ,timeout, closer) {
        $scope.flash_message = {}
        $scope.flash_message.text = msg;
        $scope.flash_message.classname = classname;

        if(!closer){
            $scope.flash_message.closer =false;
        }
        else{
            $scope.flash_message.closer = closer;
        }
        

        // apply timeout if set to true
        if(timeout){
            $timeout(function(){
                $scope.flash_message.text =  '';
            },timeout);
        }
      }

     $scope.defocus_containers = function (){
			// call parent CTRL > to move in documentCtrl
		  _.each($scope.doc.containers, function(container){
            	container.focused  = ''

		  })
	}

$scope.SetSlug = function (slug) {
    if(!slug){
        $scope.slug= 'homepage';
        // using it's route (defined in app.js routers)
        if($routeParams.docid){
          $scope.slug = $routeParams.docid

        }
        if($routeParams.docid){
          $scope.slug = $routeParams.docid
       
        }
    }
    else{
       $scope.slug      = slug;
    }
    return $scope.slug;
  };


 $scope.RenderConfig = function () {
    new renderfactory().init('document')
      

    if($scope.ui.menus.quick_tools_help.visible == true){
    	
        $scope.flashmessage($scope.render_config.i18n.CUSTOM.HELP.fresh_document, 'help' , 3000, true)
    }


  }

	
	
	$scope.init = function (){
		console.log('DocumentCtrl init')
		$scope.SetSlug()
		$scope.RenderConfig()
		doc.Load($scope.slug)
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
		
		  $scope.doc.containers.push(mi)
		  doc.docsync();
	}


	$scope.toggle_render = function(r){
		console.log('toggled_render from '+$scope.ui.renderAvailable_active+' to '+r)
		$scope.ui.menus['quick_tools_document'].open = "no"
		$scope.ui.menus['quick_tools_help'].open = "no"
		$scope.ui.menus['quick_tools_published'].open = "no"
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
		$scope.doc.containers[index+1].start = $scope.doc.containers[index+1].start+1;
	}

	$scope.expand_tools = function(name){
/*
        $scope.ui.menus['quick_tools_document'].open =false
        $scope.ui.menus['quick_tools_help'].open= false;
        $scope.ui.menus['quick_tools_published'].open = false
        */
		if(!$scope.ui.menus[name].open || $scope.ui.menus[name].open === false){
			$scope.ui.menus[name].open = true
		}
		else{
			$scope.ui.menus[name].open = false
		}
		
		
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
         text_range				 +='"'
         return text_range;
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
	$scope.$watch('doc.containers', function(newValue, oldValue) {
	   tttt++;
	   // if(oldValue){
	   // 	console.log('////////'+tttt)
	   // }
	});
	*/
	

	


	
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
	$scope.$watch('ui.selected_range.redraw', function(newValue, oldValue) {
		//console.log('<<<<<<<<<< ui.selected_range.redraw')


		//console.log(newValue, oldValue)
		if(!newValue || newValue === false){
			//console.log('<<<<<<<<<< do nothing (ui.selected_range.redraw end)')
		}
		else{
		
					
				//console.log('reset all document markups to selected = false')
			//	_.each($scope.markups, function(m, i){
	  				
			//	})

	 if( $scope.ui.selected_range.wait_ev == true   ){
       
     

				// stop redraw loop (each section)
				$scope.ui.selected_range.redraw=false
				$scope.ui.selected_range.set=true
				$scope.ui.selected_range.size = $scope.ui.selected_range.end - $scope.ui.selected_range.start


				// at least one char
				if($scope.ui.selected_range.size == 0){
					$scope.ui.selected_range.size = 1
				}
				$scope.ui.selected_range.multi =  ($scope.ui.selected_range.size) > 1 ? true : false
			

				_.each($scope.doc.containers, function(c,i){
				
					 c.inrange_letters  = Math.random()
					 c.inrange_markups  =  Math.random()
					 

					  console.log('-------------CASE UI ONLY')
				})
 }

		}
	})
/*
	 $scope.$watch('doc.markups', function(oldValue, newValue) {
      
		//
   },true);
*/

	$scope.$watch('ui.selected_range.start', function(newValue, oldValue) {
			if(newValue==null){
				
			}
			else{
				    if($scope.ui.selected_range.wait_ev == false){
						$scope.ui.selected_range.redraw=true
					}
			}
	});	

	$scope.$watch('ui.selected_range.end', function(newValue, oldValue) {

			if(newValue==null){
				
			}
			else{
					if($scope.ui.selected_range.wait_ev == false){
						$scope.ui.selected_range.redraw=true
					}
			}
					
	});






	$scope.$watch('doc.operation.before.state', function(newValue, oldValue) {

			if(newValue == 'new'){
				 $scope.apply_operation()

			}
			if(newValue == 'error'){
				$scope.doc.operations.push($scope.doc.operation)
			}
	})

	$scope.apply_operation = function(){

 			//  $scope.doc.operation.after = {}

 			if($scope.doc.operation.before.type == 'save'){
				doc.docsync();
 			}
 			if($scope.doc.operation.before.type == 'push_container'){
 				var c = $scope.doc.operation.object_
				$scope.doc.containers.push(c)
				$scope.doc.content += c.fulltext
				doc.docsync();
 			}
			




 			 $scope.doc.operation.before.state= 'done'
 			 // $scope.doc.operation.after.state= 'done'
 			 // should be in service-promise 
 			 $scope.push_to_operations()
			
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

















	/*
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
	*/
/*
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
			_.each($scope.doc.containers, function(c,i){
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

/*
	$scope.init_new_doc = function (){
		console.log('DocumentNewCtrl')
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"
		
		newdoc_service =  new DocumentService()
		newdoc_service.RenderConfig()
		newdoc_service.init_new()

		//newdoc_service
		
		$scope.userin= USERIN;
		document.title = 'Create a new document'	
	}

*/
	/*
	$scope.create_doc = function(){
		
		console.log($scope.newdoc)
		var thiselem;
		thiselem = document.createElement('div');
		thiselem.innerHTML = $scope.newdoc.raw_content
		document.body.appendChild(thiselem)
		var elem = thiselem
		$scope.serialization = new Serialize(elem)
		console.log($scope.serialization)
		thiselem.remove()
		
		var newdoc_service =  new DocumentService()
		newdoc_service.RenderConfig()
		newdoc_service.newdoc();
	}
	
	$scope.init_new_doc();
*/
	
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




