angular.module('musicBox.UserService', [])
.factory("UserService", function($rootScope) {

  
  var UserService = function() {
     console.log('UserService')
     $rootScope.userin = new Object({'username':''});
  };


  UserService.prototype.SetFromApi = function(data) {
      if(data){
        $rootScope.userin = data;
      }
   };

  UserService.prototype.SetFromLocale = function() {
     if(USERIN){
       $rootScope.userin = USERIN;
     }
  }

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