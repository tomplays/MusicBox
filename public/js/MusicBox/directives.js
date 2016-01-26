'use strict';

// custom angular directives
// for video players & embed frames

angular.module('musicBox.directives', [])

.directive('ngKeystrokeffff', function($rootScope){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs){
            elem.bind("keyup", function(){
              console.log('ft')
               // scope.$digest(); //we manually refresh all the watchers. I don't know why the watcher on {{log}} won't trigger if the event is fired on a "space" key :s but the push is done regardless
            });
        }
    };
})


.directive('mbFlashmessage', function($rootScope, $timeout){
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


  var flashmessageCtrl= function($scope, $rootScope){


     // init flash message object
   $scope.flash_message = {'text':''};

   $rootScope.flashmessage = function (msg,classname ,timeout, closer) {
       

        $scope.flash_message = {}
        $scope.flash_message.text = msg;
        $scope.flash_message.classname = classname;

        if(!closer){
            $scope.flash_message.closer =false;
        }
        else{
            $scope.flash_message.closer = closer;
        }
        

        // apply timeout if set to true
        if(timeout){
            $timeout(function(){
                $scope.flash_message.text =  '';
            },timeout);
        }
      }

      // OnLoad
      //if($rootScope.render.top_menus.help && $rootScope.render.top_menus.help.open == true){
      //}

      if($rootScope.render && $rootScope.render.fresh == true){
        $rootScope.flashmessage($rootScope.i18n.CUSTOM.HELP.fresh_document, 'help' , 3000, true)
      }




  }







    return {
        restrict: 'AE',
        controller: flashmessageCtrl,
        link: function(scope, elem, attrs){
         
        },
      scope: true,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/flash_message.tpl.html";
      }
    };
})




.directive('fluid', 

  function($rootScope) {
    // http://www.openstreetmap.org/export/embed.html?bbox=-407.8125%2C-85.45805784937232%2C226.40625%2C85.56806584676865&amp;layer=hot
    // http://www.openstreetmap.org/export/embed.html?bbox=0.68115234375%2C43.78695837311561%2C20.06103515625%2C51.795027225829145&amp;layer=mapnik
    // http://player.vimeo.com/video/107038653
    //  https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/172455259&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true
    function link(scope, elem, attr) {     
         // uh ?? 
            console.log(scope.position)
           // https://www.mail-archive.com/angular@googlegroups.com/msg03078.html
            var wrapper = angular.element(elem.parent());

            var o_w = wrapper.prop('offsetWidth');
            var o_h = o_w;
            elem.children(0)[0].style.width = o_w+'px';
            elem.children(0)[0].style.height= o_h+'px';
        
    }
    return {
          scope: {
            url   : '@',
            subtype   : '@', 
            position : '@'
          },
          link:link,
          template: '<iframe  webkitallowfullscreen mozallowfullscreen allowfullscreen scrolling="no" frameborder="no" src="{{url}}"></iframe><p>{{subtype}}</p>'
    };
})



