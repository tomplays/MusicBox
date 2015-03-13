angular.module('musicBox.DocumentRest', [])
.factory("DocumentRest", function($resource, $rootScope){

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
        url: api_url+'/doc/:Id/',
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      doc_delete:{
        method:"POST",
        url: api_url+'/doc/:Id/delete',
         params :  {Id:'@id'},
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      doc_save:{     
        method:"POST",
        url: api_url+'/doc/:id/edit',  
      },
      doc_sync:{     
        method:"POST",
        url: api_url+'/doc/:id/sync',  
      },
      doc_option_edit:{     
        method:"POST",
        url: api_url+'/doc/:id/doc_option_edit'
      },
      doc_option_delete:{ 
        method:"POST",
        url: api_url+'/doc/:id/doc_option_delete'
      },
      doc_option_new :{       
        method:"POST",
        url: api_url+'/doc/:id/doc_option_new'
      },
      doc_new :{       
        method:"POST",
        url: api_url+'/doc/create',
      }
    }
  );
})