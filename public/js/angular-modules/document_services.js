'use strict';

// 

// this file contains 


// document service

// init
//



// All you need to do is pass your configuration as third parameter to the chart function


musicBox.factory('docfactory', function ($rootScope, $http, $location,$sce, $routeParams, socket, renderfactory) {
   
    return function (inf) {
    var self = {
      init: function () {
          var docid = '';
          if($routeParams.docid){
            docid = $routeParams.docid
          }
          else{
            docid = 'homepage'
          }
          

          if(USERIN){
            //console.log(USERIN)
            $rootScope.userin = USERIN;
          }


          $http.get(api_url+'/doc/'+docid).success(function(d) {
             //console.log(m)
              $rootScope.doc = d.doc;
              /// $rootScope.doc.formated_date= 'last update '+moment(d.doc.updated).calendar() +', '+moment(d.doc.updated).fromNow(); 
              $rootScope.doc.formated_date = d.doc.updated
               // console.log($rootScope.doc.user)
             
               self.apply_object_options('document', $rootScope.doc.doc_options)
               self.apply_object_options('author', d.doc.user.user_options)
               if(d.doc.room){
                               self.apply_object_options('room', d.doc.room.room_options)

               }
               //console.log(d.markups_type)

               if($rootScope.userin._id ==  $rootScope.doc.user._id ){
                console.log('is owner')
               }
               else{
                  console.log('is !owner')

               }

            $rootScope.available_sections_objects  = d.markups_type[0]
            self.init_containers()  
         })
        
        // equivalence
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
        $rootScope.letters = new Array()
         //var data_serie = new Array()

        _.each($rootScope.containers, function(container, index){
          //console.log(section)
          self.fill_chars(container,index);
          // data_serie.push(container.start)
          //$rootScope.objects_sections[index] = new Array();
          $rootScope.containers[index]['objects'] = new Array();
          $rootScope.containers[index]['objects_count'] = new Array();
          $rootScope.containers[index]['objects_count']['by_positions'] = new Array();
           $rootScope.containers[index].section_classes = '';
//          $rootScope.containers[index]['classes'] = new Array();
          //$rootScope.objects_sections[index]['global'] = new Array();
          _.each($rootScope.available_sections_objects, function(o, obj_index){
            $rootScope.containers[index]['objects'][$rootScope.available_sections_objects[obj_index]] = new Array();
              // and each subs objects an array of each positions
              _.each(render.posAvailable() , function(op){ // op: left, right, ..
                $rootScope.containers[index]['objects_count']['by_positions'][op.name] = new Object({'count':0, 'has_object':false})
                $rootScope.containers[index]['objects'][$rootScope.available_sections_objects[obj_index]][op.name] = new Array();
              });
          });

          //
          // START Looping each TEXTDATAS
          //
          _.each($rootScope.doc.markups, function(markup){

            var i_array = 0;  
              //Only if textdata is in sections ranges
            if(markup.start >= container.start && markup.end <= container.end){

              // some commons attributes
              // > todo use states objects
              markup.sectionin = index;
              /// keep open test :
              //console.log('keep open')
              markup.selected = false;
              markup.editing = false;


              _.each($rootScope.ui.selected_objects, function(obj){
                //console.log('keep opn'+obj._id)
                if(markup._id == obj._id){
                  markup.selected = true;
                  // should select ranges too..
                }
              })
              

              
              markup.explicit_string  =   '';
              var i;
              for (i = markup.start; i < markup.end; i++) {
                var j = i - $rootScope.containers[index].start;
                markup.explicit_string += $rootScope.containers[index].fulltext[j];
              }


              if(markup.type=='container_class' ){ // or pos == inlined
                //console.log(markup)
                //$rootScope.containers[index]['classes'].push(markup.metadata)
                   $rootScope.containers[index].section_classes += markup.metadata+' ';
              }

              
              if(markup.type=='markup' ){ // or pos == inlined


                  var j_arr=0;
                  var into_for = 0;
                  //console.log('section end:'+section.end)
                  //console.log('fc:'+ parseInt(section.end) - parseInt(section.start) );
                  var size_object = parseInt(markup.end) - parseInt(markup.start) -1;
                  
                  for (var pos= markup.start; pos<=markup.end; pos++){ 

                    // pushing class to each letter..
                    var delta = parseInt(markup.start) - parseInt(container.start) + j_arr;
                    
                    if( pos == markup.start  && (markup.subtype== 'list-item' || markup.subtype== 'h1'  || markup.subtype== 'h2' || markup.subtype== 'h3'  || markup.subtype== 'h4'  || markup.subtype== 'h5'  || markup.subtype== 'h6' || markup.subtype== 'cite' || markup.subtype== 'code'   )  )   {
                      $rootScope.letters[index][delta].fi_nd.fi = true; 

                    }

                    //console.log(size_object +'/'+ j_arr)
                    //console.log(delta+ '-' +section.start+'--'+a.start+'--'+deltaz+'?end'+into_for+' / '+j_arr +'/'+i_array)
                    if( ( size_object ==  j_arr ) && (markup.subtype== 'list-item' || markup.subtype== 'h1'  || markup.subtype== 'h2' || markup.subtype== 'h3'  || markup.subtype== 'h4'  || markup.subtype== 'h5'  || markup.subtype== 'h6' || markup.subtype== 'cite' || markup.subtype== 'code'  )  )   {
                      $rootScope.letters[index][delta+1].fi_nd.nd = true; 
                    }

                    if(markup.selected === true){
                      $rootScope.letters[index][delta]['classes'].push('selected')
                    }


                    //$rootScope.letters[section_count][delta]['char'] =  j_arr;
                    //if(ztype && ztype== 'note'){
                    //  $rootScope.letters[section_count][delta]['classes'].push(a.subtype);
                    //  $rootScope.letters[section_count][delta]['classes'].push(ztype);

                    //}
                    //else{
                      $rootScope.letters[index][delta]['classes'].push(markup.subtype);
                      //$rootScope.letters[section_count][delta]['objects'].push(a);
                          //      $rootScope.letters[section_count][delta]['classes'].push('c-'+a.id);

                    //}
                    if(markup.subtype == 'link' && markup.metadata){
                      $rootScope.letters[index][delta]['href'].push(markup);
                    }
                    if(markup.selected === true){
                      $rootScope.letters[index][delta]['classes'].push('selected')
                    }
                    i_array++;
                    j_arr++
                  }
                  //$rootScope.containers[index].objects[markup.type]['inline'].push(markup); 
                  //console.log($rootScope.objects_sections[index][td.type])
            }


    //////////////

         

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
            }
              //console.log($rootScope.containers[index]['objects'][markup.type][markup.position])
              //console.log('pushed'+markup.position)
            }
          })
          //$rootScope.containers[index].objects = $rootScope.objects_sections[index]    
          $rootScope.containers[index].letters = $rootScope.letters[index]
         //  console.log($rootScope.containers[index])
        });
  
        // console.log($rootScope.letters)
        $rootScope.$emit('docEvent', {action: 'dispatched_objects' });
       // console.log( $rootScope.objects_sections['global_by_type'])

/*


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
  
      fill_chars : function (section, section_count){
        var temp_letters = new Array(); 
        var i;
        var i_array     =   0;
        var fulltext    =   '';
        var str_start     =   section.start;
        var str_end     =   section.end;
        /*var content_string  =   'Scripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts useScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for(see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see Music MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBo'
        content_string  +=  'Scripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts useScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for(see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see Music MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBo'
        content_string  +=  'Scripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts useScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for(see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see Music MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBo'
        content_string  +=  'Scripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts useScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for(see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see Music MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBo'
        content_string  +=  'Scripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts useScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for(see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used asd as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts  used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBoScripts used as backend for MusicBox (see Music MusicBox (see MusicBoScripts used as backend for MusicBox (see MusicBo'

        */
        var content_string  = $rootScope.doc.content


        //$rootScope.doc.content;

        for (i = str_start; i <= str_end; i++) {
          var letter_arr = new Object();
          var ch = '';
          ch = content_string[i];
          
          if (ch === " ") {
                ch = ' ';

            }
            if (!content_string[i]) {
                ch = ' ';
            }
              fulltext += ch;
          letter_arr['char'] = ch;

          //letter_arr['fi_nd'] = new Object({'fi': false, 'nd':false/*, 'md':false*/});
          letter_arr.fi_nd = new Object({'fi': false, 'nd':false/*, 'md':false*/});
          letter_arr.classes = new Array('lt');

          /** 
          * @something here
          * @link DocumentCtrl#fill_chars
          */

          letter_arr.order = i;
          letter_arr.action = '';
          letter_arr.rindex = i_array;
          letter_arr.lindex= i;
          
          //unsued a heavy  letter_arr.objects = new Array();
          letter_arr.href= new Array();
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

        $rootScope.letters[section_count]= temp_letters;
        $rootScope.containers[section_count].fulltext = fulltext;
      },

      /**
      * sub loop _d (not really musicbox, rather objects options (doc_options, users_options, etc..))
      */

      apply_object_options : function(object, options){
        //console.log(' apply doc_options to object'+object)
        var options_array = new Array()
        _.each(options , function(option){
           // console.log(option)
            var op_name = option.option_name;
            var op_value = option.option_value;
            var op_type = option.option_type;

            options_array[op_name]= new Array()
            options_array[op_name]['value'] = op_value;

            if(op_type == 'google_typo' && object == 'document'){
               WebFont.load({
                  google: {
                   families: [op_value]
                  }
              }); 
            }
        });
        if(object == 'document')  {
          $rootScope.doc_options = new Array()
          $rootScope.doc_options = options_array
           //console.log($rootScope.doc_options)
         }
         else if(object == 'author')  {
          $rootScope.author_options = new Array()
          $rootScope.author_options = options_array
          //console.log($rootScope.author_options)
         }
         else if(object == 'room')  {
          $rootScope.room_options = new Array()
          $rootScope.room_options = options_array
          //console.log($rootScope.room_options)
         }


         else{
          console.log('undef object')
         }
  

      },
      save_doc: function (field) {
          var data = new Object()
          data.field = field;
          data.value =  $rootScope.doc[field]
         
          $http.post(api_url+'/doc/'+$rootScope.doc._id+'/edit', serialize(data) ).
          success(function(doc) {
            // hard redirect
            if(field == 'title'){
               window.location = root_url+'/doc/'+doc.slug;
            } 
            if(field == 'content'){
            $rootScope.$emit('docEvent', {action: 'doc_ready', type: '-', collection_type: 'doc', collection:doc });


            }
           });  
        },
          save_doc_option: function (field) {
          var data = new Object()
          data.field = field;
          //data.value =  $rootScope.doc[field]
          data.value = $rootScope.doc_options[field].value

          $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/edit_options', serialize(data) ).
          success(function(doc) {
            // hard redirect
           
           });  
        },

      push_markup : function (markup){
        console.log($rootScope.userin.username)
          // todo : post api
          var data = new Object(markup)
          data.username = $rootScope.userin.username;
          data.user_id = $rootScope.userin._id;

         

        $http.post(api_url+'/doc/'+ $rootScope.doc.slug+'/markups/push', serialize(data) ).success(function(m) {
             //console.log(m)
            $rootScope.doc = m.doc;
            //$rootScope.$emit('docEvent', {action: 'doc_ready' });
            $rootScope.$emit('docEvent', {action: 'doc_ready', type: 'push', collection_type: 'markup', collection:m.inserted[0] });
         })




/*

         $http.get(api_url+'/doc/'+ $rootScope.doc.title+'/markups/push/'+markup.type+'/'+markup.subtype+'/'+markup.start+'/'+markup.end+'/'+markup.position+'/'+markup.metadata+'/'+markup.status+'/'+markup.depth).success(function(m) {
             //console.log(m)
            $rootScope.doc = m.doc;
            //$rootScope.$emit('docEvent', {action: 'doc_ready' });
            $rootScope.$emit('docEvent', {action: 'doc_ready', type: 'push', collection_type: 'markup', collection:m.inserted[0] });
        })
*/

     },
     offset_markups : function (){
          $http.get(api_url+'/doc/'+$rootScope.doc.slug+'/markups/offset/left/0/1/1').success(function(m) {
            console.log(m)
            $rootScope.doc = m;
            $rootScope.$emit('docEvent', {action: 'doc_ready', type: 'offset', collection_type: 'markup', collection:m.markups });
          })
      },
      offset_markup: function (markup){
          $http.get(api_url+'/doc/'+$rootScope.doc.slug+'/markup/'+markup._id+'/offset/left/0/1/1').success(function(m) {
            console.log(m)
            //$rootScope.doc = m;
            //$rootScope.$emit('docEvent', {action: 'doc_ready' });
          })
      },
      markup_save: function (markup){
          //var data = new Object({'start': markup.start})
            console.log(markup)
           if(markup.type =='container'){
                var temp = markup;
                markup.letters = new Array()
                markup.objects = new Array()
                markup.objects_count = new Array()
                console.log(markup)
                var data  = serialize(temp)

           }
           else{
               var data =  serialize(markup)
               console.log(data)
               console.log(data)
           }
     
         
          $http.post(api_url+'/doc/'+$rootScope.doc.slug+'/markup/'+markup._id+'/edit', data ).success(function(m) {
            console.log(m)
             $rootScope.doc = m.doc;
            $rootScope.$emit('docEvent', {action: 'doc_ready', type: 'edit', collection_type: 'markup', collection:m.edited });

          })

      },
    markup_delete: function (markup){
       $http.get(api_url+'/doc/'+$rootScope.doc.slug+'/markups/delete/'+markup._id).success(function(m) {
      //console.log(m)
      $rootScope.doc = new Array()
     $rootScope.doc = m.doc;
    $rootScope.doc.markups = m.doc.markups;
      console.log($rootScope.doc.markups)
    
      doc.init_containers()
      //$scope.$emit('docEvent', {action: 'doc_ready', type: 'delete', collection_type: 'markup', collection:m.deleted[0] });

      //$scope.$emit('docEvent', {action: 'doc_ready' });
    })

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

        virtual.visible = true;
      }
      else{
         virtual.visible = false;
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
      // after
  //  }

        console.log($rootScope.virtuals)

     }
      };
      return self;
    }
});