
angular.module('musicBox.MarkupService',[]).factory("MarkupService", function(MarkupRest, DocumentRest) {

  
  var MarkupService = function() {
    console.log('factory rest')

  };

  MarkupService.prototype.init = function (object) {
     this.set(object)

     return this

  }
  MarkupService.prototype.trace = function (ev) {
    this.tracer.push(ev)
    console.log(this.tracer)
    return;
  }

  MarkupService.prototype.set = function (object) {
    this.servicetype = object.servicetype
    this.tracer = [];
    this.optionsall = []
    var trace_object = {'log':'setting API for '+this.servicetype, 'id' : object._id} 
   
    switch(this.servicetype) {

      case 'markup':
          this.apimethod = MarkupRest
          break;
      
      case 'document':
          this.apimethod = DocumentRest
          break;
      case 'section':
          this.apimethod = MarkupRest
          break;
      
      
      default:
            this.apimethod = null
    } 
    
    console.log(this)
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

     MarkupService.prototype.apply_object_options = function(object, options){
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
        this.options_array = options_array

        this.optionsall[object] = options_array
        return this.options_array
      }


  

  MarkupService.prototype.save = function (msg) {
    console.log('MarkupService.prototype.save '+msg+'/'+this.apimethod)
    return

  }


  

  return MarkupService;
})