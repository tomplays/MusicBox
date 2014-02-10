var _ = require('underscore');
var nconf = require('nconf');

// some variables first 
// from nconf/config.json
// todo : rm nconf in functions//
var site                = new Array()
site['title']           = nconf.get('SITE_TITLE') 
site['description']     = nconf.get('SITE_DESCRIPTION') 
site['description_long']= nconf.get('SITE_DESCRIPTION_LONG')
site['site_img_thumb']  = nconf.get('SITE_IMG_THUMB')

exports.document = function(req, res){
  res.render('index', {
    locals: {
		  title: site['title']+' - '+ site['description'],
		  description: site['description_long'],
		  type: 'article',
		  image: site['site_img_thumb'],
		  use_socket_server : nconf.get('USE_SOCKET_SERVER'),
         	  socket_url: nconf.get('SOCKET_SERVER_URL')+':'+nconf.get('SOCKET_SERVER_PORT'),
 		  api_method: nconf.get('API_METHOD'),
		  api_url:nconf.get('API_SERVER_URL')+':'+nconf.get('API_SERVER_PORT')

    }
  });
};

exports.partials = function (req, res) {
  var name = req.params.name;
	res.render('partials/' + name , {
	  locals: {
             title: name
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
