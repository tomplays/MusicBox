'use strict';

/**
* @description
* @function 
* @link 
* @todo nothing
*/


var nconf = require('nconf');
nconf.argv().env().file({file:'config.json'});



  /**
  * @description
  * @function 
  * @link 
  * @todo nothing
  */

  exports.partial = function (req, res) {
    var name = req.params.name;
    var extraparam = '';
    if(req.params.param){ var extraparam = req.params.param; }
    res.render('partials/' + name , {
      locals: {
               title: name,
               extraparam: extraparam
      }
    });
  };


  /**
  * @description
  * @function 
  * @link 
  * @todo nothing
  */

  exports.fragments = function (req, res) {
    var name = req.params.name
    var extraparam = ''
    if(req.params.param){ 
      var extraparam = req.params.param
    }
    res.render('fragments/' + name , {
      locals: {
               title: name,
               extraparam: extraparam
      }
    })
  }


  /**
  * @description
  * @function 
  * @link 
  * @todo nothing
  */

  exports.errors = function(req, res) {
    var message = '<a style="text-decoration:underline;" href="'+nconf.get('ROOT_URL')+'"> &laquo; Back </a>';
    res.render('error', { title: 'Nothing here', message: message} );
  };


  /**
  * @description
  * @function 
  * @link 
  * @todo nothing
  */

  exports.sockets_list = function(req, res) {
           var user_ = new Object({'username': null,  'image_url':null})
           res.render('index_v1', { user_in:user_ } );
  };
