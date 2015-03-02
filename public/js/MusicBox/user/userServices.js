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
            //console.log(option)
             // console.log(option)
              var op_name = option.option_name;
              var op_value = option.option_value;
              var op_type = option.option_type;
              options_array[op_name]= [];
              options_array[op_name]['value'] = op_value;
          });
          $rootScope.user_options = [];
          $rootScope.user_options = options_array
  }

  return UserService;

});