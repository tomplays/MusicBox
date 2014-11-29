'use strict';

/*
* AngularJs controllers for "user" view 

	- UserProfileCtrl
	- UserCtrl (before logged, handle both login and signup forms)
	
*/


// ** GLOBAL MISC VARS
var inheriting = {};
var GLOBALS;
var render;

/** 
* @class UserCtrl
**/

function UserProfileCtrl($scope, $http , $location, $routeParams,  $locale) {

		$scope.i18n = $locale;
 		$scope.globals = GLOBALS;
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		$scope.documents = [];

         $http.get(api_url+'/me/account').success(function(d) {
         	$scope.me = d.user;
         	$scope.documents = d.user_documents;
         	console.log(d)
         	var options_array = [];
	        _.each(d.user.user_options , function(option){
	        	console.log(option)
	           // console.log(option)
	            var op_name = option.option_name;
	            var op_value = option.option_value;
	            var op_type = option.option_type;
	            options_array[op_name]= [];
	            options_array[op_name]['value'] = op_value;
	        });
          	$scope.user_options = [];
          	$scope.user_options = options_array
          	console.log($scope.user_options)
           	//console.log($rootScope.doc_options)
         });

        $scope.delete_document= function(doc){
          $http.post(api_url+':'+PORT+'/doc/'+doc.slug+'/delete').success(function(d) {
          	console.log($scope.documents)
          	//	$scope.documents = _.without($scope.documents,d)
			$scope.documents  = _.reject($scope.documents , function(doc){ return doc._id  == d._id; });
          })
        }

        $scope.external_link = function (link){
			window.location = link;
		}
}
function UserCtrl($scope, $http , $location, $routeParams,  $locale) {
	
	console.log('User Controller')
	if(USERIN){
		//console.log(USERIN)
		$scope.userin = USERIN;
	}
	$scope.register_url = root_url+':'+PORT+'/signup';
	$scope.created_user_link   = root_url+':'+PORT+'/me/account?welcome';

	if($routeParams.redirect_url){
		$scope.created_user_link 	= $routeParams.redirect_url;
		$scope.register_url 		+= '?redirect_url='+$routeParams.redirect_url
	}
    $scope.i18n = $locale;
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
			// data = serialize(data);
		 	console.log(data)
 			$http.post(root_url+':'+PORT+'/register', serialize(data) ).success(function(e) {

        	 	window.location = $scope.created_user_link 
        	});  
		}
		else{
			$scope.errors= 'complete the fields please'
		}
	}
}