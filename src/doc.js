
var _ = require('underscore');



 (function(exports){

   var doc_= {};
   
   var debuger = false;
   (debuger) ? console.log('doc module debugr') : {}
 
  var self = this;

  
   self.set = function(data){
   
      (debuger) ? console.log('set doc') : {}
      doc_        = _.extend(doc_, data)
      doc_.loaded = true;
   }

   self.set_field = function(field, data){
      doc_.doc[field]        = data
   }


   

   self.get = function(){
      return doc_
   }
   
   self.isloaded = function(){
      (debuger) ? console.log('get doc') : {}
      if(doc_ && doc_.loaded){
        return true
      }
      else{
       return false;
      }
      

   }

   exports.set             = self.set
   exports.isloaded        = self.isloaded
   exports.get             = self.get
   exports.set_field       = self.set_field


  
 })(typeof exports === 'undefined' ? this.doc = {} : exports );
   
      


  
  