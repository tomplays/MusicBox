

musicBox.factory('renderfactory', function ($rootScope, $http, $routeParams, $locale) {
    return function (inf) {
     var self = {
       init: function () {

       

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

        
        $rootScope.objSchema                  =   self.objSchema(); 
        $rootScope.available_sections_objects =   self.objAvailable(); 
        $rootScope.available_layouts          =   self.posAvailable();
        $rootScope.item_position              = '';


        $rootScope.fragments                 =   self.fragmentsAvailable();
       
        // $rootScope.classesofsections       =   self.classesAvailable();

        // ui set up.
        // this var never change as long a doc is loaded... (no reset at rebuild)

        $rootScope.ui                         = new Object();
        $rootScope.ui.selected_range          = new Object({wait_ev : false, set: false, start:'', end:'', 'textrange':''});
        $rootScope.ui.selected_section_index  = null;
        $rootScope.ui.selected_objects        = [];

        $rootScope.ui.renderAvailable         = self.renderAvailable()

        // used in section editing
        $rootScope.ui.sync_sections           = true;
        
        $rootScope.ui.focus_side              = ''
        
        // ?mode=
        if($routeParams.mode){
          $rootScope.ui.renderAvailable_active =  $routeParams.mode
        }
        else{
          $rootScope.ui.renderAvailable_active =  $rootScope.ui.renderAvailable[0]
        }
      
        $rootScope.ui.secret = false;
        
        // ?secret=
        if($routeParams.secret){
               $rootScope.ui.secret            =  $routeParams.secret
               console.log('using secret')
        }


        // &debug
        if($routeParams.debug){
           $rootScope.ui.debug                 = true;
        }

        $rootScope.ui.lite                      = new Object();
        if($routeParams.lite){
          
           $rootScope.ui.lite.state             = 'lite';
           $rootScope.ui.lite.helpers           = true;


        }
        else{
           $rootScope.ui.lite.state                = 'full';

        }

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

        $rootScope.ui.lastover = {};


        // the object to push init
        $rootScope.push = {};

        // init flash message object
        $rootScope.flash_message = {'text':''};

        console.log('render service on init_first')
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
        definitions.media = new Object({
              'name': 'media',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.media,
              'map_range': true,
              'positions': {
                  "forced": "",
                  "available": ['wide','center','left', 'right', 'under','slidewide', 'global', 'background']},
              'modes': {
                'editor': {                   
                  'enabled': true,
                  'tabs': {
                            'metadata': 'url/src',
                            'type': 'type'

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
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['img', 'soundcloud-track', 'vimeo-video', 'youtube-video', 'open-street-map', 'google-map'],
                                  },
                                    'metadata': {
                                    'display' : true,
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['hyperlink'],
                                    'forced' : 'hyperlink'
                                  },
                                  'file_upload': {
                                    'display' : true,
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['hyperlink'],
                                    'forced' : 'hyperlink'
                                  }

                          },
                              
                  },
                  'read': {
                          'enabled': true,
                          'display' : {
                                
                              
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
          definitions.markup = new Object({
              'name': 'media',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.markup,
              'map_range': true,
              'positions': {
                  "forced": "",
                  "available": ['inline']},
              'modes': {
                'editor': {                   
                  'enabled': true,

                  'tabs': {
                            'metadata': '',
                            'type': 'type'

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
                                      'input' : 'select'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtye',
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
                                    'available' : ['hyperlink'],
                                    'forced' : 'hyperlink'
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
 definitions.comment = new Object({
              'name': 'comment',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.comment,
              'map_range': true,
              'positions': {
                  "forced": "left",
                  "available": ['wide','left', 'right', 'under', 'global']},
              'modes': {
                'editor': {                   
                  'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },
                        'tabs': {
                            'metadata': 'text',
                            'type': 'type'

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
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['hyperlink'],
                                    'forced' : 'hyperlink'
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['hyperlink'],
                                    'forced' : 'hyperlink'
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
 definitions.child =  definitions.comment;
/*
var container_class =  definitions.comment;
container_class.positions.available = new Array('inline')
container_class.modes.editor.fields.metadata.label = 'css class'
//definitions.container_class = container_class;
*/


 definitions.container = new Object({
              'name': 'container',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.comment,
              'map_range': true,
              'positions': {
                  "forced": "inline",
                  "available": ['inline']},
              'modes': {
                'editor': {                   
                       'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },
                        'tabs': {
                            'metadata': '',
                            'type': 'type'

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
                                      'display' : false,
                                      'label':'position',
                                    'input' : 'select'
                                  },
                                  'subtype': {
                                    'display' : true,
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['section'],
                                    'forced' : 'section'
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'value',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['hyperlink'],
                                    'forced' : 'hyperlink'
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

          definitions.data = new Object({
              'name': 'data',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.comment,
              'map_range': true,
              'positions': {
                  "forced": "left",
                  "available": ['under', 'global']},
              'modes': {
                'editor': {                   
                  'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },
                        'tabs': {
                            'metadata': 'value',
                            'type': 'type'

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
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['x', 'y', 'z', 'string','int'],
                                    
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['hyperlink'],
                                    'forced' : 'hyperlink'
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
              'name': 'data',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.hyperlink,
              'map_range': true,
              'positions': {
                  "forced": "left",
                  "available": ['left', 'right', 'global']},
              'modes': {
                'editor': {                   
                  'enabled': true,
                        'display' : {
                            'date': false, 
                            'user': false,
                        },

                        'tabs': {
                            'metadata': 'url',
                            'type': 'type'
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
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['hyperlink', 'anchor'],
                                    'forced' : 'hyperlink'
                                  },
                                  'metadata': {
                                    'display' : true,
                                    'label':'subtye',
                                    'input' : 'select',
                                    'free_input' : false,
                                    'show_editor': 'hidden',
                                    'available' : ['hyperlink'],
                                    'forced' : 'hyperlink'
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

          return definitions;

       },

      objSchema:function (){






















            var obj_base  = new Object({'type':'block', 'only':'metadata'});
            var arr = new Array();
        
            arr.comment = new Object({
              'name': 'comment',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.comment,
              'type':obj_base.type,
              'map_range': true,
              'only':'',
              'metadata': { 
                'editor': {
                   'show' : true,
                    'label':'comment text',
                     'input' : 'textarea'
                  },
                  'render': {
                   'show' : true
                  }
              }, 
              'show_date': true, 
              'show_user': true, 
              'subtype': {
                'free_input' : false,
                'available' : ['comment', 'response']
             },   
              'position_available': ['left', 'right', 'under', 'global'],
            });
            arr.note = new Object({
              'name': 'note',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.note,
              'type':obj_base.type ,
              'map_range': true,
              'only':'',
              'metadata': { 
                'editor': {
                   'show' : true,
                    'label':'note text',
                     'input' : 'textarea'
                  },
                  'render': {
                   'show' : true
                  }
              }, 
              'show_date': true,
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': true, 
              'subtype': {
                'free_input' : false,
                'available' : ['draft','freebase', 'about']
             },   
              'position_available': ['left', 'right', 'under', 'center', 'global'],
            });
             arr.semantic= new Object({
              'name': 'semantic',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.semantic,
              'type':obj_base.type,
              'map_range': true,
              'only':'',
              'metadata': { 
                'editor': {
                   'show' : true,
                    'label':'semantic data',
                     'input' : 'textarea'
                  },
                  'render': {
                   'show' : true
                  }
              }, 
              'show_date': false,
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': false, 
              'subtype': {
                'free_input' : false,
                'available' : ['summary_block', 'summary','translation', 'date', 'hidden', 'place', 'somebody','info', 'copyright', 'mood','fact', 'err']
             },   
              'position_available': ['left', 'right', 'under', 'global'],
            });

            arr.generic = new Object({
              'name': 'generic',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.generic,
              'type':obj_base.type,
              'map_range': true,
              'only':'',
              'metadata': { 
                'editor': {
                   'show' : true,
                    'label':'text',
                     'input' : 'textarea'
                  },
                  'render': {
                   'show' : true
                  }
              }, 
              'show_date': false,
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': false,
              'subtype': {
                'free_input' : true,
                'available' : ['-']
             },   
              'position_available': ['left', 'right', 'under', 'center','global'],
            });


           arr.data = new Object({
              'name': 'data',
              'display_name': 'data',
              'type':obj_base.type,
              'map_range': true,
              'only':'',
              'metadata': { 
                'editor': {
                   'show' : true,
                    'label':'data value',
                     'input' : 'textarea'
                  },
                  'render': {
                   'show' : true
                  }
              }, 
              'show_date': false,
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': false,
              'subtype': {
                'free_input' : true,
                'available' : ['x', 'y', 'z', 'string', 'name', 'else']
             },   
              'position_available': ['left', 'right', 'under', 'center','global'],
            });
            


           arr.container= new Object({
            'name': 'container',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.container,
              'type':obj_base.type ,
              'only':'',
              'metadata': { 
                'editor': {
                   'show' : false,
                    'label':'-',
                     'input' : '-'
                  },
                  'render': {
                   'show' : true
                  }
              }, 
              'show_date': false,
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': false,
              'subtype': {
                'free_input' : false,
                'available' : ['section']
             },   
              'position_available': ['inline'],
            });

            arr.container_class = new Object({
              'name': 'container_class',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.container_class,
              'type':obj_base.type ,
              'only':'',
              'metadata': { 
                'editor': {
                   'show' : true,
                    'label':'css class(es)',
                     'input' : 'input'
                  },
                  'render': {
                   'show' : true
                  }
              }, 
              'show_date': false,
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': false,
              'subtype': {
                'free_input' : false,
                'available' : ['css']
             },   
              'position_available': ['inline'],
            });



            arr.child = new Object({
              'name': 'child',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.child,
              'type':obj_base.type,
              'only':'',
              'metadata': { 
                'editor': {
                   'show' : true,
                    'label':'block text',
                     'input' : 'input'
                  }
                  ,
                  'render': {
                   'show' : false
                  }
              }, 
              'show_date': false,
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': false, 
              'subtype': {
                'free_input' : false,
                'available' : ['doc_content_block','simple_page','share_excerpt']
             },   
              'position_available': ['left', 'right', 'under', 'global'],
            });

            arr.media = new Object({
              'name': 'media',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.media,
              'type':obj_base.type ,
              'only':'',
              'metadata': { 
                'editor': {
                    'show' : true,
                    'label':'media url',
                    'input' : 'input'
                  }
                  ,
                  'render': {
                   'show' :false
                  }
              }, 
              'show_date': false,
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': false, 
              'subtype': {
                'free_input' :false,
                'available' : ['img', 'soundcloud-track', 'vimeo-video', 'youtube-video', 'open-street-map', 'google-map']
             },   
              'position_available': ['wide','center','left', 'right', 'under', 'global', 'background'],
            });

            
            arr.markup = new Object({
              'name': 'markup',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.markup,
              'type':obj_base.type ,
              'map_range': true,
              'only':'',
              'metadata': { 
                'editor': {
                    'show' : false,
                     'label':'link url',
                     'input' : 'input'
                  }
                  ,
                  'render': {
                   'show' : false
                  }
              }, 
              'show_date': false, 
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': false, 

              'subtype': {
                'free_input' : false,
                'available' : ['h1','h2', 'h3', 'h4', 'h5','h6','em', 'strong', 'code', 'quote']
             },   
             'position_available': ['inline'],

            });
            arr.hyperlink = new Object({
              'name': 'hyperlink',
              'display_name': $rootScope.render_config.i18n.CUSTOM.OBJECTS.hyperlink,
              'type':obj_base.type ,
              'map_range': true,
              'only':'',
              'metadata': { 
                'editor': {
                    'show' : true,
                    'label':'link url',
                    'input' : 'input'
                  }
                  ,
                  'render': {
                   'show' : true
                  }
              },
              'show_date': false, 
              'icon': { 
                'before': {
                   'show' : true
                  }
              }, 
              'show_user': false, 

              'subtype': {
                'free_input' : false,
                'show_editor': 'hidden',
                'available' : ['hyperlink'],

             },   
             'position_available': ['left', 'right', 'under', 'global'],

            });



    
            console.log(arr)
            return arr;
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
            arr['markup']                    = [ {  url: 'fragments/markup'} ];
            arr['section']                   = [ {  url: 'fragments/section.jade'} ];
            arr['markup_editor']             = [ {  url: 'fragments/markup_editor.jade'} ];
            arr['section_editor']            = [ {  url: 'fragments/section_editor.jade'} ];
            arr['markup_push']               = [ {  url: 'fragments/markup_push.jade'} ];
            arr['author_card']               = [ {  url: 'fragments/author_card'} ]; 
            arr['branding']                  = [ {  url: 'fragments/branding.jade'} ];
            arr['before_doc']                = [ {  url: 'fragments/before_doc.jade'} ];
            arr['doc_title']                 = [ {  url: 'fragments/doc_title.jade'} ];
            arr['doc_options']               = [ {  url: 'fragments/doc_options.jade'} ];
            arr['comment_form']              = [ {  url: 'fragments/comment_form.jade'} ];
            arr['child_markup']              = [ {  url: 'fragments/child_markup.jade'} ];
            arr['dataset']                   = [ {  url: 'fragments/dataset.jade'} ];
            arr['post_excerpt']              = [ {  url: 'fragments/post_excerpt.jade'} ];
            arr['document_footer']           = [ {  url: 'fragments/document_footer.jade'} ];
            arr['top_menus']                 = [ {  url: 'fragments/top_menus.jade'} ];
            arr['fixed_tools']               = [ {  url: 'fragments/fixed_tools.jade'} ];
            arr['inline_tools']              = [ {  url: 'fragments/inline_tools.jade'} ];
            arr['chapters']                  = [ {  url: 'fragments/chapters.jade'} ];
            arr['document_textarea']         = [ {  url: 'fragments/document_textarea.jade'} ];

            //arr['doc_real']                = [ {  url: 'fragments/doc_real.jade'} ];
            //arr['ad_welcome']              = [ {  url: 'fragments/ad_welcome.jade'} ];


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
