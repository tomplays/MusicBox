'use strict';

// thx to btford seed  : https://github.com/btford/angular-socket-io-im/
var musicBox =  angular.module('musicBox.services', []);
/// to load with config.json via index / routes.
//console.log(USE_SOCKET_SERVER)
//var USE_SOCKET_SERVER = true;

musicBox.run(function($rootScope) {

    console.log('cross controllers service listening ..')
    /*
        Receive emitted message and broadcast it.
    */

    
    // $rootScope.$on('summarizeEvent', function(event, args) {
       // $rootScope.$broadcast('summarize', args);
    // });

 
   
});

musicBox.run(function($rootScope, $http, $route) {
 
  $rootScope.$on('$routeChangeSuccess', function (e, cur, prev) {
    if(cur && prev && cur !== prev){
  }
  });



   $rootScope.$on('docEvent', function(event, args) {
        $rootScope.$broadcast('doc', args);
    });
    $rootScope.$on('sectionEvent', function(event, args) {
        $rootScope.$broadcast('section', args);
    });
    $rootScope.$on('letterEvent', function(event, args) {
        $rootScope.$broadcast('letter', args);
    });
    $rootScope.$on('fragmentEvent', function(event, args) {
        $rootScope.$broadcast('fragment', args);
    });
    $rootScope.$on('keyEvent', function(event, args) {
        $rootScope.$broadcast('key', args);
    });   


})



musicBox.factory('docsfactory', function ($rootScope, $http, $location,$routeParams, socket, translations) {
    return function (inf) {
    var self = {
        init: function () {
     

            var translation = translations();

            $rootScope.ilc = new Array()
            $rootScope.p_lang = '';         
            $rootScope.doctoload = new Array();
            //to clean doc / working_doc /etc...
            $rootScope.working_doc = new Array();
            $rootScope.doc = new Array();
            $rootScope.doc_all = new Array();
            $rootScope.sectionstocount = 0;
            $rootScope.sorted_sections = new Array();
            $rootScope.doc_load_status = 'loading';
            $rootScope.dockeys = new Object( {'valid':'false'} , {'needed':'false'} , {'key':''} );
            $rootScope.cur_sel = new Object();
            //  not depending on params
           
            // ?? -rm
            $rootScope.published_date                 =   '';
          
            $rootScope.users_of_doc =  new Array();
            $rootScope.users_of_doc['creator'] =  new Array();
            $rootScope.users_of_doc['editor']  = new Array();

            $rootScope.comment_model = new Array();
            $rootScope.comment_model['comment_name']= "";
            $rootScope.comment_model['comment_mail']= "";
            $rootScope.comment_model['comment_text']= "";

            $rootScope.richtext = false;
            $rootScope.text_summary = '';
            $rootScope.kind = 'rich';
            $rootScope.computechar = false;
            $rootScope.currentletter;
            $rootScope.currentrange = new Array();

            $rootScope.notices = new Array();
            $rootScope.creator = new Array();
            $rootScope.creator.icons= new Array();
            $rootScope.docchilds = new Array();
            $rootScope.textdatas = new Array();
            $rootScope.letters = new Array();
            $rootScope.letters_render = true;
            
              /// ?? 
             $rootScope.current_letters_selected = new Array();
             $rootScope.current_letter  = new Array();
             $rootScope.current_letteraction  = '';
             $rootScope.action_letter = new Array();
             
            $rootScope.sectionsclass  = new Array();
            $rootScope.lettercounter = '';

            $rootScope.cside = 'right'

            $rootScope.ilctext = 'your comment..'
            $rootScope.ilclink = 'http://'
            $rootScope.ilcimgurl = 'http://'

            $rootScope.objects_sections_toggle = new Array();
            $rootScope.objects_sections_toggle['editing_bottom_editor'] = 'false';
            
            $rootScope.ilc['fragment_new_position'] =     $rootScope.available_positions_objects[0];

            //unsued anymore..
             $rootScope.cur_sel = new Array();
             $rootScope.cur_sel['fulltext_n']     =    '';
             $rootScope.cur_sel['section_push_mode'] = 'alert';
             $rootScope.cur_sel['fragment_select_mode'] = 'toggle';

             $rootScope.cur_sel['start'] = '';
             $rootScope.cur_sel['end'] = '';
             $rootScope.cur_sel['status'] = 'active';
             $rootScope.cur_sel['mode'] = '';
             $rootScope.cur_sel['string'] = '';
             $rootScope.cur_sel['section'] = '';
             $rootScope.cur_sel['section_index'] = '';
             $rootScope.cur_sel['editorsmodes'] = 'reading';

             $rootScope.cur_sel['html_editor'] = new Array();
             $rootScope.cur_sel['html_editor']['link_field'] = false;
             $rootScope.cur_sel['html_editor']['img_field'] = false;

             $rootScope.sizefulltext = new Array()
             $rootScope.fts = 0;
             $rootScope.offset_count = 0;

             $rootScope.rangemarkup = new Array();
             // $rootScope.cur_range_markup['start'] = -1;
             // $rootScope.cur_range_markup['end'] = -1;
             $rootScope.addsomething = 'comment';


            // vars to clean.
            $rootScope.current_letters_selected = new Array();
            $rootScope.current_letter  = new Array();
            $rootScope.current_letteraction  = '';
            $rootScope.cranges= new Array();
            $rootScope.cranges.start= 0;
            $rootScope.cranges.end = 1;
            $rootScope.cranges.side = 'right';
            // debug/tests vars.
            $rootScope.dialogIsHidden = 0;
            $rootScope.allselected = 'false';
            $rootScope.updated = 0;
            $rootScope.toggles = new Array();
            $rootScope.toggles['doc_logs'] = false;
            $rootScope.toggles['extended_date'] = false;
            $rootScope.toggles['editor_left'] = new Array();
            $rootScope.section_toggle_index = new Array();
            $rootScope.editors_modes = 'sss';

          return $rootScope;
        },
        init_first : function () {


            // will not change in navigation 
            // basic arrays
            var translation = translations();
            $rootScope.render_available                  =   translation.renderAvailable();
            $rootScope.available_sections_objects        =   translation.objAvailable(); 
            $rootScope.fragment_types                    =   translation.fragmentTypes();
            $rootScope.fragment_sub_types                =   translation.fragmentSubTypes();
            $rootScope.available_positions_objects       =   translation.posAvailable();
            $rootScope.available_positions_objects_flat  =   translation.posAvailableFlat();
            $rootScope.inline_markup_available           =   translation.InlineMarkupAvailable();


            $rootScope.fragments                         =   translation.fragmentsAvailable();
            $rootScope.classesofsections                 =   translation.classesAvailable();

            $rootScope.msgflash = new Array();
            $rootScope.msgflashqueue = new Array();
            $rootScope.msglog = new Array();

            $rootScope.last_push = new Array();

            // loaded docs stack
            $rootScope.docstoload = new Array();
            $rootScope.doctoload_index = 0;

            // api/misc
            $rootScope.globals = GLOBALS;
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

            // http://docs.angularjs.org/api/ng/service/$http#put
            //   $http.defaults.headers.put["Content-Type"] = "";
        },
        listen_routes: function () {
          //console.log($location.$$search);
          //console.log($routeParams)
          var translation = translations();
          $rootScope.p_lang = 'en'
          if($routeParams.doc_id && !$rootScope.doctoload.id){
            $rootScope.doctoload = $routeParams.doc_id
          }
          else{
               $rootScope.doctoload = 'homepage'
          }
          $rootScope.fresh_doc = $location.$$search.isfresh;
          // if key param in url, test key.
          if($location.$$search.key){
                 $rootScope.dockeys.key     = $location.$$search.key;
                 var preset  = {action: 'testkey', 'dockey': $rootScope.dockeys["key"] , 'docid': $routeParams.doc_id};
                 self.testkey($rootScope.doctoload.id,preset);
          }
          if($location.$$search.summarize){
            $rootScope.ilc['summarize_toggle'] = 'true';
          }
          else{ 
           $rootScope.ilc['summarize_toggle'] = 'false' 
          }
          var rl = $routeParams.render_layout;
          _.each($rootScope.render_available, function(ra, rai){
              if(ra == rl ){
                 $rootScope.current_renders_index = rai;
                 $rootScope.render_layout = ra;
                  $rootScope.render_layout_next = $rootScope.render_available[rai+1];
              }
          });
          //console.log($rootScope.current_renders_index );
          if($rootScope.render_layout == 'lire' || $location.$$search.lang =='fr'){
            $rootScope.p_lang =  'fr'; 
            moment.lang('fr');
          }
          else if($rootScope.render_layout == 'lesen' || $location.$$search.lang =='de'){
            // if todo ... :-) $rootScope.p_lang =  'de'; 
            $rootScope.p_lang= 'en'; 
          }
          else if($location.$$search.lang =='en'){
            // if todo ... :-) $rootScope.p_lang =  'de'; 
            $rootScope.p_lang= 'en'; 
          }
          // depending on params
          $rootScope.ilc                =   translation.loadlangs($rootScope.p_lang); //Intelligent Langs Control
          $rootScope.def                =   translation.def($rootScope.p_lang); // but lang is opt (english fallback)
          console.log($rootScope.p_lang)
        },
        listen: function (docId) {

         
              console.log('Now listenning.. #'+docId)
          

               /* KEY LISTENER*/
              $rootScope.$on('key', function(event, args) {
                  if(args.action && args.action == 'testkey'){
                    return self.testkey(docId,args);
                  }
              }); 
              
               /* SECTION LISTENER*/
              $rootScope.$on('section', function(event, args) {
                if(args.action &&  args.action == 'ranges_update'){
                  console.log(args.index + 'ranges_update')
                  return self.save_td(args.section);
                }
                if(args.action &&  args.action == 'delete_section'){
                  console.log('remove_section_#'+args.index)
                  return self.delete_td(docId,args);
                }
               if(args.action && args.action == 'fulltext_update'){
                   console.log('noting in service/section event')
                   return;
                }
                if(args.action && (args.action == 'create_section'  || args.action == 'add_section' ) ){
                  
                   return self.create_td(docId,args);
                }
                 if(args.action && (args.action == 'save_section'   ) ){
                  
                    return self.save_td(docId, args);
                }
                if(args.action && (args.action == 'touch_sections') ){                
                    return self.save_massive_td_mixed(docId, args);
                }



              });
              
              /* LETTER LISTENER*/
              $rootScope.$on('letter', function(event, args) {
                      console.log('letter_evt in service');
                      console.log(args);
                      args.field = 'content';
                      args.value = args.content;
                      args.key = $rootScope.dockeys.key;
                      return self.save_doc(docId, args)
              }); 
              
              /* FRAGMENT LISTENER*/
              $rootScope.$on('fragment', function(event, args) {
                //console.log(args)
                // a fragment has moved
                if(args.action && (args.action == 'toggle_position' || args.action == 'save_object' )  ){
                  return self.save_td(docId, args);
                }
                if(args.action && ( args.action == 'save_massive_object_index' )  ){
                  console.log('args massive...');
                  return self.save_massive_td(docId, args);
                }
                if(args.action && ( args.action == 'delete_markup' )  ){
                   console.log(args)
                    return self.delete_td(docId,args);
                }
                if(args.action && ( args.action == 'delete_fragment' )  ){
                  // console.log('___remove_fragment_#'+args.textdata.id+'_factory_')
                   return self.delete_td(docId,args);
                }
                if(args.action && (args.action == 'push_fragment' || args.action == 'create_fragment' )  ){ 
                    console.log(args)
                    return self.create_td(docId, args);
                }
                if(args.action && (args.action == 'save_dm' )  ){
                  return self.save_dm(args);
                }
              });    
           
        },
        load: function (doctoload) {
          var doc;
          if(API_METHOD == 'static'){
            //http://static.xxxxx.xxx/json/docs/1.json
            var promise = $http.get(API_URL+'/apis/doc/'+doctoload+'/static').success(function(doc) {
                return doc;
             });
          }
          else{
            var promise = $http.get(API_URL+'/apis/doc/'+doctoload).success(function(doc) {
                return doc;
             });
          }
          promise.then(function(docdatas){ 
            var doc = docdatas.data;
            if(doc.doc){
              var docId = doc.doc.id;
            

             // console.log('then+d');
              $rootScope.doc = doc
              $rootScope.working_doc = doc;
              $rootScope.rawtext= '-';
                self.listen(docId)
              $rootScope.doc_load_status = 'loaded';
              //$rootScope.doctoload.push($rootScope.doc);
              $rootScope.docstoload.push($rootScope.doc);
              $rootScope.doctoload_index++;
              $rootScope.encoded_doc_url = urlencode(API_URL+'/doc/lire/'+doc.doc.slug);
             // socket.emit('user', { action: 'enter_doc', doc_id: doc.doc.id });
              console.log($rootScope.doctoload_index +' document(s) queued/loaded')
              //console.log($rootScope.docstoload);
               $rootScope.doc = doc.doc;
                $rootScope.doc_all = doc;
                if(doc.doc.richmode ===false){
                  $rootScope.richtext = doc.doc.content;  
                }
                if(doc.doc.renderas == 'media'){
                  $rootScope.sections_to_count++;
                }
                $rootScope.textdatas  = doc.textdatas;
                $rootScope.$emit('docEvent', {action: 'textdatas_ready' });

                _.each(doc.logs, function(log,ilog){
                    doc.logs[ilog].date = moment(doc.logs[ilog].createdAt).calendar()+', '+moment(doc.logs[ilog].createdAt).fromNow();
                });
                $rootScope.logs  = doc.logs;
                // console.log($rootScope.logs)
                $rootScope.docmetas   = doc.docmetas;
                $rootScope.$emit('docEvent', {action: 'docmetas_ready' });
                $rootScope.$emit('docEvent', {action: 'users_ready' });



                //$rootScope.formated_date = format_publish_date(doc.doc.createdAt); 
                $rootScope.formated_date= moment(doc.doc.createdAt).calendar() +', '+moment(doc.doc.createdAt).fromNow(); 
             }
             else{
               $rootScope.doc_load_status = 'not_found';
             }
             // console.log('then');






          });

          return promise;

        },
        create_td : function(docId,args){

            if(docId !== $rootScope.working_doc.doc.id){
            return;
          }
         
          if(args.action == 'add_section'){
            var temp_data = new Array();
            temp_data.start = args.textdata.start;
            temp_data.end = args.textdata.end;
            temp_data.type = args.textdata.type;
            var data =  serialize(temp_data);
          }
          else{
            var data = serialize(args.textdata);
          }
          $http.post(API_URL+'/apis/textdata/'+docId+'/create', data).success(function(textdata) {
            if(args.action == 'push_fragment'){
              var log = {text: '-', object: textdata.type ,  verb: 'created' , subject: 'textdata', author: '-', docid: docId };
              $rootScope.$emit('fragmentEvent', {index : args.index, textdata: textdata, action:'pushed_fragment', refresh : args.refresh});
            }
            else if(args.action == 'add_section'){
              var log = {text: '-', object: textdata.type ,  verb: 'add_section'  , subject: 'textdata', author: '-', docid: docId };
              $rootScope.$emit('sectionEvent', {index : args.index, section : textdata, action:'added_section'});
            }
            else if(args.action == 'create_section'){
              var log = {text: '-', object: textdata.type ,  verb: 'created_section'  , subject: 'textdata', author: '-', docid: docId };
              $rootScope.$emit('sectionEvent', {index : args.index, section : textdata, action:'created_section'});
            }
            self.create_log(docId,log)
            $rootScope.msgflashqueue.push({text:'created'});  
          });   
        },
        delete_td : function(docId,args){
          if(docId !== $rootScope.working_doc.doc.id){
            return;
          }
          var args_action ='';
          
          if(args.action == 'delete_fragment'){
               var args_action  = 'deleted_fragment';
          }
          if(args.action == 'delete_markup'){
               var args_action  = 'deleted_markup';
          }
          if(args.action == 'delete_section'){
               var args_action  = 'deleted_section';
          }

          $http.post(API_URL+'/apis/textdata/'+docId+'/'+args.textdata.id+'/delete').success(function(textdatas) {
            if(args.action == 'delete_section'){
              $rootScope.$emit('sectionEvent', {index: args.index, textdatas: textdatas, action: args_action});
            }
            else{
              $rootScope.$emit('fragmentEvent', {index: args.index, textdatas: textdatas, action: args_action});
            }
            $rootScope.msgflashqueue.push({text:'deleted'});
          });

        },
        save_massive_td: function (docId, args) {
          //console.log(args.textdatas);
          console.log('masive TD:');
          var data_arr = new Array();
          data_arr['list'] = new Array();
          _.each(args.textdatas, function(td,i){
            data_arr['list'][i] = new Array() 
            data_arr['list'][i].id = td.id
            data_arr['list'][i].start = td.start
            data_arr['list'][i].end = td.end
          });
          var  data = serialize(data_arr);
          $http.post(API_URL+'/apis/textdata/massive/update',data).
            success(function(textdata) {
              $rootScope.$emit('fragmentEvent', { action:'saved_massive_object_index' });
              $rootScope.msgflashqueue.push({text:'saved'});
          });  
          //var log = {text: '-', object: textdata.type ,  verb: args_action  , subject: 'textdata', author: '-', docid: docId };
          //self.create_log(docId,log)
          //  $rootScope.$emit('fragmentEvent', { action:'saved_massive_object_index' });
        },

        save_massive_td_mixed: function (docId, args) {
          console.log('masive TD:');
          var data_arr = new Array();
          data_arr['list'] = new Array();
          data_arr['doc_id'] = docId;

          _.each(args.queue, function(td,i){
            data_arr['list'][i] = new Array() 
            data_arr['list'][i].id = td.id
            data_arr['list'][i].start = td.start
            data_arr['list'][i].end = td.end
          });
          var  data = serialize(data_arr);
          $http.post(API_URL+'/apis/textdata/massive/update',data).
            success(function(textdatas) {
                console.log('textdatas returned');
              $rootScope.$emit('fragmentEvent', {textdatas: textdatas,  action:'touched_sections' });
              $rootScope.msgflashqueue.push({text:'saved'});
          });         
        },
        loadsubdoc: function (td, index){

/*
            $http.get(API_URL+'/apis/doc/'+td.ext_doc).
              success(function(docref) {
                td.ext_doc_array_doc = new Array(docref);
                //dm for image ? refaktor plz _.map
                td.ext_doc_array_dm = new Array();
                _.each(docref.docmetas , function(dm,ii){
                  td.ext_doc_array_dm[dm.meta_key] = dm.meta_value;
                });
                if(td.type=='child_section'){
                  $rootScope.objects_sections[index][td.type][td.position].push(td); 

                  //incase, could be usefull
                  $rootScope.objects_sections[index]['classes'].push('ischild');
                }
                if(td.type=='img' || td.type =='player' ){
                  $rootScope.objects_sections[index][td.type][td.position].push(td); 
                  // pretty push-image FX
                  $rootScope.objects_sections[index]['classes'].push('has_image has_image_'+td.position);
                }
              
            }); 
*/

        },

        save_td: function ( docId, args) {
          console.log('td saving..');
          console.log(args);
          //var data = args;
          var data = serialize(args.textdata);
          $http.post(API_URL+'/apis/textdata/update',data).
            success(function(textdata) {
              console.log('..saved td');  
              console.log(textdata);  
              var args_action ='else'
              if(args.action == 'toggle_position'){
                 var args_action  = 'toggled_position';
                 $rootScope.$emit('fragmentEvent', {index: args.index, textdatas: textdata, action:args_action });
              }
              else if(args.action == 'save_object'){
                 var args_action  = 'saved_object';
                 $rootScope.$emit('fragmentEvent', {index: args.index, textdatas: textdata, action:args_action });

              }
               else if(args.action == 'save_section'){
                 var args_action  = 'saved_section';
                 $rootScope.$emit('sectionEvent', {index: args.index, textdatas: textdata, action:args_action });

              }
              else if(args.action == 'save_object_index'){
                 var args_action  = 'saved_object';
                 $rootScope.$emit('fragmentEvent', {index: args.index, textdatas: textdata, action:args_action });
              }
              else{
                  //alert(args.action)
              }
              var log = {text: '-', object: textdata.type ,  verb: args_action  , subject: 'textdata', author: '-', docid: docId };
              self.create_log(docId,log)
              $rootScope.msgflashqueue.push({text:'saved'});
            return;  
         });  
         return;   
        },
        save_dm: function (args) {
          console.log(args)
          // return(args)
          $http.post(API_URL+'/apis/docmetas/update', serialize(args)).
            success(function(results) {
              console.log(results);
              $rootScope.docmetas[results.docmeta.meta_key] = results.docmeta.meta_value
              $rootScope.$emit('fragmentEvent', { action: 'saved_dm' });
              // $rootScope.msgflashqueue.push({text:'value saved'});
              return results;
          });
        },
        delete_dm: function (args) {
          console.log('deleting Docmeta')
          //console.log(key, docid, docmetaid)
          $http.post(API_URL+'/apis/docmetas/delete', serialize(args)).
            success(function(results) {
               $rootScope.docmetas =results;
               $rootScope.msgflashqueue.push({text:'value deleted'});
               return;

          });
        },
        create_dm : function (args) { 
          $http.post(API_URL+'/apis/docmetas/'+args.doc_id+'/create', serialize(args)).
          success(function(docmeta) {
            console.log(args)
            $rootScope.docmetas.push(docmeta);
            $rootScope.msgflashqueue.push({text:'value created'});
            return;
          });
        },
       
        save_doc: function (docId, args) {
          var args_action = 'undef.';
          // console.log('saving doc #'+docId);
          var data = { 'dockey': args.key, 'field': args.field, 'value': args.value};
          var data = serialize(data)
          $http.post(API_URL+'/apis/doc/'+docId+'/edit', data).
          success(function(doc) {
              if(args.action == 'save_document_field'){
                args_action = 'save_document_field';
              }
              if(args.field == 'content' || args.field == 'save_content'){
                args_action = 'saved_doc_content';
              }
              // console.log('saved (service)');
              // $rootScope.doc.title = artvalue;
              // console.log(doc);
              // $rootScope.msgflashqueue.push({text:'saved'});
              $rootScope.$emit('docEvent', {doc : doc, action: args_action });
              // var log = {text: '-', object: args.field ,  verb: args_action+'-' , subject: 'document', author: '-', docid: docId };
              // self.create_log(docId,log)
           });  
        },
        create_log: function (docId, args){
          var data = {text: args.text, object: args.object,  verb: args.verb, subject: args.subject, author: args.author, docid: docId };
          var data = serialize(data)
          $http.post(API_URL+'/apis/doclogs/create', data).
            success(function(log) {
              if(log){
                log.date = '! '+moment(log.createdAt).calendar()+', '+moment(log.createdAt).fromNow();
                $rootScope.logs.push(log);
                 console.log('created log (service)');
                 // $rootScope.$emit('docEvent', {doc : doc, action: 'created log' });
                return;
              }
          });
        },
        testkey: function (docId, args) {
          $http.post(API_URL+'/apis/testkey/'+docId, serialize(args)).
            success(function(testresult) {
                $rootScope.msgflashqueue.push({text:testresult});
                if(testresult == 'correct key'){
                  $rootScope.dockeys.key     = args.dockey;
                  $rootScope.dockeys.valid   = 'true';
               }
          });
        },
        save: function (docId, field, val) {
            console.log('saving doc #'+docId+' field: '+field+' / value:'+val);
            return 'saving field+'+field;
        }
      };
      return self;
    }
});

musicBox.factory('translations', function ($rootScope, $http, $location) {
    return function (inf) {
     var self = {
      objAvailable:function (){
        var arr = new Array('comment','place','data','version', 'translation','note','summary','summary-block','freebase','player','markup','css_styles','classes','img','child_section');
        return arr 
      },
      fragmentTypes:function (){
        var arr = new Array('note','data','summary','summary-block','img','player','child_section');
        return arr 
      },
      fragmentSubTypes:function (){
        // todo : groups
        var arr = new Array('pick one', 'world','city', 'hyperlocal', 'comment','place','code_block','data','year','unit','x','y','version','sc-track', 'translation','comment','wikipedia','youtube','vimeo','soundcloud','freebase','person-bio','summary','summary-block','img','child_section');
        return arr 
      },
      posAvailable:function (){
        var arr = new Array({name:'left'},{name:'right'},{name:'wide'},{name:'slidewide'},{name:'center'},{name:'center_into_before'},{name:'center_into_after'},{name:'under'}, {name:'inline'}, {name:'inline-implicit'}, {name:'global'});
        return arr;
      },
      posAvailableFlat:function (){
        var arr = new Array('left', 'right', 'wide', 'slidewide', 'center', 'under','global');
        return arr;
      },
      InlineMarkupAvailable:function (){
        var arr = new Array('h1', 'h2');
        return arr;
      },

      renderAvailable:function (){
        var arr = new Array('lire','read','fragments','sections','editor','dataset','logs', 'card', 'media');
        return arr 
      },
      fragmentsAvailable:function (){
        var arr = new Array();
            arr['branding']             = [ {  url: 'fragments/branding.jade'} ];
            arr['share']                = [ {  url: 'fragments/share'} ];
            arr['author_card']          = [ {  url: 'fragments/profile'} ]; 
            arr['comment_global']       = [ {  url: 'fragments/comment_global'} ];
            arr['docnodes']             = [ {  url: 'fragments/nodes'} ];
         
            arr['child_section']        = [ {  url: 'fragments/child_section.jade'} ];
            arr['date']                 = [ {  url: 'fragments/date'} ];
            
            arr['generic']              = [ {  url: 'fragments/generic'} ];
            
            arr['before_doc']           = [ {  url: 'fragments/before_doc'} ];
            arr['page_footer']          = [ {  url: 'fragments/page_footer'} ];
            arr['doc_footer']           = [ {  url: 'fragments/doc_footer'} ];
            arr['titles']               = [ {  url: 'fragments/titles'} ];
            arr['main']                 = [ {  url: 'fragments/main'} ];

            arr['main_d']                 = [ {  url: 'fragments/main_d'} ];
            arr['main_e']                 = [ {  url: 'fragments/main_e'} ];
            arr['main_f']                 = [ {  url: 'fragments/main_f'} ];
            arr['main_g']                 = [ {  url: 'fragments/main_g'} ];

            // generic ! (beacuse of 'tricky' param injection (with Express.routes / as jade/ partial param use..) )
            arr['col_generic_wide']     = [ {  url: 'fragments/column/wide'} ];
            arr['col_generic_center']   = [ {  url: 'fragments/column/center'} ];
            arr['col_generic_right']    = [ {  url: 'fragments/column/right'} ];
            arr['col_generic_left']     = [ {  url: 'fragments/column/left'} ];
            arr['col_generic_under']    = [ {  url: 'fragments/column/under'} ];
            arr['col_generic_global']   = [ {  url: 'fragments/column/global'} ];

            // render modes
            arr['dataset']              = [ {  url: 'fragments/dataset'} ];
            arr['media']                = [ {  url: 'fragments/media'} ];
            arr['card']                 = [ {  url: 'fragments/card'} ];

            // editor
            arr['editleft']             = [{  url: 'editor/edit_side/left'} ];
            arr['editright']             = [{ url: 'editor/edit_side/right'} ];
            arr['section_tool']         = [ {  url: 'editor/section_tool'} ];
            arr['section_tool_lab']     = [ {  url: 'editor/section_tool_lab'} ];
            arr['bottom_editor']        = [ {  url: 'editor/bottom_editor'} ];
            arr['logs']     = [ {  url: 'fragments/logs'} ];
        return arr;
      },
      classesAvailable:function (){
        var arr = [
            //  { id: 1, icon: 'black_ptext' , notice: 'b'},
            //  { id: 2, icon: 'white_ptext', notice: 'w' },
            // { id: 1, icon: 'fx_bolds', notice: 'bolds are reverse', group: 'markup' }, 
            { id: 2, icon: 'black_bg', notice: 'Fond noir / background #000', group: 'bg' }, 
            //  { id: 3, icon: 'silver_bg',  notice: 'Fond silver / background #bdc3c7' , group: 'bg' }, 
            //  { id: 4, icon: 'cloud_bg',  notice: 'Fond cloud / background #ecf0f1' , group: 'bg' }, 
            {id:5, icon :'mapa20_topbtm', notice: 'padding et margin 0 20px', group: 'pd'},
            {id:12, icon :'pa20_topbtm', notice: 'padding 20px haut et bas',group: 'pd'},
            {id:13, icon :'pa40_topbtm', notice: 'padding 40px haut et bas',group: 'pd'},
            {id:12, icon :'pa100_topbtm', notice: 'padding 100px haut et bas',group: 'pd'},
            {id:19, icon :'textright', notice: 'Texte aligné à droite',group: 'pd'},
            { id: 45, icon: 'bigger_fonts',  notice: 'Bigger fonts size' , group: 'fs' }, 
            /*
            {id:14, icon :'rotate_r_45', notice: 'rotate r_45'},
            {id:15, icon :'rotate_l_45', notice: 'rotate l_45'},
            {id:16, icon :'rotate_r_90', notice: 'rotate r_90'},
            {id:17, icon :'rotate_l_90', notice: 'rotate l_90'},
            {id:18, icon :'rotate_180', notice: 'rotate 180'},
            */
            {id:78, icon :'col_splited_2', notice: 'two cols text', group: 'wd'},
            {id:89, icon :'text_wider', notice: 'Texte plus large',group: 'wd'},
            {id:6, icon :'custom_a', notice: 'Custom a'},
            {id:7, icon :'custom_b', notice: 'Custom b'},
            {id:8, icon :'custom_c', notice: 'Custom c'},
            {id:9, icon :'custom_d', notice: 'Custom d'},
            {id:10, icon :'custom_e', notice: 'Custom e'},
            {id:11, icon :'custom_f', notice: 'Custom f'}
          ];
          return arr;
          ///section_text black_bg white_ptext no_bg_repeat big_black_text green_filter has_image has_image_center has_image_right
      },
      loadlangs: function (lang) {
          var langs = new Array();
          // refactor langs
          
           /*
           langs['on-the-right'] = "on-the-right";
           langs['on-the-left'] = "on-the-left";
           langs['on-the-wide'] = "wide";
           langs['on-the-center'] = "centered";
           langs['under'] = "under";
           langs['center_into_before'] = "center_into_before";
           langs['center_into_after'] = "center_into_after";
           langs['nextdoc_notice'] = "next doc";
           langs['prevdoc_notice'] = "previous doc";
           langs['link_title'] = 'Add links'
           langs['link_notice'] = 'link url'
           langs['media_title'] = 'Add images'
           langs['media_notice'] = 'image url'
           langs['note_title'] = 'Add a note'
           langs['note_notice'] = 'Note content'
           langs['range_title'] = 'Sections/Ranges'
           langs['range_notice'] = 'start and end of section'
           langs['range_start'] = 'Start/début'
           langs['range_end'] = 'End/fin';
           langs['summarize'] = 'Résumer'
           */
           langs['fr'] = new Array();
           langs['en'] = new Array();
           langs['en']['doc_loading_notice'] = 'Loading.  .  .';
           langs['fr']['doc_loading_notice'] = 'Chargement en cours.  .  . ';
           langs['en']['doc_notfound_notice']= '404 - Document not found';
           langs['fr']['doc_notfound_notice']= '404 - Document introuvable';
           langs['en']['backhome_notice']= 'Back to /root';
           langs['fr']['backhome_notice']= 'Retour vers /root';
           langs['en']['sections_to_count_notice']= 'no sections found';
           langs['fr']['sections_to_count_notice']= 'pas de section trouvée';
           langs['en']['post_email']= 'Email';
           langs['fr']['post_email']= 'Email';

           langs['en']['start']= 'start';
           langs['fr']['start']= 'début';
           langs['en']['end']= 'end';
           langs['fr']['end']= 'fin';
           langs['en']['select_side']= 'Select side';
           langs['fr']['select_side']= 'Position';
            // gloabls comments 
           langs['en']['post_comment_titlePlural']= 'Comments';
           langs['fr']['post_comment_titlePlural']= 'Commentaires';
           langs['en']['post_comment_title']= 'Add a comment';
           langs['fr']['post_comment_title']= 'Ajouter un commentaire';
           langs['en']['post_comment_by']= 'Name/ Nick';
           langs['fr']['post_comment_by']= 'Nom ou Prenom ou pseudo ';
           langs['en']['add_a']= 'Add a';
           langs['fr']['add_a']= 'Ajouter';
           langs['en']['markup_title']= 'html editor';
           langs['fr']['markup_title']= 'Editeur html';
           langs['en']['markup_notice']= 'Add markup, links and pictures';
           langs['fr']['markup_notice']= 'Ajouter balises, liens et images';
           langs['en']['post_comment_text']= '';
           langs['fr']['post_comment_text']= '';
           langs['en']['post_comment_btn']= 'Comment';
           langs['fr']['post_comment_btn']= 'Commenter';
           langs['en']['just-now'] = 'Just now..';
           langs['fr']['just-now'] = 'A l\'instant..';
           langs['en']['doc_loading'] = 'Loading..';
           langs['fr']['doc_loading'] = 'Chargement..';
           langs['en']['redirecting'] = 'Redirect..';
           langs['fr']['redirecting'] = 'Redirection..';
           langs['en']['published_on'] = 'Published on';
           langs['fr']['published_on'] = 'Publié le';
           langs['en']['cssclasses_title'] = 'Section styles'
            langs['fr']['cssclasses_title'] = 'Styles de la section'
           langs['en']['cssclasses_notice'] = 'Set predefined styles'
           langs['fr']['cssclasses_notice'] = 'Styles prédéfinis'


           langs['en']['raw_editor_title'] = 'Text edit'
           langs['en']['raw_editor_notice'] = '"raw" text'
           langs['fr']['raw_editor_title'] = 'Editeur de contenu'
           langs['fr']['raw_editor_notice'] = 'Texte "brut"'


           langs['summarized_title'] = 'Texte résumé'
           langs['comment_title'] = "Commentaires";
           langs['comment_input'] = 'post your comment';
           langs['comment_state_notice'] = '';
        
           langs['cssclassesextend_title'] = 'Styles extend'
           langs['cssclassesextend_notice'] = 'Custom'
           langs['cssclassesextend_new'] = 'Add new';
            return langs;
        },
        def: function (l) {
          //  var defs = new Array('title','slug','kind',/*'content',*/ 'external','section', 'order', 'status',' ishome','staticload','rev','real_published','secret' );
          var defs = new Array('slug','kind', 'external','section', 'order', 'status',' ishome','staticload','rev','real_published');
          return defs;
        }
      };
      return self;
    }
});

musicBox.factory('userinfo', function ($rootScope, $http, $location) {
  return function (inf) {
    var self = {
         load: function (userId, kind) {
          var user;
          if(API_METHOD == 'static'){
            //http://static.xxxxx.xxx/json/docs/1.json
            var promise = $http.get(API_URL+'/apis/profile/'+userId+'/static').success(function(user) {
                return user;
             });
          }
          else{
            var promise = $http.get(API_URL+'/apis/profile/'+userId+'/static').success(function(user) {
                return user;
             });
          }
          promise.then(function(userdatas){ 
            var user = userdatas.data;

              var user_obj = new Array();
              user_obj['username'] = user.root.username;
              user_obj['color'] = user.root.color;
              user_obj['icons'] = new Array();
              _.each(user.usermetas, function(um){
                if(um.meta_key == 'has_bitwallet' || um.meta_key == 'has_lab' || um.meta_key == 'has_earlyadopter'){
                  var push = new Array(um.meta_key, um.meta_value);
                  user_obj.icons[um.meta_key] = new Array('true');
                  //user_obj.icons.push(push);
                  //console.log(user_obj.icons)
                }
                else{
                  var umv = um.meta_value;
                  var umk = um.meta_key;
                  user_obj[umk] = umv;
                }     
              });
              user_obj.kind= kind;
              $rootScope.users_of_doc.push(user_obj);
          });
          return promise;
         }
      };
      return self;
    }
});
            


// SOCKET part 
musicBox.factory('socket', function ($rootScope) {
  console.log('socket call')
  if(USE_SOCKET_SERVER){
    var socket = io.connect(SOCKET_URL);
    return {

      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };

  }
  else {
    var socket = '';
    return {
      on:  function () {},
      emit:  function () {}

    }
    
  };
});