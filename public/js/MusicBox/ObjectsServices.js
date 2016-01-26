
angular.module('musicBox.markup.service',[]).factory("ObjectService", function($rootScope,  $routeParams, MarkupRest, DocumentRest, UserRest, mb_ui) {

  
  var ObjectService = function() {
   // console.log('factory rest')

  };

  ObjectService.prototype.init = function (object, servicetype ) {
     if(servicetype){
       this.servicetype = servicetype
     }
     this.object_ = object;
     this.set()
     return this

  }
  ObjectService.prototype.trace = function (ev) {
     this.tracer.push(ev)
  //  console.log(this.tracer)
    return;
  }

 

  ObjectService.prototype.setFulltext = function (){
    

    var s = this.object_.start
    var e = this.object_.end
   
    //alert(e)
   
      var fulltext = '';
      var fulltext_block = ''
      var i_array     =   0;
      for (var i = s; i <= e; i++) {
      // console.log(i)
      if($rootScope.doc && $rootScope.doc.content[i]){
        fulltext        += $rootScope.doc.content[i];
        fulltext_block  += $rootScope.doc.content[i];
      }
      else{
        // there is no letter for section !
        fulltext += '-';
        fulltext_block += '-'
      }
    }
  
   this.object_.fulltext = fulltext;
   this.object_.fulltext_edit = fulltext;



   /// trigger Force watcher new__value  #D
   this.object_.fulltext_to_array = 'init'


    //$scope.section.fulltext = fulltext
    // $scope.section.fulltext__ = fulltext+'llll'
   return  fulltext;
    //$scope.compile_fulltext(fulltext_block)
   

  
  //$scope.compile_fulltext(fulltext_block)

  }



     ObjectService.prototype.setobjSchemas = function (object){
          
      // var objSchemas;
      var objSchemas_ = $rootScope.objSchemas[object]

      if(object == 'container_class'){
          this.object_.objSchemas_css = objSchemas_
      }
      else{
          this.object_.objSchemas = objSchemas_
      }
    //  console.log(this.objSchemas)
      return objSchemas_;

     }


   ObjectService.prototype.populateUser = function (){

              //base user
              var u = { 
                        'username':'',
                        'account_url':'me/account', 
                        'login_url':'/login',
                        'signout_url':'/signout',
                        'islogged' : false
              }
              if(this.object_.user && this.object_.user.username !== null){
                // u = this.object_.user;
                u.documents = this.object_.user_documents ? this.object_.user_documents : [];
                u.islogged = true
                u.user_options = this.apply_object_options('user') 
                u  = _.extend(u ,this.object_.user)
               
              }
              return u;

   }


   ObjectService.prototype.populate = function (){
          console.log('populate object_'+this.servicetype)
          var d_s_m_base = { 
                          'operation': this.object_.operation ?  this.object_.operation : {},
                          'operations': this.object_.operations ?  this.object_.operations : [],
                          'touched'     : false
                        } 

                       
          if(this.servicetype == 'section'){
           
             var d_s_m =  _.extend(d_s_m_base, {
                        'selected'  : false,
                        'focused'   : '',
                        'editing_text': $rootScope.render.debug ? true : false,
                        'modeletters' : $rootScope.render.debug ? 'single' : 'compiled',
                        'section_classes':'bsssg_black',
                        'inrange_letters': null
                      
             })
             this.object_ = _.extend(this.object_, d_s_m)


             return d_s_m;
          }

           if(this.servicetype == 'markup'){
             var d_s_m =  _.extend(d_s_m_base, {
                  selected        : false,
                  editing         : false,
                  fast_editor     : ($rootScope.doc.doc_owner) ? true : false,
                  inrange         : false,
                  deleted         : false,
                  forced          : (this.object_.type =='markup' || this.object_.type =='container_class' ) ? true : false,
                  doc_id_id       : '', // special cases for child documents (refs as doc_id in markup record)
                   ////      by_me      : ( $scope.markup.user_id._id && $scope.$parent.userin._id  && ($scope.$parent.userin._id == $scope.markup.user_id._id ) ) ? true : false,
                  can_approve     : ($rootScope.doc.doc_owner) ? true : false                     
             })
              

           }
           if(this.servicetype == 'document'){


              mb_ui_.textrange()

             var encoded_url = root_url+':'+PORT+''
             encoded_url += (this.object_.slug !=='homepage') ? '/doc/'+this.object_.slug : '';
             
      
             var d_s_m =  _.extend(d_s_m_base, {
                encoded_url     : urlencode(encoded_url),
                text_summary    : '',

                room__id        : (this.object_.room) ? this.object_.room._id : '',
                sections        : _.sortBy(this.object_.sections,function (num) {
                   return num.start;
                }),
                markups         : _.sortBy(this.object_.markups_,function (num) {

                   return num.start;
                }) 

             })
              console.log('mapped doc : sections: '+_.size(this.object_.sections)+' markups:'+ _.size(this.object_.markups_))      

              

           }
           console.log(this.object_)
          
          this.object_ = _.extend(this.object_, d_s_m)
          return 


 

  }

  ObjectService.prototype.set = function () {
    var object = this.object_
    this.tracer = [];
    this.object_.options_ = []
    var trace_object = {'log':'setting API for '+this.servicetype, 'id' : object._id} 
   
    switch(this.servicetype) {

      case 'markup':
          this.apimethod = MarkupRest
          // object.isolated  = object.isolated ? object.isolated : 'undef'
          this.setobjSchemas(this.object_.type);
          this.populate()
          this.setFulltext()
          break;
      
      case 'document':
          
          // set UI 
          mb_ui_ =  new mb_ui()
          mb_ui_.init()

          this.api_method = DocumentRest
          this.populate()
          this.apply_object_options('doc_options')

         
          break;
      case 'section':
          this.apimethod = MarkupRest
          this.setobjSchemas('container');
          this.setobjSchemas('container_class');
          this.populate()
          this.setFulltext()

          break;
      case 'user':
          this.apimethod = UserRest
          break;
      
      
      default:
          this.apimethod = null
    } 
    
   // console.log(this)
    //this.trace(trace_object)
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

     ObjectService.prototype.apply_object_options = function(f){
       
        var options;

        if(f && f=='doc_options' ){
            options = this.object_.doc_options
        }
        if(this.servicetype == 'section'){
        }
       /* if(this.servicetype == 'markup'){
            // ??? 
            options = this.object_.user_id.user_options
        }
        */
        if(f && f=='user' || this.servicetype == 'user'){
            options = this.object_.user.user_options
        }
        if(f &&  f=='author' ){
            options = this.object_.user
        }
        
        if(f && f=='markup_user'){
           options = this.object_.user_id.user_options
        }



        //console.log(' apply doc_options to object'+object)
        var options_array = {};
        _.each(options, function(option){
           
            var op_name = option.option_name;
            options_array[op_name]          = {};
            

            options_array[op_name].option_name = option.option_name
            options_array[op_name].value= option.option_value
            options_array[op_name]._id   = option._id
            options_array[op_name].type  = option.option_type

            if(this.servicetype == 'document' && option.option_value && option.option_type == 'google_typo'){
              
               WebFont.load({
                  google: {
                   families: [option.option_value]
                  }
               }); 
               var fixed = options_array[op_name]['value'];
               options_array[op_name]['fixed'] =  fixed.replace(/ /g, '_').replace(/,/g, '').replace(/:/g, '').replace(/400/g, '').replace(/700/g, '') 
            }


        });       
        
        if(f && f=='doc_options' ){   
            this.object_.doc_options  = options_array
        }

        this.object_.options_[f] = options_array
        return options_array
      }



  ObjectService.prototype.save = function (msg) {
    console.log('ObjectService.prototype.save '+msg+'/'+this.apimethod)
    return

  }

  return ObjectService;
})