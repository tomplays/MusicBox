'use strict';



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
Markup  = mongoose.model('Markup');
var nconf = require('nconf');
nconf.argv().env().file({file:'config.json'});
var chalk = require('chalk');


var app;


var documents = require('./documents')
var mails = require('./mails.js');




exports.edit = function(req, res) {
	console.log(req.body.edittype)
	var edited = new Array();
	
	var exit_user = false;
	var out ={};
	var m_body = req.body; 
	

	if(req.user){
		var req_user_id = req.user.toObject()._id;

		// console.log('req_user_id:::'+req_user_id)
	var query = Document.findOne({ 'slug':req.params.slug });
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -hashed_password -email', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {

	if (err){ 
		return res.json(err)
	}
	else{
		if(req_user_id == doc.user._id || m_body.secret == doc.secret){
				// console.log('user is owner OR secret match')
		}
		 _.each(doc.markups , function (m, i){
			 	// single match.
				if(m._id == req.params.markup_id){
					console.log(req_user_id +' vs: '+ doc.user._id)
					console.log(m.user_id.toObject()._id)
					// doc owner or markup owner


					console.log(req.body)
					

					if(req_user_id.equals(doc.user._id)  || req_user_id.equals(m.user_id._id) ){
						console.log("m.status")


						// APPROVE / LOGIC HERE
						console.log(m.status)
						console.log(m_body.status)

						//if()
						//m.status 	= 'moderated'
						m.status 	= m_body.status ? m_body.status : 'pending'
						// case own
						if(req_user_id.equals(m.user_id._id) ){
							m.status 	= m_body.status
						}
						if(req_user_id.equals(doc.user._id)){
							m.status 	= m_body.status
						}

						
					 	m.start 	= m_body.start ? m_body.start : m.start
					 	m.end 		= m_body.end ? m_body.end : m.end
					 	m.type 		= m_body.type ? m_body.type : m.type
					 	m.subtype 	= m_body.subtype ? m_body.subtype : m.subtype
					 	m.position	= m_body.position ? m_body.position: m.position
						m.metadata 	= m_body.metadata ? m_body.metadata : m.metadata
												m._id 	=  m._id

						m.depth     = m_body.depth ? m_body.depth : m.depth 

						if(m_body.doc_id){
							console.log('DOC sub _id: '+m_body.doc_id)
						
							var memo_doc = m.doc_id;
							
								console.log('CA')

							if(m.doc_id !=='' && m.doc_id && m.doc_id._id){
								m.doc_id._id = m_body.doc_id;

								console.log('CB')
							}
							else{
								if( m_body.doc_id !== ''){
										m.doc_id = m_body.doc_id;

									console.log('CC')
								}
								else{
									m.doc_id = '';
								}
								
							}
							
						

						}
						else{
							m.doc_id = null;
								console.log(' doc_id set to null')
						}

						 // arrays updated  
						 edited.push(m)
						 doc.markups[i] = m
						console.log('C0')

					}
					else{
							console.log('user is not markup owner')
							if(m_body.secret == doc.secret){
								console.log('but secret match')
							}
							else{
								console.log('and secret dont match(   '+doc.secret+'   )')
								var err = new Object ({'err_code':'Need to be either doc owner or use right secret key' })

								exit_user = true;
								
								
							}
						}
	

				} // matching ID end if


			});	// each
			



			if(exit_user === true){
					var err = new Object ({'err_code':'Need to be either doc owner or use right secret key' })

					out.err = err;	
					res.json(out)
					return;
			}
			else{

						// save 
					doc.save(function(err,doc) {
							if (err) {
								res.send(err)
							} 
							else {
							
								if(req.user){
									out.userin 	= req.user.toObject();
								}
								out.is_owner 		= documents.test_owner_or_key(doc,req);
								out.doc = doc
								out.edited = [];
								out.edited.push(edited)
								console.log(edited)
								res.json(out)
							}
					}); // save

			}


			
		} //  has record

		
	}) // query


	} // not logged
	else{

		var err = new Object ({'err_code':'Need to be either doc owner or use right secret key' })
		out.err = err;	
		res.json(out)
		
	}
	

} // function 



/*

Create a markup 

use $Get slug as doc query
use $Post markup to setup
return json ( doc, owner, inserted)

*/
exports.create = function(req, res) {
	

	var out = {}
//bug ?
	var req_user_id = req.user._id;
	console.log(req_user_id)

	var query = Document.findOne({ 'slug':req.params.slug });
	// console.log(req.body)
	// console.log(req.body.username)
	//query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {

	if (err) {
		res.json(err)
	}
	else{
		// set as pending if not doc_owner 
		var markup_status 	= 'pending'
		
		out.is_owner 		=  documents.test_owner_or_key(doc,req)	
		if(out.is_owner == true){
			markup_status 	= 'approved';
		}
		else{
			var email_object = new Object({'subject':'[New comment on document] - ', 'bodytext':'<p>Somebody just left a comment on a document you own.</p><p>by:<em>'+req.body.username+'</em></p><blockquote>'+req.body.metadata+'</blockquote> <p>You can set it as approved (and visible to anyone) <a href="'+nconf.get('ROOT_URL')+':'+nconf.get('PORT')+'/doc/'+req.params.slug+'">here</a></p>'})
        	mails.sendmailer(email_object)

		}

		var markup = new Markup( { 'username':req.body.username, 'user_id': req_user_id, 'position': req.body.position, 'start':req.body.start, 'end':req.body.end, 'subtype': req.body.subtype, 'type': req.body.type, 'status': markup_status, 'metadata': req.body.metadata, 'depth': req.body.depth} )
		markup.isNew; // true

		//markup = markup.toObject();
		doc.markups.push(markup)
		
		doc.markModified('markups');
		
		var inserted = _.last(doc.markups);
		

		doc.save(function(err,doc) {
			if (err) {
				res.json(err)
			} else {
				var query = Document.findOne({ 'slug':req.params.slug });
					// console.log(req.body)
					// console.log(req.body.username)
					//query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {
					query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {
					if (err) {
						res.json(err)
					}
					else{
			        	out.doc 			=  doc.toObject()
						if(req.user){
							out.userin 		= req.user.toObject()
						}
						out.is_owner 		=  documents.test_owner_or_key(doc,req)	
						out.doc.secret 		= 'api_secret';
						out.inserted = new Array(inserted);
						res.json(out);
					}
				});
			}
		});
	  }
	});
}



/* 

markup_delete 




use $Get slug as doc query
use $Get id or all

endpoints : 

	api/v1/doc/:doc_id_or_title/markup/delete/:markup_id
  and 
 	api/v1/doc/:doc_id_or_title/markup/delete/all

return json ( doc, owner, deleted)

*/
exports.delete = function(req, res) {
	console.log(req.body.edittype)
	var deleted= new Array();
	var has_error = false;
	var query = Document.findOne({ 'slug':req.params.slug });
    // complete query 
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {
	
	  if(err) {
	  	res.send(err)
	  }
	  else{

		if(req.user.id == doc.user._id){
			console.log('match')
		}
		var is_owner 		=  documents.test_owner_or_key(doc,req)	

		
			//has_error = true;
			
				
		//}

	  	if(req.params.markup_id && req.params.markup_id == 'all'){
			var deleted = doc.markups
			doc.markups = []

		}

		else{
			var deleted= [];
			var after_markups =[];
		 	_.each(doc.markups , function (m, i){
				if(m._id == req.params.markup_id){
					// console.log(m)
					deleted.push(m)
				}
				else{
					after_markups.push(m)
				}
			});

			doc.markups = after_markups;
	
		}


		if(is_owner){
			console.log('is owner or has key')
			doc.save(function(err,doc) {
				if (err) {
				  res.send(err)
				} 
		        else {

		        	var out = {}
		        	out.doc 			= doc.toObject()
					if(req.user){
						out.userin 		= req.user.toObject()
					}
					out.is_owner 		=  documents.test_owner_or_key(doc,req)	
					out.doc.secret 		= 'api_secret'
					out.deleted         =  new Array(deleted);

					res.json(out)
				}
			});
		}
		else{
			console.log('is owner')
			var out = {}
			out.err = 'is not auhtorized'
			res.json(out)
		}
		

	  }
	});
}


