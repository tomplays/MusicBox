var _ = require('underscore');


 (function(exports){


	var debuger = false;
	(debuger) ? console.log('layout module debugr') : {}
  var self = this;
	self.get_layout_zones = function(){
	var z = [ 'center', 'left', 'inline', 'under'];
	return z
	}


	self.get_markups = function(markups, s){
		var res = []    
		_.filter(markups,function (m) {
			if(m.start >= s.start && m.end <= s.end){
			res.push(m)
			}   
		});
		return res
	}

    
  self.build = function(doc,cursor){
  	var sections = []
  	var markups = []
  	var doc_content = doc.doc.content



  	var unfiltered_markups 	= doc.doc.markups
	 
	 unfiltered_markups.forEach(function(m) {   
           if(m.type == 'container'){
                  sections.push(m)
            }
            else{
                  markups.push(m)
            }
     });


   	 //console.log(markups)


 	 var layout_zones = self.get_layout_zones()  


   	 _.each(sections, function(s,si) {
   	 		
   	 		var rel_string = ''
         	var rel_letters = []
         	
         	s.layout_zones = layout_zones

         	for (var i = s.start; i <= s.end; i++) {
             
	            var char__ = { 
	                classes:[],
	                classes_flat: '', 
	                order:i,
	                r: Math.random(),
	                inrange:false
	            } 
	              
	            if(i <= cursor.end  &&  i >= cursor.start  ){
	                 char__.inrange = true
	                 char__.classes_flat += 'inrange-true ';
	            }
	            else{
	            	  char__.classes_flat += 'inrange-false ';
	            }

             
	            char__.char_  = doc_content[i]
	            rel_string 	 += char__.char_
	            rel_letters.push(char__)
          	}
         	s.rel_string = rel_string;



         	var s_markups = self.get_markups(markups,s)
         	// console.log('si'+si+'--'+s_markups.length)
         	// console.log(s_markups)

         	 _.each(s_markups, function(sm){

                  for (var y = sm.start; y <= sm.end; y++) {
                     // console.log(y)
                     if(rel_letters[y]){
                        //  console.log('add class '+sm.subtype+'@'+y)
                        rel_letters[y].classes.push(sm.subtype)
                        rel_letters[y].classes_flat += 'st-'+sm.subtype+' '



                     }
                  }
         	})

         	s.letters = rel_letters;
         	s.compiled = '<pre>'+rel_string+'</pre>';

         

         	var g = _.groupBy(s_markups, function(m) {
            	return m.position
          	})
          	var s_zones =  [] 

          	var loop_r = _.keys(layout_zones);   
            _.each(layout_zones, function(key) {
                // console.log(key)
            
                var k_obj = {'key': key, 'markups': []}
                //s_objects.regions = []
                if(g[key]){
					
					_.each(g[key], function(kk,ii){
	                    	var mktyped   = _.groupBy(g[key], function(k){
                        	return k.type
                    	})
	                    var loop_types = _.keys(mktyped);  

	                    _.each(loop_types, function(t,isi){
	                     // console.log(key,t)
	                      k_obj.markups[t] = mktyped[t]
	                    })
	                 })
                  

                }
                s_zones[key]= k_obj

             })
         	 s.zones = s_zones

   	 })
   	 return sections

   	 	
   }


    
    exports.build       = self.build


 })(typeof exports === 'undefined' ? this.layout = {} : exports );
   
      


 	