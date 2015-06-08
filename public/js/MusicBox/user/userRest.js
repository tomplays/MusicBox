
angular.module('musicBox.UserRest', [])
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
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      edit:{
        method:"POST",
        url: api_url+'/me/edit',
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      }

    }
  );
})