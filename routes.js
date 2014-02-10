var index= require('./routes/index');

/* for developpers
include here: 
 var labroutes = require('./routes/lab');
*/

module.exports = function(app) {
	app.all('/*', function(req, res, next) {
 	 res.header("Access-Control-Allow-Origin", "*");
 	 res.header("Access-Control-Allow-Headers", "X-Requested-With");
 	 res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  	 next();
	});

	// http:// ... /doc/read/1
	app.get('/doc/:layout/:docid/:foo?/:bar?', 								index.document); // added foo and bar params could be usefull
	
	app.get('/fragments/:name/:param?',										index.fragments); // load kind of blocks 
	app.get('/partials/:name/:param?', 										index.partials);  // document.jade for example + column/right|left|..
	// ALL ELSE
	app.get('*', 															index.document);
}
