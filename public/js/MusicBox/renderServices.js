

musicBox.factory('renderfactory', function ($rootScope, $http, $routeParams, $locale) {
    return function (inf) {
     var self = {
       init: function () {
          console.log('renderService:init')
       

         $rootScope.render_config = new Object()
         $rootScope.render_config.loading = new Object()
         $rootScope.render_config.loading.inited = true;
        
         $rootScope.render_config.i18n =  $locale;

        // inject locale service. defined in public/js/angualr-modules/i18n/angular_lang-lang.js
        

        // DEPREC. use :  $rootScope.render_config.i18n instead
        $rootScope.i18n                       = $locale;
        //console.log($rootScope.i18n.id)
        $rootScope.objSchemas                  =   self.objSchemas(); 

        //$rootScope.$emit('renderEvent', { action:'render_ready' });
        self.config                           = [];
        self.state                            = [];
        //$rootScope.r = 7;
        self.config.hasbranding               = true;
        self.state.logs                       = 'closed';

        // api/misc
        $rootScope.globals                    = GLOBALS;
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        
        $rootScope.available_sections_objects =   self.objAvailable(); 
        $rootScope.available_layouts          =   self.posAvailable();
        $rootScope.item_position              = '';
        $rootScope.fragments                 =   self.fragmentsAvailable();
       
        // $rootScope.classesofsections       =   self.classesAvailable();

        // ui set up.
        // this var never change as long a doc is loaded... (no reset at rebuild)

        $rootScope.ui                         = new Object();
        $rootScope.ui.selected_range          = new Object({'wait_ev' : false, 'set': false, 'start':null, 'end':null, 'textrange':''});
        //$rootScope.ui.selected_range.markups_to_offset = new Array();
        //$rootScope.ui.selected_range.insert = null;
        //$rootScope.ui.offset_queue = new Array()
        $rootScope.ui.selected_range.debug = new Array()

        $rootScope.ui.routing = $routeParams

        $rootScope.ui.selected_section_index  = null;
       

        $rootScope.ui.selected_objects        = [];
        $rootScope.ui.selected_objects_filter = null;

              

        $rootScope.ui.renderAvailable         = self.renderAvailable()

        // used in section editing
        $rootScope.ui.sync_sections           = true;
        
      
        // ?mode=
        $rootScope.ui.renderAvailable_active =  $routeParams.mode ? $routeParams.mode : $rootScope.ui.renderAvailable[0]
        // ?secret=  
        $rootScope.ui.secret  =  $routeParams.secret ? $routeParams.secret : false
        var doc_secret = $rootScope.ui.secret 
        // ? debug
        $rootScope.ui.debug   = $routeParams.debug ? true : null;
       
      

        if($routeParams.docid){
              $rootScope.ui.is_home = 'false'
              $rootScope.ui.is_single = 'true'
        }
        else{
            $rootScope.ui.is_home = 'true'
            $rootScope.ui.is_single = 'false'
        }

        $rootScope.ui.menus = [];
        $rootScope.ui.menus.push_markup = [];
        $rootScope.ui.menus.push_markup.open = -1;
        $rootScope.ui.menus.push_comment = [];
        $rootScope.ui.menus.push_comment.open = -1;
        

        // top page menu tools

       // $rootScope.ui.menus['quick_tools']            = new Object({'open': 'no'});
        $rootScope.ui.menus['quick_tools_help']       = new Object({'open': 'no'});
        $rootScope.ui.menus['quick_tools_published'] = new Object({'open': 'no'});
        $rootScope.ui.menus['quick_tools_document'] = new Object({'open': 'no'});

        $rootScope.inserttext = [];
        $rootScope.inserttext[0] =''

        // $rootScope.ui.lastover = {};


        // the object to push init
        $rootScope.push = {};

        // init flash message object
        $rootScope.flash_message = {'text':''};

        /**
      * @description 
      * Show a message to user
      *
      *  @param {String} msg - message to show
      *  @param {String} classname - a css class ('ok'/ 'bad' / ..)
      *  @param {Number/Time} timeout - 

      *  @return -
      * 
      * @function docfactory#flash_message
      * @link docfactory#flash_message
      * @todo --
      */

        
          //console.log(self)
          return  $rootScope.render_config
        
        },

      // flat list.
      objAvailable:function (){
        var arr = Object.keys($rootScope.objSchemas) 
        return arr ;
      },
      markupSchema:function (){
        // start end metavalue, .......

      },
      objSchemas:function (){
        var definitions = new Array();
       
          definitions.markup = new Object({
              'name': 'markup',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.markup,
              'compute_fulltext': true,
              'map_range': true,
              'positions': {
                  "forced": "",
                  "available": ['inline']},
              'modes': {
                'pusherleft': false,
                 'editor': {                   
                  'enabled': true,
                  'tabs': {
                            'subtype': 'subtype'
                        },
                  'fields' : {
                                  'ranges': { 
                                      'display' : true,
                                      'label':'',
                                      'input' : 'range'
                                  },
                                  'type': { 
                                      'display' : true,
                                      'label':'type',
                                      'input' : 'select'

                                  },
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select',
                                      'forced' : 'inline'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['h1','h2', 'h3', 'h4', 'h5','h6','em', 'strong', 'code', 'quote'],
                                  },
                                    'metadata': {
                                    'display' : true,
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : [''],
                                    'forced' : '-'
                                  }

                          },
                              
                  },
                  'read': {
                          'enabled': true,
                          'display' : {
                              
                                 'metadata': {
                                      'displayed':'subtype'
                                 }

                          },
                        'icon': { 
                            'before': {
                                'show' : true,
                                'class' : 'media'
                              }
                          },           
                  },
            },
          })
 definitions.media = new Object({
              'name': 'media',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.media,
              'map_range': false,
               'compute_fulltext': true,
              'positions': {
                  "forced": "",
                  "available": ['wide','center','left', 'right', 'under','slidewide', 'global', 'background']},
              'modes': {
                'pusherleft': true,
                'editor': {                   
                  'enabled': true,
                  'tabs': {
                            'metadata': 'url',
                            'type': 'type',
                             'subtype': 'subtype',
                              'position': 'position'

                        },
                              'fields' : {
                                  'ranges': { 
                                      'display' : true,
                                      'label':'link url',
                                      'input' : 'range'
                                  },
                                  'type': { 
                                      'display' : true,
                                      'label':'type',
                                      'input' : 'select'
                                  },
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['img', 'soundcloud-track', 'vimeo-video', 'youtube-video', 'open-street-map', 'google-map'],
                                  },
                                    'metadata': {
                                    'display' : true,
                                    'label':'url',
                                    'input' : 'text',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                              
                        
                                  },
                                  'file_upload': {
                                    'display' : true,
                                    'label':'send',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                               
                                  }

                          },
                              
                  },
                  'read': {
                          'enabled': true,
                           'display' : {
                                 'date': false, 
                                 'user': false,
                                 'metadata': {
                                      'displayed':''
                                 }

                          },
                        'icon': { 
                            'before': {
                                'show' : true,
                                'class' : 'media'
                              }
                          },           
                  },
            },
          })
          definitions.comment = new Object({
              'name': 'comment',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.comment,
              'map_range': true,
               'compute_fulltext': false,
              'positions': {
                  "forced": "left",
                  "available": ['wide','left', 'right', 'under', 'global']},
              'modes': {
                 'pusherleft': true,
                 'pusherleftopen': true,
                 'editor': { 
                 
                  'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },
                        'tabs': {
                            'metadata': 'text',
                            'type': 'type',
                            'subtype': 'subtype',
                              'position': 'position'
                        },

                          'fields' : {
                                  'ranges': { 
                                      'display' : true,
                                      'label':'link url',
                                    'input' : 'range'
                                  },
                                  'type': { 
                                      'display' : true,
                                      'label':'type',
                                    'input' : 'select'
                                  },
                                
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['comment'],
                                    'forced' : 'comment'
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'comment text',
                                    'input' : 'textarea',
                                    'free_input' : false,
                                    'show_editor': 'hidden'
                                  
                                  
                                  }

                          },
                              
                  },
                  'read': {
                          'enabled': true,
                          'display' : {
                                 'date': true, 
                                 'user': true,
                                 'metadata': {
                                      'displayed':'metadata'
                                 }

                          },
                        'icon': { 
                            'before': {
                                'show' : true,
                                'class' : 'comment'
                              }
                          },           
                  },
            },
          })

          definitions.child = new Object({
              'name': 'child',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.comment,
                             'compute_fulltext': false,

              'map_range': false,
              'positions': {
                  "forced": "left",
                  "available": ['wide','left', 'right', 'under', 'global']},
              'modes': {
                'pusherleft': true,
                'editor': {                   
                  'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },
                        'tabs': {
                            'metadata': 'text',
                            'type': 'type',
                            'subtype': 'subtype',
                            'position': 'position'
                        },

                          'fields' : {
                                  'ranges': { 
                                      'display' : true,
                                      'label':'link url',
                                    'input' : 'range'
                                  },
                                  'type': { 
                                      'display' : true,
                                      'label':'type',
                                    'input' : 'select'
                                  },
                                
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['simple_page'],
                                    'forced' : 'simple_page'
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'comment text',
                                    'input' : 'textarea',
                                    'free_input' : false,
                                    'show_editor': 'hidden'
                                  
                                  
                                  }

                          },
                              
                  },
                  'read': {
                          'enabled': true,
                          'display' : {
                                 'date': true, 
                                 'user': true,
                                 'metadata': {
                                      'displayed':'metadata'
                                 }

                          },
                        'icon': { 
                            'before': {
                                'show' : true,
                                'class' : 'comment'
                              }
                          },           
                  },
            },
          })


 definitions.note =  definitions.comment;
 definitions.generic =  definitions.comment;
 definitions.semantic =  definitions.comment;

 definitions.container = new Object({
              'name': 'container',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.container,
              'compute_fulltext': true,
              'map_range': false,
              'positions': {
                  "forced": "inline",
                  "available": ['inline']},
              'modes': {
                'pusherleft': false,
                'editor': {                   
                       'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },
                        'tabs': {
                            //'subtype': 'container subtype'

                        },
                        'fields' : {
                                  'ranges': { 
                                      'display' : true,
                                      'label':'link url',
                                      'input' : 'range'
                                  },
                                  'type': { 
                                      'display' : false,
                                      'forced' : 'container'
                                  },
                                
                                  'position':{ 
                                      'display' : false,
                                      'forced' : 'inline'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['section'],
                                    'forced' : 'section'
                                  },
                                  'metadata': {
                                    'display' : false,
                                    'forced' : ''
                                  }

                          },
                              
                  },
                  'read': {
                          'enabled': true,
                          'display' : {
                                 'date': false, 
                                 'user': false,
                                 'metadata': {
                                      'displayed':'metadata'
                                 }

                          },
                        'icon': { 
                            'before': {
                                'show' : true,
                                'class' : 'comment'
                              }
                          },           
                  },
            },
          })
 definitions.container_class = new Object({
              'name': 'container class',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.container_class,
              'map_range': false,
              'compute_fulltext': false,
              'positions': {
                  "forced": "inline",
                  "available": ['inline']},
              'modes': {
                'pusherleft': false,
                'editor': {                   
                  'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },
                        'tabs': {
                            'metadata': 'Classname',
                           

                        },
                          'fields' : {
                                  'ranges': { 
                                      'display' : true,
                                      'label':'link url',
                                    'input' : 'range'
                                  },
                                  'type': { 
                                      'display' : true,
                                      'label':'type',
                                      'input' : 'select'
                                  },
                                
                                  'position':{ 
                                    'display' : true,
                                    'label':'position',
                                    'input' : 'select',
                                      'forced' : 'inline'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['css'],
                                    'forced' : 'css'
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'Css class',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['bg_black', 'bg_dark', 'two-cols', 'pad-top-bottom', 'text-right', 'gradient-pink'],
                                  
                                  }

                          },
                              
                  },
                  'read': {
                          'enabled': true,
                          'display' : {
                                 'date': true, 
                                 'user': true,
                                 'metadata': {
                                      'displayed':'metadata'
                                 }

                          },
                        'icon': { 
                            'before': {
                                'show' : true,
                                'class' : 'comment'
                              }
                          },           
                  },
            },
          })
          definitions.datavalue = new Object({
              'name': 'datavalue',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.datavalue,
              'map_range': true,
              'compute_fulltext': true,
              'positions': {
                  "forced": "left",
                  "available": ['under', 'global']},
              'modes': {
                'pusherleft': true,
                'editor': {                   
                  'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },
                        'tabs': {
                            'metadata': 'value',
                            'type': 'type',
                            'subtype': 'subtype',
                            'position': 'position'


                        },

                          'fields' : {
                                  'ranges': { 
                                      'display' : true,
                                      'label':'link url',
                                      'input' : 'range'
                                  },
                                  'type': { 
                                      'display' : true,
                                      'label':'type',
                                     'input' : 'select'
                                  },
                                
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select'
                                  },
                                   'subtype': {
                                    'display' : true,
                                    'label':'kind of data',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': true,
                                    'available' : ['x', 'y', 'z','string'],
                                    'forced' : false
                                  },
                                 
                                   
                            
                                  'metadata': {
                                    'display' : true,
                                    'label':$rootScope.render_config.i18n.CUSTOM.OBJECTS.datavalue,
                                    'input' : 'text',
                                    'free_input' : true,
                                    'show_editor': true,
                                   
                                
                                  }

                          },
                              
                  },
                  'read': {
                          'enabled': true,
                          'display' : {
                                 'date': false, 
                                 'user': false,
                                 'metadata': {
                                      'displayed':'metadata'
                                 }

                          },
                        'icon': { 
                            'before': {
                                'show' : true,
                                'class' : 'comment'
                              }
                          },           
                  },
            },
          })
          definitions.hyperlink = new Object({
              'name': 'Link',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.hyperlink,
              'map_range': true,
              'compute_fulltext':true,
              'positions': {
                  "forced": "left",
                  "available": ['left', 'right', 'global']},
              'modes': {
                'pusherleft': true,
                'editor': {                   
                  'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },

                        'tabs': {
                            'metadata': 'url',
                            'type': 'type',
                            'subtype': 'subtype'
                          },

                          'fields' : {
                                  'ranges': { 
                                      'display' : true,
                                      'label':'link url',
                                    'input' : 'range'
                                  },
                                  'type': { 
                                      'display' : true,
                                      'label':'type',
                                      'input' : 'select'
                                  },
                                
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'kind of link',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': true,
                                    'available' : ['hyperlink', 'anchor'],
                                    'forced' : false
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'url',
                                    'input' : 'text',
                                    'free_input' : true,
                                    'show_editor': 'hidden',
                                    'available' : ['hyperlink']
                                  }

                          },
                              
                  },
                  'read': {
                          'enabled': true,
                          'display' : {
                                 'date': false, 
                                 'user': false,
                                 'metadata': {
                                      'displayed':'metadata'
                                 }

                          },
                        'icon': { 
                            'before': {
                                'show' : true,
                                'class' : 'link'
                              }
                          },           
                  },
            },
          })

          return definitions;

       },
      
      posAvailable:function (){



        var arr = new Array(
          {name:'wide', order:0, ID:0, actif:true},
          {name:'slidewide', order:4, ID:1},
          {name:'center', order:2, include_title:true,  ID:2, include_even_empty:true},
          {name:'left', order:7, ID:3, include_even_empty:true},  // "left" layout is after inline (css-technique : margin-left:-50%)
          {name:'inline_into',  order:3, ID:6},
          {name:'inline', order:4, include_objects:false, ID:5, include_even_empty:true}, 
          {name:'inline-implicit', order:6, ID:6},
          //  {name:'inline_into_after', order:6, ID:7},
          {name:'right', order:8, ID:8, include_even_empty:true},
          {name:'under', order:9, ID:9},
          {name:'global', include_objects:false, order:10, ID:10, include_even_empty:true},
          {name:'background', order:11, include_objects:false, ID:11} 

          );

        arr  = _.sortBy(arr,function (num) {
         return num.order;
        });
        return arr;
      },
    
      InlineMarkupAvailable:function (){
        var arr = new Array('h1', 'h2');
        return arr;
      },

      renderAvailable:function (){
        var arr = new Array('read','fragments','doc_options','editor','dataset','logs', 'card', 'media');
        return arr 
      },
      fragmentsAvailable:function (){
            var arr = [];
            arr['author_card']               = [ {  url: 'fragments/author_card'} ]; 
            arr['child_markup']              = [ {  url: 'fragments/child_markup.jade'} ];
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
        def: function (l) {
          //  var defs = new Array('title','slug','kind',/*'content',*/ 'external','section', 'order', 'status',' ishome','staticload','rev','real_published','secret' );
          var defs = new Array('slug','kind', 'external','section', 'order', 'status',' ishome','staticload','rev','real_published');
          return defs;
        }       
      }
         return self;
    }
});
