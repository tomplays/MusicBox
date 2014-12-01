angular.module('musicBox', [])
    .controller('musicBoxController', ['$scope', '$http' , function($scope, $http) {
           
        
        $scope.loadvars = function(next){
              $scope.layouts = new Array('left','inline', 'right', 'center', 'wide', 'global', 'under')
        }    

         $scope.loaddocument = function(doc_id, next){
                $scope.loadvars()

                $http.get('data/demo_'+doc_id+'.json').success(function(d) {
                    $scope.doc= d.doc;
                    if(next){
                     $scope.tosection(true)
                    }
               });


        }    

        $scope.tosection = function(next){
                $scope.containers = _.filter($scope.doc.markups, function(td){ return  td.type == 'container'; });
                $scope.sectionstocount = _.size($scope.containers);

                if(next){
                     $scope.tolayout(true)
                }

        }

        $scope.tolayout = function(next){
            _.each($scope.containers, function(c){

                c.layout = new Array()
                 _.each($scope.layouts, function(l){
                    c.layout.push(l)
                    c.layout[l] = new Object({'name':l})
                    c.layout[l].markups = new Array()
                 })
            });
            
            if(next){
                $scope.totext(true)
            }

        }

        $scope.totext = function(next){
            _.each($scope.containers, function(c){
                c.fulltext = '';
                for (var l = c.start; l <= c.end; l++) {
                    c.fulltext +=  $scope.doc.content[l];
                }
                c.layout['inline'].fulltext = c.fulltext;

            })
            if(next){
                     $scope.toposition(true)
            }
        }
        $scope.toposition = function(next){
            _.each($scope.containers, function(c){
                
                _.each( $scope.doc.markups, function(mk){
                    if(mk.start >= c.start && mk.end <= c.end && mk.type !=='container'){
                        console.log(mk.position)
                        c.layout[mk.position].markups.push(mk)
                    }
                });     
            })
        }
        $scope.all = function(){
                $scope.loaddocument(1,true);
      }
    }]);

