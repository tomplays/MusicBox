// AJOUTE SUR GIT

angular.module('musicBox.DocumentRest', [])
.factory("DocumentRest", function($resource, $rootScope){

  

  var parseResponse = function (data) {
    return angular.fromJson(data);
  };

  return $resource(
    {  Id:'@id', Mid:'@mid'},
    { /*id: "@id", start: "@start" */},

    {
      get: {
        method:"GET",
      
        url: 'http://localhost:8082/api/v1/doc/:Id/',
        transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      markup_push : {
        
        method:"POST",
        isArray: false,
        url: 'http://localhost:8082/api/v1/doc/:Id/markup/push',
        //transformResponse: parseResponse
      },

      markup_delete: {
        method:"POST",
        params :  {Id:'@id', Mid:'@mid'},
        url: 'http://localhost:8082/api/v1/doc/:Id/markup/delete/:Mid',
        //transformResponse: parseResponse
      },
      markup_save: {       
        method:"POST",
        url: 'http://localhost:8082/api/v1/doc/:id/markup/:mid/edit',
      //transformResponse: parseResponse
      }



      
    }
  );
})