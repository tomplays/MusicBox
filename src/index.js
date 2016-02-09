
var cursor  = require('./cursor.js');
var layout  = require('./layout.js');
var doc     = require('./doc.js');
var state   = require('./state.js');


var _ = require('underscore');


(function(exports){
    
    // public   
    

    exports.cursor_move = function(s,e){
           var s_c = state.setState('hasmutation', true)
           var cursor_ = cursor.move(s,e)
           return cursor_;

    }
    exports.socket_event = function(data){
          

          _.each(data.actions , function(a,ai){
             console.log(a.test)
             var cursor_ = cursor.move(a.test.rs,a.test.re)

          })
          var s_c = state.setState('hasmutation', true)
          
          //var d_ = doc.set_field('slug', 'socket_event '+data.time)
          // return d_ 
    }


  
    exports.doc_set_field = function(field, data){
        var d_ = doc.set_field(field, data)        
        return d_;
    }
    
    exports.state_get = function(){
       var state_ = state.getState()       
       return  state_
    }
    exports.state_set = function(tostate, tosateValue){
       var state_ = state.setState(tostate, tosateValue)      
       return  state_
    }


    

     exports.refresh_tree = function(){


        var to          =  this.state_get()
        var hasmutation =  to.hasmutation 

        if(hasmutation || hasmutation == 'init'){

            if(hasmutation == 'init'){
                console.log('has mutation (first time)')
            }
            else{
                console.log('has mutation')
            }
            var r = toState();
            return r

        }
        else{
           // console.log('has NO mutation')
            return false
        }




       


       
    }


    var toState = function (){
            var d_        = doc.get()
            var cursor_   = cursor.get()
            var sections  = layout.build(d_,cursor_)
            var r         = {sections : sections, doc:d_, cursor: cursor_};
            
            var s_b = state.setState('immutabledoc', r) 
            var s_m = state.setState('hasimmutable', true)

            // clean trigger.
            var s_c = state.setState('hasmutation', false)
            return  r;
    }


    exports.init = function (){

         
         fetch('http://localhost:8882/data/sample.json')

          .then(function(response) {
            return response.json()
          }).then(function(json) {
           console.log('parsed json', json)
            

            var d_  = doc.set(json)
            var s_  = state.setState('loaded',true);
            var s_e = state.setState('hasmutation', 'init')

            return json

          }).catch(function(ex) {
            // console.log('parsing failed', ex)
            return ex
          })
    }
  
})(typeof exports === 'undefined' ? this.musicbox = {} : exports );

