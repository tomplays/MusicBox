'use strict';

var mongoose = require('mongoose'),
 _ = require('underscore'),
Document = mongoose.model('Document'),
Markup  = mongoose.model('Markup');

var nconf = require('nconf')
nconf.argv().env().file({file:'config.json'});
var chalk = require('chalk')


var app;

exports.index_doc= function(req, res) {
		var user_ = ''
		if(req.user){
			user_ = new Object({'_id': req.user._id , 'username': req.user.username,  'image_url': req.user.image_url})
		}
		res.render('index_v1', {
			user_in : user_
		});
}

exports.docByIdOrTitle = function(req, res) {
	var query = Document.findOne({ 'slug':req.params.slug });

 var opts = {
path: 'markups.doc_id',
model: 'Document'
}
// .populate('markups', opts).
/*
	var iter = function(doc, callback) {
                Markup.populate('document', {
                    path: 'markups.doc_id'
                }, callback);
            };


            console.log(doc)

*/

	query.populate('user','-email -hashed_password -salt').populate({path:'markups.doc_id', select:'-markups'}).populate('room').exec(function (err, doc) {
	if (err){
		res.json(err)
	} else{

		var markups_type = new Array()
		var markups_f = new Array()
		if(doc && doc.markups){

		 	_.each(doc.markups , function (markup, i){
				if(markup.type){
			 		markups_type.push(markup.type)
			 	}
			})
 			markups_type = _.uniq(markups_type)
			doc.markups_type = new Array()
		}
		var out = new Object();
		out.doc = doc.toObject()
		out.doc.secret = 'api_secret'
		out.markups_type = new Array(markups_type);
		///	out.markups_type.push()
		res.json(out)
		}
	})
}

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
exports.doc_create = function(req,res){

	// to filter a better way
	var raw_title =req.body.raw_title;
	var raw_content   = req.body.raw_content;
 	var filtered_title = raw_title;
	var filtered_content =raw_content;
	var slug= raw_title.replace(/\s/g, '-')
	slug= slug.replace('?', '_')
	slug = slug.replace('!', '_')

	//var ar = new Object({'title':'bloue'+Math.random()})
	var new_doc = new Object({'title':filtered_title, 'slug': slug, 'content': filtered_content})

	 new_doc.markups = new Array()
	 new_doc.doc_options = new Array()
	 var markup_section_base  = new Object( {'user_id':req.user._id, 'username':req.user.username, 'start':0, 'end':300,  'type': 'container', 'subtype':'section', 'position':'inline'} )
	 new_doc.markups.push(markup_section_base)


	 // var markup_class= new Object( {'user_id':req.user._id, 'username':req.user.username, 'start':0, 'end':10,  'type': 'container_class', 'subtype':'css_class', 'metadata': 'bg_black', 'position':'inline'} )
	 // new_doc.markups.push(markup_class)

	var text_typography  = new Object( {'option_name':'text_typography', 'option_value':'Esteban',  'option_type': 'google_typo' } )
	new_doc.doc_options.push(text_typography)
	var headings_typography  = new Object( {'option_name':'headings_typography', 'option_value':'Droid Sans',  'option_type': 'google_typo' } )
	new_doc.doc_options.push(headings_typography)

	var  use_authorcard = new Object( {'option_name':'use_authorcard', 'option_value':'full_last',  'option_type': 'fragment' } )
	new_doc.doc_options.push(use_authorcard)

	var   doc_notices_after_title= new Object( {'option_name':'doc_notices_after_title', 'option_value':'-',  'option_type': '' } )
	new_doc.doc_options.push(doc_notices_after_title)

	var   doc_notices_before_title= new Object( {'option_name':'doc_notices_before_title', 'option_value':'-',  'option_type': '' } )
	new_doc.doc_options.push(doc_notices_before_title)

	var  share_fragment = new Object( {'option_name':'share_fragment', 'option_value':'right',  'option_type': '' } )
	new_doc.doc_options.push(share_fragment)

	var branding_class  = new Object( {'option_name':'branding_class', 'option_value':'sa white-bg',  'option_type': '' } )
	new_doc.doc_options.push(branding_class)

	var   footer_center_html = new Object( {'option_name':'footer_center_html', 'option_value':"<i class=\'fa fa-file-text-o\'></i>a data-document powered by <a href=\'http://github.com/tomplays/MusicBox/\'>MusicBox beta*</a> - 2014 - <a href=\'http://hacktuel.fr\'>@Hacktuel.fr</a>",  'option_type': '' } )
	new_doc.doc_options.push(footer_center_html)


	// hardcoded
	//new_doc.doc_options.push(doc_options)
	//nconf.get('DEFAULT_ROOM_ID')
	///new_doc.room = nconf.get('ROOM_ID');

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
			//console.log(doc)
			var doc =  Document.findOne({title: filtered_title}).populate('user', 'name username image_url').populate('room').exec(function(err, doc) {
        	res.json(doc)
   			});            
        }
    });
}




exports.doc_edit  = function(req, res) {
	var query = Document.findOne({ '_id':req.params.doc_id });
	query.populate('user').populate('room').exec(function (err, doc) {
	if (err){
		res.json(err)
	} else{
			console.log('editing user id :'+ req.user._id +' test doc_user.id'+ doc.user._id)
			//console.log('editing doc id :')
			//console.log(doc)


			//if(1){
					  console.log(chalk.green('authorized') );

					  var field = req.body.field
				var value = req.body.value
				console.log('editing doc '+req.params.doc_id +'field '+ field +'<->'+ value)
				// 'create' is a routes keyword..
				if(field == 'title' && value !== 'create' ){
					// and todo : clean
					var slugify = value.replace(/\s/g, '-')
					slugify = slugify.replace('?', '_')
					slugify = slugify.replace('.', '_')
					slugify = slugify.replace('/', '_')
					slugify = slugify.replace('!', '_')
					doc['slug'] =slugify


					doc[field] = value;
					  console.log(chalk.green('after doc edit') );

			}


			if(field == 'content' ){
			


						doc[field] = value;
					  console.log(chalk.green('after doc edit') );

			}
			if(field == 'room_id'){
doc.room = value;
			}


			doc.save(function(err,docsaved) {
						if (err) {
							res.send(err)
						} else {
							  console.log(chalk.green('after doc 22 edit') );
						
	var out = new Object();
		out.doc = docsaved;
		console.log(out)
							res.json(out)
						}
					});		

			
	}
	})
}



exports.doc_create_option  = function(req, res) {
	var query = Document.findOne({ 'slug':req.params.slug });
	query.populate('user').populate('room').exec(function (err, doc) {
	if (err){
		res.json(err)
	} else{
				console.log(doc)
			res.send('created')
	}

});



}

exports.doc_delete_option  = function(req, res) {

	var query = Document.findOne({ 'slug':req.params.slug });
	query.populate('user').populate('room').exec(function (err, doc) {
	if (err){
		res.json(err)
	} else{
				console.log(doc)
			res.send('deleted'+req.body.option_name)
	}

});
}

exports.doc_edit_option  = function(req, res) {
	var query = Document.findOne({ 'slug':req.params.slug });
	query.populate('user').populate('room').exec(function (err, doc) {
	if (err){
		res.json(err)
	} else{

			var field = req.body.field
			var value = req.body.value
  			var doc_options_new = new Array()
			console.log(field +'<->'+ value)
			 _.each(doc.doc_options , function (option, i){
			 	if(option.option_name == field ){
 					option.option_value = value
 					doc_options_new.push(option)
 				 	console.log(option)
			 	}
			 	else{
			 		doc_options_new.push(option)
			 	}
			 })
			 doc.doc_options = new Array()
			 doc.doc_options = doc_options_new
			 doc.save(function(err,doc) {
					if (err) {
						res.send(err)
					} else {
						res.json(doc)
					}
			});		
	}
	})
}

exports.markup_edit = function(req, res) {

	var edited = new Array();
	var query = Document.findOne({ 'slug':req.params.slug });
	query.exec(function (err, doc) {
	if (err){ 
			return handleError(err);
	}
	else{
			 _.each(doc.markups , function (m, i){
			       if(m._id == req.params.markup_id){
			       	console.log('m.doc_id>')
			       	console.log(req.body)
				if(req.body.doc_id_id){

					console.log('DOC ID IDADADA'+req.body.doc_id_id)
				}
		//	console.log(m)
			      	 	m.start = req.body.start
			      	 	m.end = req.body.end
			      	 	m.type = req.body.type
			      	 	m.subtype = req.body.subtype
			      	 	m.position= req.body.position
						m.metadata = req.body.metadata
						

							if(req.body.doc_id_id){

					console.log('DOC ID IDADADA'+req.body.doc_id_id)
					m.doc_id = req.body.doc_id_id;
				}


						  /*m.depth
						  m.status
						
						  m.doc_id
						  m.user_id
						  m.updated
						  m.created
						  */
					//	console.log(m.toObject())

			      	 	edited.push(m)
			      	 	doc.markups[i] = m



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


});		
	}
		
	})
	
}


// /api/v1/doc/:doc_id_or_title/markups/create/:type/:subtype/:start/:end/:position/:metadata/:status/:depth
exports.markup_create = function(req, res) {
	var query = Document.findOne({ 'slug':req.params.slug });
	console.log(req.body)


	console.log(req.body.username)

	
	query.exec(function (err, doc) {
	if (err) {
		res.send(err)
	}
	else{
		var markup  = new Object( {'user_id': req.body.user_id , 'username': req.body.username, 'position': req.body.position, 'start':req.body.start, 'end':req.body.end, 'subtype': req.body.subtype, 'type': req.body.type, 'status': req.body.status, 'metadata': req.body.metadata, 'depth': req.body.depth} )
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
	var query = Document.findOne({ 'slug':req.params.slug });
	


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
	console.log(req.params)
	console.log(req.body)
	//res.send('ok')
	var query = Document.findOne({ 'slug':req.params.slug });
	query.exec(function (err, doc) {
		if (err) {
		return handleError(err);
		}
		else{
			
			_.each(doc.markups, function (m, i){
					if(req.body.markup_id == m._id){

						console.log('touch')
						console.log(m)

/*
  		  data.markup_id = markup._id;
          data.side = 'left'
          data.start_qty = -2;
          data.end_qty = 4;
          data.qty = 1



*/
						doc.markups[i].start = parseInt(doc.markups[i].start)+parseInt(req.body.start_qty);
						doc.markups[i].end = parseInt(doc.markups[i].end)+parseInt(req.body.end_qty);

					}


			})
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
	});
}

exports.markups_offset = function(req, res) {
	// /api/v1/doc/:doc_id_or_title/markups/offset/:side/:start/:end/:qty
	var query = Document.findOne({ 'slug':req.params.slug });
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

