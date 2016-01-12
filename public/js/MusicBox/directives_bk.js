/*.directive('fluidtext',   
  function($rootScope, $compile) {
   
    function link(scope, elem, attrs) { 
      //   console.log(scope.section.letters);
      
      scope.$watch(attrs.modeletters, function(value,old) {
        //console.log('wtached modeletters')
      });

     

      elem.bind('click', function() {
        console.log('modeletters toggled')
        
        scope.$apply(function(){

          scope.section.modeletters = 'single';
        });
      })

      console.log('drawing...')
      var text_out = '';
      
      _.each(scope.section.letters, function(lt, w){
           var lt_out = '';
           var lt_classes = ''
          if(_.size(lt.classes)==0){
                lt_out += lt.char
          }
          else{
            _.each(lt.classes, function(ltc, x){
                //console.log(ltc)
                console.log(lt.order+'class count:'+x)
              if(ltc !=='lt'){
               lt_classes += ' '+ltc 
              }
              lt_out = '<span class="lt '+lt_classes+'" >'+lt.char+'</span>'
             });
          }
          //   console.log(lt)
          
          text_out += lt_out
          //text_out += '<span class="'+lt_classes+'" >'+lt.char+'</span>';
        });
       // console.log(text_out)
        elem.html(text_out);
        $compile(elem.contents())(scope);
    }
    return {
            scope: {
              section   : '=',     
            },
            transclude :true,
            restrict: 'EA',
            link: link,
           // template: '<p>{{section.fulltext}}</p>'
        }
})
*/
