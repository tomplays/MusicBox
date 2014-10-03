'use strict';

var mongoose = require('mongoose'),
 _ = require('underscore'),
Document = mongoose.model('Document')
var nconf = require('nconf')
nconf.argv().env().file({file:'config.json'});


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
	query.populate('user').populate('room').exec(function (err, doc) {
	if (err){
		res.json(err)
	} else{
		var markups_type = new Array()
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
		out.doc = doc
		out.markups_type= new Array(markups_type);
		///	out.markups_type.push()
		res.json(out)
		//res.json(doc)

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

exports.createdoc = function(req, res){
   

	var slug = req.params.slug;
	

	//var ar = new Object({'title':'bloue'+Math.random()})
	var new_doc = new Object({'title':slug, 'slug': slug, 'content': 'Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..'})

	 new_doc.markups = new Array()
	 new_doc.doc_options = new Array()





	var markup_section_base  = new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':0, 'end':300,  'type': 'container', 'subtype':'section', 'position':'inline'} )
	new_doc.markups.push(markup_section_base)
/*
	if(req.params.slug == 'guerilla-open-access-manifesto'){


			var new_doc = new Object({'title':slug, 'slug': slug, 'content': 'Sqsditing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..'})

		var markup_class= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':0, 'end':10,  'type': 'container_class', 'subtype':'css_class', 'metadata': 'bg_black', 'position':'inline'} )
		new_doc.markups.push(markup_class)










	}


    
	else if(req.params.slug == 'demo-1'){
			var new_doc = new Object({'title':slug, 'slug': slug, 'content': 'Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing.. Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..Start editing..'})

					var markup_summary  = new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':20, 'end':30,  'type': 'summary', 'subtype':'', 'position':'inline-implicit'} )
					var markup_class= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':0, 'end':10,  'type': 'container_class', 'subtype':'css_class', 'metadata': 'bg_black', 'position':'inline'} )
					

					var markup_h1	= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':0, 'end':10,  'type': 'markup', 'subtype':'h1', 'metadata': '', 'position':'inline'} )
					var markup_h2	= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':11, 'end':20,  'type': 'markup', 'subtype':'h2', 'metadata': '', 'position':'inline'} )
					var markup_h3	= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':21, 'end':30,  'type': 'markup', 'subtype':'h3', 'metadata': '', 'position':'inline'} )
					var markup_h4	= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':31, 'end':40,  'type': 'markup', 'subtype':'h4', 'metadata': '', 'position':'inline'} )
					var markup_h5	= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':41, 'end':50,  'type': 'markup', 'subtype':'h5', 'metadata': '', 'position':'inline'} )
					var markup_h6	= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':51, 'end':60,  'type': 'markup', 'subtype':'h6', 'metadata': '', 'position':'inline'} )



					var markup_em		= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':60, 'end':70,  'type': 'markup', 'subtype':'em', 'metadata': '', 'position':'inline'} )
					var markup_strike	= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':71, 'end':80,  'type': 'markup', 'subtype':'strike', 'metadata': '', 'position':'inline'} )
					var markup_strong	= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':81, 'end':90,  'type': 'markup', 'subtype':'strong', 'metadata': '', 'position':'inline'} )

					var markup_link		= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':100, 'end':110,  'type': 'markup', 'subtype':'link', 'metadata': 'https://github.com/tomplays/MusicBox', 'position':'inline'} )

					var markup_img		= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':0, 'end':1,  'type': 'media', 'subtype':'img', 'metadata': 'http://www.todayandtomorrow.net/wp-content/uploads/2009/07/surface-modulation_2.jpg', 'position':'wide'} )


					var markup_code		= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':160, 'end':170,  'type': 'markup', 'subtype':'code', 'metadata': '', 'position':'inline'} )
					var markup_cite		= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':171, 'end':180,  'type': 'markup', 'subtype':'cite', 'metadata': '', 'position':'inline'} )
					var markup_list_item= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':181, 'end':190,  'type': 'markup', 'subtype':'list_item', 'metadata': '', 'position':'inline'} )




					
					new_doc.markups.push(markup_summary)
					new_doc.markups.push(markup_class)

					new_doc.markups.push(markup_h1)
					new_doc.markups.push(markup_h2)
					new_doc.markups.push(markup_h3)
					new_doc.markups.push(markup_h4)
					new_doc.markups.push(markup_h5)
					new_doc.markups.push(markup_h6)
					new_doc.markups.push(markup_em)
					new_doc.markups.push(markup_strong)

					new_doc.markups.push(markup_strike)
					new_doc.markups.push(markup_link)
					new_doc.markups.push(markup_img)

					new_doc.markups.push(markup_code)
					new_doc.markups.push(markup_cite)
					new_doc.markups.push(markup_list_item)
	}
	else{
*/

			var markup_class= new Object( {'user_id':'542691afb9dc3c6a19445d24', 'username':'tom', 'start':0, 'end':10,  'type': 'container_class', 'subtype':'css_class', 'metadata': 'bg_black', 'position':'inline'} )
			new_doc.markups.push(markup_class)

//	}




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

	var   footer_center_html = new Object( {'option_name':'footer_center_html', 'option_value':"<i class=\'fa fa-file-text-o\'></i>document #2 <a>cc</a>- 2013 - <a>Hacktuel.fr</a>",  'option_type': '' } )
	new_doc.doc_options.push(footer_center_html)



	


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



exports.edit  = function(req, res) {
	var query = Document.findOne({ '_id':req.params.doc_id });
	query.populate('user').populate('room').exec(function (err, doc) {
	if (err){
		res.json(err)
	} else{
			var field = req.body.field
			var value = req.body.value
			console.log('editing doc '+req.params.doc_id +'field '+ field +'<->'+ value)
			// 'create' is a routes keyword..
			if(field == 'title' && value !== 'create' ){
				// and todo : clean
				var slugify = value.replace(/\s/g, '-')
				slugify = slugify.replace('?', '_')
				slugify = slugify.replace('!', '_')
				doc['slug'] =slugify

			}
			doc[field] = value;

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

exports.edit_options  = function(req, res) {
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
	console.log(req.body.start)

	var edited = new Array();
	var query = Document.findOne({ 'slug':req.params.slug });
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
						m.metadata = req.body.metadata

						  /*m.depth
						  m.status
						
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
	res.send('ok')
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

