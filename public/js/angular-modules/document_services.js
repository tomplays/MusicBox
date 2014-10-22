// todo doc   


// main "service / angular factory"
// handle POST/GET calls to api (rest) for document, doc_options, markups .. backend methods

// mainly called from contollers (on load, save / edits from UI )
// can emit events

// "MusicBox" algorythm (sorting, distribution, letters system)



musicBox.factory('docfactory', function ($rootScope, $http, $location,$sce, $routeParams, socket, renderfactory, $locale) {
 return function (inf) {
    var self = {

     

      load: function () {
        var docid = 'homepage';
        if($routeParams.docid){
            docid = $routeParams.docid
        }

        
        $http.get(api_url+'/doc/'+docid).success(function(d) {
              // redirects if doc is null
              if(!d.doc && docid !=='homepage'){
               // api routing should already had redirects..
               window.location = root_url+'/doc'; // error page 
               return;
              }
              // enough for load.
              // init-set 
              self.init(d);
         });
        
      },
      


      // set doc object after an api call (first load or any other callback)
      init: function (d) {

             if(d.userin){
                // not an absulte condition, api will always check rights
                $rootScope.userin = d.userin;
                //console.log($rootScope.userin)
              }
              else{
                $rootScope.userin = new Object({'username':''});
              }

              $rootScope.doc = d.doc;
              $rootScope.doc.formated_date=  moment(d.doc.updated).calendar() +', '+moment(d.doc.updated).fromNow(); 
              //$rootScope.doc.formated_date = d.doc.updated
               // console.log($rootScope.doc.user)
             
               self.apply_object_options('document', $rootScope.doc.doc_options)
               self.apply_object_options('author', d.doc.user.user_options)
               
               if(d.doc.room){
                  $rootScope.doc.room__id = d.doc.room._id;
                  // self.apply_object_options('room', d.doc.room.room_options)
               }
               else{
                   $rootScope.doc.room__id = '';
                   $rootScope.doc.room = new Object({'_id':'-'});
               }
               //console.log(d.markups_type)

                $rootScope.doc_owner = d.is_owner;
                console.log('is owner:'+ $rootScope.doc_owner)
                document.title = $rootScope.doc.title
                // $rootScope.available_sections_objects   = d.markups_type[0]
               
                var encoded_url = root_url;
                if($rootScope.doc.slug !=='homepage'){
                    encoded_url += '/doc/'+$rootScope.doc.slug;
                }
                $rootScope.doc.encoded_url = urlencode(encoded_url);
                
                // test
                // $rootScope.selectingd = 'init';        

                self.init_containers()
                return

                // equivalent : 
                //$rootScope.$emit('docEvent', {action: 'doc_ready', type: 'load', collection_type: 'doc', collection:doc});
      },

      /**
      * init containers
      * @function DocumentCtrl#init_containers
      */


      init_containers: function () {

        $rootScope.sectionstocount = 0;
        $rootScope.doc.markups  = _.sortBy($rootScope.doc.markups,function (num) {
          return num.start;
        });
        
       // $rootScope.virtuals= new Array();
       // var virtual_summary = new Object({'slug': 'summary', 'header': 'Text summary', 'auto': {'bytype': 'h1-h6'} , 'implicit': {'bytype': 'summary'} } )
       // $rootScope.virtuals.push(virtual_summary)
        // var virtual_containers = new Object({'slug': 'sections', 'header': 'containers ', 'auto': {'bytype': 'h1-h6'} , 'implicit': {'bytype': 'container'} } )
        // $rootScope.virtuals.push(virtual_containers)

        //self.virtualize()


        //console.log($rootScope)
        //http://localhost:3002/api/v1/doc/bloue0.6898315178696066/markups/push/container/section/0/990/left/hello/visible/1
        
        /**
        * filter container type
        */
        $rootScope.containers = _.filter($rootScope.doc.markups, function(td){ return  td.type == 'container'; });
        
        $rootScope.sectionstocount = _.size($rootScope.containers);
        $rootScope.sections_to_count_notice = ($rootScope.sectionstocount == 0) ? true : false;
        
        // console.log($rootScope.containers)

        $rootScope.objects_sections = [];
        $rootScope.objects_sections['global_all'] = [];
        $rootScope.objects_sections['global_by_type'] = [];
        _.each($rootScope.available_sections_objects, function(o, obj_index){
          $rootScope.objects_sections['global_by_type'][o] =[];
        });
        // emit event

        $rootScope.$emit('docEvent', {action: 'containers_ready' });
      },

      /**
      * @description 
      * Distribute markups in layout position and push classes to letters (loop _b)
      *
      * Push right objects in right sections (distribution in arrays of objects by sections)
      * #### assuming 
      * * Document and its markups are loaded
      * * Sections are init
      *
      * #### loop overview 
      *
      * ##### each(containers,s) 
      *
      * * init globals objects
      * * fill_chars()
      * * init type-position arrays
      *
      * * each(textdatas,td)
      * * if in s.ranges 
      *
      * @return {DocEvent} emit event 'dispatched_objects']
      * @function DocumentCtrl#distribute_markups
      * @link DocumentCtrl#fill_chars
      * @todo -
      */

      distribute_markups : function () {
        //  
        // START Looping each SECTION
        // 
        $rootScope.letters = [];
        var temp_letters = [];
         //var data_serie = new Array()


         $rootScope.max_reached_letter = 0;
        _.each($rootScope.containers, function(container, index){


            container.selecting = -1;
    
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
          
          //console.log(section)
         
          // populate letters as objects.

         // self.fill_chars(container,index);
         $rootScope.containers[index]['letters'] = []
         var  temp_letters  =  self.fill_chars(container,index);
       

          // data_serie.push(container.start)
          //$rootScope.objects_sections[index] = new Array();
          $rootScope.containers[index]['objects'] = [];
          $rootScope.containers[index]['objects_count'] = [];
          $rootScope.containers[index]['objects_count']['by_positions'] = [];
          $rootScope.containers[index]['objects_count']['all'] = [];


          // section can have css classes and inlined styles (background-image)
          $rootScope.containers[index].section_classes = '';
          $rootScope.containers[index].section_styles  = '';


//          $rootScope.containers[index]['classes'] =[];
          //$rootScope.objects_sections[index]['global'] = [];
          _.each($rootScope.available_sections_objects, function(o, obj_index){
            $rootScope.containers[index]['objects'][$rootScope.available_sections_objects[obj_index]] = [];
              // and each subs objects an array of each positions
               $rootScope.containers[index]['objects_count']['all']= new Object({'count':0, 'has_object':false})


              _.each(render.posAvailable() , function(op){ // op: left, right, ..
                $rootScope.containers[index]['objects_count']['by_positions'][op.name] = new Object({'count':0, 'has_object':false})
                $rootScope.containers[index]['objects'][$rootScope.available_sections_objects[obj_index]][op.name] =[];
              });
          });

          //
          // START Looping each TEXTDATAS
          //
          _.each($rootScope.doc.markups, function(markup){
            markup.offset_start = 0;
            markup.offset_end = 0;
            //markup.sectionin = false;
            markup.isolated = true;

            var i_array = 0;  
              //Only if textdata is in sections ranges
            if(markup.start >= container.start && markup.end <= container.end){

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

              // user by_me test
              markup.by_me = 'false'
              if( markup.user_id._id && $rootScope.userin._id  && ($rootScope.userin._id == markup.user_id._id ) )  {
                   markup.by_me = 'true';
              }

               markup.user_options =  self.apply_object_options('markup_user_options',markup.user_id.user_options)

              _.each($rootScope.ui.selected_objects, function(obj){
                //console.log('keep opn'+obj._id)
                if(markup._id == obj._id){
                 // markup.selected = true;
                  // should select ranges too..
                }
              })
               _.each($rootScope.ui.editing_objects, function(obj){
                //console.log('keep opn'+obj._id)
                if(markup._id == obj._id){
                  markup.editing = true;
                }
              })
        

              if(markup.type=='container_class' ){ // or pos == inlined
                //console.log(markup)
                //$rootScope.containers[index]['classes'].push(markup.metadata)
                   $rootScope.containers[index].section_classes += markup.metadata+' ';

              }

              if(markup.type == 'media' || markup.type == 'child'){
                     $rootScope.containers[index].section_classes += 'has_image ';
                     if(markup.position){
                        $rootScope.containers[index].section_classes += ' focus_side_'+markup.position +' ';
                     }

                     if(markup.position == 'background'){
                        $rootScope.containers[index].section_styles = 'background-image:url('+markup.metadata+')' ;
                     }

              }

              // special cases for chil documents (refs as doc_id in markup record)
              markup.doc_id_id = '';
              if(markup.type =='child'){ 
                // to keep doc_id._id (just id as string) in model and not pass to post object later..
                if(markup.doc_id){ 
                   markup.doc_id_id = markup.doc_id._id;
                    // markup.doc_id_id.uuser = markup.doc_id.user;
                    // console.log( markup.doc_id)

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
          
              if(markup.type=='markup' || markup.type == 'hyperlink'  || markup.type=='comment' || markup.type=='note' || markup.type=='semantic'  ){ // or pos == inlined

                  var j_arr=0;
                  var into_for = 0;
                  //console.log('section end:'+section.end)
                  //console.log('fc:'+ parseInt(section.end) - parseInt(section.start) );
                  var size_object = parseInt(markup.end) - parseInt(markup.start) -1;
                  markup.explicit_string  =   '';
                  for (var pos= markup.start; pos<=markup.end; pos++){ 
                    
                    // push class to each letter..
                    var delta = parseInt(markup.start) - parseInt(container.start) + j_arr;
                    
                    if($rootScope.doc.content[delta]){
                        markup.explicit_string += $rootScope.doc.content[delta];
                    }
                    // only to markup with type markup
                    if( markup.subtype=='h1' ||  markup.subtype=='h2' ||  markup.subtype=='h3' || markup.subtype=='h4' || markup.subtype=='h5' || markup.subtype=='h6' || markup.subtype=='list-item')  {

                          if(pos == markup.start ){
                             temp_letters[delta]['classes'].push('fi')
                            
                          }
                          if( size_object ==  j_arr){
                            temp_letters[delta+1]['classes'].push('nd')

                          }
                          if(j_arr == 0){
                            //$rootScope.letters[index][delta]['classes'].push('nd')
                          }
                          //as object ?  
                          //$rootScope.letters[index][delta].fi_nd.fi = true; 
                    }

                    
           

                    //$rootScope.letters[index][delta]['classes'] = _.without($rootScope.letters[index][delta]['classes'],'selected')
                    //$rootScope.letters[index][delta]['classes'] = _.without($rootScope.letters[index][delta]['classes'],'editing')

                    if(markup.editing === true ){
                     // $rootScope.letters[index][delta]['classes'].push('editing')
                      temp_letters[delta]['classes'].push('editing')

                      /* L+ */
                    }
                    if(markup.selected === true){
                     // temp_letters[delta]['classes'].push('selected')
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



                      if( markup.type=='semantic'){
                          temp_letters[delta]['classes'].push(markup.type);
                        
                      }
                      //$rootScope.letters[section_count][delta]['objects'].push(a);
                          //      $rootScope.letters[section_count][delta]['classes'].push('c-'+a.id);

                    //}
                    if(markup.type == 'hyperlink' && markup.metadata){
                      temp_letters[delta]['href'] = markup.metadata
                    }
                    i_array++;
                    j_arr++
                  }
                  //$rootScope.containers[index].objects[markup.type]['inline'].push(markup); 
                  //console.log($rootScope.objects_sections[index][td.type])
            }

           if(markup.type !== "" && markup.position){

                 if(markup.position == 'global'){
                      $rootScope.objects_sections['global_all'].push(markup)
                      $rootScope.objects_sections['global_by_type'][markup.type].push(markup)

                 }
                 else{

                    $rootScope.containers[index].objects[markup.type][markup.position].push(markup) 

                 }

                $rootScope.containers[index].objects_count['by_positions'][markup.position].count++;
                $rootScope.containers[index].objects_count['by_positions'][markup.position].has_object  = true;
            
                $rootScope.containers[index].objects_count['all'].count++;
                $rootScope.containers[index].objects_count['all'].has_object  = true;

            }
              //console.log($rootScope.containers[index]['objects'][markup.type][markup.position])
              //console.log('pushed'+markup.position)
            }
          })
          //$rootScope.containers[index].objects = $rootScope.objects_sections[index]    
         // $rootScope.containers[index].letters = $rootScope.letters[index]
        

         // set letters to their the container

          _.each(temp_letters, function(lc, w){
              _.each(lc.classes, function(c, i){ 
                temp_letters[w]['classes_flat'] +=  c +' ';
              });
          })

        
         $rootScope.containers[index].letters = temp_letters;
        



        //console.log($rootScope.containers[index])

         //  console.log($rootScope.containers[index])
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
            if(markup.isolated == true && markup.type !=="container"){
                console.log('isolate markup: '+markup.start+' - '+markup.type)
               // console.log(markup)
                $rootScope.ui.isolated_markups.push(markup)
            }

          })



  
        // console.log($rootScope.letters)
        $rootScope.$emit('docEvent', {action: 'dispatched_objects' });
       // console.log( $rootScope.objects_sections['global_by_type'])

        //console.log($rootScope.containers)

      },


      /**
      * fill arrays of letters for each section  {@link DocumentCtrl#distribute_markups} 
      * @param {Object} section - section object
      * @param {Start-range} section.start  -    section start
      * @param {End-range} section.end    -  section end
      * @param {Number} [section_count] - section index value 
      * @function DocumentCtrl#fill_chars
      * @return {Object} letters of a section
      * @link DocumentCtrl#distribute_markups 
      * @todo remove section count param
      */
  // util flatten array to string
    
     flatten_classes: function (n) {
    //console.log(n);
    var out = '';
      _.each(n, function(c, i){out +=  n[i]+' ';});
    return out;
}, 
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
          var letter_arr = new Object();
          var ch = '';
          ch = content_string[i];
          
          if (ch === " ") {
                ch = ' ';

            }
            if (!content_string[i]) {
              // maybe better to unset ? 
                ch = ' ';
            }
          fulltext += ch;
          letter_arr['char'] = ch;

          //letter_arr['fi_nd'] = new Object({'fi': false, 'nd':false/*, 'md':false*/});
          letter_arr.fi_nd = new Object({'fi': false, 'nd':false/*, 'md':false*/});
          letter_arr.classes = new Array('');
          letter_arr.classes_flat = '';

          /** 
          * @something here
          * @link DocumentCtrl#fill_chars
          */

          letter_arr.order = i;
          letter_arr.action = '';
          letter_arr.rindex = i_array;
          letter_arr.lindex= i;
          
          //unsued a heavy  letter_arr.objects = [];
          letter_arr.href= '';
          letter_arr.sectionin = section_count;
          letter_arr.mode= 'display';


          letter_arr.state = new Object({ 'statemode' : 'loading','select' : false,'clicked' : false,'inrange' : false , 'flat': {}  });
          letter_arr.sel = false;
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
      * sub loop _d (not really musicbox, rather objects options (doc_options, users_options, etc..))
      */

      apply_object_options : function(object, options){
        //console.log(' apply doc_options to object'+object)
        var options_array = [];
        _.each(options , function(option){
           // console.log(option)
            var op_name = option.option_name;
            var op_value = option.option_value;
            var op_type = option.option_type;

            options_array[op_name]= [];
            options_array[op_name]['value'] = op_value;

            if(op_type == 'google_typo' && object == 'document'){
               WebFont.load({
                  google: {
                   families: [op_value]
                  }
              }); 
               var fixed = options_array[op_name]['value'];
               options_array[op_name]['fixed'] =  fixed.replace(/ /g, '_').replace(/,/g, '').replace(/:/g, '').replace(/400/g, '').replace(/700/g, '') 
            }
        });



        if(object == 'document')  {
          $rootScope.doc_options = [];
          $rootScope.doc_options = options_array
           //console.log($rootScope.doc_options)
         }
         else if(object == 'author')  {
          $rootScope.author_options = [];
          $rootScope.author_options = options_array
          //console.log($rootScope.author_options)
         }
         else if(object == 'room')  {
          $rootScope.room_options = [];
          $rootScope.room_options = options_array
          //console.log($rootScope.room_options)
         }
         else if(object =='markup_user_options'){
            //  console.log(options_array)
              return options_array;

         }

         else{
          console.log('undef object')
         }
  

      },

      text_range: function (start, end) {
       


      },
      init_new: function () {
        $rootScope.i18n                    =   $locale;         
        $rootScope.newdoc                  =   new Object();
        $rootScope.newdoc.raw_content      =   $rootScope.i18n.CUSTOM.DOCUMENT.default_content
        $rootScope.newdoc.raw_title        =   $rootScope.i18n.CUSTOM.DOCUMENT.default_title
        $rootScope.newdoc.created_link     =   '';
      },

      newdoc: function(){
          ///api/v1/doc/create
          var data = new Object();
         
          data =  $rootScope.newdoc;
    
          $http.post(api_url+'/doc/create', serialize(data) ).
          success(function(doc) {
              // hard redirect
              console.log(doc)
              //console.log(doc)
              $rootScope.newdoc.created_link = doc.slug;
              $rootScope.newdoc.created_link_title = doc.title;
           });  
      },

      docsync: function(){
        ///api/v1/doc/create
        var data = new Object();
         
        //console.log($rootScope.ui.selected_range.markups_to_offset)
        data.doc_content = $rootScope.doc.content;
        data.markups = []
        // prepare / clean 
        _.each($rootScope.ui.selected_range.markups_to_offset, function(mk){
                var a_mk = new Object({'id':mk._id, 'offset_start':mk.offset_start, 'offset_end':mk.offset_end})
                data.markups.push(a_mk)
        });
        //console.log(serialize(data))
        $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/sync', serialize(data) ).
           success(function(doc) {
              // reinit array of offsets markups ! 
              $rootScope.ui.selected_range.markups_to_offset = []
              
              console.log(doc)
              // re-set doc "softest" way (#no date bug)
              $rootScope.doc.content = doc.content;
              $rootScope.doc.markups = doc.markups;
              $rootScope.$emit('docEvent', {action: 'doc_ready', type: '-', collection_type: 'doc', collection:doc });
        });  
      },

      save_doc: function (field) {
          var data = new Object()
          data.field = field;     
          if(field == 'room_id'){
          data.value =  $rootScope.doc.room__id;
              //alert(data.value) 
          }
          else if(field== 'user_id'){
            //alert('d')
            data.value =  $rootScope.doc.user._id;
          }
          else{
            data.value =  $rootScope.doc[field]
          }
          
          $http.post(api_url+'/doc/'+$rootScope.doc._id+'/edit', serialize(data) ).
            success(function(doc) {
              
              // was  // re-set.
              if(field == 'room_id'){
                   $rootScope.doc.room     = doc.doc.room;
                   $rootScope.doc.room__id = doc.doc.room;            
              }
              console.log(doc)
              // hard redirect
              if(field == 'title'){
                window.location = root_url+'/doc/'+doc.doc.slug;
              }
              else if(field == 'content'){
                $rootScope.$emit('docEvent', {action: 'doc_ready', type: '-', collection_type: 'doc', collection:doc });
              }
              else{
                  console.log('emit?')
              }
              self.init(doc)
             });  
        },
        save_doc_option: function (field) {
          var data = new Object()
          data.field = field;
          //data.value =  $rootScope.doc[field]
          data.value = $rootScope.doc_options[field].value;
          $rootScope.doc_options[field].value = data.value
          $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/edit_option', serialize(data) ).
          success(function(doc) {
            // # todo reset doc event/ cb
                     // hard redirect
                     console.log(doc)
                     self.init(doc)
           
           });  
        },

        // # CRUD 
       delete_doc_option: function (field) {
        var data = new Object()
         data.option_name = field;
         $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/delete_option', serialize(data) ).
                success(function(doc) {
                  alert(doc)
         });
       },

       // # CRUD 
      create_doc_option: function () {
         // calling service
         $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/create_option' ).
                success(function(doc) {
                //alert(doc)
         }); 
      },

      // # CRUD 
      push_markup : function (markup){
          console.log($rootScope.userin)
          // todo : post api
          var data = new Object(markup);
          data.username = $rootScope.userin.username;
          data.user_id = $rootScope.userin._id;

         // APi call
          $http.post(api_url+'/doc/'+ $rootScope.doc.slug+'/markup/push', serialize(data) ).success(function(d) {
               console.log(d)
               
                doc.init(d);

              //$rootScope.$emit('docEvent', {action: 'doc_ready', type: 'push', collection_type: 'markup', collection:d.inserted[0] });
           });
     },
     offset_markups : function (){
          $http.get(api_url+'/doc/'+$rootScope.doc.slug+'/markups/offset/left/0/1/1').success(function(d) {
            console.log(d)
            doc.init(d);
            $rootScope.$emit('docEvent', {action: 'doc_ready', type: 'offset', collection_type: 'markup', collection:d.markups });
          })
      },
      offset_markup: function (markup,start_qty, end_qty){

          var data = {}
          data.markup_id  = markup._id;
          data.start_qty  = start_qty
          data.end_qty    = end_qty
        

          $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/markup/'+markup._id+'/offset', serialize(data) ).success(function(m) {
            console.log(m)
            $rootScope.doc = m;
            $rootScope.$emit('docEvent', {action: 'doc_ready', type: 'offset', collection_type: 'markup', collection:m.markups });
          })
      },
      markup_save: function (markup){
          //var data = new Object({'start': markup.start})
           console.log(markup)
           var temp = markup;
      
           var save = new Object({
            'metadata':markup.metadata,
            'start':markup.start,
            'end':markup.end,
            'depth':markup.depth,
            'status':markup.status,
            'type':markup.type,
            'subtype':markup.subtype,
            'position':markup.position,
            'doc_id': markup.doc_id_id
          });
/*
           if(markup.type =='container'){
                markup.letters =[];
                markup.objects =[];
                markup.objects_count =[];
           }
           else{
               if(markup.doc_id){
                  temp.child_options = ''
                  temp.doc_id = markup.doc_id._id;
               }
           }
           */
          save.secret = $rootScope.ui.secret;
          console.log(save)
          var data = serialize(save)
          $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/markup/'+markup._id+'/edit', data ).success(function(m) {
            console.log(m)
            if(m.err_code){
              alert(m.message)
            }
            else{
                doc.init(m);
                $rootScope.$emit('docEvent', {action: 'doc_ready', type: 'edit', collection_type: 'markup', collection:m.edited });

            }
          })
      },

      markup_delete: function (markup){
        $http.get(api_url+'/doc/'+$rootScope.doc.slug+'/markup/delete/'+markup._id).success(function(d) {
        console.log(d)
        doc.init(d)
        //$scope.$emit('docEvent', {action: 'doc_ready', type: 'delete', collection_type: 'markup', collection:m.deleted[0] });
        //$scope.$emit('docEvent', {action: 'doc_ready' });
      });

     },
     virtualize : function(){

            /**
            * construct virtual collection  
            *  use case : summarization
            *  @params collection_name (header, name , auto{}, implicit{}, explicit{})
            *  @return text string
            *  A. auto : use h1>h6
            *  B  implicit : subtype using corresponding ranges of text (implicit)
            *  C  explicit : subtype collection . > using markup metavalue (explicit)

            */ 

            _.each($rootScope.virtuals, function(virtual, vi){
             console.log('> virtualize '+virtual.slug)
              if(!virtual.visible){
                virtual.visible = true
              }
              else{
                 virtual.visible = false
              }
              virtual.string = '<h2 class="'+virtual.slug+'summarize_header">'+virtual.header+'</h2>';
              // setup 'at least one'
              var found_element = false;
               //loop
              _.each($rootScope.doc.markups, function(markup){

                if(virtual.implicit.bytype && markup.type == virtual.implicit.bytype){
                    found_element = true
                     for (var i=markup.start;i<=markup.end;i++){ 
                        // $scope.text_summary += content[i]; 
                        virtual.string += $rootScope.doc.content[i]; 
                     }
                }
                /*
                // AUTO
                //// CHECK ORDER !!!!
                if(t.type == 'markup' && (t.subtype =='h1' || t.subtype =='h2' || t.subtype =='h3' || t.subtype =='h4' || t.subtype =='h5') ){
                  $scope.text_summary += '<'+t.subtype+'>';
                  for (var i=t.start;i<=t.end;i++){ 
                    if(content[i]){
                      $scope.text_summary += content[i];    
                    }
                  }
                  $scope.text_summary += '</'+t.subtype +'>'
                }
                EXPLICIT
                if(t.subtype == 'summary_block'){
                  $scope.text_summary += '<p>'+t.metadata+'</p>';
                } 
                */  

              });
              $rootScope.virtuals[vi] = virtual
          }); // each   virtuals
        console.log($rootScope.virtuals)
     } // virtual function end

// closing factory 
   };
  return self
  }
});








/*


misc/ tests


       var data = {


  labels: ['Week1', 'Week2', 'Week3', 'Week4', 'Week5', 'Week6'],
  series: [
    data_serie
  ]
};

// We are setting a few options for our chart and override the defaults
var options = {
  // Don't draw the line chart points
  showPoint: false,
  // Disable line smoothing
  lineSmooth: false,
  // X-Axis specific configuration
  axisX: {
    // We can disable the grid for this axis
    showGrid: false,
    // and also don't show the label
    showLabel: false
  },
  // Y-Axis specific configuration
  axisY: {
    // Lets offset the chart a bit from the labels
    offset: 40,
    // The label interpolation function enables you to modify the values
    // used for the labels on each axis. Here we are converting the
    // values into million pound.
    labelInterpolationFnc: function(value) {
      return '$' + value + 'm';
    }
  }
};

          Chartist.Line('.ct-chart', data, options);



*/


