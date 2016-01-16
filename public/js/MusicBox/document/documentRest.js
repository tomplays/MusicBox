angular.module('musicBox.document.rest', [])
.factory("DocumentRest", function($resource, $rootScope,$routeParams){

  var secret_string= ''

  if($routeParams.secret){
      secret_string = '?secret='+$routeParams.secret
  }

  var parseResponse = function (data) {
    var data_ = angular.fromJson(data);
    return data_
  };

  return $resource(
    {Id:'@id', Mid:'@mid'},
    {},
    {
      get:{
        method:"GET",
        url: api_url+'/doc/:Id'+secret_string,
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      new :{       
        method:"POST",
        url: api_url+'/doc/create',
      },
      delete:{
        method:"POST",
        url: api_url+'/doc/:Id/delete',
         params :  {Id:'@id'},
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      save:{     
        method:"POST",
        url: api_url+'/doc/:id/edit',  
      },
      sync:{     
        method:"POST",
        url: api_url+'/doc/:id/sync',  
      },
      option_edit:{     
        method:"POST",
        url: api_url+'/doc/:id/doc_option_edit'
      },
      option_delete:{ 
        method:"POST",
        url: api_url+'/doc/:id/doc_option_delete'
      },
      option_new :{       
        method:"POST",
        url: api_url+'/doc/:id/doc_option_new'
      }
    }
  );
})