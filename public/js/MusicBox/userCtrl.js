
// ** GLOBAL MISC VARS
var inheriting = {};
var GLOBALS;
var render;

/** 
* @class UserCtrl
**/
function UserCtrl($scope, $http , $location, $routeParams) {
	
		console.log('User Controller')
		if(USERIN){
				//console.log(USERIN)
				$scope.userin = USERIN;
		}

}


function SignUpCtrl($scope, $http ) {
		console.log('SignUpCtrl')
		$scope.errors= '';
$scope.init = function (){
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

	$scope.password  ='';
	$scope.username = ''
}


		$scope.checkpost = function (){
		

			if($scope.password && $scope.username && $scope.password !=="" && $scope.username !=="" ){
				$scope.errors= ''
				var data = new Object()
				data.username = $scope.username;
				data.password = $scope.password;
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
	$scope.init()
	

}
