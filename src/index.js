
var cursor  = require('./cursor.js');
var layout  = require('./layout.js');
var doc     = require('./doc.js');


var _ = require('underscore');


(function(exports){
    
    // public   
    

    exports.cursor_move = function(s,e){
           var cursor_ = cursor.move(s,e)
           return cursor_;

    }
    exports.socket_event = function(data){
          

          _.each(data.actions , function(a,ai){
             console.log(a.test)
             var cursor_ = cursor.move(a.test.rs,a.test.re)

          })
          var d_ = doc.set_field('slug', 'socket_event '+data.time)
          return d_ 
    }


    
    exports.hastree = function(){
        var isloaded = doc.isloaded()        
        return isloaded;

    }

     exports.gettree = function(){
        
        var d_        = doc.get()
        var cursor_   = cursor.get()
        var sections  = layout.build(d_,cursor_)
        return {sections : sections, doc:d_, cursor: cursor_};
    }


    exports.init = function (){

         fetch('http://localhost:8882/data/sample.json')

          .then(function(response) {
            return response.json()
          }).then(function(json) {
           console.log('parsed json', json)
            doc.set(json)
            // return json

          }).catch(function(ex) {
            // console.log('parsing failed', ex)
            return ex
          })
    }
  
})(typeof exports === 'undefined' ? this.musicbox = {} : exports );

