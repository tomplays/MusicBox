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
var text = 'On Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industry On Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industryOn Thursday, December 1st, 2011 WikiLeaks began publishing The Spy Files, thousands of pages and other materials exposing the global mass surveillance industry'
//console.log(_document)

// ** GLOBAL MISC VARS
var inheriting = {};
var GLOBALS = new Array();
GLOBALS.facebook_page_url = '';
GLOBALS.fonts_api = 'gfonts';
GLOBALS.load_section_style = true;
GLOBALS.show_section_size = false;


// MAIN document controller
// require files "filters.js" and "services.js" for CTRLs


// 
function DocumentCtrl($scope, $http , $location, $routeParams,socket, translations, userinfo, docsfactory) {
	console.log('Document 2 Ctrl')
    //socket.emit('news', { action: 'post_comment' });
  //  console.log(this)
	//$scope.doc.sections.push(sectionA)
	//$scope.doc.sections.push(sectionB)





	var docf = docsfactory();
	docf.init_first();
	if(!$routeParams.doc_id){
		 $routeParams.doc_id = 1;
		 $routeParams.render_layout = 'read'
	}
   	// basic vars for a doc
	docf.init();

	
	
	
	// routes params + determine doc id to load
	docf.listen_routes();
	docf.load($scope.doctoload);
	


$scope.$watchCollection('doc.sections', function(value,varz) {
//alert(' !!!!! value doc watched !!!!!!!')
		
		//$scope.$parent.sections[0] = $scope.section
       
	},true);

$scope.$watch('doc.xval', function(value,varz) {

	if(value !==-1 && value && value !== varz){
	
		$scope.doc.xval= value; 

		$scope.doc.scount=_document.textdatas.length
		// $scope.doc.sections.length
		console.log(value)

	}
		//$scope.$parent.sections[0] = $scope.section
       
	},true);

 	
    $scope.y= 5;

	$scope.transform = function(a,b) {
       $scope.$parent.x++;
        console.log('$scope.$parent.x')
    };
$scope.toggleobjectindex= function() {

  



  };

$scope.init = function() {
	

  }
   $scope.pushnew= function(o) {
   	
		
 }
    
	//var tt =this.transform(5, 6)
//$scope.init()
} // </crtl>



function SectionCtrl($scope, $http , $location, $routeParams,socket, translations, userinfo, docsfactory) {
	//console.log($scope.section)
	

$scope.init= function() {
	$scope.section._status = 'none'
	

	$scope.populate()
  
  }
  $scope.reinit= function() {
	//$scope.doc.sections = new Array()
	
	$scope.populate()
  
  }
	//console.log('SectionCtrl 2 Ctrl')
	//console.log($scope.$parent.doc.sections)
  $scope.sectionclick= function() {

  	var tt = {
      "css": "",
      "metadata": "aasdsdaa",
      "type": "img",
      "subtype": "img",
      "position": "right",
      "start": $scope.section.start,
      "end": $scope.section.end,
      "version": null,
   
      "id": 907,
      "createdAt": "2013-08-24T05:53:32.000Z",
      "updatedAt": "2013-08-24T05:53:33.000Z",
      "IdocId": 1
    }


   $scope.doc.textdatas.push(tt)
   $scope.section._status = 'object added'
   $scope.$parent.doc.xval = $scope.section
	$scope.doc.sections =  _.filter($scope.doc.textdatas, function(td){ return  td.type == 'section'; });
    $scope.populate()
  }
  

    $scope.populate= function() {
_.each($scope.$parent.doc.sections, function(s,is){


$scope.$parent.doc.sections[is].osections = new Array()

_.each($scope.$parent.doc.textdatas, function(a){
				var i_array = 0;	
					if(a.type !=='section'){
						 
						 if(a.start >= s.start && a.end <= s.end){
						 	$scope.$parent.doc.sections[is].osections.push(a)
						 }
					


					}
		})



 	 $scope.$parent.doc.sections[is].ocount =$scope.$parent.doc.sections[is].osections.length
 	$scope.section.fulltext = $scope.fulltexter()

})


////////console.log($scope.section.letters)


	
 }

    $scope.fulltexter= function() {
		$scope.section.fulltext = '';
		$scope.section.letters = new Array()
		var str_start 		= 	$scope.section.start;
		var str_end 		= 	$scope.section.end;
		var temp = '';
		var real_array_index = 0;
		for (var i = str_start; i <= str_end; i++) {
			//console.log(text[i])

			
			$scope.section.letters[real_array_index] = new Array()
			$scope.section.letters[real_array_index]._char = $scope.doc._content[i]
			// minimal useless $scope.section.letters[i].objects =  new Array()
			$scope.section.letters[real_array_index]._classes  = '';
			//minimal useless $scope.section.letters[i]._tempclasses  = new Array()
			
			var _tempclasses  = new Array()
			
			$scope.section.fulltext += $scope.doc._content[i]


			_.each($scope.section.osections, function(o, obj_index){
				//console.log(o)


						if(i >= o.start && i <= o.end ){


							if(o.type && o.position ){
															_tempclasses.push('has_o_position_'+o.position, 'has_o_type_'+o.type)

							}
							//console.log('letter ('+i+')has Object')
							//console.log(o.position)
							//$scope.section.letters[i].objects.push(o)
						}

				    
	                  
			})

			// flatten
			  _tempclasses = _.uniq(_tempclasses)
	           _.each(_tempclasses, function(_class){ 
	                $scope.section.letters[real_array_index]._classes += _class+' ';
	           }); 
            //$scope.section.osections

			real_array_index++;
		}
		
	 	return  $scope.section.fulltext 



	}

	
	

   // $scope.doc.sections[0].osections['left'].push(osectionsb)
   //$scope.doc.sections.osections['left'] = new Array(osectionsb)
   //$scope.doc.section.osections['left'].push(osections)

	//console.log($scope.section.osections['left'])
	//console.log($scope.doc.sections)

	
	// apply on doc !
	//$scope.transform(5, 6)
	//$scope.$parent.transform(5, 6)

	$scope.modifyBothScopes= function() {
       ///$scope.$parent.x++;
       //console.log($scope.$parent.x)
       //$scope.x++;
       //$scope.section.x++;
 
    };

	//wi $scope.modifyBothScopes()
	//wi $scope.$parent.transform(5, 6)

	
	
	$scope.$watchCollection('section', function(value,varz) {
		if(value){
		//	alert('value section watched !!!!!!!')
		//console.log('zindex=')
		//console.log(value.zindex)
		//console.log($scope.$parent.xval)
		//$scope.section.xval = section.xval + 1
		//$scope.populate()
		//$scope.$pusharent.doc.sections.start+1;
	//	$scope.doc.xval++;
	//	$scope.$parent.doc.xval++;

		//console.log($scope.doc.sections[value.zindex].fulltext )
		}
		
		//$scope.$parent.sections = value
       
	},true);




$scope.$watch('sections._status', function(value,varz) {

	console.log('!! '+ varz +' to  '+ value)
		if(varz && value !== 'none' && value && value !==varz){
		//	alert('value section watched !!!!!!!')
		//console.log('s status change from '+ varz +' to  '+ value)
		//console.log(value.zindex)
		//console.log($scope.$parent.xval)
		//$scope.section.xval = section.xval + 1
		//$scope.populate()
		//$scope.$pusharent.doc.sections.start+1;
	//	$scope.doc.xval++;
	//	$scope.$parent.doc.xval++;

		//console.log($scope.doc.sections[value.zindex].fulltext )
		}
		
		//$scope.$parent.sections = value
       
	});

	//$scope.section.ocount = $scope.section.osections.length

}



function LetterCtrl($scope, $http , $location, $routeParams,socket, translations, userinfo, docsfactory) {

$scope.letterclick = function(l){
	$scope._classes += ' h1 '
	$scope.$parent.section._status = 'clicked letter'
	$scope.$parent.$parent.doc.xval  = l
	$scope.$parent.$parent.doc.xval.type  = 'letter'

	$scope.section.letters
}



}

function ObjectCtrl($scope, $http , $location, $routeParams,socket, translations, userinfo, docsfactory) {
	/*
	console.log('0SectionCtrl 2 Ctrl')
	console.log($scope.$parent.sections)
	console.log($scope.$parent.$parent.sections)
	console.log(this)
	*/
	
	 $scope.x = 0;
	$scope.modifyBothScopes= function(m) {
       //$scope.$parent.x++;
       //$scope.$parent.$parent.x++;
        //$scope.$parent.$parent.x++;
       console.log($scope.$parent.$parent.x)
        console.log($scope.$parent.section)
		console.log($scope.$parent.$parent.section)


		//$scope.$parent.section.end = 121;
		$scope.$parent.$parent.section.end = $scope.$parent.$parent.section.end+1;
		//$scope.sections = $scope.$parent.$parent.sections;
		//$scope.$parent.$parent.sections[0].end = 111;
 		//$scope.$parent.section.x++;
        //$scope.x++;


    };



	$scope.clicked= function (object) {
		console.log($scope.osection) // this

   		console.log('first ?'+$scope.$first) // this

		
		if($scope.osection.position == 'right'){
			$scope.osection.position = 'left'
		}
		else{
			$scope.osection.position = 'right'
		}
		$scope.osection.type = 'note or type.'


			$scope.$parent.section.status = 'object moved'

		
		//$scope.$parent.osection.start = $scope.$parent.osection.start +1

		//$scope.$parent.osection.end = 	$scope.$parent.osection.end +1
			
	//	alert($scope.$parent.osection.start +'--'+$scope.$parent.osection.end)



if($scope.$parent.osection.start >= $scope.$parent.section.end ){
	$scope.$parent.$parent.toggleobjectindex()

	//alert($scope.$parent.section.index)
}
		//$scope.$parent.section.start++

		//$scope.pushnew($scope.$parent.osection)


		//$scope.$parent.fulltexter();
		//$scope.$parent.$parent.sectionsalert($scope.osection)
	

		//tt.id = Math.random(0,1)
   		//$scope.osection.$$hashKey =Math.random(0,1)
 	


       $scope.$parent.reinit()

        
	  //  $scope.osection.metadata= 'rblou'


		//console.log($scope.$parent.osection)
		
		// $scope.$parent.osection.metadata = 'blou clicked';
		//console.log($scope.$parent.section)


		$scope.$parent.$parent.doc.xval = $scope.osection
		//$scope.xval = $scope.$parent.section.start



		//			console.log($scope.xval);
//console.log($scope.$parent.xval);

	    //$scope.modifyBothScopes($scope.osection)
	   // $scope.$parent.$apply()


	}

/*

	$scope.$watchCollection('osection', function(value,varz) {
		console.log('value osection watched !!!!!!!')
		//$scope.$parent.sections[0] = $scope.section
       
	},true);
*/


	




	
}