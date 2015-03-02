
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
.factory("DocumentService", function($rootScope, $http,$sce, $resource,$location, $routeParams ,renderfactory, DocumentRest, UserService, $timeout, $locale) {

  
  var DocumentService = function() {
    this.api_method = DocumentRest;

  };
  DocumentService.prototype.FreshLoad = function () {
    this.SetSlug()
   
    this.Load()

  }
  

  DocumentService.prototype.Load = function (slug) {
       
    this.slug = slug
    // this.flash_message('..', 'bad' , 10, false)

    var promise = DocumentRest.get({Id:this.slug},{  }).$promise;
    promise.then(function (Result) {
          $rootScope.doc = Result.doc
          $rootScope.loaded_markups = Result.doc.markups;
      //    $rootScope.doc.markups  = Result.doc.markups;
          this.populate(Result)
          new UserService().SetFromApi(Result.userin)
          $rootScope.doc_owner = Result.is_owner;
          console.log('is owner or has secret ('+ Result.is_owner+')')


    


    }.bind(this));
    promise.catch(function (response) {     
      console.log(response);
    }.bind(this));

  };







  DocumentService.prototype.populate = function (Result) {

         var d = Result.doc
     

        
          // filter markups > only if markup.type ==  "container"
        
          $rootScope.doc.formated_date = '';
       

          $rootScope.doc_options      =    this.apply_object_options('document', d.doc_options)
          $rootScope.author_options   =   this.apply_object_options('author',   d.user.user_options)
               

              if(d.room){
                  $rootScope.doc.room__id = d.room._id;
                 // $rootScope.room_options =  self.apply_object_options('room', d.doc.room.room_options)
               }
               else{
                   $rootScope.doc.room__id = '';
                   $rootScope.doc.room = new Object({'_id':'-'});
               }
             
                var encoded_url = root_url+':'+PORT;
                if(d.slug !=='homepage'){
                    encoded_url += '/doc/'+d.slug;
                }
                $rootScope.doc.encoded_url = urlencode(encoded_url);
                $rootScope.doc.text_summary = '';

                $rootScope.sections_to_count_notice = ($rootScope.sectionstocount == 0) ? true : false;
        
                $rootScope.objects_sections = [];
                $rootScope.objects_sections['global_all'] = [];


/*
        if($rootScope.max_reached_letter !==  $rootScope.doc.content.length){
          console.log('unreached letter found :'+ $rootScope.max_reached_letter +'--'+$rootScope.doc.content.length)
          //max_reached_letter.end = container.end
          if(_.last($rootScope.containers) && $rootScope.max_reached_letter  <  $rootScope.doc.content.length){
              console.log('should patch last section from :'+ _.last($rootScope.containers).end+ ' to'+$rootScope.doc.content.length)
          }
        } 



        // reloop to find isolate markups
        $rootScope.ui.isolated_markups = []

        _.each($rootScope.doc.markups, function(markup){
          
          if(!markup.isolated == false  ){
            console.log('markup.isolated' )
          //  markup.isolated = true;
          //  $rootScope.ui.isolated_markups.push(markup)
          }
        })
*/
        
       
      
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


        _.each($rootScope.ui.offset_queue, function(mk){

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
      
        var promise = this.api_method.doc_sync({id:$rootScope.doc.slug},serialize(data)).$promise;
        promise.then(function (Result) {

          if($rootScope.ui.debug){
              $rootScope.doc.formated_date = Result.doc.updated;

          }
           
         console.log('SAVED')
            thos.flash_message('-', 'line' , 400, false)

           
            
            $rootScope.ui.selected_range.markups_to_offset = new Array()
            $rootScope.ui.offset_queue = new Array()
         

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