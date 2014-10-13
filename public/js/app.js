'use strict';

// Declare app level module which depends on filters, and services
angular.module('musicBox',  ['ngLocale', 'ngResource', 'musicBox.filters', 'ngRoute', 'musicBox.services', 'musicBox.directives', 'ngSanitize']).
  config(['$localeProvider','$routeProvider', '$locationProvider', '$sceProvider', function($localeProvider,$routeProvider, $locationProvider, $sceProvider ) {
    $routeProvider.
 	   when('/', {
        templateUrl: 'partials/document',
        controller: DocumentCtrl
      }).
      when('/doc/create', {
        templateUrl: '/partials/document_new',
        controller: DocumentNewCtrl
      }).
       when('/login', {
         templateUrl: '/partials/login',
        controller: UserCtrl
      }).
       when('/signup', {
        templateUrl: '/partials/signup',
        controller: UserCtrl
      }).
      when('/doc/:docid', {
        templateUrl: '/../partials/document',
        controller: DocumentCtrl
      }).
       when('/sockets/list', {
        templateUrl: '/partials/sockets_list',
        controller: SocketsListCtrl
      }).
      when('/docs/:mode', {
        templateUrl: '/partials/documents_list',
        controller: DocumentsListCtrl
      }).
     
      when('/me/account', {
        templateUrl: '/partials/user_account',
        controller: UserProfileCtrl
      }).
       when('/room/:room_slug', {
        templateUrl: '/partials/sockets_list',
        controller: SocketsListCtrl
      }).
      when('#_=_', {
        redirectTo: '/'
      }).
      otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
      //console.log($localeProvider)
      // $sceProvider.enabled(false);
     //$sceDelegateProvider.resourceUrlWhitelist(['.*']);
    }
  ]);

// instead of empty file include, but files exist #v+
// if/not included switcher
angular.module('musicBox.filters', [])
//angular.module('musicBox.directives', [])


angular.module('musicBox.directives', [])

.directive('myText', 


  function($rootScope, $compile) {

      function draw(scope, elem, attrs){
        console.log('drawing...')
        var text_out = '';
        _.each($rootScope.letters[scope.section.sectionin], function(lt, w){


           
           var lt_classes = 'lt '
           _.each(lt.classes, function(ltc, x){
             lt_classes += ' '+ltc 
           });

            if(lt.char === " " || lt.char === ""){
             lt.char = ' '
             //lt_classes += ' blank '
            }
            text_out += '<lt lettersi="'+lt.sectionin+'" letterorder="'+lt.order+'"  class="'+lt_classes+'"  chars="'+lt.char+'">'+lt.char+'</lt>';
        });       
        elem.html(text_out);
       // $compile(elem.contents())(scope);

      }
      
     function link(scope, elem, attrs) {

        


        scope.$watch(attrs.selecting, function(value,old) {
            //console.log(attrs.selecting)
           // console.log(value, old)
           // console.log(old)
           if(old !== value && old && value) {draw(scope, elem, attrs);}
        });


         draw(scope, elem, attrs);
  
      }


    return ({
      scope: {
       section : '=',
       selecting : '='
      },

    
      transclude :true,
      restrict: 'E',
      link: link
      //  compile: compile,
      // template: '<span>{{customerSection.start}}{{customerSection.starte}}</span>'

  })

 })


.directive('lt', function($rootScope) {
  // parsing avoid scope...
    return {
     
      scope: {
          ltLetterorder: '=letterorder',
          ltLettersi: '=lettersi'
         
        
      },
      
     /*
          template: '<span class="{{classe}}">{{chars}}</span>',
     */
      restrict: 'E',

      link: function(scope, elem, attrs) {


      
          elem.bind('click', function() {
            //  alert('sd')
            //console.log(scope.customerLetter)
            //console.log(elem)
            //console.log(attrs)
            // alert(attrs.chars)
            // 
            // alert($rootScope.doc.title)
            // console.log($scope)
            //  var src = elem.find('img').attr('src');
            // call your SmoothZoom here
            //  angular.element(attrs.options).css({'background-image':'url('+ scope.item.src +')'});

          });

         
          elem.bind('mouseup', function() {
                     // var parsed = JSON.parse(attrs.letterz)
                     //console.log(parsed.order)
                     scope.$parent.$parent.over(scope.ltLetterorder, 'down')

                      scope.$apply(function(){
                          scope.$parent.selecting = Math.random()+'ov';
                      });

          });
          
           elem.bind('mousedown', function() {
             
            // console.log(scope.ltLetterorder)
            //alert(attrs.chars)
           // scope.$parent.$parent.over( scope.ltLetterorder, 'down')
          });


      }
    };
  });


