
var _ = require('underscore');



 (function(exports){

   var doc_= {};
   
   var debuger = false;
   (debuger) ? console.log('doc module debugr') : {}
 
  var self = this;

  
   self.set = function(data){
      (debuger) ? console.log('set doc') : {}
      doc_        = _.extend(doc_, data)
      return doc_

   }

   self.set_field = function(field, data){
      console.log('field: '+field+' '+'oldvalue: '+doc_.doc[field]+' newValue: '+data)
      doc_.doc[field]        = data
      //  self.set(doc_)
      return doc_;
   }


   self.get = function(){
      return doc_
   }
   
  
   
   exports.get             = self.get
   exports.set             = self.set
   exports.set_field       = self.set_field


  
 })(typeof exports === 'undefined' ? this.doc = {} : exports );
   
      


  
  