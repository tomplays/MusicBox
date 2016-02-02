/*

REST API factory for markup.

markup belongs to a doc (:Id/ param)
markup as an id (:Mid/ param)

*/


angular.module('musicBox.markup.rest', [])
.factory("MarkupRest", function($resource, $rootScope){

  var parseResponse = function (data) {
    var data_ = angular.fromJson(data);
    return data_
  };

/* if($routeParams.secret){
      data.secret = $rootScope.ui.secret;
  }
  */




  var route_object = 'markup' 
 
  return $resource(
    {Id:'@id', Mid:'@mid'},
    {},
    {
      new:{
        method:"POST",
        url: api_url+'/doc/:Id/'+route_object+'/push',
      },
      delete:{
        method:"POST",
        params :  {Id:'@id', Mid:'@mid',  Aid: '@aid'},
        url: api_url+'/doc/:Id/'+route_object+'/:Mid/delete',
      },
      save:{       
        method:"POST",
        url: api_url+'/doc/:id/'+route_object+'/:mid/edit',
      },
      new_option:{       
        method:"POST",
        url: api_url+'/doc/:id/'+route_object+'/:mid/optionnew',
      },
      delete_option:{
        method:"POST",
        url: api_url+'/doc/:id/'+route_object+'/:mid/optiondelete',
      }
    }
  );
})