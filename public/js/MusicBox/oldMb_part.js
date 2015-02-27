  /**
      * wrap a "range of markup"
      * @param {Object} markup
      * @param {Object} container
      * @param {LoopIndex} index
      * @param {Array} temp_letters
      * @function docfactory#markup_ranges
      * @return --
      * @link docfactory#markup_ranges
      */
    
      markup_ranges : function (markup, container, index, temp_letters){

        console.log('Markup ranges')

        var j_arr=0;
        var i_array = 0;  
        var into_for = 0;
        // console.log('section end:'+section.end)
        // console.log('fc:'+ parseInt(section.end) - parseInt(section.start) );
        
        var size_object = parseInt(markup.end) - parseInt(markup.start) -1;
        markup.explicit_string  =   '';
        

        var first_of_a_kind = true;
        var last_of_a_kind = true;

    for (var pos= markup.start; pos<=markup.end; pos++){ 
          // push class to each letter..
          var delta = parseInt(markup.start) - parseInt(container.start) + j_arr;      
          
          if($rootScope.doc.content[delta]){
              markup.explicit_string += $rootScope.doc.content[delta];
          }


         //  console.log(markup._id)
        

          // only to markup with "block" 

          if(markup.visible === true)  {

            //temp_letters[delta]['classes'].push('is_visible')
          }
        if(markup.visible ==false)  {
            //temp_letters[delta]['classes'].push('is_not_visible')

 

          }
          if(markup.subtype=='h1' ||  markup.subtype=='h2' ||  markup.subtype=='h3' || markup.subtype=='h4' || markup.subtype=='h5' || markup.subtype=='h6' || markup.subtype=='list-item'  || markup.subtype=='quote' ||  markup.type=='data')  {
                if(pos == markup.start ){
                   temp_letters[delta]['classes'].push('fi')
                }
                if(size_object+1 ==  j_arr ){
                  temp_letters[delta]['classes'].push('nd')
                }
               

               if(pos !== markup.start  && size_object+1 !==  j_arr){
                 temp_letters[delta]['classes'].push('md')
               }



               
          }


          if(markup.subtype=='h2'){
            temp_letters[delta].classes_array[markup.subtype] = {'active' : true};
            // console.log('h2].active on letter'+delta)
          }

          if( temp_letters[delta]){
          //  temp_letters[delta]['classes'].push(markup._id)
          }
          //$rootScope.letters[index][delta]['classes'] = _.without($rootScope.letters[index][delta]['classes'],'selected')
          //$rootScope.letters[index][delta]['classes'] = _.without($rootScope.letters[index][delta]['classes'],'editing')
          if(markup.editing === true ){
           // $rootScope.letters[index][delta]['classes'].push('editing')
            temp_letters[delta]['classes'].push('editing')
            /* L+ */
          }
          if(markup.selected === true){
            temp_letters[delta]['classes'].push('selected')
             /* L+ */
          }
          //$rootScope.letters[section_count][delta]['char'] =  j_arr;
          //if(ztype && ztype== 'note'){
          //  $rootScope.letters[section_count][delta]['classes'].push(a.subtype);
          //  $rootScope.letters[section_count][delta]['classes'].push(ztype);

          //}
          //else{
            


            if(temp_letters[delta] && markup.subtype && markup.subtype !=='h2'){
                
                // if twice, adds "_" to subtype-class
                if(_.contains(temp_letters[delta]['classes'], markup.subtype) ) {
                      temp_letters[delta]['classes'].push('_'+markup.subtype);

                } 
                else{
                      temp_letters[delta]['classes'].push(markup.subtype);
                }
            }




            if(temp_letters[delta] && markup.depth){
                 temp_letters[delta]['classes'].push('depth_'+markup.depth);

            }

            if(temp_letters[delta] && markup.status){
                 temp_letters[delta]['classes'].push('status_'+markup.status);
            }


            // in some cases, include 'type' class too (subtype usually used.)
            if(temp_letters[delta] && (markup.type=='semantic' || markup.type =='data' || markup.type =='genreric') ){

                temp_letters[delta]['classes'].push(markup.type);
              
            }
           
            //$rootScope.letters[section_count][delta]['objects'].push(a);
                //      $rootScope.letters[section_count][delta]['classes'].push('c-'+a.id);

          //}

          // markup is an hyperlink
          if(markup.type == 'hyperlink' && markup.metadata){
            temp_letters[delta]['href'] = markup.metadata;
          }


          ///temp_letters[delta].classes_array
           var ok= Object.keys(temp_letters[delta].classes_array) 
           //  console.log(ok)

                    _.each(ok, function(k, i){

                     // console.log(k)
                      //console.log(letter_arr.classes_array[k])
                      if(temp_letters[delta].classes_array[k] && temp_letters[delta].classes_array[k].active){
                        //temp_letters[delta]['classes'].push(k)

                      }

                    });

               


          i_array++;
          j_arr++
        }
        return markup;
      },
      ranges_to_fulltext: function (content, start, end){
        var fulltext = '';
        var i_array     =   0;
       
        for (var i = start; i <= end; i++) {
          var ch = '';
          ch = content[i];
          if (ch === " ") {
            ch = ' ';
          }
          if (!content[i]) {   
            ch = '';     
          }
          fulltext += ch;
          i_array++;
        }
        if(!fulltext){
          fulltext = '-';
         }
         return  fulltext;
      },


      /**
      * fill arrays of letters for each section  {@link docfactory#distribute_markups} 
      * @param {Object} section - section object
      * @param {Start-range} section.start  -    section start
      * @param {End-range} section.end    -  section end
      * @param {Number} [section_count] - section index value 
      * @function docfactory#fill_chars
      * @return {Object} letters of a section
      * @link docfactory#distribute_markups 
      * @todo remove section count param
     

      fill_chars : function (section, section_count){
     
        var temp_letters = [];
        var i;
        var i_array     =   0;
        var fulltext    =   '';
        var str_start   =   section.start;
        var str_end     =   section.end;

        // confing could be a option/mode feature
        var content_string  = $rootScope.doc.content


        var classes_arr = new Array()
        // classes_arr.h1 = {}
        // classes_arr.h2 = {}


        for (i = str_start; i <= str_end; i++) {
          var letter_arr = new Object({
              'classes':[], 
              'classes_array': classes_arr, 
              'classes_flat': '',
              'order':i,
              'absolute_order':str_start+i,
          
          });


          var ch = '';
          ch = content_string[i];
          
          if (ch === " ") {
                ch = ' ';
          }
          if (!content_string[i]) {
            // maybe better to unset ? 
            ch = '';
                letter_arr.classes.push('no-lt')
                letter_arr.classes_flat += 'no-lt '
            }
         
          letter_arr['char'] = ch;
          letter_arr.sectionin = section_count;
          temp_letters[i_array]  = letter_arr;
          i_array++;
        }
        if(!fulltext){
          fulltext = '-';
         }
        return temp_letters;
      },

      remove_lt_classes: function (container) {
        console.log(container)
        alert('d')

      },
 */