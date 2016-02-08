//var Immutable = require('immutable');
/*
var uu = jsx.fromFile('../../node_modules/musicbox/templ.html', {
  		factory: 'h'
	});
*/

(function(exports){

  var self = this;
    self.cursor = {'start':0, 'end':0, 'test_letters_range': false}


   self.get = function(){
       // console.log(self.cursor)
        return self.cursor
   }
   self.move = function(s,e){
       // console.log(self.cursor)
       
      

      if(s){
         self.cursor.start = s

      }
      if(e){
         self.cursor.end = e

      }

        return self.cursor
   }

    /*

  	var self = this;
    console.log('cursor module')
    exports.test = function(){
      console.log('cursor module test')
    }
  



    exports.set = function(){
 		 console.log('cursor module')





 		// var map1 = Immutable.Map({a:1, b:2, c:3});
		//var map2 = map1.set('b', 50);
		//map1.get('b'); // 2
		//console.log(map1.get('b'))

 		
 		return this.cursor;
   }

   

    exports.set_test_letters_range_ = function(val){
       	self.cursor.test_letters_range = val
       	return self.cursor
    }

   exports.move = function(event,s,e){

 
    if(event){
   		 self.cursor.start  =  parseInt(event.target.selectionStart)
	  	 self.cursor.end    =  parseInt(event.target.selectionEnd)
   	}
   	if(s){
	  	 self.cursor.start    =  parseInt(s)

   	}
   	if(e){
   		self.cursor.end    =  parseInt(e)

   	}
   	self.cursor.test_letters_range = true
	return self.cursor;
	
	}

  */

      exports.get       = self.get
      exports.move      = self.move


 
    
})(typeof exports === 'undefined' ? this.cursor = {} : exports );