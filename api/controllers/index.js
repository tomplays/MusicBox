'use strict';



exports.sockets_list = function(req, res) {
			   var user_ = new Object({'username': null,  'image_url':null})
   			 res.render('index_v1', { user_in:user_ } );
};

exports.login = function(req, res) {
        // res.render('login');

          var user_ = new Object({'username': null,  'image_url':null})
         res.render('index_v1', { user_in:user_ } );
};

exports.signup = function(req, res) {

  var user_ = new Object({'username': null,  'image_url':null})
  res.render('index_v1', { user_in:user_ } );

  
};


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


exports.fragments = function (req, res) {
  var name = req.params.name;
  var extraparam = '';
  if(req.params.param){ var extraparam = req.params.param; }
  res.render('fragments/' + name , {
    locals: {
             title: name,
             extraparam: extraparam
    }
  });
};