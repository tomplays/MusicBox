
/*

  "MusicBox algorithm" (sorting, distribution, letters system)
*/


 /**
 * Factory / services for MusicBox Render 
 * 
 * @class MusicBoxLoop
 * @param {Factory} MusicBoxLoop -  
 * @inject $rootScope, $http, $location,$sce, $routeParams, socket, renderfactory, $locale, $timeout, renderfactory
 */

var musicBox = angular.module('musicBox.MusicBoxLoop', ['musicBox.document_controller','ngLocale', 'ngResource', 'ngRoute','musicBox.services', 'musicBox.directives', 'ngSanitize', 'musicBox.DocumentRest', 'musicBox.MusicBoxLoop'])
.factory('MusicBoxLoop', function ($rootScope, $http, $location,$sce, $routeParams, socket, $locale, $timeout) {
 return function (inf) {
    var self = {
     
    
    
     
      init: function (d) {
        
        alert('old')

      //  $rootScope.resort_markups()
        

        /*
        $rootScope.virtuals= new Array();
        var virtual_summary = new Object({'slug': 'summary', 'header': 'Text summary', 'auto': {'bytype': 'h1-h6'} , 'implicit': {'bytype': 'summary'} } )
        var virtual_data_x = new Object({'slug': 'data_x', 'header': 'data serie (x)', 'explicit': {'bysubtype': 'x'} } )
        var virtual_data_y = new Object({'slug': 'data_y', 'header': 'data serie (y)', 'explicit': {'bysubtype': 'y'} } )
        var virtual_data = new Object({'slug': 'data', 'header': 'data serie (any)', 'explicit': {'bytype': 'data'} } )

    
        $rootScope.virtuals.push(virtual_summary)
        $rootScope.virtuals.push(virtual_data_x)
        $rootScope.virtuals.push(virtual_data_y)
        $rootScope.virtuals.push(virtual_data)
        */
      

        // var virtual_containers = new Object({'slug': 'sections', 'header': 'containers ', 'auto': {'bytype': 'h1-h6'} , 'implicit': {'bytype': 'container'} } )
        // $rootScope.virtuals.push(virtual_containers)

        // no need yet but works. 
        // self.virtualize()
  
        
        // filter markups > only if markup.type ==  "container"
        $rootScope.containers = _.filter($rootScope.markups, function(td){ return  td.type == 'container'; });
        
        // warning and check notices
       //  $rootScope.sectionstocount = _.size($rootScope.containers);
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
alert('old')
        //  
        // START Looping each container
        // 

        _.each($rootScope.containers, function(container, index){


        
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

          /**
          * Loop each doc.markups 
          * 
          */

          // populate letters as single objects.
        //  var  temp_letters  =  self.fill_chars(container,index);

        
          var temp_letters = []
       



        // $rootScope.containers[index].letters = temp_letters;

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


                //temp_letters[w].classes_flat = self.flatten_classes(lc.classes)

                
              


                /// compile string only with char
                if(lc.classes_flat == ""){
                   lt_out += lc["char"];
                }
                else{

                    lt_out += '<span class="lt '+temp_letters[w]['classes_flat']+'" >'+lc['char']+'</span>'

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

          // $rootScope.containers[index].fulltext_block = lt_out;
          

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
          
          if(!markup.isolated ==false  ){
            console.log('markup.isolated' )
            markup.isolated = true;
            $rootScope.ui.isolated_markups.push(markup)
          }
        })
      
      },

      


    
      set_container_attribute: function (container, attribute, value, switchothers) {
        if(switchothers === true){
            _.each($rootScope.containers, function(c){
                c[attribute] = !value
            })
        }
        container[attribute] = value    
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

      markup_push : function (markup) {
        _.each($rootScope.containers, function(container, c_index){
            if(markup.start >= container.start && markup.end <= container.end){
              if(markup.type == 'markup'){
                for (var pos= markup.start; pos<=markup.end; pos++){ 
                  container.letters[pos].classes.push(markup.subtype)
                //  container.letters[pos].classes.push('mup')
                }
              }
              console.log(container.objects[markup.type][markup.position])
              //
              //this.prepare_markup(markup)
              //container.objects[markup.type][markup.position].push(markup)
            }
        });
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