
/* 
main "service / angular factory"

handle POST/GET calls to api (rest) for document, doc_options, markups .. crud / backend methods
can be called from contollers (init on load, save / edits from UI )
can emit events, flash_messages and websockets.
can redirect window


 Contains "MusicBox algorithm" (sorting, distribution, letters system)
*/


 /**
 * Factory / services for document model
 * 
 * @class docfactory
 * @param {Factory} docfactory -  angular custom factory for document 
 * @inject $rootScope, $http, $location,$sce, $routeParams, socket, renderfactory, $locale, $timeout
 */
var temp_scope;







angular.module('musicBox.document.service',[])
.factory("DocumentService", function($rootScope, $http,$sce, $resource,$location, $routeParams ,renderfactory, DocumentRest, UserService, $timeout, $locale,MarkupService) {

  
  var DocumentService = function() {
    this.api_method = DocumentRest;

  };
 

 
  

  DocumentService.prototype.Load = function (slug) {
       
    this.slug = slug
    // this.flash_message('..', 'bad' , 10, false)

    var promise = DocumentRest.get({Id:this.slug},{  }).$promise;
    promise.then(function (Result) {
       if(Result){
          $rootScope.doc = Result.doc
      
          $rootScope.markups  = _.sortBy(Result.doc.markups_,function (num) {
               return num.start;
          });

          $rootScope.doc.markups  = _.sortBy(Result.doc.markups_,function (num) {
               return num.start;
          });
          //    $rootScope.doc.markups  = Result.doc.markups;
         

       

              if(Result.doc.room){
                  $rootScope.doc.room__id = Result.doc.room._id;
                 // $rootScope.room_options =  self.apply_object_options('room', d.doc.room.room_options)
               }
               else{
                   $rootScope.doc.room__id = '';
                   $rootScope.doc.room = new Object({'_id':'-'});
               }
             

                $rootScope.doc.operation = {}
                $rootScope.doc.operations = []

                var encoded_url = root_url+':'+PORT;
                if(Result.doc.slug !=='homepage'){
                    encoded_url += '/doc/'+Result.doc.slug;
                }
                $rootScope.doc.encoded_url = urlencode(encoded_url);
                $rootScope.doc.text_summary = '';

                $rootScope.sections_to_count_notice = ($rootScope.sectionstocount == 0) ? true : false;
        
                $rootScope.objects_sections = [];
                $rootScope.objects_sections['global_all'] = [];
                

               // // new service call.
                Result.doc.servicetype = 'document'
                var _doc = new MarkupService().init(Result.doc)


                $rootScope.doc_options      =    _doc.apply_object_options('document', Result.doc.doc_options)
                $rootScope.author_options    =   _doc.apply_object_options('author',   Result.doc.user.user_options)
               


            new UserService().SetFromData(Result.userin)
            $rootScope.userin.login_url = '/login?redirect_url='+root_url+':'+PORT+'/doc/'+Result.doc.slug

            $rootScope.containers = _.sortBy( Result.doc.sections,function (num) {
               return num.start;
            });


            $rootScope.doc.containers = _.sortBy( Result.doc.sections,function (num) {
               return num.start;
            });

            /* to refactor... vs 'containers'
            $rootScope.sections = _.sortBy( Result.doc.sections,function (num) {
               return num.start;
            });
            */
            //_.filter($rootScope.sections, function(td){ return  td.type == 'container'; });
           

            $rootScope.doc_owner = Result.is_owner;
            
            console.log('is owner or has secret ('+ Result.is_owner+')')


       
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
        var data = new Object();
        var thos = this;

      
     
        data.markups = new Array()
        // prepare / clean 
        var string  = '';
         _.each($rootScope.doc.containers, function(s){
         
          // remove line breaks
          //  container.fulltext =  container.fulltext.replace(/(\r\n|\n|\r)/gm,"");
        
          // console.log(container.fulltext)
          string  += s.fulltext;

            if(s.touched == true){
              var a_s = new Object({'id':s._id, 'start': s.start,'end': s.end, 'action':'offset' })
               data.markups.push(a_s)
            }
         })

   $rootScope.doc.content = string
        
        // equivalent service call // $scope.sync_queue()
       
        data.doc_content = string
      

        _.each($rootScope.doc.markups, function(m){

           if(m.touched == true){
                         if( _.isFinite(m.start) && _.isFinite(m.end)){
                             var a_mk = new Object({'id':m._id, 'start': m.start,'end': m.end, 'action':'offset' })
                             data.markups.push(a_mk)
                          }
                          else{
                            alert('doh ? ')
                          }
           } 
               
        });
        data.edittype = 'markups_sync'

        console.log(data)
        //// $rootScope.doc.operation.before.sync = data;

        data.doc_content = string
        
        var promise = this.api_method.sync({id:$rootScope.doc.slug},serialize(data)).$promise;
        promise.then(function (Result) {
          if(Result.doc){



            
             $rootScope.doc.updated = new Date()
             
           
          $rootScope.flashmessage('Document saved', 'ok' , 1600, false)

            _.each($rootScope.doc.containers, function(s){
                 s.touched = false
             });

              _.each($rootScope.doc.markups, function(m){
                 m.touched = false
             });
              
          }
         

        }.bind(this));
        promise.catch(function (response) { 
                console.log(response)
                $rootScope.flashmessage('doc sync error', 'bad' , 2000)

           //this.flashmessage(response.err, 'bad' , 3000)
        }.bind(this));


      },

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
        var thos = this;
        var data = new Object()
        data.field = field;     
        
        if(field == 'room_id'){
          data.value =  $rootScope.doc.room__id
        
        }
        else if(field == 'user_id'){
          data.value =  $rootScope.doc.user._id;
        }
        else{
          data.value =  $rootScope.doc[field]
        }


        var promise = this.api_method.save({id:$rootScope.doc._id},serialize(data)).$promise;
        promise.then(function (Result) {
            var restart = false
            if(field == 'room_id'){
                          if(field == 'room_id' && data.value !==''){}
                          else{
                            $rootScope.doc.room     = Result.doc.room;
                            $rootScope.doc.room__id = Result.doc.room; 
                          }
                         $rootScope.flashmessage('document set to room', 'ok' , 2000)    
            }

            // hard redirect
            else if(field == 'title'){
              window.location = root_url+':'+PORT+'/doc/'+Result.doc.slug;
            }
  
            else if(field == 'published'){
              $rootScope.flashmessage('document set to '+Result.doc.published, 'ok' , 2000)    

            }
            else if(field == 'excerpt' || field == 'thumbnail'){
                $rootScope.flashmessage('document\' '+field+' set to '+data.value, 'ok' , 2000)  

            }
            else{
              $rootScope.flashmessage('document set for  '+field, 'ok' , 2000)    
            }   
        }.bind(this));
        promise.catch(function (response) { 
            $rootScope.flashmessage('document edit error', 'bad' , 2000)    
        }.bind(this));
     }
  /**
      * @description 
      * Setup a document
      *
      *  --
      *  @params collection_name (o{})
      *  @return nothing
      * 
      * @function docfactory#init_new
      * @link docfactory#init_new
      * @todo rename to doc_init_new
      */

  DocumentService.prototype.init_new = function () {
        $rootScope.i18n                    =   $locale;         
        $rootScope.newdoc                  =   new Object();
        $rootScope.newdoc.raw_content      =   $rootScope.i18n.CUSTOM.DOCUMENT.default_content
        $rootScope.newdoc.raw_title        =   $rootScope.i18n.CUSTOM.DOCUMENT.default_title
        $rootScope.newdoc.published        =   'draft';
        console.log($rootScope)
        alert('qsd')
  };


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
        var thos = this;
        if($rootScope.userin.username ==''){
           return false
        }
        var data = new Object({'_id':id,'value':value})
      
        var promise = this.api_method.option_edit({id:this.slug},serialize(data)).$promise;
        promise.then(function (Result) {
             
              $rootScope.flashmessage('option saved (->'+data.value+')', 'ok' , 3000)
             
        }.bind(this));
        promise.catch(function (response) { 
          $rootScope.flashmessage('error', 'bad' , 3000)
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
        var thos = this;
        var data = new Object({'_id':_id})
   
        var promise = this.api_method.option_delete({id:this.slug},serialize(data)).$promise;
        promise.then(function (Result) {
             
              $rootScope.flashmessage('option deleted', 'ok' , 3000)
              // reinit, no need to redraw containers
        }.bind(this));
        promise.catch(function (response) { 
          $rootScope.flashmessage('error', 'bad' , 3000)
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
        var thos = this;
        var data = new Object({'option_name':$rootScope.ui.doc_option_new_name })
    
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
      *  @params collection_name (o{})
      *  @return -
      * 
      * @function docfactory#--
      * @link docfactory#--
      * @todo rename to doc_new
      */

      DocumentService.prototype.newdoc = function(){
        var thos = this;
        

        $rootScope.i18n                    =   $locale;         
        $rootScope.newdoc                  =   new Object();
        $rootScope.newdoc.raw_content      =   $rootScope.i18n.CUSTOM.DOCUMENT.default_content
        $rootScope.newdoc.raw_title        =   'draft #'+Math.random();
        $rootScope.newdoc.published        =   'draft';
       


        var data =  $rootScope.newdoc;
        
        var promise = this.api_method.new({},serialize(data)).$promise;
        promise.then(function (Result) {



                  if(Result.err){
                          if(Result.code == 11000 ){

                           $rootScope.flashmessage('This title is already used please choose another one', 'bad' , 3000)
                          }
                          else{
                           $rootScope.flashmessage('error #'+Result.code, 'bad' , 3000)

                          }
                   
                  }else{
                              window.location = root_url+':'+PORT+'/doc/'+Result.slug+'?fresh'; // fresh


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
        var thos = this;
        var promise = new Object();
     
        promise.query = this.api_method.delete( {id:this.slug}).$promise;
        promise.query.then(function (Result) {
            $rootScope.flashmessage('deleted', 'ok' , 3000)

            console.log(Result)
            console.log($rootScope.documents)
 
        }.bind(this));
        promise.query.catch(function (response) {  
           console.log(response)   
           $rootScope.flashmessage('error', 'error' , 3000)
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
            console.log(d)
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

          var data = {}
          data.markup_id  = markup._id;
          data.start_qty  = start_qty
          data.end_qty    = end_qty
        
 
          $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/markup/'+markup._id+'/offset', serialize(data) ).success(function(m) {
            console.log(m)
              alert('??')
            $rootScope.doc = m;
            //$rootScope.$emit('docEvent', {action: 'doc_ready', type: 'offset', collection_type: 'markup', collection:m.markups });
          })
      }
  

  return DocumentService;
})