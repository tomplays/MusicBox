
/* 
      "DOCUMENT" <--> MusicBox API model 

      // angular factory

      handle POST/GET calls to api (rest) for document, doc_options, markups .. crud / backend methods
      
      used from documentCtrl and UserCtrl (load / save / edit )
      
      flash_messages
      can redirect window
*/


angular.module('musicBox.document.service',[])

.factory("DocumentService", function($rootScope, $http, $sce, $resource, $location,$routeParams,$timeout, $locale, DocumentRest, ObjectService,mb_ui) {
  
  var DocumentService = function() {
    this.api_method = DocumentRest;
  };

  DocumentService.prototype.Load = function (slug) {
    this.slug = slug

    var promise = this.api_method.get({Id:this.slug},{  }).$promise;
    promise.then(function (Result) {
      if(Result){

         

          var _user         = new ObjectService().init(Result, 'user')
          $rootScope.userin =  _user.populateUser()
          $rootScope.userin.login_url               = '/login?redirect_url='+root_url+':'+PORT+'/doc/'+Result.doc.slug;
          
  

          //depre.
          

          // new: see object extend
         
 $rootScope.doc =                               Result.doc

          var _doc = new ObjectService().init(Result.doc, 'document')
        
        

          if(!Result.doc.room){
              $rootScope.doc.room                   = {'_id':'-'};
          }
          $rootScope.sections_to_count_notice       = ($rootScope.sectionstocount == 0) ? true : false;
          $rootScope.objects_sections               = [];
          $rootScope.objects_sections['global_all'] = [];
         // $rootScope.doc_options                    =   _doc.apply_object_options();

          /////   $rootScope.author_options                 =   _doc.apply_object_options('author');
        //  $rootScope.doc.author_options                 =   _doc.apply_object_options('author');
 console.log('is owner or has secret ('+ Result.doc.doc_owner+')');
      }
      else{
        console.log('err');
      }
    }.bind(this));
    promise.catch(function (response) {     
      console.log(response);
    }.bind(this));

  };


  /**
  * @description 
  * Save 'sync' a document by offsets.. 
  *
  *  --
  *  @params collection_name (o{})
  *  @return -
  * 
  * @function docfactory#docsync
  * @link docfactory#docsync
  * @todo documentation, rename to doc_sync
  */
  DocumentService.prototype.docsync = function(){
    ///api/v1/doc/create
    var data = {
             'markups': [],
            // 'edittype' : 'markups_sync'
    };
    // prepare / clean 
    var string  = '';
    data.doc_content = $rootScope.doc.content;

    _.each(['markups','sections'], function(obj){
            _.each($rootScope.doc[obj], function(o, i){
              if(o.touched == true){
                //o.deleted !==true && 
                 if( _.isFinite(o.start) && _.isFinite(o.end)){
                   data.markups.push({'id':o._id, 'start': o.start,'end': o.end, 'type':o.type});
                }
              } 
           });
    });


   
    console.log(data)
   
    var promise = this.api_method.sync({id:$rootScope.doc.slug},serialize(data)).$promise;
    promise.then(function (Result) {
      if(Result){
        console.log(Result.doc.obj_updated)
        
        // (client-side)
        $rootScope.doc.updated = new Date()
       
        $rootScope.flashmessage('Document saved.', 'ok' , 1600, false);
        
        //
        // reset touched
        _.each(['markups','sections'], function(obj){
            _.each($rootScope.doc[obj], function(o, i){
               o.touched = false;
           });
        });
          
      }
     

    }.bind(this));
    promise.catch(function (response) { 
            console.log(response)
            $rootScope.flashmessage('doc sync error', 'bad' , 2000);
       //this.flashmessage(response.err, 'bad' , 3000)
    }.bind(this));

  };

  /**
  * @description 
  * save a document value-field.
  *
  *  --
  *  @params collection_name (o{})
  *  @return -
  * 
  * @function docfactory#save_doc
  * @link docfactory#save_doc
  */

  DocumentService.prototype.save_doc = function (field) {
    
    var data = {
      'field' : field
    }
    
    if(field == 'room_id'){
      data.value =  $rootScope.doc.room__id;
    
    }
    else if(field == 'user_id'){
      data.value =  $rootScope.doc.user._id;
    }
    else{
      data.value =  $rootScope.doc[field];
    }


    var promise = this.api_method.save({id:$rootScope.doc._id},serialize(data)).$promise;
    promise.then(function (Result) {
        if(field == 'room_id'){
            if(field == 'room_id' && data.value !==''){}
            else{
                $rootScope.doc.room     = Result.doc.room;
                $rootScope.doc.room__id = Result.doc.room; 
            }
            $rootScope.flashmessage('document set to room', 'ok' , 2000);   
        }

        // hard redirect
        else if(field == 'title'){
          window.location = root_url+':'+PORT+'/doc/'+Result.doc.slug;
        }

        else if(field == 'published'){
          $rootScope.flashmessage('document set to '+Result.doc.published, 'ok' , 2000);  

        }
        else if(field == 'excerpt' || field == 'thumbnail'){
            $rootScope.flashmessage('document\' '+field+' set to '+data.value, 'ok' , 2000);

        }
        else{
          $rootScope.flashmessage('document set for  '+field, 'ok' , 2000);  
        }   
    }.bind(this));
    promise.catch(function (response) { 
        $rootScope.flashmessage('document edit error', 'bad' , 2000);  
    }.bind(this));
  }

  /**
  * @description 
  * Save a doc_option 
  *
  *  --
  *  @params collection_name (o{})
  *  @return -
  * 
  * @function docfactory#save_doc_option
  * @link docfactory#save_doc_option
  */

  DocumentService.prototype.doc_option_edit =  function (value, id) {
    if($rootScope.userin.username ==''){
       return false;
    }
    var data = {'_id':id,'value':value};
    var promise = this.api_method.option_edit({id:this.slug},serialize(data)).$promise;
    promise.then(function (Result) {
      $rootScope.flashmessage('option saved (->'+data.value+')', 'ok' , 3000);
    }.bind(this));
    promise.catch(function (response) { 
      $rootScope.flashmessage('error', 'bad' , 3000);
    }.bind(this));    
  }

  /**
  * @description 
  * Delete an option of document 
  *
  *  --
  *  @return -
  * 
  * @function docfactory#delete_doc_option
  * @link docfactory#delete_doc_option
  * @todo rename doc_option_delete / implement in api!
  */

  DocumentService.prototype.doc_option_delete = function (_id) {
    
    var data = {'_id': _id };

    var promise = this.api_method.option_delete({id:this.slug},serialize(data)).$promise;
      promise.then(function (Result) {
            $rootScope.flashmessage('option deleted', 'ok' , 3000);
            // reinit, no need to redraw containers
      }.bind(this));
      promise.catch(function (response) { 
        $rootScope.flashmessage('error', 'bad' , 3000);
      }.bind(this));

  }

  /**
  * @description 
  * create a new option to document
  *
  *  --
  *  @params collection_name (o{})
  *  @return -
  * 
  * @function docfactory#create_doc_option
  * @link docfactory#create_doc_option
  * @todo rename to   doc_option_create
  */

  DocumentService.prototype.doc_option_new = function () {
     // calling service
    
    var data = {'option_name':$rootScope.ui.doc_option_new_name }
    var promise = this.api_method.option_new({id:this.slug},serialize(data)).$promise;
      promise.then(function (Result) { 
          $rootScope.flashmessage('document option created','ok', 3000)
      }.bind(this));
      promise.catch(function (response) { 
        $rootScope.flashmessage('error', 'bad' , 3000)
      }.bind(this));

  }
  /**
  * @description 
  * new document 
  *
  *  --
  *  @params 
  *  @return -
  * 
  * @function docfactory#--
  * @link docfactory#--
  * @todo rename to doc_new
  */

  DocumentService.prototype.newdoc = function(){

    $rootScope.i18n     =   $locale;         
    $rootScope.newdoc   =   {
                              'raw_content'      :   $rootScope.i18n.CUSTOM.DOCUMENT.default_content,
                              'raw_title'        :   'draft #'+Math.random(),
                              'published'        :   'draft'
                           } ;
    var promise = this.api_method.new({},serialize($rootScope.newdoc)).$promise;
    promise.then(function (Result) {
              if(Result.err){
                if(Result.code == 11000 ){

                  $rootScope.flashmessage('This title is already used please choose another one', 'bad' , 3000)
                }
                else{
                  $rootScope.flashmessage('error #'+Result.code, 'bad' , 3000)
                }
               
              }else{
                window.location = root_url+':'+PORT+'/doc/'+Result.slug+'?fresh'; 
              }

    }.bind(this));
    promise.catch(function (response) { 
    }.bind(this));
  };

  /**
  * @description 
  * Show a message to user
  *
  *  @param {String} msg - message to show
  *  @param {String} classname - a css class ('ok'/ 'bad' / ..)
  *  @param {Number/Time} timeout - 

  *  @return -
  * 
  * @function docfactory#flash_message
  * @link docfactory#flash_message
  * @todo --
  */
 
   DocumentService.prototype.doc_delete = function () {
    
 
    var promise = this.api_method.delete( {id:this.slug}).$promise;
      promise.then(function (Result) {
          $rootScope.flashmessage('deleted', 'ok' , 3000);
          console.log(Result);
          console.log($rootScope.documents);

      }.bind(this));

      promise.catch(function (response) {  
         console.log(response)   
         $rootScope.flashmessage('error', 'error' , 3000);
      }.bind(this));
   }

  /**
  * @description 
  * depre.  
  *
  *  --
  *  @params collection_name (o{})
  *  @return -
  * 
  * @function docfactory#--
  * @link docfactory#--
  * @todo ---
  */

 DocumentService.prototype.offset_markups = function (){
      $http.get(api_url+'/doc/'+$rootScope.doc.slug+'/markups/offset/left/0/1/1').success(function(d) {
        console.log(d);
        //doc.init(d,true);
        //$rootScope.$emit('docEvent', {action: 'doc_ready', type: 'offset', collection_type: 'markup', collection:d.markups });
      })
  }

  /**
  * @description 
  * Offset a markup positions
  *
  *  --
  * @param {object} markup - markup to offset
  *  @return -
  * 
  * @function docfactory#--
  * @link docfactory#--
  * @todo rename/check use
  */

  DocumentService.prototype.offset_markup =  function (markup,start_qty, end_qty){

      var data        = {}
      data.markup_id  = markup._id;
      data.start_qty  = start_qty
      data.end_qty    = end_qty
    
      $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/markup/'+markup._id+'/offset', serialize(data) ).success(function(m) {
        console.log(m);
          alert('??');
        $rootScope.doc = m;
        //$rootScope.$emit('docEvent', {action: 'doc_ready', type: 'offset', collection_type: 'markup', collection:m.markups });
      })
  }
  
  return DocumentService;
})