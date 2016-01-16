angular.module('musicBox.user.service', [])

.factory("UserService", function($rootScope) {

  var UserService = function() {
     console.log('UserService')
     $rootScope.userin = new Object({'username':'', 'account_url':'me/account', 'login_url':'/login', 'signout_url':'/signout'});
  };

  UserService.prototype.SetFromData = function(u) {
      if(u){

        if(u.username !== ''){
          u.islogged=true
        }
        $rootScope.userin = _.extend($rootScope.userin, u);


      }
   };

  UserService.prototype.MapOptions = function(data) {
            $rootScope.documents = [];
            $rootScope.documents = data.user_documents;
            var options_array = [];
            _.each(data.user.user_options , function(option){
              
              
                var op_name = option.option_name ? option.option_name : '';
                var op_value = option.option_value ? option.option_value : '';
                var op_type = option.option_type  ? option.option_type : '';
                var opt = {'option_name' : op_name, 'option_value' : op_value,'option_type' : op_type }
                options_array.push(opt)
              
             
            });
           console.log(options_array)
           return options_array

  }
  return UserService;
});