var _ = require('underscore');


 (function(exports){
 
 

 var s__ = {
    loaded:false, 
    hasimmutable:false,
    immutabledoc:null,
    composants :[]

  };


	var debuger = false;
	(debuger) ? console.log('state  module debugr') : {}
  var self = this;
	
  
  self.getState = function(){
   // console.log('state get')
    //console.log(s__);
    return s__
  }

  self.setState = function(tostate, tostateValue){
       s__[tostate] = tostateValue;
       return s__
  }

    
  exports.getState       =  self.getState
  exports.setState       =  self.setState


 })(typeof exports === 'undefined' ? this.state = {} : exports );
   
      


 	