angular.module('musicBox.DocumentDirectives', [])

.directive("mbDocument", function() {
		
    function link(scope, elem, attr) {
      console.log('mb doc linked directive') 
    }
    return {
      link:link,
      restrict: "E",
      scope:true,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/document.tpl.html";
      }
    };
    
})
.directive("docTitle", function() {
   function link(scope, elem, attr) {
      console.log(' [document title] directive')

    }
  return {
    restrict: "E",
     link:link,
   templateUrl: function() {
   
       var turl = "js/MusicBox/document/tpl/doctitle.tpl.html"
        return turl;
   
    }
  };
})
.directive("mbBranding", function($rootScope) {

    var link= function(){
      console.log(' [branding] directive')
    }
    return {
      // replace:true,
      restrict: "E",
      scope: true,
      link:link,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/branding.tpl.html";
      }
    };
})
.directive("mbChapters", function($rootScope) {

    var link= function(){
      console.log(' [chapter Section] directive')
    }
    return {
      restrict: "E",
      scope: true,
      link:link,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/chapters.tpl.html";
      }
    };
})
.directive("mbBeforedoc", function($rootScope) {
    var link= function(){
      //if($rootScope.ui.debug){

      //}
      console.log(' [before doc] directive')
    }
    return {
      // replace:true,
      restrict: "E",
      scope: true,
      link:link,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/before_doc.tpl.html";
      }
    };
})
.directive("mbPostexcerpt", function($rootScope) {
    var link= function(){
      console.log(' [Post excerpt] directive')
    }
    return {
      // replace:true,
      restrict: "E",
      scope: true,
      link:link,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/post_excerpt.tpl.html";
      }
    };
})
.directive("mbDocoptions", function($rootScope) {
    var link= function(){
      console.log(' [doc_options] directive')
      
    }
    return {
      // replace:true,
      restrict: "E",
      scope: true,
      link:link,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/doc_options.tpl.html";
      }
    };
})
.directive("mbFlashmessage", function($rootScope) {
    var link= function(){
      console.log(' [Flash message] directive')
    }
    return {
      // replace:true,
      restrict: "E",
      scope: true,
      link:link,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/flash_message.tpl.html";
      }
    };
})
.directive("mbTopmenus", function($rootScope) {
    var link= function(){
      console.log(' [top menus] directive')
    }
    return {
      // replace:true,
      restrict: "E",
      scope: true,
      link:link,
      templateUrl: function() {
        return "js/MusicBox/document/tpl/top_menus.tpl.html";
      }
    };
})
;