
angular.module('musicBox.controller', []).controller('MarkupCtrl', function($scope, $http) {
	

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



	$scope.handle_change_range = function(oldValue,newValue, sore){
			console.log(sore+'of markup changes watched')
			//alert(oldValue+'-->'+newValue)

			//alert($scope.markup.sectionin)

			_.each($scope.$parent.section.letters, function(l,i){

				//	l.classes= new Array()
			})
			//$scope.markup.$parent.letters = new Array()
			//console.log($scope.markup)
					//	console.log($scope.markup.$parent)
			//console.log($scope.$parent.section.letters)
                _.each($scope.$parent.section.letters, function(l){
                	//	l.classes = new Array();
				})

            var st_at = $scope.markup.start-$scope.$parent.section.start

			for (var pos= st_at; pos<=newValue; pos++){ 
				//if($scope.markup.type !== 'container'){
					
					if($scope.$parent.section.letters[pos]){
						//console.log($scope.$parent.section)
						//console.log(pos)
						//$scope.$parent.section.letters[pos].classes.push('mup')
					//	$scope.$parent.section.letters[$scope.markup.end].classes.push('mup')

						$scope.$parent.section.letters[pos].classes.push($scope.markup.subtype)
					}
					else{
										//		console.log(pos)

					}
					//$scope.markup.$parent.section.letters[pos].classes = []
					//$scope.markup.$parent.section.letters[pos].classes.push($scope.markup.subtype)

			//	}
			}


	}
	/*
	$scope.$watch('markup.ready', function( oldValue, newValue) {
		//if(newValue === true){
			console.log('mk ready')
						console.log($scope.markup)

	//	}
		
	 });
	 */	


	$scope.$watch('markup.start', function( oldValue, newValue) {
        if(newValue && newValue !== oldValue){
          	$scope.handle_change_range(oldValue,newValue,  'start')
		}	 
   });	

   $scope.$watch('markup.end', function(  newValue, oldValue) {
         if(newValue && newValue !== oldValue){
          	$scope.handle_change_range(oldValue, newValue,  'end')
		}	 
   });	
  


    $scope.$watch('markup.position', function(oldValue,newValue ) {
        	
     		if(newValue && oldValue && oldValue !== newValue){
	  			// only new value check
	          console.log('watch position trigger>')

	       

	        //$scope.$parent.section.hello= new Object($scope.markup)

	           // $scope.markup.position = newValue;
	            //no toggle 
	           // $scope.ui.focus_side = ''
				if(!$scope.$parent.section.objects_[$scope.markup.type]){
					$scope.$parent.section.objects_[$scope.markup.type] = new Array()
					if(!$scope.$parent.section.objects_[$scope.markup.type][newValue]){
						$scope.$parent.section.objects_[$scope.markup.type][newValue] = new Array()
					}
				    $scope.$parent.section.objects_[$scope.markup.type][newValue].push($scope.markup)
				}
			///	console.log($scope.markup)
			//	console.log($scope.$parent.section)
			//	$scope.$parent.section.objects_[$scope.markup.type][oldValue] = _.reject($scope.$parent.section.objects_[$scope.markup.type][oldValue], function(mk){ return mk._id = $scope.markup._id; });



				//console.log($scope.$parent.objects_[$scope.markup.type][oldValue])
			//	$scope.$parent.section.objects_[$scope.markup.type][oldValue] = _.without($scope.$parent.section.objects_[$scope.markup.type][oldValue], $scope.markup)
	            /// doc.markup_save($scope.markup)

          }
          else{
          		//console.log(newValue)
	         	//console.log(oldValue)
           		// console.log('watch position untrigger')
          }



          $scope.$parent.section.fulltext = $scope.$parent.section.fulltext+'-'
          
          


      
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


	// used for editing a markup posittion ui.
	// icon click or section select
	$scope.toggle_select_markup = function (event_name){
		console.log($scope.markup)
		if($scope.markup.sectionin || $scope.markup.sectionin == 0){
			$scope.containers[$scope.markup.sectionin].modeletters = 'single'
		}

		if($scope.markup.isolated == true){
			$scope.markup.editing = !$scope.markup.editing
			return;
		}
		if($scope.markup.type == 'container'){
			_.each($scope.containers, function(c, i){
				if(c !== $scope.markup){
					// toggle the others
					c.selected = false;
				}
			});

		}
		// event 
		if(event_name == 'dblclick'){

			if($scope.doc_owner || $scope.markup.by_me === true){
				$scope.markup.editing = !$scope.markup.editing
			}
			if($scope.markup.by_me === false){
				// alert('not by me')
			}
		}
		if(event_name == 'click'){
			$scope.markup.selected = !$scope.markup.selected
		}
		if($scope.markup.editing === true){
			$scope.markup.selected = true;
		}

		// focus'
		if($scope.markup.position=="left" && $scope.markup.editing){
			$scope.ui.focus_side = 'side_left'
		}
		else if( ($scope.markup.position=="right" || $scope.markup.position=="inline") && $scope.markup.editing){
			$scope.ui.focus_side = 'side_right'
		}
		else{
			$scope.ui.focus_side = ''
		}
    }	


	$scope.mini_layout_class= function (markup,mkpos ){
		var output = ''
		//console.log($scope.objSchemas[markup.type].positions.available)
		if($scope.objSchemas[markup.type] && _.contains($scope.objSchemas[markup.type].positions.available, markup.position) ){
			output += ' selectable'
		}
		else{
			output += ' unselectable'
		}
		if(markup.position == mkpos ){
			output += ' selected'
		}
		return output


		
	}
	//console.log($scope.markup);
	
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
					// could autosave : doc.markup_save($scope.markup)

					
				}).error(function(err){
					console.log(err)
			})
		}



}); // end controller


  Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
