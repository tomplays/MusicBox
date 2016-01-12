'use strict';

/*
* AngularJs controllers for "user" view 

	- UserProfileCtrl
		> get account infos (name, mail,..., and documents)

	- UserCtrl (before logged, handle both login and signup forms)
	
*/

angular.module('musicBox.user_controller', []);

// ** GLOBAL MISC VARS
var inheriting = {};
var GLOBALS;
var render;
/** 
* @class UserCtrl
**/
// todo : remove old api call

function UserProfileCtrl($scope, $http , $location, $routeParams,  $locale, DocumentService, UserRest, UserService, renderfactory,$timeout) {
	  	 new renderfactory().init()

 		$scope.globals = GLOBALS;
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		
 		var promise = UserRest.account({},{  }).$promise;
    	promise.then(function (Result) {
      		
      		var this_user = new UserService()
      		this_user.SetFromApi(Result.user)
      		
      		$scope.userin.user_options = this_user.MapOptions(Result)
      		

		 }.bind(this));
		 promise.catch(function (response) {     
		      console.log(response);
		 }.bind(this));



      $scope.flashmessage = function (msg,classname ,timeout, closer) {
        $scope.flash_message = {}
        $scope.flash_message.text = msg;
        $scope.flash_message.classname = classname;

        if(!closer){
            $scope.flash_message.closer =false;
        }
        else{
            $scope.flash_message.closer = closer;
        }
        

        // apply timeout if set to true
        if(timeout){
            $timeout(function(){
                $scope.flash_message.text =  '';
            },timeout);
        }
      }


  		$scope.edit_user= function(){
  			var data = new Object()
  			_.each(['username', 'password', 'email', 'newsletter'] , function(f){ 
  				data[f] = $scope.userin[f]
  			});

		 	var promise = UserRest.edit({}, serialize(data) ).$promise;
    		promise.then(function (Result) {
    			var msg = 'saved'
    			if(Result.edited){
					msg = Result.edited
					$scope.flashmessage(msg, 'ok' , 2000, false)
    			}
    			if(Result.error){
    				$scope.flashmessage(Result.error, 'bad' , 2000, false)
    			}
          		

		 }.bind(this));
		 promise.catch(function (response) {     
		      console.log(response);
		 }.bind(this));


		}

        $scope.delete_document= function(doc){
        	
        	var tdoc           	= new DocumentService();
        	tdoc.SetSlugFromValue(doc.slug)
        	tdoc.doc_delete({id:doc.slug});
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
	if(action_){
		$scope.action_ = action_
	}
	

	if($routeParams.redirect_url){
		$scope.created_user_link 	= $routeParams.redirect_url;
		$scope.register_url 		+= '?redirect_url='+$routeParams.redirect_url

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
		var data = new Object({'username': $scope.username, 'password': $scope.password, 'redirect_url':$routeParams.redirect_url})
		//console.log($routeParams.redirect_url)
		$http.post(root_url+':'+PORT+'/api/v1/userlogin', serialize(data) ).success(function(e) {
         	//console.log(e)
         	window.location = e.redirect_url;
         }).error(function(data, status) {});  
	}


	$scope.toggle_lostpass_form = function(){

		$scope.lostpass_form = true
	}

	$scope.lostpass_post = function(email){
			
			var data = new Object()
			data.email 		= email;
			$http.post(root_url+':'+PORT+'/api/v1/user/lostpass',serialize(data)  ).success(function(e) {
        	 $scope.complete =true
        	});  
	}


	$scope.checkregister = function (){
		
		if($scope.password && $scope.username && $scope.password !=="" && $scope.username !=="" ){
			$scope.errors= ''
			var data = new Object()
			data.username 	= $scope.username;
			data.password 	= $scope.password;
			data.email 		= $scope.email;
			data.newsletter	= $scope.newsletter ? $scope.newsletter : false ;
 			$http.post(root_url+':'+PORT+'/register', serialize(data) ).success(function(e) {
        	 	$scope.complete = true;
        		window.location = $scope.created_user_link 

        	});  
		}
		else{
			$scope.errors= 'complete the fields please'
		}
	}
	$scope.subscribe = function (){
		
		if($scope.email){
			$scope.errors= ''
			var data = new Object()
			data.email 		= $scope.email;
			
 			$http.post(root_url+':'+PORT+'/api/v1/subscribe', serialize(data) ).success(function(e) {
        	 	//window.location = $scope.created_user_link 
        	 	 $scope.complete = true;
        	});  
		}
		else{
			$scope.errors= 'complete the fields please'
		}
	
	}
}