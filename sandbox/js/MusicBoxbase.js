angular.module('musicBox', [])
    .controller('musicBoxController', ['$scope', '$http' , function($scope, $http) {
           
        

        // some vars defined
        $scope.loadvars = function(next){
              $scope.layouts = new Array('left','inline', 'right', 'center', 'wide', 'global', 'under');
              // "notlite" arrays are more complex..
        }    


        // load a doc (static here)
        // @params : doc_id

         $scope.loaddocument = function(doc_id, next){
                $scope.loadvars()

                $http.get('data/demo_'+doc_id+'.json').success(function(d) {
                    $scope.doc= d.doc;
                    if(next){
                        $scope.tosection(true)
                    }
               });


        }    


        // loop markups to find sections
        $scope.tosection = function(next){
            if(!$scope.doc){
                console.log('load doc first')
                return;
            }
                $scope.containers = _.filter($scope.doc.markups, function(td){ return  td.type == 'container'; });
                $scope.sectionstocount = _.size($scope.containers);


                $scope.containers =   _.sortBy($scope.containers,function (num) {
                   return num.start;
                 });

                if(next){
                     $scope.tolayout(true)
                }

        }



        // init each "zone" for each section
        // output two-dimensions arrays

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


        // the letters are added to the section.

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


        // objects are added to the sections.
        $scope.toposition = function(next){
            _.each($scope.containers, function(c){
                
                _.each( $scope.doc.markups, function(mk){
                    if(mk.start >= c.start && mk.end <= c.end && mk.type !=='container'){
                        console.log(mk.position)
                        c.layout[mk.position].markups.push(mk)
                    }
                });     
            })
            if(next){
                $scope.map_letters(true)
            }
        }

        $scope.map_letters= function(next){
            console.log('loop end.')
        }

        $scope.all = function(){
            $scope.loaddocument(1,true);
       }
    }]);

