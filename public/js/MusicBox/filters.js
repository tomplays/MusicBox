'use strict';
/* Filters */
// not included, see index and app.js



angular.module('musicBox.filters', ['ngSanitize'] ).
filter('trusted', function() {
    return function(val) {
    };
});

/*.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
*/