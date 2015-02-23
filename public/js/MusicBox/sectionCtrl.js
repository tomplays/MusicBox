
angular.module('musicBox.controllerz', []).controller('SectionCtrl', function($scope, $http, DocumentService, DocumentRest,  MusicBoxLoop) {




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
		$scope.section.fulltext = $scope.to_fulltext();
		$scope.section.fulltext_block = $scope.section.fulltext;
		//console.log($scope.section.objects)
		


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



			if(newValue ){
		 		



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
			console.log($scope.section.objects)
 			 _.each($scope.doc.markups, function(markup){
         
              // only for markups which ranges match container

              			if(!$scope.section.objects_){
              				$scope.section.objects_ = new Array()
              			}

			            if(markup.position && markup.start >= $scope.section.start && markup.end <=$scope.section.end){
			            			

									//$scope.section.objects_.push(markup)
									//console.log(markup)
									if(!$scope.section.objects_[markup.type]){
										$scope.section.objects_[markup.type] = new Array(markup)
									

										if(!$scope.section.objects_[markup.type][markup.position]){
											$scope.section.objects_[markup.type][markup.position] = new Array(markup)
											//$scope.section.objects_[markup.type][markup.position].push()

										}
										else{
											//									$scope.section.objects_[markup.type][markup.position].push(markup)

										}

									}
									else{
									//	console.log('else')
									//	console.log($scope.section)
										//$scope.section.objects_[markup.type][markup.position].push(markup)

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

 



	

}); // end controller

