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




exports.markup_edit = function(req, res) {
	var edited = new Array();

	var m_body = req.body; 
	//console.log(req.body)
	var req_user_id = req.user.toObject()._id;
	// console.log('req_user_id:::'+req_user_id)
	var query = Document.findOne({ 'slug':req.params.slug });
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {

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
					if(req_user_id.equals(doc.user._id)  || req_user_id.equals(m.user_id._id) ){}
						else{
							console.log('user is not markup owner')
							if(m_body.secret == doc.secret){
								console.log('but secret match')
							}
							else{
								console.log('and secret dont match(   '+doc.secret+'   )')
								var err = new Object({'message':'Need to be either doc owner or use right secret key', 'err_code':'100'})
								res.json(err)
								return;
							}
						}
						
						//	console.log(m)
						
					 	m.start 	= m_body.start
					 	m.end 		= m_body.end
					 	m.type 		= m_body.type
					 	m.subtype 	= m_body.subtype
					 	m.position	= m_body.position
						m.metadata 	= m_body.metadata
						m.status 	= m_body.status
						m.depth     = m_body.depth
						
								console.log('C0')



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



				} // matching ID end if


			});	// each
			
			// save 
			doc.save(function(err,doc) {
					if (err) {
						res.send(err)
					} 
					else {
						var out ={};
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
		} //  has record
		
	}) // query
} // function 



/*

Create a markup 

use $Get slug as doc query
use $Post markup to setup
return json ( doc, owner, inserted)

*/
exports.markup_create = function(req, res) {
	var query = Document.findOne({ 'slug':req.params.slug });
	// console.log(req.body)
	// console.log(req.body.username)
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {
	if (err) {
		res.json(err)
	}
	else{
		var markup  = new Object( {'user_id': req.body.user_id , 'username': req.body.username, 'position': req.body.position, 'start':req.body.start, 'end':req.body.end, 'subtype': req.body.subtype, 'type': req.body.type, 'status': req.body.status, 'metadata': req.body.metadata, 'depth': req.body.depth} )
		//console.log(doc.markups)
		doc.markups.push(markup)
		//console.log('doc.markups after')
		//console.log(doc.markups)
		var inserted = _.last(doc.markups);
		// console.log(inserted)
		doc.save(function(err,doc) {
			if (err) {
				res.json(err)
			} else {
				

				var out = {}
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
exports.markup_delete = function(req, res) {
	//console.log(req.params.doc_id_or_title)
	var deleted= new Array();
	var query = Document.findOne({ 'slug':req.params.slug });
	
    // complete query 
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {
	
	  if(err) {
	  	res.send(err)
	  }
	  else{
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
	});
}

exports.markup_offset= function(req, res) {

	res.json('refactoring')
	


	
	console.log(req.params)
	console.log(req.body)
	//res.send('ok')
	var query = Document.findOne({ 'slug':req.params.slug });
		query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room').exec(function (err, doc) {

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

	res.json('refactoring')

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
