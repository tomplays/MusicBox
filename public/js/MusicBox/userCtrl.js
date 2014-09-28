
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

