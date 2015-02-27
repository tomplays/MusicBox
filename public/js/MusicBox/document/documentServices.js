
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
angular.module('musicBox.DocumentService', [])
.factory("DocumentService", function($rootScope, $http,$sce, $resource,$location, $routeParams ,renderfactory, DocumentRest, UserService, MusicBoxLoop, $timeout, $locale) {

  
  var DocumentService = function() {
    this.api_method = DocumentRest;

  };

  DocumentService.prototype.SetSlug = function (slug) {
    if(!slug){
      this.slug      = this.SlugFromUrl();
    }
    else{
       this.slug      = slug;
    }
  };

  DocumentService.prototype.Load = function () {
      

    var promise = DocumentRest.get({Id:this.slug},{  }).$promise;
    promise.then(function (Result) {

      this.populate(Result)

      // console.log(Result);
      new UserService().SetFromApi(Result.userin)
      new MusicBoxLoop().init(true);

    }.bind(this));
    promise.catch(function (response) {     
      console.log(response);
    }.bind(this));

  };


  DocumentService.prototype.populate = function (d) {

          $rootScope.doc = d.doc;
         
          $rootScope.markups  = _.sortBy(d.doc.markups,function (num) {
             return num.start;
          });

          //$rootScope.doc.formated_date =  d.doc.updated;
          $rootScope.doc.formated_date = moment(d.doc.updated).calendar() +', '+moment(d.doc.updated).fromNow(); 
          $rootScope.doc_options      =   this.apply_object_options('document', d.doc.doc_options)
          $rootScope.author_options   =    this.apply_object_options('author',   d.doc.user.user_options)
               

              if(d.doc.room){
                  $rootScope.doc.room__id = d.doc.room._id;
                 // $rootScope.room_options =  self.apply_object_options('room', d.doc.room.room_options)
               }
               else{
                   $rootScope.doc.room__id = '';
                   $rootScope.doc.room = new Object({'_id':'-'});
               }
               //console.log(d.markups_type)

                $rootScope.doc_owner = d.is_owner;
                console.log('is owner or has secret ('+ d.is_owner+')')
                document.title = d.doc.title
               
                var encoded_url = root_url+':'+PORT;
                if(d.doc.slug !=='homepage'){
                    encoded_url += '/doc/'+d.doc.slug;
                }
                $rootScope.doc.encoded_url = urlencode(encoded_url);
                $rootScope.doc.text_summary = '';
       
      
  }
   /**
      * @description Sub-function to set objects options (doc_options, users_options, etc..)
      * @param {String} object - kind of object to map
      * @param {Array} options - source array
      * @return {{Array}}
      * @function docfactory#apply_object_options
      * @todo ---
      */

      DocumentService.prototype.apply_object_options = function(object, options){
        //console.log(' apply doc_options to object'+object)
        var options_array = [];
        _.each(options , function(option){
            
           
            var op_name = option.option_name;
            options_array[op_name]          = [];
            options_array[op_name]['value'] = option.option_value
            options_array[op_name]['_id']   = option._id
            options_array[op_name]['type']  = option.option_type
            if( option.option_value && option.option_type == 'google_typo' && object == 'document'){
               WebFont.load({
                  google: {
                   families: [option.option_value]
                  }
               }); 
               var fixed = options_array[op_name]['value'];
               options_array[op_name]['fixed'] =  fixed.replace(/ /g, '_').replace(/,/g, '').replace(/:/g, '').replace(/400/g, '').replace(/700/g, '') 
            }
        });       
        // console.log(options_array) 
        return options_array;
      }
     

  DocumentService.prototype.Config = function () {


      
  }
  DocumentService.prototype.RestartMusicBoxLoop = function () {


      
  }

  DocumentService.prototype.RenderConfig = function () {
      this.render = new renderfactory().init()
      if($routeParams.fresh){
       $rootScope.ui.menus.quick_tools_help.active= 'yes'        
        this.flash_message($rootScope.render_config.i18n.CUSTOM.HELP.fresh_document, 'help' , 300000, true)

     }
  }


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
        //console.log($rootScope.ui.selected_range.markups_to_offset)
        data.doc_content = $rootScope.doc.content;
        data.markups = new Array()
        // prepare / clean 


        _.each($rootScope.ui.selected_range.markups_to_offset, function(mk){

          if(true){
             var a_mk = new Object({'id':mk._id, 'offset_start':mk.offset_start, 'offset_end':mk.offset_end, 'action':'offset', 'type':mk.type, 'subtype':mk.subtype })
             data.markups.push(a_mk)
          }

          if(!mk.offset_start && mk.offset_start !==0){
          
            console.log('bug offset start')
          }
          if(!mk.offset_end){
            console.log('bug offset end')
          }
               
        });
      
        var promise = this.api_method.doc_sync({id:this.slug},serialize(data)).$promise;
        promise.then(function (Result) {

          if($rootScope.ui.debug){
                       $rootScope.doc.formated_date = Result.doc.updated;

          }
           
            // console.log(Result)
            thos.flash_message('&nbsp;', 'line' , 100, false)

             _.each($rootScope.doc.markups, function(m){
                  m.end = m.end+m.offset_end
                  m.start = m.start+m.offset_start
                  m.offset_end=0
                  m.offset_start=0
                  m.has_offset=false
             });
            
            $rootScope.ui.selected_range.markups_to_offset = new Array()

           // new MusicBoxLoop().init(true);
       

        }.bind(this));
        promise.catch(function (response) { 
                console.log(response)
                thos.flash_message('doc sync error', 'bad' , 2000)

           //this.flash_message(response.err, 'bad' , 3000)
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
      * @todo rename to doc_save
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


        var promise = this.api_method.doc_save({id:$rootScope.doc._id},serialize(data)).$promise;
        promise.then(function (Result) {
            var restart = false
            if(field == 'room_id'){
                          if(field == 'room_id' && data.value !==''){}
                          else{
                            $rootScope.doc.room     = Result.doc.room;
                            $rootScope.doc.room__id = Result.doc.room; 
                          }
                          thos.flash_message('document set to room', 'ok' , 2000)    
            }

            // hard redirect
            else if(field == 'title'){
              window.location = root_url+':'+PORT+'/doc/'+Result.doc.slug;
            }
  
            else if(field == 'published'){
              thos.flash_message('document set to '+Result.doc.published, 'ok' , 2000)    

            }
            else if(field == 'excerpt' || field == 'thumbnail'){
                thos.flash_message('document\' '+field+' set to '+data.value, 'ok' , 2000)  

            }
            else{
              thos.flash_message('document set for  '+field, 'help' , 2000)    
            }   
        }.bind(this));
        promise.catch(function (response) { 
            thos.flash_message('document edit error', 'bad' , 2000)    
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
      
        var promise = this.api_method.doc_option_edit({id:this.slug},serialize(data)).$promise;
        promise.then(function (Result) {
              thos.populate(Result)
              thos.flash_message('option saved (->'+data.value+')', 'ok' , 3000)
             
        }.bind(this));
        promise.catch(function (response) { 
          thos.flash_message('error', 'bad' , 3000)
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
   
        var promise = this.api_method.doc_option_delete({id:this.slug},serialize(data)).$promise;
        promise.then(function (Result) {
              thos.populate(Result)
              thos.flash_message('option deleted', 'ok' , 3000)
              // reinit, no need to redraw containers
        }.bind(this));
        promise.catch(function (response) { 
          thos.flash_message('error', 'bad' , 3000)
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
    
        var promise = this.api_method.doc_option_new({id:this.slug},serialize(data)).$promise;
        promise.then(function (Result) {
              thos.populate(Result)
              thos.flash_message('document option created','ok', 3000)
        }.bind(this));
        promise.catch(function (response) { 
          thos.flash_message('error', 'bad' , 3000)
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
        
        var promise = this.api_method.doc_new({},serialize(data)).$promise;
        promise.then(function (Result) {



                  if(Result.err){
                          if(Result.code == 11000 ){

                           thos.flash_message('This title is already used please choose another one', 'bad' , 3000)
                          }
                          else{
                           thos.flash_message('error #'+Result.code, 'bad' , 3000)

                          }
                   
                  }else{
                   window.location = root_url+':'+PORT+'/doc/'+Result.slug+'?fresh';

                               //alert(Result.slug)
                               //   $rootScope.newdoc.created_link = Result.slug;
                               //   $rootScope.newdoc.created_link_title = Result.title;
                               //   $rootScope.newdoc.created_secret = Result.secret;

                  }

        }.bind(this));
        promise.catch(function (response) { 
         
        }.bind(this));




      };



  DocumentService.prototype.SlugFromUrl = function () {
        // default slug
        var docid = 'homepage';
        // using it's route (defined in app.js routers)
        if($routeParams.docid){
          docid = $routeParams.docid
        }
        return docid;
  }

 



  /*
        DocumentService.prototype.Markup_pre = function () {
          

          var data = new Object();
          data.username = $rootScope.userin.username;
          data.user_id = $rootScope.userin._id;
          data.type = 'kjkj'
          data.subtype = 'section';
          data.start =0;
          data.end = 100;
          return data;

        };
    */

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

      DocumentService.prototype.flash_message = function (msg,classname ,timeout, closer) {
        $rootScope.flash_message = {}
        $rootScope.flash_message.text = msg;
        $rootScope.flash_message.classname = classname;

        if(!closer){
            $rootScope.flash_message.closer =false;
        }
        else{
            $rootScope.flash_message.closer = closer;
        }
        

        // apply timeout if set to true
        if(timeout){
            $timeout(function(){
                $rootScope.flash_message.text =  '';
            },timeout);
        }
      };


      /**
      * @description 
      * Delete a markup in API and in view
      *
      *  
      * @param {object} markup - markup to delete 
      * @return -
      * @callback error or reset document + flash message
      * @function docfactory#markup_delete
      * @link docfactory#markup_delete
      * @todo i18n 
      */

      DocumentService.prototype.markup_delete =  function (markup){
      
        var promise = DocumentRest.markup_delete( {id:this.slug, mid:markup._id }).$promise;
        promise.then(function (Result) {
          var tt  = new MusicBoxLoop().init(Result,true);
          this.flash_message('markup deleted', 'ok' , 2000)
        }.bind(this));
        promise.catch(function (response) {  
           this.flash_message(response.err, 'bad' , 3000)
        }.bind(this));
     }

     

     /**
      * @description 
      * Save a markup (attributes)
      *
      * @param {object} markup - markup to save
      * @return {Function} init and/or flash
      * 
      * @function docfactory#markup_save
      * @link docfactory#markup_save
      * @todo ---
      */
      DocumentService.prototype.markup_save= function (markup, field_only, soft) {
        if(!soft){
          var soft = false;
        }
        if(!field_only){
          var field_only = false;
        }


        var thos = this;
        var promise = new Object();
        var data = new Object({
            'metadata':markup.metadata,
            'start':markup.start,
            'end':markup.end,
            'depth':markup.depth,
            'status':markup.status,
            'type':markup.type,
            'subtype':markup.subtype
          });
          if(markup.doc_id_id){
            data.doc_id = markup.doc_id_id
          }
          // can be null.
          data.secret = $rootScope.ui.secret;

          // check-force data
          if(markup.type == 'markup' || markup.type == 'container'  || markup.type == 'container_class' ){
             data.position = 'inline'
          }
          else{
            data.position = markup.position
          }

        
          promise.query = DocumentRest.markup_save({id:this.slug, mid:markup._id }, serialize(data) ).$promise;
          promise.query.then(function (Result) {
            var edited  = Result.edited[0][0]
            console.log(edited)
           
            
           
               this.flash_message(edited.type +' saved', 'ok' , 3000)
              
          
          


          }.bind(this));
          promise.query.catch(function (response) {  
            console.log(response)   
            this.flash_message(response.err.err_code, 'bad' , 3000)
          }.bind(this));

      }
       DocumentService.prototype.doc_delete = function () {
        var thos = this;
        var promise = new Object();
     
        promise.query = DocumentRest.doc_delete( {id:this.slug}).$promise;
        promise.query.then(function (Result) {
            thos.flash_message('deleted', 'ok' , 3000)

            console.log(Result)
            console.log($rootScope.documents)
 
        }.bind(this));
        promise.query.catch(function (response) {  
           console.log(response)   
           thos.flash_message('error', 'error' , 3000)
        }.bind(this));


       }


       /**
      * @description Push a markup
      * @param {object} markup - markup to push
      * @return {function} flash_message() - message 
      * @API : $POST
      * @function docfactory#push_markup
      * @link docfactory#push_markup
      * @todo --
      */
      DocumentService.prototype.markup_push = function (markup) {
        //$rootScope.push = this.Markup_pre();
        var promise = new Object();
        var data = new Object(markup);
        data.username = $rootScope.userin.username;
        data.user_id = $rootScope.userin._id;
        promise.data = serialize(data);
        var thos = this;
        // this.Markup_pre();

        promise.query = DocumentRest.markup_push( {Id:this.slug},promise.data).$promise;
        promise.query.then(function (Result) {
                thos.flash_message(Result.inserted[0].type +' inserted', 'help' , 100)
             
                //console.log(Result.inserted[0])
                  thos.populate(Result)
                  if(markup.type == 'markup'){
                    alert('added')
                  //  new MusicBoxLoop().markup_push(Result.inserted[0]);
                  }
                  else{
                     alert('added')
                   // new MusicBoxLoop().init(true);
                  }
                                  ///// 
             
             //console.log(Result.inserted[0].type)
            
               // socket.emit('news', {doc_id: $rootScope.doc.slug, action: 'push_markup' , type: 'push', object:d.inserted });
               // socket.emit('news', {doc_id: $rootScope.doc.slug, action: 'push_markup' , type: 'push', object:d.inserted });
               //$rootScope.$emit('docEvent', {action: 'doc_ready', type: 'push', collection_type: 'markup', collection:d.inserted[0] });
        }.bind(this));
        promise.query.catch(function (response) {  
           console.log(response)   
           this.flash_message('error', 'error' , 3000)
        }.bind(this));

      };


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