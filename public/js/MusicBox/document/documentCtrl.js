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

angular.module('musicBox.document_controller', []);


//musicBox.controller('FragmentCtrl');


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


function DocumentCtrlRo($scope, $http , $sce, $location, $routeParams ,socket,renderfactory, DocumentService, $anchorScroll) {
	console.log('DocumentCtrlRo')
}



function DocumentCtrl($scope, $http , $sce, $location, $routeParams ,socket,renderfactory, DocumentService, $anchorScroll, MusicBoxLoop,  $timeout) {
		

	doc = new DocumentService()
	
	/**
	* initialization for document and render factory (services)
    * @function DocumentCtrl#init
	*/

	$scope.sectionstocount=0;
	$scope.markup_total_count = 0;

	$scope.mapping_passes = 0;
	$scope.mapping_pass = function(){
		return $scope.mapping_passes++
	}
  
$scope.letters = [];
         
             $scope.max_reached_letter = 0;


	$scope.update_section_count = function(direction){
		if(direction=='add'){
			$scope.sectionstocount++;
		}
		else{
			$scope.sectionstocount--;
		}
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


 $scope.RenderConfig = function () {
    new renderfactory().init()
      

    if($routeParams.fresh ){
        $scope.ui.menus.quick_tools_help.active= 'yes'    
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
      * @description Sub-function to set objects options (doc_options, users_options, etc..)
      * @param {String} object - kind of object to map
      * @param {Array} options - source array
      * @return {{Array}}
      * @function docfactory#apply_object_options
      * @todo ---
      */

      $scope.apply_object_options = function(object, options){
        //console.log(' apply doc_options to object'+object)
        var options_array = [];
        _.each(options , function(option){
            
           
            var op_name = option.option_name;
            options_array[op_name]          = [];
            options_array[op_name]['value'] = option.option_value
            options_array[op_name]['_id']   = option._id
            options_array[op_name]['type']  = option.option_type


           

            if( option.option_value && option.option_type == 'google_typo' && object == 'document'){
               WebFont.load({
                  google: {
                   families: [option.option_value]
                  }
               }); 
               var fixed = options_array[op_name]['value'];
               options_array[op_name]['fixed'] =  fixed.replace(/ /g, '_').replace(/,/g, '').replace(/:/g, '').replace(/400/g, '').replace(/700/g, '') 
            }
        });       
        // console.log(options_array) 
        return options_array;
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


	

	$scope.open_pusher_details= function (type){

		console.log(type)
		//push_generic_from_ranges('media', 'media','left', 'http://img.ffffound.com/static-data/assets/6/aba9eee8a8620e87272efcaedb7b1314d21c0c46_m.jpg')
	
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
	

	
	
	$scope.sync_queue = function(){
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
	}

	/* */
	

	$scope.sync_section_next = function(section, index){
		console.log(index)
		$scope.containers[index+1].start = $scope.containers[index+1].start+1;
	}

	$scope.expand_tools = function(name){


        $scope.ui.menus['quick_tools_document'].open = 'no';
        $scope.ui.menus['quick_tools_help'].open = 'no';
        $scope.ui.menus['quick_tools_published'].open = 'no';

/*
		_.each($scope.ui.menus[0], function(m, i){
console.log(m)

			m[0].open = "no"


		})
*/

		//$scope.ui.menus[name].open = $scope.ui.menus[name].open * -1;
		if($scope.ui.menus[name].open == 'no'){
			$scope.ui.menus[name].open = 'yes'
		}
		else{
			$scope.ui.menus[name].open = 'no'
		}
		//return;
		//alert('d')
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
	$scope.toggle_fragment_ranges = function (kind,classname, markup, value, trigger){
}
	$scope.toggle_fragment_ranges_ol = function (kind,classname, markup, value, trigger){
		console.log('toggle_fragment_ranges'+kind)
		var source = $scope.doc.markups;
		
alert('toggle_fragment_ranges')
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
	
$scope.$watch('ui.selected_range.start', function(newValue, oldValue) {
		//if(oldValue && newValue ){
				if(oldValue == newValue){

				}
				else{
					console.log('ui.selected_range')
					
				

					$scope.ui.selected_range.size = $scope.ui.selected_range.end - $scope.ui.selected_range.start +1
					$scope.ui.selected_range.multi = $scope.ui.selected_range.size > 1 ? true : false
					
					$scope.ui.selected_range.textrange = $scope.textrange()

					 
				}
		//}

	});	

	$scope.$watch('ui.selected_range.end', function(newValue, oldValue) {
		//if(oldValue && newValue ){
				if(oldValue == newValue){

				}
				else{
					console.log('ui.selected_range section:')
					
				
					$scope.ui.selected_range.size = $scope.ui.selected_range.end - $scope.ui.selected_range.start +1
					$scope.ui.selected_range.multi = $scope.ui.selected_range.size > 1 ? true : false
					$scope.ui.selected_range.textrange = $scope.textrange()

				}
		//}

	});

	/*
	$scope.$watch('doc.published', function(newValue, oldValue) {
	 
	  	if(oldValue && newValue && newValue !== oldValue){
	  		
			if(newValue == 'public'){
				/////$scope.ui.menus.quick_tools_published.open='no'
			}
	 	}
	});
	$scope.$watch('MusicBoxLoop.state', function(newValue, oldValue) {
	 
	  	if(newValue && newValue !== oldValue){
			console.log('mb')

			if($scope.MusicBoxLoop.state == 'ready'){
				alert('rm here')
				// new MusicBoxLoop().init(true); 
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



