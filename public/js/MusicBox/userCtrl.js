
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



         $http.get(api_url+'/me/account').success(function(d) {

         	$scope.me = d.user;
         	$scope.documents = d.user_documents;

         	console.log(d)



         })


}
function UserCtrl($scope, $http , $location, $routeParams,  $locale) {
	
		console.log('User Controller')
		if(USERIN){
				//console.log(USERIN)
				$scope.userin = USERIN;

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
			$http.post(root_url+'/api/v1/userlogin', serialize(data) ).
         	success(function(e) {
         		 //console.log(e)
         		 window.location = e.redirect_url;
          	}).error(function(data, status) {});  
		}

		$scope.checkregister = function (){
		

			if($scope.password && $scope.username && $scope.password !=="" && $scope.username !=="" ){
				$scope.errors= ''
				var data = new Object()
				data.username = $scope.username;
				data.password = $scope.password;
				data.email = $scope.email;
				// data = serialize(data);
			 	console.log(data)
 				$http.post(root_url+'/register', serialize(data) ).
         		 success(function(e) {
          			$scope.success= 'welcome '+$scope.username +' !'
           
          		 });  

			}
			else{
				$scope.errors= 'complete the fields please'
			}

		}


}




function SignUpCtrl($scope, $http ) {
		console.log('SignUpCtrl')
		
		$scope.init = function (){
		        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

		
		}


		
	$scope.init()
	

}
