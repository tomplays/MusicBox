
angular.module('musicBox.user.rest', [])
.factory("UserRest", function($resource, $rootScope){

  var parseResponse = function (data) {
    var data_ = angular.fromJson(data);
    return data_
  };

  return $resource(
    {},
    {},
    {
      account:{
        method:"GET",
        url: api_url+'/me/account',
      },
      edit:{
        method:"POST",
        url: api_url+'/me/edit',
      },
      subscribe:{
        method:"POST",
        url: api_url+'/subscribe',
      },
      register:{
        method:"POST",
        url: api_url+'/user/register',
      },
      lostpass:{
        method:"POST",
        url: api_url+'/user/lostpass',
      },
      login:{
        method:"POST",
        url: api_url+'/user/userlogin',
      }
    }
  );
})