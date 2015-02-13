'use strict';


/**
* @description
* @function 
* @link 
* @todo nothing
*/
/*
API functions

"document" functions

	create, edit, delete ..


"markups"

	crud /	offset

misc. function (access/right)

*/

var mongoose = require('mongoose'),
 _ = require('underscore'),
 S = require('string'),
Document = mongoose.model('Document'),
meta_options = mongoose.model('Metaoptions'),
User = mongoose.model('User'),
Markup  = mongoose.model('Markup');
var nconf = require('nconf');

nconf.argv().env().file({file:'config.json'});

var chalk = require('chalk');
var app;
var mail= require('./../../sendmail.js');


 	exports.doc_create_view= function(req, res) {
		
		if(req.user){
	 		var user_	= req.user.toObject()

			res.render('index', {
				user_in : user_,
				doc_title : '',
				raw_content : '',
				doc_thumbnail : '',
				doc_excerpt: '',
				doc_slug_discret : '',
				doc_include_js : '',
				doc_include_css : '' 
			});			
		}
		else{
			res.render('error', {});

		}
 	}

	/**
	* @description
	* @function 
	* @link 
	* @todo nothing
	*/
 	exports.index_doc= function(req, res) {

 		var debugger_on = 'true' /// fix database for broken meta_options.

		var user_ = ''
		if(req.user){
			// user_ = new Object({'_id': req.user._id , 'username': req.user.username,  'image_url': req.user.image_url})
		}
		var doc_req_slug 	  = 'homepage';
		var doc_slug_discret  =  nconf.get('ROOT_URL')+':'+nconf.get('PORT');
		if(req.params.slug){
			doc_req_slug = req.params.slug;
			doc_slug_discret  +=  '/doc/'+req.params.slug;
		}

		// miniquery.
		var query = Document.findOne({ 'slug':doc_req_slug });
			query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {
			if (err){
				res.json(err)
			} else{
				if(doc){
					if(doc.published == 'draft')
					{
								var user_can	= exports.test_owner_or_key(doc,req)
								if(!user_can){
									var redirect_to = nconf.get('ROOT_URL')+':'+nconf.get('PORT')
									if(req.params.slug){
										redirect_to += '/doc/'+req.params.slug;
									}
									
									 var message = 'This doc is a draft : <a style="text-decoration:underline;" href="/login?redirect_url='+redirect_to+'">login</a> if your are doc owner or grab "secret key" <a style="text-decoration:underline;" href="'+nconf.get('ROOT_URL')+'"> &laquo; Back </a>';
									 res.render('error', { title: 'no access', message: message} );
									 return;
								}
					}


					var doc_include_js=''
					var doc_include_css= '';

					var new_doc_options = []
					_.each(doc.doc_options , function (option, i){
						//console.log(option)



						//
if(debugger_on){
						var fix_opt  = new meta_options( {'option_name':option.option_name, 'option_value':option.option_value,  'option_type': option.option_type } )
						new_doc_options.push(fix_opt)
}


						if(option.option_name == 'doc_include_js' ){			 	
							doc_include_js += option.option_value;
						}
						if(option.option_name == 'doc_include_css' ){			 	
							doc_include_css += option.option_value;
						}
					});
					
if(debugger_on){
						console.log(new_doc_options)
						doc.doc_options = new_doc_options;

						doc.save(function(err,docsaved) {
						if (err) {
							
						} 
						else {
						  	console.log(chalk.green('doc saved') );
						  }
						});
}
					


					console.log('public doc rendered')	
					res.render('index', {
						user_in : user_,
						doc_title : doc.title,
						raw_content : doc.content,

						doc_thumbnail : doc.thumbnail,
						doc_excerpt: doc.excerpt,
						doc_slug_discret : doc_slug_discret,
						doc_include_js : doc_include_js,
						doc_include_css : doc_include_css 
					});
				} // has doc
				else{
					res.json(err)
				}
			}
		});
	}


	/**
	* @description  single document record
	* @params : slug $get
	* @function 
	* @link 
	* @todo nothing
	*/

	exports.doc_get = function(req, res) {
		var query = Document.findOne({ 'slug':req.params.slug })
		query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {
			if (err){
				res.json(err)
			} 
			else{
				if(doc){



					doc.markups.forEach(function(mk) {
                   	 console.log(mk.status)
            			// userMap[user._id] = user
          
        			})

					
					// test rights
					if(doc.published =='draft'){
								var user_can	= exports.test_owner_or_key(doc,req)
								if(!user_can){
									var message = 'This doc is a draft, are you the document owner ? are you logged in or using secret key ?';
									res.json('err', { title: 'no access', message: message})
									return;
								}
					}
					

					var out 			= {}
					out.doc 			= doc.toObject()
					if(req.user){
						 out.userin 	= req.user.toObject()
					}
					out.is_owner 		= exports.test_owner_or_key(doc,req)
					if(out.is_owner == true){
							
					}
					else{
						out.doc.secret 		= 'api_secret'
					}
					res.json(out)
				}
				else{
					res.json('err')
				}
			}
		})
	}

exports.list = function(req, res) {

	//var status_only = new Object({'published': 'draft'})
	var status_only = new Object();


	var query = Document.find( {}, {'markups':0, 'doc_options':0, 'secret':0});
	


	query.populate('user', '-email -hashed_password -salt -user_options').populate('room').exec(function (err, docs) {

	if (err){
		return handleError(err);
	} 
	else{

		var out = {}
		out.docs_count = docs.length
		out.docs = []
		_.each(docs, function(doc, i){
			out.docs.push(doc)


		});

		res.json(out)
	}


		
	})
};
exports.listRender = function(req, res) {
	var query = Document.find();
	query.exec(function (err, docs) {
		//console.log(docs)
		if (err) return handleError(err);
			docs = JSON.stringify(docs)
			res.render('index', {
				docs: docs
			});
	})
};
exports.doc_sync= function(req, res) {
	//console.log('req.body.markups')
	//console.log(req.body.markups)
	var query = Document.findOne({ 'slug':req.params.slug });
	// complete query 
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {
		if (err){
			res.json(err)
		} 
		else{
			//console.log(req.body.doc_content)
			console.log('doc.markups')
			console.log('#######')
			//console.log(doc.markups)
			console.log('#######################')
			console.log(req.body.markups)
			console.log('#######')
	
			_.each(doc.markups, function(doc_mk, i){
doc.markups[i].touched = false
					//console.log(mk)
					var match = _.find(req.body.markups, function(m){ return m.id  == doc_mk._id; });
					if(match){
						/*
						console.log('original start: '+doc_mk.start)
						console.log('offset start : '+match.offset_start)
						console.log('original end: '+doc_mk.end )
						console.log('offset end : '+parseFloat(match.offset_end))
						//console.log('doc.markups[i] before')
						//console.log(doc.markups[i])
						*/
						
						doc.markups[i].start 	=  parseFloat(doc.markups[i].start) + parseFloat(match.offset_start);
						doc.markups[i].end 		=  parseFloat(doc.markups[i].end)   + parseFloat(match.offset_end);
						doc.markups[i].touched = true
						//console.log('doc.markups[i] after')
						//console.log(doc.markups[i])
						//match.start = mk.start;
						
					}
					else{

						//console.log(chalk.red('doc_sync should not mismatch >>' ) );
						//console.log(doc_mk)
					}
			});


			// save content
				doc.content = req.body.doc_content;

			   var out 			= {}
               if(req.user){
					 out.userin 	= req.user.toObject()
				}
				out.is_owner 		= exports.test_owner_or_key(doc,req)


			doc.save(function(err,docsaved) {
				if (err) {
					res.send(err)
				} 
				else {
					
				  	console.log(chalk.green('doc sync') );
					out.doc 			= doc.toObject()
					out.doc_title 		= doc.title
					out.doc.secret 		= 'api_secret'
					//console.log(out)
					res.json(out)
				}
			});


		}
	});
}


exports.doc_clone = function(req,res){
	// http://stackoverflow.com/questions/18324843/easiest-way-to-copy-clone-a-mongoose-document-instance
	
	var query = Document.findOne({ 'slug':req.params.slug }, { 'secret':0});
	query.populate('user').populate( {path:'markups.user_id', select:'', model:'User'}).populate({path:'markups.doc_id', select:'', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {
		if (err){
			return false;
		} 
		else{

			var right = exports.test_owner_or_key(doc, req)
			if(right){

				var new_doc = doc.toObject();

				// can only have one parent :-) 
				new_doc.clone_of = new_doc._id;

				// avoid cascading clones :-)
				new_doc.clones = []
				// unset at root level '_id'
				new_doc._id = mongoose.Types.ObjectId();
				
				new_doc.slug = req.params.clone_slug;
				new_doc.title = req.params.clone_slug;
				
				new_doc.user = doc.user;
				
				new_doc.isNew = true;
				_.each(doc.markups , function (markup, i){
					// unset '_id' for each
					doc.markups[i]._id = null; 
				});
				var new_ = new Document(new_doc);
				//console.log(new_)
				//.push(new_doc)
				
				// DOUBLE SAVE, CROSSED
				new_.save(function(err,newdoc) {
					if (err) {
			   			res.json(err);
			        } else {

						doc.clones.push(newdoc._id);
						doc.save(function(err,doc) {
							if (err) {
					   			res.json(err)
					        } else {
					        	res.json(newdoc)
					   			          
					        }
				  	    });        
			        }
		  	    });
		  	}
		  	else{
		  		res.json('right error')
		  	}
		}
	});

}

exports.doc_create = function(req,res){

	// to filter a better way
	var raw_title        =     req.body.raw_title;
	var raw_content      =     req.body.raw_content;

	
	if(req.body.published){
		var published      = req.body.published
	}
	else{
		var published      = 'draft'
	}

 	var filtered_title   =     raw_title;
	var filtered_content =     raw_content;
	var slug             =     S(raw_title).slugify().s 

	

	//var ar = new Object({'title':'bloue'+Math.random()})
	var new_doc = new Object({'title':filtered_title, 'slug': slug, 'content': filtered_content, 'published': published })

	 new_doc.markups = new Array()
	 new_doc.doc_options = new Array()

	 var text_size = _.size(raw_content)-1;

	 var markup_section_base  = new Markup( {'user_id':req.user._id, 'username':req.user.username, 'start':0, 'end':text_size,  'type': 'container', 'subtype':'section', 'position':'inline', 'status':'approved'} )
	 new_doc.markups.push(markup_section_base)


	 // var markup_class= new Object( {'user_id':req.user._id, 'username':req.user.username, 'start':0, 'end':10,  'type': 'container_class', 'subtype':'css_class', 'metadata': 'bg_black', 'position':'inline'} )
	 // new_doc.markups.push(markup_class)

	var text_typography  = new meta_options( {'option_name':'text_typography', 'option_value':'Open Sans',  'option_type': 'google_typo' } )
	


	new_doc.doc_options.push(text_typography)
	


	var headings_typography  = new meta_options( {'option_name':'headings_typography', 'option_value':'Open Sans',  'option_type': 'google_typo' } )
	new_doc.doc_options.push(headings_typography)

	
	var   doc_notices_after_title= new meta_options( {'option_name':'doc_notices_after_title', 'option_value':'',  'option_type': '' } )
	new_doc.doc_options.push(doc_notices_after_title)

	var   doc_notices_before_title= new meta_options( {'option_name':'doc_notices_before_title', 'option_value':'',  'option_type': '' } )
	new_doc.doc_options.push(doc_notices_before_title)


	var r = getRandomInt(0, 255);
    var g = getRandomInt(0, 255);
    var b = getRandomInt(0, 255);
    //var rand_color = 'rgb('+r+', '+g+', '+b+')';
    //var rand_color_b = 'rgb('+b+', '+r+', '+g+')';

	var rand_color = '#000'
	var rand_color_b = '#fff'

	var   block_color= new meta_options( {'option_name':'block_color', 'option_value':rand_color,  'option_type': '' } )
	new_doc.doc_options.push(block_color)
	var   title_color= new meta_options( {'option_name':'title_color', 'option_value':rand_color_b,  'option_type': '' } )
	new_doc.doc_options.push(title_color)

/*
	var  share_fragment = new Object( {'option_name':'share_fragment', 'option_value':'right',  'option_type': '' } )
	new_doc.doc_options.push(share_fragment)
	var  use_authorcard = new Object( {'option_name':'use_authorcard', 'option_value':'full_last',  'option_type': 'fragment' } )
	new_doc.doc_options.push(use_authorcard)
*/

	var branding_class  = new meta_options( {'option_name':'branding_class', 'option_value':'sa bg_transparent',  'option_type': '' } )
	new_doc.doc_options.push(branding_class)

	var   footer_center_html = new meta_options( {'option_name':'footer_center_html', 'option_value':"<i class=\'fa fa-file-text-o\'></i> powered by <a href=\'http://github.com/tomplays/MusicBox/\'>MusicBox beta*</a> - 2014 - <a href=\'http://hacktuel.fr\'>@Hacktuel.fr</a>",  'option_type': '' } )
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

        	var email_object = new Object({'subject':'[new document] - ', 'text':'new document created!'})
        	mail.sendmail(email_object)
			//console.log(doc)
			// var doc =  Document.findOne({title: filtered_title}).populate('user', '-salt name username image_url').populate('room').exec(function(err, doc) {
        	res.json(doc)
   			          
        }
    });
}


// delete markups
// create a section

exports.doc_reset  = function(req, res) {
	var query = Document.findOne({ 'slug':req.params.slug });
	query.exec(function (err, doc) {
		if (err){
			res.json(err)
		} 
		else{
				 var markup_section_base  = new Object( {'user_id':req.user._id, 'username':req.user.username, 'start':0, 'end':300,  'type': 'container', 'subtype':'section', 'position':'inline'} )
				 doc.markups.push(markup_section_base)

				 doc.save(function(err,docsaved) {
				if (err) {
					res.send(err)
				} 
				else {
				  	
					res.json(doc)
				}
			});

		}
	});
}	


exports.doc_delete  = function(req, res) {

// TODO : 	// check owner

	var query = Document.findOne({ 'slug':req.params.slug });
	query.populate('user', '-email -hashed_password -salt -user_options').populate('room').exec(function (err, doc) {
		if (err){
			res.json(err)
		} 
		else{
			var right = exports.test_owner_or_key(doc, req)
			if(right){
							doc.remove(function(err) {
			        if (err) {
			            res.jsonp('err deleteing')
			        } else {
			            res.jsonp(doc);
			        }
			    });

			}
			else{
				res.json('doc delete error')
			}
			


		}
	});
}	

exports.doc_edit  = function(req, res) {
	var query = Document.findOne({ '_id':req.params.doc_id });
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {
		if (err){
			res.json(err)
		} 
		else{

			console.log('editing user id :'+ req.user._id +' test doc_user.id'+ doc.user._id)
			//console.log(doc)
			
	        var field = req.body.field
			var value = req.body.value
			console.log('editing doc '+req.params.doc_id +'field '+ field +'<->'+ value)
			// 'create' is a routes keyword..
			if(field == 'title' && value !== 'create' ){
				// and todo : clean

				doc['slug'] = S(value).slugify().s 
				doc[field] = value;
			}

			//if(field == 'content' || field == 'excerpt' || field == 'thumbnail' ){}

			if(field == 'room_id'){

				if(value !==''){
					//doc.room._id = value;
					doc.room = value
					
				}
				else{
					doc.room =undefined;
				}	
				
			}
			if(field == 'user_id'){
				doc.user = value;
			}

			if(field !== 'user_id' && field !== 'room_id' && field !== 'title'){
				doc[field] = value;	
			}
               var out 			= {}
               if(req.user){
					 out.userin 	= req.user.toObject()
				}
				out.is_owner 		= exports.test_owner_or_key(doc,req)


			doc.save(function(err,doc) {
				if (err) {
					res.send(err)
				} 
				else {
					out.doc 			= doc.toObject()
					out.doc.secret 		= 'api_secret'
					console.log(chalk.green('doc saved') );
					res.json(out)
				}
			});
		}
	})
}


exports.doc_option_new  = function(req, res) {
	var query = Document.findOne({ 'slug':req.params.slug });
		query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {


		if (err){
			res.json(err)
		} else{
			    var out 			= {}

				//var field = req.body.field
				//var value = req.body.value
	  				var  new_option = new meta_options( {'option_name':req.body.option_name, 'option_value':'-',  'option_type': '' } )
					if(req.user){
						 out.userin 	= req.user.toObject()
					}
					out.is_owner 		= exports.test_owner_or_key(doc,req)

					if(out.is_owner == true){
						 doc.doc_options.push(new_option)
						 doc.save(function(err,doc) {

						if (err) {
							res.send(err)
						} else {
								console.log(out)
							out.doc 			= doc.toObject()
							out.doc.secret 		= 'api_secret'
							res.json(out)		
						}
				     });		
					}
					else{
						res.json('err')
					}			   
		}
		})
	}


	exports.doc_option_delete  = function(req, res) {
		var query = Document.findOne({ 'slug':req.params.slug });
		query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {


		if (err){
			res.json(err)
		} else{
			    var out 			= {}

				    var del_option_id = req.body._id;
	  				var  new_options = new Array()
	  				var doc_options_deleted = new Array()
	  				_.each(doc.doc_options , function (option, i){
				 	if(del_option_id && option._id ==del_option_id ){
	 					
	 					doc_options_deleted.push(option)
	 				 	console.log(option)
				 	}
				 	else{
				 		new_options.push(option)
				 	}
					})


	  				 
					if(req.user){
						 out.userin 	= req.user.toObject()
					}
					out.is_owner 		= exports.test_owner_or_key(doc,req)

					if(out.is_owner == true){
						    doc.doc_options = new Array()
				    		 doc.doc_options = new_options
							 doc.save(function(err,doc) {

						if (err) {
							res.send(err)
						} else {
						 console.log(out)
							out.doc 			= doc.toObject()
							out.doc.secret 		= 'api_secret'
							res.json(out)		
						}
				     });		
					}
					else{
						res.json('err')
					}			   
		}
		})
	}

	exports.doc_option_edit  = function(req, res) {
		var query = Document.findOne({ 'slug':req.params.slug });
		query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {


		if (err){
			res.json(err)
		} else{
			    var out 			= {}

				var _id = req.body._id
				var value = req.body.value
	  			var doc_options_new = new Array()
				
				 _.each(doc.doc_options , function (option, i){
				 	if(option._id == _id ){
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
				
					if(req.user){
						 out.userin 	= req.user.toObject()
					}


					out.is_owner 		= exports.test_owner_or_key(doc,req)

					if(out.is_owner == true){
							 doc.save(function(err,doc) {
						if (err) {
							res.send(err)
						} else {
								console.log(out)
							out.doc 			= doc.toObject()
							out.doc.secret 		= 'api_secret'
							res.json(out)		
						}
				     });		
					}
					else{
						res.json('err')
					}			   
		}
		})
	}



	// UTILs
	exports.test_owner_or_key = function(doc,req){
		// doc owner or markup owner
		if(req.user){
			if(req.user._id.equals(doc.user._id) ){	
				console.log('user is owner')
				return true;	
			}
			else{

				
				if( (req.body.secret && doc.secret==req.body.secret) || (req.query.secret && doc.secret==req.query.secret) ){
					console.log('secret match')
					return true;
				}
				else{
					console.log('and secret dont match(tell no one: '+doc.secret+'   )')
					var err = new Object({'message':'Need to be either doc owner or use right secret key', 'err_code':'100'})
					return false
				}
			}
		}
		return false;
	}

	function getRandomInt(min, max) {
 		return Math.floor(Math.random() * (max - min + 1)) + min;
	}





 exports.init = function (req, res) {

	var user = new User({'username':'bqsob', 'email':'sfqsqsdfss@sd.fr', 'password':'secret'});
    var message = null;
    user.user_options = new Array();
    
    var r = getRandomInt(0, 255);
    var g = getRandomInt(0, 255);
    var b = getRandomInt(0, 255);
    var rand_color = 'rgb('+r+', '+g+', '+b+')';
    var user_option = new Object( {'option_name':'color', 'option_value': rand_color,  'option_type': '' } )
    user.user_options.push(user_option)
    user.provider = 'local';
    user.save(function(err, user) {


    	req.logIn(user, function(err) {    
            
        });



	var raw_title        =     'homepage';
	var raw_content      =     'hello world';
	

 	var filtered_title   =     raw_title;
	var filtered_content =     raw_content;
	var slug             =     S(raw_title).slugify().s 

	

	//var ar = new Object({'title':'bloue'+Math.random()})
	var new_doc = new Object({'title':filtered_title, 'slug': slug, 'content': filtered_content, 'published':'public' })

	 new_doc.markups = new Array()
	 new_doc.doc_options = new Array()
	

	 var text_size = _.size(raw_content)-1;

	 var markup_section_base  = new Markup( {'user_id':user._id, 'username':user.username, 'start':0, 'end':text_size,  'type': 'container', 'subtype':'section', 'position':'inline'} )
	 new_doc.markups.push(markup_section_base)


	

	var text_typography  = new meta_options( {'option_name':'text_typography', 'option_value':'Open Sans',  'option_type': 'google_typo' } )
	


	new_doc.doc_options.push(text_typography)
	


	var headings_typography  = new meta_options( {'option_name':'headings_typography', 'option_value':'Open Sans',  'option_type': 'google_typo' } )
	new_doc.doc_options.push(headings_typography)

	
	var   doc_notices_after_title= new meta_options( {'option_name':'doc_notices_after_title', 'option_value':'',  'option_type': '' } )
	new_doc.doc_options.push(doc_notices_after_title)

	var   doc_notices_before_title= new meta_options( {'option_name':'doc_notices_before_title', 'option_value':'',  'option_type': '' } )
	new_doc.doc_options.push(doc_notices_before_title)


	var r = getRandomInt(0, 255);
    var g = getRandomInt(0, 255);
    var b = getRandomInt(0, 255);
    //var rand_color = 'rgb('+r+', '+g+', '+b+')';
    //var rand_color_b = 'rgb('+b+', '+r+', '+g+')';

	var rand_color = '#000'
	var rand_color_b = '#fff'

	var   block_color= new meta_options( {'option_name':'block_color', 'option_value':rand_color,  'option_type': '' } )
	new_doc.doc_options.push(block_color)
	var   title_color= new meta_options( {'option_name':'title_color', 'option_value':rand_color_b,  'option_type': '' } )
	new_doc.doc_options.push(title_color)

/*
	var  share_fragment = new Object( {'option_name':'share_fragment', 'option_value':'right',  'option_type': '' } )
	new_doc.doc_options.push(share_fragment)
	var  use_authorcard = new Object( {'option_name':'use_authorcard', 'option_value':'full_last',  'option_type': 'fragment' } )
	new_doc.doc_options.push(use_authorcard)
*/

	var branding_class  = new meta_options( {'option_name':'branding_class', 'option_value':'sa bg_transparent',  'option_type': '' } )
	new_doc.doc_options.push(branding_class)

	var   footer_center_html = new meta_options( {'option_name':'footer_center_html', 'option_value':"<i class=\'fa fa-file-text-o\'></i> powered by <a href=\'http://github.com/tomplays/MusicBox/\'>MusicBox beta*</a> - 2014 - <a href=\'http://hacktuel.fr\'>@Hacktuel.fr</a>",  'option_type': '' } )
	new_doc.doc_options.push(footer_center_html)



	var doc = new Document(new_doc);
	doc.user = user;
   	doc.username =user.username;
		
	//doc.populate('user', 'name username image_url').exec(function(err,doc) {
		doc.save(function(err,doc) {
			if (err) {
	   			res.json(err);
	        } else {
				//console.log(doc)
				// var doc =  Document.findOne({title: filtered_title}).populate('user', '-salt name username image_url').populate('room').exec(function(err, doc) {
	        	res.json(doc)
	   			          
	        }
	    });

    });


}
