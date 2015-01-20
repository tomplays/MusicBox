
/* 
main "service / angular factory"

handle POST/GET calls to api (rest) for document, doc_options, markups .. crud / backend methods
can be called from contollers (init on load, save / edits from UI )
can emit events, flash_messages and websockets.
can redirect window


 Contains "MusicBox algorithm" (sorting, distribution, letters system)
*/


 /**
 * Factory / services for document model
 * 
 * @class docfactory
 * @param {Factory} docfactory -  angular custom factory for document 
 * @inject $rootScope, $http, $location,$sce, $routeParams, socket, renderfactory, $locale, $timeout
 */

var musicBox = angular.module('musicBox.MusicBoxLoop', ['musicBox.controller','ngLocale', 'ngResource', 'ngRoute','musicBox.services', 'musicBox.directives', 'ngSanitize', 'musicBox.DocumentRest', 'musicBox.MusicBoxLoop'])
.factory('MusicBoxLoop', function ($rootScope, $http, $location,$sce, $routeParams, socket, renderfactory, $locale, $timeout, renderfactory) {
 return function (inf) {
    var self = {
     
    
/**
      * set doc object after an api call (first load or "redraw-callback" )
      * if "next" params, redraw containers, else, only reset doc "base"
      * @return 
      * *doc base
      * *ready for loops
      * @function docfactory#init
      */
      init: function (d, next) {

             var temp_scope = $rootScope;
             //$rootScope;

             if(d.userin){
                // not an absulte condition, api will always check rights
                temp_scope.userin = d.userin;

              }
              else{
                temp_scope.userin = new Object({'username':''});
              }

              temp_scope.doc = d.doc;

            
              temp_scope.doc.formated_date =  moment(d.doc.updated).calendar() +', '+moment(d.doc.updated).fromNow(); 
              console.log(  $rootScope.i18n.id )
              // http://stackoverflow.com/questions/17493309/how-do-i-change-the-language-of-moment-js
              //$rootScope.doc.formated_date = d.doc.updated
               // console.log($rootScope.doc.user)
             
              temp_scope.doc_options =   self.apply_object_options('document', d.doc.doc_options)
              temp_scope.author_options =    self.apply_object_options('author',   d.doc.user.user_options)
               

              if(d.doc.room){
                  temp_scope.doc.room__id = d.doc.room._id;
                 // temp_scope.room_options =  self.apply_object_options('room', d.doc.room.room_options)
               }
               else{
                   temp_scope.doc.room__id = '';
                   temp_scope.doc.room = new Object({'_id':'-'});
               }
               //console.log(d.markups_type)

                temp_scope.doc_owner = d.is_owner;
                console.log('is owner or has secret ('+ d.is_owner+')')
                document.title = d.doc.title
               
                var encoded_url = root_url+':'+PORT;
                if(d.doc.slug !=='homepage'){
                    encoded_url += '/doc/'+d.doc.slug;
                }
                temp_scope.doc.encoded_url = urlencode(encoded_url);
                temp_scope.doc.text_summary = '';
                
                // letters and 
                temp_scope.letters = [];
                // "warnings" variable
             
                temp_scope.max_reached_letter = 0;
                // test
                // $rootScope.selectingd = 'init';        
               
                $rootScope = temp_scope;
                if(next == true){
                   self.init_containers()
                }
               


               

                return
                // equivalent : 
                // $rootScope.$emit('docEvent', {action: 'doc_ready', type: 'load', collection_type: 'doc', collection:doc});
      },


      /**
      * init containerS (as a collection)
      * @function docfactory#init_containers
      */

      init_containers: function () {
        $rootScope.sectionstocount = 0;
        $rootScope.doc.markups  = _.sortBy($rootScope.doc.markups,function (num) {
          return num.start;
        });
        
        $rootScope.virtuals= new Array();
        var virtual_summary = new Object({'slug': 'summary', 'header': 'Text summary', 'auto': {'bytype': 'h1-h6'} , 'implicit': {'bytype': 'summary'} } )
        var virtual_data_x = new Object({'slug': 'data_x', 'header': 'data serie (x)', 'explicit': {'bysubtype': 'x'} } )
        var virtual_data_y = new Object({'slug': 'data_y', 'header': 'data serie (y)', 'explicit': {'bysubtype': 'y'} } )
        var virtual_data = new Object({'slug': 'data', 'header': 'data serie (any)', 'explicit': {'bytype': 'data'} } )

    
        $rootScope.virtuals.push(virtual_summary)
        $rootScope.virtuals.push(virtual_data_x)
        $rootScope.virtuals.push(virtual_data_y)
        $rootScope.virtuals.push(virtual_data)

      

        // var virtual_containers = new Object({'slug': 'sections', 'header': 'containers ', 'auto': {'bytype': 'h1-h6'} , 'implicit': {'bytype': 'container'} } )
        // $rootScope.virtuals.push(virtual_containers)

        // no need yet but works. 
        // self.virtualize()
  
        
        // filter markups > only if markup.type ==  "container"
        $rootScope.containers = _.filter($rootScope.doc.markups, function(td){ return  td.type == 'container'; });
        
        // warning and check notices
        $rootScope.sectionstocount = _.size($rootScope.containers);
        $rootScope.sections_to_count_notice = ($rootScope.sectionstocount == 0) ? true : false;
        
        $rootScope.objects_sections = [];
        $rootScope.objects_sections['global_all'] = [];
        
        // reafactor for global.
        // $rootScope.objects_sections['global_by_type'] = [];
        // _.each($rootScope.available_sections_objects, function(o, obj_index){
        // $rootScope.objects_sections['global_by_type'][o] =[];
        //});
      
        // containers are ready to be filled
        this.distribute_markups()
      },


      /**
      * @description 
      * Distribute markups in matching containers and in matching layout positions 
      *
      * #### assuming 
      * * Document and its markups are loaded
      * * Containers are init
      *
      * 
      * @function docfactory#distribute_markups
      * @link docfactory#fill_chars
      * @todo nothing
      */

      distribute_markups : function () {

        //  
        // START Looping each container
        // 

        _.each($rootScope.containers, function(container, index){

          self.init_container(container, index);

          /**
          * Loop each doc.markups 
          * 
          */

          // populate letters as single objects.
          var  temp_letters  =  self.fill_chars(container,index);
       
          _.each($rootScope.doc.markups, function(markup){
              
              // only for markups which ranges match container
              if(markup.start >= container.start && markup.end <= container.end){
                self.wrap_markup(markup, container, index, temp_letters);
              } // if in-range

          }); // each markups end.

         $rootScope.containers[index].letters = temp_letters;

          // final compilation.
          var lt_out ='';
          _.each(temp_letters, function(lc, w){

                // flatten classes
               // console.log(lc)
                /*
                var fi = '';
                var nd = '';
                
                if( _.contains(lc.classes, 'fi')   ){
                  console.log('fi/nd class.')
                  fi='fi';
                 // lc.classes = _.without(lc.classes, 'fi')

                }
                if( _.contains(lc.classes, 'nd')   ){
                  console.log('nd class.')
                  nd= 'nd';
                 // lc.classes = _.without(lc.classes, 'nd')
                }
                */

                //lc.fi_or_nd = self.test_fi_or_nd_classes(lc.classes)


                temp_letters[w].classes_flat = self.flatten_classes(lc.classes)

                
              


                /// compile string only with char
                if(lc.classes_flat == ""){
                   lt_out += lc.char
                }
                else{

                    lt_out += '<span class="lt '+temp_letters[w]['classes_flat']+'" >'+lc.char+'</span>'

                    /*
                   // wrap each letter in span with its classes.
                    if( temp_letters[w-1] && temp_letters[w-1].classes_flat && temp_letters[w-1].classes_flat == temp_letters[w].classes_flat){
                          lt_out += lc.char
                     }
                     else{
                      
                        if(w>0){
                          lt_out += '</span>';
                        }
                        lt_out += '<span class="lt '+temp_letters[w]['classes_flat']+'" >'+lc.char+''

                     }

                     */
                }


                if(w == temp_letters.length-1){
                  // lt_out += '</span>';
                }

           });

           $rootScope.containers[index].fulltext_block = lt_out;
          

        }); // end of containers loop


        // if need special class to add only once.
        //_.each($rootScope.containers[index].letters, function(lc, wb){
        //  lc['classes_flat'] += 'lt-def '
        //});
        /*
        _.each($rootScope.containers, function(container, index){
            $rootScope.containers[index].compiled = '';
              _.each($rootScope.containers[index].letters, function(l, l_index){
                  $rootScope.containers[index].compiled += "<my-customer></my-customer>";
            });
        }); // end of containers loop        
        */


        if($rootScope.max_reached_letter !==  $rootScope.doc.content.length){
          console.log('unreached letter found :'+ $rootScope.max_reached_letter +'--'+$rootScope.doc.content.length)
          //max_reached_letter.end = container.end
          if(_.last($rootScope.containers) && $rootScope.max_reached_letter  <  $rootScope.doc.content.length){
              console.log('should patch last section from :'+ _.last($rootScope.containers).end+ ' to'+$rootScope.doc.content.length)
          }
        } 

        // reloop to find isolate markups
        $rootScope.ui.isolated_markups = []
        _.each($rootScope.doc.markups, function(markup){
          if(!markup.isolated ==false || markup.start > $rootScope.doc.content.length ){
            console.log('markup.isolated' )
            markup.isolated = true;
            $rootScope.ui.isolated_markups.push(markup)
          }
        })
      
      },

      /**
      * init container (as single object)
      * @param {Object} container
      * @param {Number} index
      * @function docfactory#init_container
      */

      init_container: function (container, index) {

            /* some variable seting for each container */

            // its letters"      
            // var temp_letters;
            
            container.selecting = -1;
            // letters mode (html "block" or single)

            container.modeletters = 'block'

            // reach letter max test
            if(container.end > $rootScope.max_reached_letter){
              $rootScope.max_reached_letter = container.end
            } 

            // continous test (prev end match current start)
            if($rootScope.containers[index-1]){
              var container_prev_end = ($rootScope.containers[index-1].end)+1;
              if(container_prev_end !== container.start){
                console.log('discontinous section found '+container_prev_end+' /vs/'+container.start)
              }
            }
          
          

            // data_serie.push(container.start)
            //$rootScope.objects_sections[index] = new Array();
            $rootScope.containers[index]['objects'] = [];
            $rootScope.containers[index]['objects_count'] = [];
            $rootScope.containers[index]['objects_count']['by_positions'] = [];
            $rootScope.containers[index]['objects_count']['all'] = [];

            // section can have css classes and inlined styles (background-image)
            $rootScope.containers[index].section_classes = '';
            $rootScope.containers[index].section_styles  = '';


            // $rootScope.containers[index]['classes'] =[];
            // $rootScope.objects_sections[index]['global'] = [];
            _.each($rootScope.available_sections_objects, function(o, obj_index){
              $rootScope.containers[index]['objects'][$rootScope.available_sections_objects[obj_index]] = [];
              // and each subs objects an array of each positions
              $rootScope.containers[index]['objects_count']['all']= new Object({'count':0, 'has_object':false})
              _.each($rootScope.available_layouts  , function(op){ // op: left, right, ..
                $rootScope.containers[index]['objects_count']['by_positions'][op.name] = new Object({'count':0, 'has_object':false})
                $rootScope.containers[index]['objects'][$rootScope.available_sections_objects[obj_index]][op.name] =[];
              });
              // set to "1" for title include.
              // $rootScope.containers[0]['objects_count']['by_positions']['center'].count = 1;
            });




      },


      /**
      * wrap a markup
      * @param {Object} markup
      * @param {Object} container
      * @param {LoopIndex} index
      * @param {Array} temp_letters
      * @function docfactory#wrap_markup
      * @return --
      * @link docfactory#wrap_markup
      */

      wrap_markup: function(markup, container, index, temp_letters ){

        if(!$rootScope.objSchema[markup.type]){
          console.log(markup.type)
          console.log('no schematype for markup!')
          return false;
        }

        //   console.log($rootScope.objSchema[markup.type].display_name)
       
        markup.offset_start = 0;
        markup.offset_end = 0;
 
        // some commons attributes
        // > todo use states objects
        markup.sectionin = index;
        markup.isolated = false;
        /// keep open test :
        //console.log('keep open')
        markup.selected = false;
        markup.editing  = '';
        markup.inrange  = true;
        markup.uptodate = '';
      
        // special cases for child documents (refs as doc_id in markup record)
        markup.doc_id_id = '';

        markup.user_options =  self.apply_object_options('markup_user_options',markup.user_id.user_options)

        // user "by_me" ownership test
        markup.by_me = 'false'
        if( markup.user_id._id && $rootScope.userin._id  && ($rootScope.userin._id == markup.user_id._id ) )  {
             markup.by_me = 'true';
        }

        // using "memory" of ui.
        _.each($rootScope.ui.selected_objects, function(obj){
          //console.log('keep opn'+obj._id)
          if(markup._id == obj._id){
               markup.selected = true;
            // should select ranges too..
          }
        })
         _.each($rootScope.ui.editing_objects, function(obj){
          //console.log('keep opn'+obj._id)
          if(markup._id == obj._id){
            markup.editing = true;
          }
        })
  

        // depending cases of types and subtypes : 
        

        if(markup.type=='container_class' ){ // or pos == inlined
             $rootScope.containers[index].section_classes += markup.metadata+' ';
        }

        if(markup.type == 'media' || markup.subtype == 'simple_page' ||  markup.subtype == 'doc_content_block' ){
               $rootScope.containers[index].section_classes += 'has_image ';
               if(markup.position){
                  $rootScope.containers[index].section_classes += ' focus_side_'+markup.position +' ';
               }

               if(markup.position == 'background'){
                  $rootScope.containers[index].section_styles = 'background-image:url('+markup.metadata+'); ' ;
               }

        }

        if(markup.type =='child'){ 
          // to keep doc_id._id (just id as string) in model and not pass to post object later..
          if(markup.doc_id){ 
             markup.doc_id_id = markup.doc_id._id;
             if(markup.doc_id.doc_options){
               // m.markup.child_options = [];
               var  options_array =  [];
                markup.child_options = [];
                _.each(markup.doc_id.doc_options , function(option){
                  options_array[option.option_name] = option.option_value
                });
                markup.child_options = options_array
              }
          }
          //console.log('children call ...')
        }
        if(markup.type =='data'){


        } 

        // need to map letters for each range of markup (not all objects)
        if( ($rootScope.objSchema[markup.type].map_range && $rootScope.objSchema[markup.type].map_range==true)  || markup.subtype=='share_excerpt'  ){ // or pos == inlined
            
            self.markup_ranges(markup, container, index, temp_letters);
            //$rootScope.containers[index].objects[markup.type]['inline'].push(markup); 
            //console.log($rootScope.objects_sections[index][td.type])
        } // if textrange_loop end.

        /**
        * add to container objects
        *
        */

        // check exist/not null
        if(markup.type !== "" && markup.position){ // > can add it
          
          // adding to the global collection
          if(markup.position == 'global'){
            $rootScope.objects_sections['global_all'].push(markup)
            // $rootScope.objects_sections['global_by_type'][markup.type].push(markup)
          }

          // add markup to container objects (container::index::type::position) 
          $rootScope.containers[index].objects[markup.type][markup.position].push(markup) 
          
          // if(markup.type !=='container'){
          $rootScope.containers[index].objects_count['all'].count++;
          $rootScope.containers[index].objects_count['all'].has_object  = true;
          $rootScope.containers[index].objects_count['by_positions'][markup.position].count++;
          $rootScope.containers[index].objects_count['by_positions'][markup.position].has_object  = true;
          //}
        }
        //console.log($rootScope.containers[index]['objects'][markup.type][markup.position])
        //console.log('pushed'+markup.position)
        
        return markup;
      },


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
            
            if(temp_letters[delta] && markup.subtype){
                
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


          i_array++;
          j_arr++
        }
        return markup;
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
      */

      fill_chars : function (section, section_count){
     
        var temp_letters = [];
        var i;
        var i_array     =   0;
        var fulltext    =   '';
        var str_start   =   section.start;
        var str_end     =   section.end;

        // confing could be a option/mode feature
        var content_string  = $rootScope.doc.content

        for (i = str_start; i <= str_end; i++) {
          var letter_arr = new Object({
              'classes':[], 
              'classes_flat': '',
              'order':i,
          
          });


          var ch = '';
          ch = content_string[i];
          
          if (ch === " ") {
                ch = ' ';

            }
            if (!content_string[i]) {
              // maybe better to unset ? 
                ch = '?';
                letter_arr.classes.push('no-lt')
                letter_arr.classes_flat += 'no-lt '
            }
            fulltext += ch;
            letter_arr['char'] = ch;


          // old. #mongotaste
        //letter_arr['fi_nd'] = new Object({'fi': false, 'nd':false/*, 'md':false*/});
        //  letter_arr.fi_nd = new Object({'fi': false, 'nd':false/*, 'md':false*/});
        
          
          /** 
          * @something here
          * @link DocumentCtrl#fill_chars
          */

         
            //letter_arr.action = '';
            //  letter_arr.rindex = i_array;
            //  letter_arr.lindex= i;
            //unsued a heavy  letter_arr.objects = [];
          letter_arr.sectionin = section_count;
                  //letter_arr.mode= 'display';
                  //letter_arr.state = new Object({ 'statemode' : 'loading','select' : false,'clicked' : false,'inrange' : false , 'flat': {}  });
                  //letter_arr.sel = false;
    
          temp_letters[i_array]  = letter_arr;
          i_array++;
        }
         
         if(!fulltext){
          fulltext = '-';
         }

        //$rootScope.letters[section_count]= temp_letters;
        //$rootScope.containers[section_count].letters = temp_letters;
        //console.log( $rootScope.containers[section_count].letters)
        $rootScope.containers[section_count].fulltext = fulltext;



        return temp_letters;
      },


      /**
      * Util transfomring array to string
      * @param {Array} source array
      * @function docfactory#flatten_classes
      * @returns {String} values of array with empty spaces between
      * @link docfactory#flatten_classes
      */

      flatten_classes: function (n) {
      //console.log(n);
      var out = '';
      _.each(n, function(c, i){out +=  n[i]+' ';});
        return out;
      }, 


      /**
      * @description Sub-function to set objects options (doc_options, users_options, etc..)
      * @param {String} object - kind of object to map
      * @param {Array} options - source array
      * @return {{Array}}
      * @function docfactory#apply_object_options
      * @todo ---
      */

      apply_object_options : function(object, options){
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
        return options_array;
      },
     

      /**
      * @description 
      *  
      *
      *  --
      *  @params collection_name (o{})
      *  @return -
      * 
      * @function docfactory#--
      * @link docfactory#--
      * @todo ---
      */

      text_range: function (start, end) {
        return;
      },


      
    /**
    * @description 
    * construct virtual collection  
    *
    *  use case : summarization
    *  @params collection_name (header, name , auto{}, implicit{}, explicit{})
    *  @return text string
    *  A. auto : use h1>h6
    *  B  implicit : subtype using corresponding ranges of text (implicit)
    *  C  explicit : subtype collection . > using markup metavalue (explicit)
    *
    * 
    * @function docfactory#virtualize
    * @link docfactory#virtualize
    * @todo nothing
    */

    virtualize : function(){

            _.each($rootScope.virtuals, function(virtual, vi){

             console.log('> virtualize '+virtual.slug)
             console.log(virtual)
              
              virtual.string = '<h2 class="'+virtual.slug+'summarize_header">'+virtual.header+'</h2>';
             // $rootScope.doc.text_summary +='<h2 class="'+virtual.slug+'summarize_header">'+virtual.header+'</h2>';
              // setup 'at least one'
              var found_element = false;
               //loop
              _.each($rootScope.doc.markups, function(markup){

                if(virtual.implicit && virtual.implicit.bytype && markup.type == virtual.implicit.bytype){
                     found_element = true
                     for (var i=markup.start;i<=markup.end;i++){ 
                        // $scope.text_summary += content[i]; 
                        virtual.string += $rootScope.doc.content[i]; 
                     }
                }

                if(virtual.explicit && virtual.explicit.bysubtype && markup.subtype == virtual.explicit.bysubtype){
                      found_element = true
                      virtual.string += '<p><i class="fa fa-data"></i> '+markup.metadata+'</p>';

                }
                if(virtual.explicit && virtual.explicit.bytype && markup.type == virtual.explicit.bytype){
                      found_element = true
                      virtual.string += '<p><i class="fa fa-data"></i> '+markup.subtype +'->'+markup.metadata+'</p>';

                }

               
                // AUTO
                //// CHECK ORDER !!!!
                if(markup.type == 'markup' && (markup.subtype =='h1' || markup.subtype =='h2' || markup.subtype =='h3' || markup.subtype =='h4' || markup.subtype =='h5') ){
                  //$rootScope.doc.text_summary += '<'+markup.subtype+'>';
                   found_element = true
                  for (var i=markup.start;i<=markup.end;i++){ 
                    if($rootScope.doc.content[i]){
                      //$rootScope.doc.text_summary +=$rootScope.doc.content[i];    
                      virtual.string += $rootScope.doc.content[i]; 
                    }
                  }
                  //$rootScope.doc.text_summary += '</'+markup.subtype +'>'
                }



               // EXPLICIT
                if(markup.subtype == 'summary_block'){
                   found_element = true
                   $rootScope.doc.text_summary += '<p>'+markup.metadata+'</p>';
                   //virtual.string += t.metadata  
                } 
              

                if(markup.subtype == 'summary'){
                   found_element = true
                   for (var i=markup.start;i<=markup.end;i++){ 
                                    if($rootScope.doc.content[i]){
                                      //$rootScope.doc.text_summary +=$rootScope.doc.content[i];    
                                      virtual.string += $rootScope.doc.content[i]; 
                      }
                   }
                               
                } 



               
              });
              if(found_element == true){
                virtual.visible = true
              }
              else{
                 virtual.visible = false
              }

              $rootScope.virtuals[vi] = virtual
          }); // each   virtuals
         console.log($rootScope.virtuals)
     } // virtual function end
// closing factory 
   };
  return self
  }
});