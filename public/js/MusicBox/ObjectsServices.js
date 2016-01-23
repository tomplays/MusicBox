
angular.module('musicBox.markup.service',[]).factory("MarkupService", function(MarkupRest, DocumentRest, UserRest) {

  
  var MarkupService = function() {
   // console.log('factory rest')

  };

  MarkupService.prototype.init = function (object, servicetype ) {
     this.set(object)

     this.object_ = object;

     if(servicetype ){
       this.servicetype = servicetype
     }
    
     return this

  }
  MarkupService.prototype.trace = function (ev) {
    this.tracer.push(ev)
  //  console.log(this.tracer)
    return;
  }

 

  MarkupService.prototype.fulltext = function (s,e){
  console.log('init_fulltext (Class)')

   

  return ;
  //$scope.compile_fulltext(fulltext_block)

  }

   MarkupService.prototype.populate = function (){
        console.log('populateUser')
         
          if(this.servicetype == 'user'){
              //base user
              var u = { 
                   
                        'username':'',
                        'account_url':'me/account', 
                        'login_url':'/login',
                        'signout_url':'/signout',
                        'islogged' : false
              } 
              // extend 
              if(this.object_.user && this.object_.user.username !== null){
               // u = this.object_.user;
                u.documents = this.object_.user_documents ? this.object_.user_documents : [];
                u.islogged = true
                u.user_options = this.apply_object_options('user') 
                u  = _.extend(u ,this.object_.user)
                return u;
              }
              else{
                 return u;
              }

          }



          return 


 

  }

  MarkupService.prototype.set = function (object) {
    this.tracer = [];
    this.optionsall = []
    var trace_object = {'log':'setting API for '+this.servicetype, 'id' : object._id} 
   
    switch(this.servicetype) {

      case 'markup':
          this.apimethod = MarkupRest
          object.isolated  = object.isolated ? object.isolated : 'undef'
          break;
      
      case 'document':
          this.api_method = DocumentRest
          break;
      case 'section':
          this.apimethod = MarkupRest
          this.fulltext(object.start, object.end)
          break;
      case 'user':
          this.apimethod = UserRest
          break;
      
      
      default:
          this.apimethod = null
    } 
    
   // console.log(this)
    this.trace(trace_object)
    return this

  }



  /**
      * @description Sub-function to set objects options (doc_options, users_options, etc..)
      * @param {String} object - kind of object to map
      * @param {Array} options - source array
      * @return {{Array}}
      * @function docfactory#apply_object_options
      * @todo ---
      */

     MarkupService.prototype.apply_object_options = function(f){
       
       var options = []

        if(!f && this.servicetype == 'document'){
            //
            options = this.object_.doc_options
        }
        if(this.servicetype == 'section'){
            // options = this.object_.doc.doc_options
        }
        if(this.servicetype == 'markup'){
            // ??? 
            options = this.object_.user_id.user_options
        }
        if(f && f=='user' || this.servicetype == 'user'){
            options = this.object_.user.user_options
        }
        if(f &&  f=='author' ){
            options = this.object_.user
        }
        




        //console.log(' apply doc_options to object'+object)
        var options_array = [];
        _.each(options, function(option){
           
            var op_name = option.option_name;
            options_array[op_name]          = [];
            options_array[op_name]['value'] = option.option_value
            options_array[op_name]['_id']   = option._id
            options_array[op_name]['type']  = option.option_type

            if( this.servicetype == 'document' && option.option_value && option.option_type == 'google_typo'){
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
       
      
     
        return options_array
      }


  

  MarkupService.prototype.save = function (msg) {
    console.log('MarkupService.prototype.save '+msg+'/'+this.apimethod)
    return

  }


  

  return MarkupService;
})