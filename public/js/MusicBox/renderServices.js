

angular.module('musicBox.render', [])


.factory('renderfactory', function ($rootScope, $http, $routeParams, $locale) {
    return function (inf) {
     var self = {


       init: function (view) {
        
         console.log('renderService:init for _view: '+view)
         $rootScope.is_view = view

         $rootScope.render_config = {
              'i18n' :  $locale,
              'renderAvailable' : self.renderAvailable(),
              'renderAvailable_active' :  $routeParams.mode ? $routeParams.mode : self.renderAvailable()[0]
         }

         $rootScope.render = {
              'debug'     : ($routeParams.debug) ? true : false,
              'dataset'   : {'active': $routeParams.dataset == true  ? true : false},
              'menu_a'    : {'open':true},
              'fresh'     : ($routeParams.fresh) ? true : false,
              'is_home'   : ($routeParams.docid) ? 'false' : 'true',
              'is_single' : ($routeParams.docid) ? 'true' : 'false',
              'top_menus' : {
                              'help'  : {'open': false },
                              'published'  : {'open':  false },
                              'doc'  : {'open':  false }

                          }

           }

        $rootScope.i18n                       = $locale;
        // api/misc
        $rootScope.globals                    = GLOBALS;
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

       // self.renderAvailable()
       // $rootScope.ui.renderAvailable_active =  $routeParams.mode ? $routeParams.mode : $rootScope.ui.renderAvailable[0]

        if(view == 'document'){
          
            $rootScope.objSchemas                 =   self.objSchemas(); 
            $rootScope.available_sections_objects =   self.objAvailable(); 
            $rootScope.available_layouts          =   self.posAvailable();
            $rootScope.fragments                  =   self.fragmentsAvailable();
            $rootScope.css_classesAvailable       =   self.classesAvailable()
        }
        else if(view == 'user'){
        }
        else{
        }
        return  $rootScope.render_config
        },
        toggle_render: function(r){
          console.log('toggled_render from '+$rootScope.render_config.renderAvailable_active+' to '+r)
          $rootScope.render.top_menus.doc.open        =   false
          $rootScope.render.top_menus.help.open       =   false
          $rootScope.render.top_menus.published.open  =   false
          $rootScope.render_config.renderAvailable_active = r
        },

      expand_tools: function(name){
          //   if(!)
          // use DocumentCtrl AND with UserCtrl
          if(!$rootScope.render.top_menus[name] || $rootScope.render.top_menus[name].open === false){
               $rootScope.render.top_menus[name].open = true
          }
          else{
           $rootScope.render.top_menus[name].open = false
          }
         //  return $rootScope.render.top_menus

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
                'pusherleft': true,
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
                                      'input' : 'select',
                                       'show_editor': true

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
                                    'show_editor': false,
                                    'available' : ['h1','h2', 'h3', 'h4', 'h5','h6','em', 'strong', 'code', 'quote'],
                                  },
                                    'metadata': {
                                    'display' : true,
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': false,
                                    'available' : [''],
                                    'forced' : ''
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
              'display_name': $rootScope.i18n.CUSTOM.OBJECTS.media,
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
                                      'input' : 'select',
                                       'show_editor': true
                                  },
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select',
                                      'show_editor': true,
                                      'default': 'left'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': true,
                                    'default': 'img',
                                    'available' : ['img', 'soundcloud-track', 'vimeo-video', 'youtube-video', 'open-street-map', 'google-map'],
                                 
                                  },
                                    'metadata': {
                                    'display' : true,
                                    'label':'url or embed object url',
                                    'input' : 'text',
                                    'free_input' : false,
                                    'show_editor': true,
                              
                        
                                  },
                                  'file_upload': {
                                    'display' : true,
                                    'label':'send',
                                    'input' : 'select',
                                    'free_input' : false,
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
              'display_name': $rootScope.i18n.CUSTOM.OBJECTS.comment,
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
                                    'label':'ranges',
                                    'input' : 'range',
                                    'show_editor': true
                                  },
                                  'type': { 
                                    'display' : true,
                                    'label':'type',
                                    'input' : 'select',
                                    'show_editor': true,
                                  },
                                
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select',
                                      'show_editor': true,
                                      'default': 'left'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': false,
                                    'available' : ['comment'],
                                    'forced' : 'comment',
                                     'default': 'comment'
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'comment text',
                                    'input' : 'textarea',
                                    'free_input' : false,
                                    'show_editor': true
                                  
                                  
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
                                    'input' : 'select',
                                      'show_editor': true
                                  },
                                
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select',
                                       'show_editor': true
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': true,
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


 definitions.note =  _.clone(definitions.comment);
 definitions.generic =  _.clone(definitions.comment);
 definitions.semantic =  _.clone(definitions.comment);
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
                                      'label':'container ranges',
                                      'input' : 'range',
                                       'show_editor': false
                                  },
                                  'type': { 
                                      'display' : false,
                                      'show_editor': false,
                                      'forced' : 'container'
                                  },
                                
                                  'position':{ 
                                      'display' : false,
                                      'forced' : 'inline',
                                      'show_editor': false
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtype',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': false,
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
                                      'label':'ranges',
                                      'input' : 'range'
                                  },
                                  'type': { 
                                      'display' : true,
                                      'label':'type',
                                      'input' : 'select',
                                        'show_editor': true
                                  },
                                
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select',
                                      'default' : 'left'
                                  
                                  },
                                   'subtype': {
                                    'display' : true,
                                    'label':'kind of data',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': true,
                                    'available' : ['x', 'y', 'z','string'],
                                    'default' : 'x',
                                    'forced' : 'x',

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
                  "available": ['left', 'right', 'global', 'inline']},
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
                                      'input' : 'select', 
                                      'show_editor': true
                                  },
                                
                                  'position':{ 
                                      'display' : true,
                                      'label':'position',
                                      'input' : 'select',
                                      'default' : 'left'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'kind of link',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': true,
                                    'available' : ['hyperlink', 'anchor'],
                                    'default' : 'hyperlink',
                                    'forced' : false
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'url',
                                    'input' : 'text',
                                    'free_input' : true,
                                    'show_editor': true,
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
          {name:'wide', order:0, ID:0,  include_dataset:true,  include_even_empty:true}, // for dataset
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
        var arr = new Array('read','fragments','doc_options','editor','logs', 'card', 'media');
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
      
            { id: 2, name: 'bg_black', notice: 'Fond noir / background #000', group: 'bg' }, 
            { id: 3, name: 'bg_dark', notice: 'couleurs claires', group: 'bg' }, 
            { id: 4, name: 'text-right', notice: 'Texte aligné à droite', group: 'bg' }, 
            { id: 5, name: 'gradient-pink', notice: 'Fond noir / background #000', group: 'bg' }, 
            { id: 6, name: 'aligned', notice: 'Texte aligné au centre', group: 'bg' }, 
            {id:12, name :'pad-top-bottom', notice: 'padding 20px haut et bas',group: 'pd'},
            { id: 45, name: 'bigger_fonts',  notice: 'Bigger fonts size' , group: 'fs' }, 
            {id:78, name :'two-cols', notice: 'two-cols text', group: 'wd'}
          /*
            {id:89, name :'text_wider', notice: 'Texte plus large',group: 'wd'},
            {id:6, name :'custom_a', notice: 'Custom a'},
            {id:7, name :'custom_b', notice: 'Custom b'},
            {id:8, name :'custom_c', notice: 'Custom c'},
            {id:9, name :'custom_d', notice: 'Custom d'},
            {id:10, name :'custom_e', notice: 'Custom e'},
            {id:11, name :'custom_f', notice: 'Custom f'}
            */
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
