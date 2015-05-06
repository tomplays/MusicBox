/*

REST API factory for markup.

markup belongs to a doc (:Id/ param)
markup as an id (:Mid/ param)

*/


angular.module('musicBox.MarkupRest', [])
.factory("MarkupRest", function($resource, $rootScope){

  var parseResponse = function (data) {
    var data_ = angular.fromJson(data);
    return data_
  };

  return $resource(
    {Id:'@id', Mid:'@mid'},
    {},
    {
      markup_push:{
        method:"POST",
        isArray: false,
        url: api_url+'/doc/:Id/markup/push',
         transformResponse: parseResponse
      },
      markup_delete:{
        method:"POST",
        params :  {Id:'@id', Mid:'@mid'},
        url: api_url+'/doc/:Id/markup/:Mid/delete',
      },
      markup_save:{       
        method:"POST",
        url: api_url+'/doc/:id/markup/:mid/edit',
      }
    }
  );
})