'use strict';

/*
* AngularJs controllers for "user" view 

	- UserProfileCtrl
		> get account infos (name, mail,..., and documents)

	- UserCtrl (before logged, handle both login and signup forms)
	
*/

angular.module('musicBox.user.controller', []);


// ** GLOBAL MISC VARS
var inheriting = {};
var GLOBALS;
var render;
/** 
* @class UserCtrl
**/
// todo : remove old api call

function UserProfileCtrl($rootScope, $scope, $http , $location, $routeParams,  $locale, $timeout, DocumentService, UserRest, renderfactory, ObjectService ) {
	  	
	  	render  = new renderfactory()
	  	render.init('user')


 		$scope.globals = GLOBALS;
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		



 		var promise = UserRest.account({},{  }).$promise;
    	promise.then(function (Result) {

			
			var _user 		    = new ObjectService().init(Result, 'user')
			$rootScope.userin 	= _user.populateUser()
			
			console.log(_user)


		 }.bind(this));
		 promise.catch(function (response) {     
		      console.log(response);
		 }.bind(this));



  		$scope.edit_user= function(){
  			var data = new Object()
  			_.each(['username', 'password', 'email', 'newsletter'] , function(f){ 
  				data[f] = $scope.userin[f]
  			});

		 	var promise = UserRest.edit({}, serialize(data) ).$promise;
    		promise.then(function (Result) {
    			if(Result.edited){
					$rootScope.flashmessage(Result.edited, 'ok' , 2000, false)
    			}
    			if(Result.error){
    				$rootScope.flashmessage(Result.error, 'bad' , 2000, false)
    			}
          		

		 }.bind(this));
		 promise.catch(function (response) {     
		      console.log(response);
		 }.bind(this));


		}

		$scope.expand_tools = function(name){
			render.expand_tools(name)
  		}
  		$scope.toggle_render = function(r){
			render.toggle_render(r)
		}



        $scope.delete_document= function(doc){
        	var tdoc           	= new DocumentService();
        	//tdoc.SetSlugFromValue(doc.slug)
        	tdoc.doc_delete({id:tdoc.slug});
        	$scope.userin.documents  = _.reject($scope.userin.documents , function(doch){ return doch._id == doc._id });
        }

        $scope.external_link = function (link){
			window.location = link;
		}

		$scope.create_doc = function(){
			var newdoc_service =  new DocumentService('n')
			newdoc_service.newdoc();
		}
}
function UserCtrl($scope, $http , $location, $routeParams,  $locale, renderfactory, UserRest) {
	
	console.log('User Controller (signup, login, newsletter)')

	// call a render 
	new renderfactory().init('user')

	// get user

	//var _user 		    = new ObjectService().init(USERIN, 'user')
	// _user.populate()
	//new UserService().SetFromData(USERIN)

	
	$scope.created_user_link   	= root_url+':'+PORT+'/me/account?welcome';
	$scope.register_url 		= root_url+':'+PORT+'/signup';
	
	if($routeParams.redirect_url){
		$scope.created_user_link 	= $routeParams.redirect_url;
		$scope.register_url 		+= '?redirect_url='+$routeParams.redirect_url
	}

	if(action_){
		$scope.action_ = action_
	}

	//	$scope.render_config = new Object({'i18n':  $locale})


 	$scope.globals = GLOBALS;
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.errors= '';
	$scope.password  ='';
	$scope.username = '';
	$scope.complete = false;
	
	$scope.lostpass_form = false

	$scope.checklogin = function(){
		var data = {'username': $scope.username, 'password': $scope.password, 'redirect_url':$routeParams.redirect_url}
		//console.log($routeParams.redirect_url)
		var promise = UserRest.login({}, serialize(data) ).$promise;
		promise.then(function (Result) {
          		window.location = Result.redirect_url;
		 }.bind(this));
		 promise.catch(function (response) {     
		      console.log(response);
		 }.bind(this));
	}

	$scope.toggle_lostpass_form = function(){
		$scope.lostpass_form = true
	}

	$scope.lostpass_post = function(email){
		
		var promise = UserRest.lostpass({}, serialize({'email' :email }) ).$promise;
		promise.then(function (Result) {
          		$scope.complete 	 = true
          		$scope.lostpass_form = false
		 }.bind(this));
		 promise.catch(function (response) {     
		      console.log(response);
		 }.bind(this));	 
	}


	$scope.checkregister = function (){
		
		if($scope.password && $scope.username && $scope.password !=="" && $scope.username !=="" ){
			$scope.errors= ''
			
			var data = {
					'username' 	: $scope.username,
					'password' 	: $scope.password,
					'email' 	: $scope.email,
					'newsletter': $scope.newsletter ? $scope.newsletter : false 
			};

			var promise = UserRest.register({}, serialize(data) ).$promise;
			promise.then(function (Result) {
	          		$scope.complete = true;
	          		
        			window.location = $scope.created_user_link 
			 }.bind(this));
			 promise.catch(function (response) {     
			      console.log(response);
			 }.bind(this));	 	
		}
		else{
			$scope.errors= 'complete the fields please'
		}
	}
	$scope.subscribe = function (){
		
		if($scope.email){
			$scope.errors= ''
			var promise = UserRest.subscribe({}, serialize({'email':$scope.email}) ).$promise;
			promise.then(function (Result) {
	          		 $scope.complete = true;
			 }.bind(this));
			 promise.catch(function (response) {     
			      console.log(response);
			 }.bind(this));	 	
		}
		else{
			$scope.errors= 'complete the fields please'
		}
	
	}
}