'use strict';

/*
* AngularJs controllers for "user" view 

	- UserProfileCtrl
		> get account infos (name, mail,..., and documents)

	- UserCtrl (before logged, handle both login and signup forms)
	
*/


// ** GLOBAL MISC VARS
var inheriting = {};
var GLOBALS;
var render;
/** 
* @class UserCtrl
**/
// todo : remove old api call

function UserProfileCtrl($scope, $http , $location, $routeParams,  $locale, DocumentService, UserRest, UserService, renderfactory) {
	  	 new renderfactory().init()

 		$scope.globals = GLOBALS;
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		
 		var promise = UserRest.account({},{  }).$promise;
    	promise.then(function (Result) {
      		
      		var this_user = new UserService()
      		this_user.SetFromApi(Result.user)
      		this_user.MapOptions(Result)
      		

		 }.bind(this));
		 promise.catch(function (response) {     
		      console.log(response);
		 }.bind(this));

        $scope.delete_document= function(doc){
        	var tdoc           	= new DocumentService();
        	tdoc.SetSlug(doc.slug)
        	tdoc.doc_delete();
        	$scope.documents  = _.reject($scope.documents , function(doch){ return doch._id == doc._id });
        }

        $scope.external_link = function (link){
			window.location = link;
		}

		$scope.create_doc = function(){
		
			var newdoc_service =  new DocumentService('n')
			newdoc_service.newdoc();
	}
}
function UserCtrl($scope, $http , $location, $routeParams,  $locale, renderfactory, UserService) {
	
	console.log('User Controller')

	// call a render 
	new renderfactory().init()

	// get user
	new UserService().SetFromLocale()

	
	
	$scope.register_url = root_url+':'+PORT+'/signup';
	$scope.created_user_link   = root_url+':'+PORT+'/me/account?welcome';

	if($routeParams.redirect_url){
		$scope.created_user_link 	= $routeParams.redirect_url;
		$scope.register_url 		+= '?redirect_url='+$routeParams.redirect_url

	}

	//	$scope.render_config = new Object({'i18n':  $locale})



 	$scope.globals = GLOBALS;
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.errors= '';
	$scope.password  ='';
	$scope.username = ''

	$scope.checklogin = function(){
		var data = new Object({'username': $scope.username, 'password': $scope.password, 'redirect_url':$routeParams.redirect_url})
		//console.log($routeParams.redirect_url)
		$http.post(root_url+':'+PORT+'/api/v1/userlogin', serialize(data) ).success(function(e) {
         	//console.log(e)
         	window.location = e.redirect_url;
         }).error(function(data, status) {});  
	}

	$scope.checkregister = function (){
		if($scope.password && $scope.username && $scope.password !=="" && $scope.username !=="" ){
			$scope.errors= ''
			var data = new Object()
			data.username 	= $scope.username;
			data.password 	= $scope.password;
			data.email 		= $scope.email;
			
 			$http.post(root_url+':'+PORT+'/register', serialize(data) ).success(function(e) {
        	 	window.location = $scope.created_user_link 
        	});  
		}
		else{
			$scope.errors= 'complete the fields please'
		}
	}
}