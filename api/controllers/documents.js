'use strict';

var mongoose = require('mongoose'),
 _ = require('underscore'),
Document = mongoose.model('Document')


var nconf = require('nconf')
nconf.argv().env().file({file:'config.json'});
var app;




exports.list = function(req, res) {
	var query = Document.find();
	query.exec(function (err, docs) {
	if (err) return handleError(err);
		res.json(docs)
	})
};
exports.listRender = function(req, res) {
	var query = Document.find();
	query.exec(function (err, docs) {
		//console.log(docs)
		if (err) return handleError(err);
			docs = JSON.stringify(docs)
			res.render('index_v1', {
				docs: docs
			});
	})
};

exports.createdoc = function(req, res){
   



	//var ar = new Object({'title':'bloue'+Math.random()})
	var new_doc = new Object({'title':req.params.title, 'content': 'Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..'})

	new_doc.markups = new Array()
	new_doc.doc_options = new Array()


	var markup  = new Object( {'start':0, 'end':100,  'type': 'container', 'subtype':'section', 'position':'inline'} )
	var markup_summary  = new Object( {'start':20, 'end':30,  'type': 'summary', 'subtype':'', 'position':'inline-implicit'} )


	var doc_options  = new Object( {'option_name':'text_typography', 'option_value':'Esteban',  'option_type': 'style' } )


	new_doc.markups.push(markup)
	new_doc.markups.push(markup_summary)

	new_doc.doc_options.push(doc_options)
	new_doc.room = '542691cab9dc3c6a19445d27'


	var doc = new Document(new_doc);
	if(req.user){

		doc.user = req.user;
   	 	doc.username = req.user.username;
   	 	console.log(req.user)
	}
	else{
		//return res.send('users/signup', {
             //   errors: err.errors,
             //   article: article
          //  });
	}

	//doc.populate('user', 'name username image_url').exec(function(err,doc) {


	



	doc.save(function(err,doc) {
		if (err) {
   			res.json(err);
        } else {

        	 


        	console.log(doc)

      	var doc =  Document.findOne({title: new_doc.title}).populate('user', 'name username image_url').populate('room').exec(function(err, doc) {
        res.json(doc)
    });	
        	

            
        }
    });
}

exports.docByIdOrTitle = function(req, res) {
	var query = Document.findOne({ 'title':req.params.doc_id_or_title });
	query.populate('user').populate('room').exec(function (err, doc) {
	if (err){
		res.json(err)
	} else{
		res.json(doc)
		}
	})
}
exports.markup_edit = function(req, res) {
	console.log(req.body.start)

	var edited = new Array();
	var query = Document.findOne({ 'title':req.params.doc_id_or_title });
	query.exec(function (err, doc) {
	if (err){ 
			return handleError(err);
	}
	else{
			 _.each(doc.markups , function (m, i){
			       if(m._id == req.params.markup_id){
			      	 	console.log(m)
			      	 	m.start = req.body.start
			      	 	m.end = req.body.end
			      	 	m.type = req.body.type
			      	 	m.subtype = req.body.subtype
			      	 	m.position= req.body.position
						/*
						++

						  m.depth
						  m.status
						  m.metadata
						  m.doc_id
						  m.user_id
						  m.updated
						  m.created
						*/
			      	 	edited.push(m)
			      	 	doc.markups[i] = m
			       }
			 });
			 doc.save(function(err,doc) {
				if (err) {
					res.send(err)
				} else {
					var out = new Object();
					out.doc = doc
					out.edited = new Array();
					out.edited.push(edited)

					res.json(out)
				}
			});
	}
		
	})
	
}


exports.docByIdOrTitleRender = function(req, res) {


	//console.log(req.user)



	if(!req.params.doc_id_or_title){
		// (no test if no homepage, assuming existence)
		var doc_id_or_title  = 'homepage';

	}
	else{
		var doc_id_or_title  = req.params.doc_id_or_title;
	}
	var query = Document.findOne({ 'title':doc_id_or_title });
	query.exec(function (err, doc) {
		if (err) {
			return handleError(err);
		}
		var doc_ = JSON.stringify(doc)
				var user_ = ''

		if(req.user){
				user_ = new Object({'username': req.user.username,  'image_url': req.user.image_url})

		}
		
  
		res.render('index_v1', {
			doc: doc_,
			docs: new Object(),
			user : user_,
			socket_url: nconf.get('SOCKET_SERVER_URL')
		});

	})
}

// /api/v1/doc/:doc_id_or_title/markups/create/:type/:subtype/:start/:end/:position/:metadata/:status/:depth
exports.markup_create = function(req, res) {
	var query = Document.findOne({ 'title':req.params.doc_id_or_title });
	
	query.exec(function (err, doc) {
	if (err) {
		res.send(err)
	}
	else{
		var markup  = new Object( {'position': req.params.position, 'start':req.params.start, 'end':req.params.end, 'subtype': req.params.subtype, 'type': req.params.type, 'status': req.params.status, 'metadata': req.params.metadata, 'depth': req.params.depth} )
		//console.log(doc.markups)


		doc.markups.push(markup)
		console.log('doc.markups after')
		//console.log(doc.markups)

		var inserted = _.last(doc.markups);
		// console.log(inserted)

		doc.save(function(err,doc) {
			if (err) {
				res.send(err)
			} else {
				var out = new Object();
				out.doc = doc
				out.inserted = new Array();
				out.inserted.push(inserted)
				//console.log(out)
				//console.log(doc)
				res.json(out)
			}
		});
	  }
	});
}



// /api/v1/doc/:doc_id_or_title/markups/delete/:markup_id
exports.markup_delete = function(req, res) {
	console.log(req.params.doc_id_or_title)
	var deleted= new Array();
	var query = Document.findOne({ 'title':req.params.doc_id_or_title });
	


	query.exec(function (err, doc) {
	  if(err) {
	  	res.send(err)
	  }
	  else{
	  		if(req.params.markup_id && req.params.markup_id == 'all'){
					deleted= doc.markups
					doc.markups = new Array();

					doc.save(function(err,doc) {
			        if (err) {
			           res.send(err)
			        } else {


			        	var out = new Object();
						out.doc = doc
						out.deleted= new Array();
						out.deleted.push(deleted)
						res.json(out)
			        }
			 		});

	  		}
			else{
				//console.log(req.params.markup_id)
				var deleted= new Array();
				//console.log(doc.markups)

				//console.log(doc)
					var after_markups = new Array();
				  _.each(doc.markups , function (m, i){
			       if(m._id == req.params.markup_id){
			      	 	console.log(m)
			       		deleted.push(m)

			       }
			       else{
			       		after_markups.push(m)
			       }
			      });
				  doc.markups = new Array()
			      doc.markups = after_markups;

			      doc.save(function(err,doc) {
			        if (err) {
			           res.send(err)
			        } else {


			        	var out = new Object();
						out.doc = doc
						out.deleted= new Array(deleted);
						//out.deleted.push(deleted[0])
						res.json(out)
			        }
			 	});


			}
			// both case save
			
	  }
	});
}

exports.markup_offset= function(req, res) {
	//todo
	res.send('ok')
}

exports.markups_offset = function(req, res) {
	// /api/v1/doc/:doc_id_or_title/markups/offset/:side/:start/:end/:qty
	var query = Document.findOne({ 'title':req.params.doc_id_or_title });
	query.exec(function (err, doc) {
		if (err) {
		return handleError(err);
		}
		else{
			var qty = parseInt(req.params.qty)
			_.each(doc.markups, function (td, i){
				//if( (td.start <= req.params.start )  ){
						if(req.params.side && req.params.side == 'left'){
							doc.markups[i].end 		= 	parseInt(doc.markups[i].end) + qty;
							doc.markups[i].start    =   parseInt(doc.markups[i].start) + qty;
						}
						else{
							doc.markups[i].end 		= parseInt(doc.markups[i].end) - qty;
							doc.markups[i].start 	= parseInt(doc.markups[i].start) - qty;
						}
				//}
			});
			doc.save(function (err,article) {
				if (err) {
					res.send(err)
				}
				else{
					// console.log('Success!');
					res.json(doc)
				}
			});
		}
	})
}

/*
Contact.findByIdAndUpdate(
    info._id,
    {$push: {"messages": {title: title, msg: msg}}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    }
);


*/

