
angular.module('musicBox.controllerz', []).controller('SectionCtrl', function($scope, $http, DocumentService, DocumentRest,  MusicBoxLoop) {

$scope.distribute_arrays = function(){

	console.log($scope.section.objects_)
	 
	 $scope.section.objects_  = _.groupBy($scope.section.objects_, function(item){return item.position;});
        _.each( $scope.section.objects_, function(value, key, list) {
       	 list[key] = _.groupBy(value, function(item){return item.type;});
   	 }); 




}
$scope.attribute_objects = function(){
  console.log('attribute_objects')
    _.each($scope.$parent.markups, function(markup){
              

        // only for markups which ranges match container
        if(markup.start >= $scope.section.start && markup.end <= $scope.section.end){
              
				markup.sectionin = $scope.$parent.$index
				console.log('attribute_objects')
				if(markup.type =='container'){
					 console.log('attribute_objects self container')
				}
              
               
		  		markup.user_options =  $scope.apply_object_options('markup_user_options',markup.user_id.user_options)

		      		// user "by_me" ownership test
		        markup.by_me = false
		        // console.log(markup.user_id)
		        // console.log($rootScope.userin)
		        if( markup.user_id._id && $scope.$parent.userin._id  && ($scope.$parent.userin._id == markup.user_id._id ) )  {
		             markup.by_me = true;
		        }
				markup.can_approve = false
		        if( $scope.$parent.doc_owner )  {
		             markup.can_approve = true;
		        }

		        markup.visible = true;
		        if(markup.status == 'approved' ||  markup.by_me ==true || markup.can_approve == true){
		          markup.visible = true;
		        }

		        // using "memory" of ui.
		        _.each( $scope.$parent.ui.selected_objects, function(obj){
		          //console.log('keep opn'+obj._id)
		          if(markup._id == obj._id){
		               markup.selected = true;
		            // should select ranges too..
		          }
		        })
		         _.each( $scope.$parent.ui.editing_objects, function(obj){
		          //console.log('keep opn'+obj._id)
		          if(markup._id == obj._id){
		            markup.editing = true;
		          }
		        })


				if(markup.type=='container_class' ){ // or pos == inlined
				   $scope.section.section_classes += markup.metadata+' ';
				}

		        if(markup.type =='child'){ 
		          // to keep doc_id._id (just id as string) in model and not pass to post object later..
		          if(markup.doc_id){ 
		             markup.doc_id_id = markup.doc_id._id;
		             if(markup.doc_id.doc_options){
		               // m.markup.child_options = [];
		               var  options_array =  [];
		                markup.child_options = [];
		                _.each(markup.doc_id.doc_options , function(option){
		                  options_array[option.option_name] = option.option_value
		                });
		                markup.child_options = options_array
		              }
		          }
		          //console.log('children call ...')
		        }
		       	/*
		        if(markup.type =='data'){} 
       		 	if( ($scope.$parent.objSchemas[markup.type].map_range && $scope.$parent.objSchemas[markup.type].map_range==true && markup.visible == true)  || (markup.subtype=='share_excerpt' && markup.visible == true)  ){
       		 	} 
				*/
      

			if(markup.type =='container'){
			  //  markup.isolated = false;
			  //  markup.ready = 'tssdrue';

			}
			if(markup.type == 'media' || markup.subtype == 'simple_page' ||  markup.subtype == 'doc_content_block' ){
			    $scope.section.section_classes += 'has_image ';
			    if(markup.position){
			          $scope.section.section_classes += ' focus_side_'+markup.position +' ';
				}

				if(markup.position == 'background'){
					$scope.section.section_styles = 'background-image:url('+markup.metadata+'); ' ;
				}
			}

			console.log(markup)

	        ///// •¿¿ ///
	        if(markup.type !== "" && markup.position){ // > can add it

				// adding to the global collection
				if(markup.position == 'global'){
					$scope.$parent.objects_sections['global_all'].push(markup)
					// $rootScope.objects_sections['global_by_type'][markup.type].push(markup)
				}
				
				// add markup to container objects (container::index::type::position) 
				// $scope.section.objects_[markup.type][markup.position].push(markup) 

				if(markup.type !=='container'){
					$scope.section.objects_count['all'].count++;
					$scope.section.objects_count['all'].has_object  = true;
					$scope.section.objects_count['by_positions'][markup.position].count++;
					$scope.section.objects_count['by_positions'][markup.position].has_object  = true;
				}
			}

			//   console.log('wraped')
			// console.log(markup)
    	} // if in-range

    }); // each markups end.
}





$scope.init_= function () {

		console.log('init section')
		console.log($scope.section)
		console.log('parent ctrl')
		console.log($scope.$parent)
		console.log('section index'+$scope.$parent.$index)


		
		$scope.$parent.update_section_count('add')
        // $rootScope.sections_to_count_notice = ($rootScope.sectionstocount == 0) ? true : false;



           /* some variable seting for each container */
            container_ = new Object({
                'selecting' : -1,
                'sectionin' : $scope.$parent.$index,
                'isolated'  : false,
                'selected'    : false,
                'editing_text':false,
                'ready' : 'init',
                'modeletters' : 'block',
                'section_classes':''
               // 'fulltext'    : self.ranges_to_fulltext($rootScope.doc.content, container.start, container.end)
            })


            // extend object
         

            // adds default arrays for objects(setup once)

          //  var cp = _.clone($rootScope.object_arr);

              var objectsarray = new Object();

           objectsarray.section_styles  = '';
           //new Array('objects', 'objects_')
          // objectsarray['objects'] = [];
           objectsarray['objects_'] = [];


           objectsarray['objects_count'] = [];
           objectsarray['objects_count']['by_positions'] = [];
           objectsarray['objects_count']['all'] = [];
            // section can have css classes and inlined styles (background-image)
         
            // $rootScope.containers[index]['classes'] =[];
            // $rootScope.objects_sections[index]['global'] = [];
            _.each($scope.$parent.available_sections_objects, function(o, obj_index){
              objectsarray['objects_'][$scope.$parent.available_sections_objects[obj_index]] = [];
              // and each subs objects an array of each positions
              objectsarray['objects_count']['all']= new Object({'count':0, 'has_object':false})
              _.each($scope.$parent.available_layouts  , function(op){ // op: left, right, ..
                objectsarray['objects_count']['by_positions'][op.name] = new Object({'count':0, 'has_object':false})
                objectsarray['objects_'][$scope.$parent.available_sections_objects[obj_index]][op.name] =[];
              });
              // set to "1" for title include.
              // $rootScope.containers[0]['objects_count']['by_positions']['center'].count = 1;
            });





    	 $scope.section = _.extend($scope.section, objectsarray );
   					$scope.section = _.extend($scope.section, container_);

            // reach letter max test
            if($scope.section.end > $scope.$parent.max_reached_letter){
              $scope.$parent.max_reached_letter = $scope.section.end
            } 

            // continous test (prev end match current start)
           /*
            if($rootScope.containers[index-1]){
              var container_prev_end = ($rootScope.containers[index-1].end)+1;
              if(container_prev_end !== container.start){
                console.log('discontinous section found '+container_prev_end+' /vs/'+container.start)
              }
            }
*/


}


$scope.init_()
$scope.attribute_objects()


    $scope.to_fulltext = function (){
        var fulltext = '';
        var i_array     =   0;
       
        for (var i = $scope.section.start; i <= $scope.section.end; i++) {
         	// console.log(i)
         	if($scope.doc.content[i]){
         		fulltext += $scope.doc.content[i];
         	}
     	}
     	return fulltext;
    }

	$scope.$watch('section.hello', function(  oldValue, newValue) {
		//
		if(oldValue){
			console.log(oldValue)
			console.log($scope.section.objects_)
			//$scope.section.objects_[oldValue.type][oldValue.position].push(oldValue)
		}
			


	})
	$scope.$watch('section.ready', function( oldValue, newValue) {
	
	//if(!newValue){
				

	//}
	if(newValue === true){
		console.log('section ready >')
		console.log($scope.section)
	}
	if(newValue == 'init'){
		console.log('section init >')
		//$scope.section.fulltext;
		// = 'blou'

		//for
		
		
		


	}
	//else{
	//	console.log('section NOT ready >'+newValue+'-'+oldValue)
	//	console.log($scope.section)
	//}



		  
});	




$scope.$watch('section.cursor_at', function(oldValue, newValue) {



	if(oldValue){


	
			if($scope.section.letters && $scope.section.letters[oldValue]){
					_.each($scope.section.letters, function(letter,y){
					    letter.classes = _.without(letter.classes, 'cursor_at')
					                
		            })
					$scope.section.letters[oldValue].classes.push('cursor_at')
			}



		 	//if(oldValue !==newValue ){
		 		if(oldValue && newValue)
		 			{


		 		//		alert(oldValue)

		 			}
		 			console.log($scope.section.letters)
		 		

				// $scope.section.fulltext = $scope.section.fulltext.replace("\n", "")
 				var string  = '';
                _.each($scope.$parent.containers, function(container){
                    string  += container.fulltext;
                    
                     console.log(container.fulltext)

                })



            $scope.doc.content = string;
      
if( $scope.ui.selected_range.insert_direction== 'save'){
	var this_sync = new DocumentService()
					 this_sync.SetSlug($scope.doc.slug)
					this_sync.docsync()
}
					
					//$scope.section.letters[$scope.ui.selected_range.insert].classes.push('h1')
					
		//	}

	}
})

$scope.$watch('section.fulltext', function(oldValue, newValue) {
			
			console.log('section fulltext watched')



			if(newValue && oldValue){
		 		

			console.log(oldValue.length - newValue.length)

		 	console.log('section fulltext watched with changes:'+newValue+'>'+oldValue)
		 	

							 		var temp_letters = new Array();
							        var i;
							        var i_array     =   0;
							        var fulltext    =   '';
							        var str_start   =   0;
							        var str_end     =   _.size($scope.section.fulltext);

							        // confing could be a option/mode feature
							        var content_string  = $scope.doc.content


							        var classes_arr = new Array()
							        // classes_arr.h1 = {}
							        // classes_arr.h2 = {}




							        for (i = str_start; i <= str_end; i++) {


									          var letter_arr = new Object({
									              'classes':[], 
									              'classes_array': classes_arr, 
									              'classes_flat': '',
									              'order':i,
									              'char':$scope.section.fulltext[i],
									              'absolute_order':str_start+i,
									          
									          });

										if($scope.ui.selected_range.insert == i){
												//letter_arr.classes.push('mup')
												$scope.section.cursor_at = i_array+1;
										}







									  temp_letters[i_array]  = letter_arr;






									  i_array++;
									 }
						

			$scope.section.letters = temp_letters;

			

			$scope.section.objects_ = new Array()
			console.log($scope.section.objects_)
 			 _.each($scope.$parent.markups, function(markup){
         
              // only for markups which ranges match container

              			if(!$scope.section.objects_){
              				$scope.section.objects_ = new Array()
              				
              			}

			            if(markup.position && markup.start >= $scope.section.start && markup.end <=$scope.section.end){
			           
									//console.log(markup)
									if(!$scope.section.objects_[markup.type]){
									$scope.section.objects_[markup.type] = new Array()
										if(!$scope.section.objects_[markup.type][markup.position]){
												$scope.section.objects_[markup.type][markup.position] = new Array()
											//$scope.section.objects_[markup.type][markup.position].push()
										}
									}
								


									//console.log('apply '+markup.type)

			            			
			            			//console.log(markup)

									 for (var mr = markup.start; mr <= markup.end;mr++) {
									 		if($scope.section.letters[mr]){
									 			temp_letters[mr].classes.push(markup.subtype)
									 			//$scope.section.letters[mr].classes_array[markup.subtype] = true;
												//$scope.section.letters[mr].char = mr;
									 		}

									 }
									 $scope.section.objects_[markup.type][markup.position].push(markup)
			            }
          	});



			console.log($scope.section.objects_)
			$scope.section.end = $scope.section.end+1
			//$scope.section.start = $scope.section.start+1

			
			$scope.section.modeletters = 'single';




		} 


});	

$scope.$watch('section.has_offset', function(o, markup) {

		 	if(markup){
				console.log(markup)
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

$scope.push_generic_from_ranges= function (type, subtype,position,metadata){
		if(metadata){
			$scope.$parent.push.metadata = metadata
		}
		$scope.$parent.push.type = type;
		$scope.$parent.push.subtype = subtype;
		$scope.$parent.push.start= $scope.ui.selected_range.start;
		$scope.$parent.push.end = $scope.ui.selected_range.end;
		$scope.$parent.push.position = position

		$scope.$parent.push.sectionin = $scope.$parent.section.sectionin

		$scope.push_markup();
	}

$scope.save_section= function (){



	// Manual save section
	   			// var string  = '';
                //_.each($scope.containers, function(container){
                  //  string  += container.fulltext;
           //     })
               console.log($scope.section.fulltext)
               console.log('nothing happening here')
                //$scope.doc.content = string;
               // $scope.doc_sync()

	//	section.fulltext =section.fulltext+'----'
	//	$scope.section.fulltext = section.fulltext
	//	console.log(section.fulltext)
		//alert($scope.section.fulltext)
	//	$scope.doc.content = $scope.section.fulltext
	//	$scope.section.end = $scope.section.end+1;
	}



$scope.ssave_section= function (){
		//alert('sd')
	}

	/*
$scope.$watchCollection('containers', function(newValue, oldValue) {

		 	if(oldValue && newValue && newValue !== ''){
		 		console.log('FT! doc')
		 	}
      
    });	




$scope.$watchCollection('section', function(newValue, oldValue) {

		 	if(oldValue && newValue && newValue !== ''){
		 	 alert('hey hello')
		 	}
      
    });	
*/
	// short function to push a comment

	$scope.push_comment= function (){


		

			
		   $scope.push_markup()



	}
$scope.push_object= function (){


			
			console.log($scope.$parent.push)

			
		

		var this_sync = new DocumentService()
		




 var promise = new Object();
        var data = new Object($scope.$parent.push);
        data.username = $scope.userin.username;
        data.user_id = $scope.userin._id;
        promise.data = serialize(data);
        var thos = this;
        // this.Markup_pre();

        promise.query = DocumentRest.markup_push( {Id:$scope.doc.slug},promise.data).$promise;
        promise.query.then(function (Result) {
				if(Result.inserted[0]){
					var mi = Result.inserted[0]
					mi.visible = true;

					console.log(mi)
            	this_sync.flash_message(mi.type +' inserted', 'ok' , 400)

					if(!$scope.section.objects_[mi.type] || !$scope.section.objects_[mi.type][mi.position] ){
						if(!$scope.section.objects_[mi.type] ){
								console.log('no old array type')
								
								$scope.section.objects_[mi.type] = new Array()						
							
							

						}
						if(!$scope.section.objects_[mi.type][mi.position] ){
							console.log('no old array type')
							$scope.section.objects_[mi.type][mi.position] = new Array()
						


						}

						
					}
					//else{
							$scope.section.objects_[mi.type][mi.position].push(mi)
					//}
				
					console.log($scope.section.objects_)

					///this_sync.SetSlug($scope.doc.slug)
					//this_sync.docsync()
					// new MusicBoxLoop().init(true);
					

				}
        		else{
        			alert('err')
        		}
				

			// $scope.$parent.push = new Object()


             
                       }.bind(this));
        promise.query.catch(function (response) {  
           console.log(response)   
         //  this.flash_message('error', 'error' , 3000)
        }.bind(this));

    





	}

	$scope.push_commentjhh= function (markup){



var markup = {}


        //$rootScope.push = this.Markup_pre();
        var promise = new Object();
        var data = new Object(markup);
        data.username = $scope.userin.username;
        data.user_id = $scope.userin._id;
        promise.data = serialize(data);
        var thos = this;
        // this.Markup_pre();

        promise.query = DocumentRest.markup_push( {Id:this.slug},promise.data).$promise;
        promise.query.then(function (Result) {
                thos.flash_message(Result.inserted[0].type +' inserted', 'help' , 100)
             
                       }.bind(this));
        promise.query.catch(function (response) {  
           console.log(response)   
           this.flash_message('error', 'error' , 3000)
        }.bind(this));

      };

 



	$scope.section.fulltext = $scope.to_fulltext();
	$scope.section.fulltext_block = $scope.section.fulltext;

}); // end controller

