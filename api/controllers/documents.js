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






	var text_typography  = new Object( {'option_name':'text_typography', 'option_value':'Esteban',  'option_type': 'google_typo' } )
	new_doc.doc_options.push(text_typography)
	var headings_typography  = new Object( {'option_name':'headings_typography', 'option_value':'Droid Sans',  'option_type': 'google_typo' } )
	new_doc.doc_options.push(headings_typography)



	var  use_authorcard = new Object( {'option_name':'use_authorcard', 'option_value':'full_last',  'option_type': 'fragment' } )
	new_doc.doc_options.push(use_authorcard)



	var   doc_notices_after_title= new Object( {'option_name':'doc_notices_after_title', 'option_value':'',  'option_type': '' } )
	new_doc.doc_options.push(doc_notices_after_title)

	var  share_fragment = new Object( {'option_name':'share_fragment', 'option_value':'right',  'option_type': '' } )
	new_doc.doc_options.push(share_fragment)

	var branding_class  = new Object( {'option_name':'branding_class', 'option_value':'sa white-bg',  'option_type': '' } )
	new_doc.doc_options.push(branding_class)

	var   footer_center_html = new Object( {'option_name':'footer_center_html', 'option_value':"<i>2014</i> , MusicBox  CC",  'option_type': '' } )
	new_doc.doc_options.push(footer_center_html)

/*
	var   = new Object( {'option_name':'', 'option_value':'',  'option_type': '' } )
	new_doc.doc_options.push()
*/

	

/*
	docmetas": [
    {
      "id": 49,
      "meta_key": "nextdoc_notice",
      "meta_value": "Partie 2. &raquo;",
      "createdAt": "2014-09-22T10:11:08.977Z",
      "updatedAt": "2014-09-22T10:11:09.384Z",
      "IdocId": 4
    },
    {
      "id": 50,
      "meta_key": "nextdoc_link",
      "meta_value": "http://localhost:3021/doc/v1/lire/5",
      "createdAt": "2014-09-22T10:11:08.977Z",
      "updatedAt": "2014-09-22T10:11:09.385Z",
      "IdocId": 4
    },
    {
      "id": 52,
      "meta_key": "kind",
      "meta_value": "classic-post",
      "createdAt": "2014-09-22T10:11:08.978Z",
      "updatedAt": "2014-09-22T10:11:09.386Z",
      "IdocId": 4
    },
    {
      "id": 53,
      "meta_key": "image_thumb",
      "meta_value": "http://localhost:3021/img/docs/8/pers.png",
      "createdAt": "2014-09-22T10:11:08.979Z",
      "updatedAt": "2014-09-22T10:11:09.386Z",
      "IdocId": 4
    },
    {
      "id": 54,
      "meta_key": "use_authorcard",
      "meta_value": "full_last",
      "createdAt": "2014-09-22T10:11:08.980Z",
      "updatedAt": "2014-09-22T10:11:09.387Z",
      "IdocId": 4
    },
    {
      "id": 55,
      "meta_key": "share_fragment",
      "meta_value": "right",
      "createdAt": "2014-09-22T10:11:08.980Z",
      "updatedAt": "2014-09-22T10:11:09.388Z",
      "IdocId": 4
    },
    {
      "id": 56,
      "meta_key": "share_notice",
      "meta_value": "Partager",
      "createdAt": "2014-09-22T10:11:08.981Z",
      "updatedAt": "2014-09-22T10:11:09.389Z",
      "IdocId": 4
    },
    {
      "id": 57,
      "meta_key": "keywords_notice",
      "meta_value": "Mots-clé",
      "createdAt": "2014-09-22T10:11:08.982Z",
      "updatedAt": "2014-09-22T10:11:09.390Z",
      "IdocId": 4
    },
    {
      "id": 58,
      "meta_key": "author_notice",
      "meta_value": "Ecrit par",
      "createdAt": "2014-09-22T10:11:08.982Z",
      "updatedAt": "2014-09-22T10:11:09.391Z",
      "IdocId": 4
    },
    {
      "id": 59,
      "meta_key": "nodes_fragment",
      "meta_value": "full_last",
      "createdAt": "2014-09-22T10:11:08.983Z",
      "updatedAt": "2014-09-22T10:11:09.392Z",
      "IdocId": 4
    },
    {
      "id": 60,
      "meta_key": "date_fragment",
      "meta_value": "full_last",
      "createdAt": "2014-09-22T10:11:08.983Z",
      "updatedAt": "2014-09-22T10:11:09.393Z",
      "IdocId": 4
    },
    {
      "id": 61,
      "meta_key": "single_theme",
      "meta_value": "plnt",
      "createdAt": "2014-09-22T10:11:08.984Z",
      "updatedAt": "2014-09-22T10:11:09.393Z",
      "IdocId": 4
    },
    {
      "id": 62,
      "meta_key": "text_class",
      "meta_value": "high_fat",
      "createdAt": "2014-09-22T10:11:08.985Z",
      "updatedAt": "2014-09-22T10:11:09.394Z",
      "IdocId": 4
    },
    {
      "id": 63,
      "meta_key": "text_typo",
      "meta_value": "Esteban::latin",
      "createdAt": "2014-09-22T10:11:08.985Z",
      "updatedAt": "2014-09-22T10:11:09.395Z",
      "IdocId": 4
    },
    {
      "id": 64,
      "meta_key": "headings_typo",
      "meta_value": "Droid Sans",
      "createdAt": "2014-09-22T10:11:08.986Z",
      "updatedAt": "2014-09-22T10:11:09.396Z",
      "IdocId": 4
    },
    {
      "id": 66,
      "meta_key": "doc_notices_before_title",
      "meta_value": "Ci-dessous le premier article publié sur hacktuel.fr, un long format, inédit et illustré",
      "createdAt": "2014-09-22T10:11:08.987Z",
      "updatedAt": "2014-09-22T10:11:09.398Z",
      "IdocId": 4
    },
    {
      "id": 67,
      "meta_key": "branding_class",
      "meta_value": "sa white_bg",
      "createdAt": "2014-09-22T10:11:08.987Z",
      "updatedAt": "2014-09-22T10:11:09.399Z",
      "IdocId": 4
    },
    {
      "id": 68,
      "meta_key": "short_excerpt",
      "meta_value": "Un jeune pigiste attend de voir son reportage publié.<br/> Devant le résultat il revient sur le papier idéal qu'il aurait voulu écrire et les obstacles rencontrés.",
      "createdAt": "2014-09-22T10:11:08.988Z",
      "updatedAt": "2014-09-22T10:11:09.399Z",
      "IdocId": 4
    },
    {
      "id": 69,
      "meta_key": "block_bgcolor",
      "meta_value": "midnight_bg",
      "createdAt": "2014-09-22T10:11:08.988Z",
      "updatedAt": "2014-09-22T10:11:09.400Z",
      "IdocId": 4
    },
    {
      "id": 70,
      "meta_key": "block_color",
      "meta_value": "white_atext",
      "createdAt": "2014-09-22T10:11:08.989Z",
      "updatedAt": "2014-09-22T10:11:09.401Z",
      "IdocId": 4
    },

*/


	new_doc.markups.push(markup)
	new_doc.markups.push(markup_summary)

//new_doc.doc_options.push(doc_options)


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

		var user_ = ''
		if(req.user){
				user_ = new Object({'username': req.user.username,  'image_url': req.user.image_url})

		}
		res.render('index_v1', {
			user_in : user_,
			socket_url: nconf.get('SOCKET_SERVER_URL')
		});

	
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

