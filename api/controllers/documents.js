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
var mails = require('./mails.js');


 	exports.doc_create_view= function(req, res) {
		
		if(req.user){
	 		var user_	= req.user.toObject()

			res.render('index', {
				user : user_,
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

 		var debugger_on = 'false' /// fix database for broken meta_options.

		var user_ = ''
		if(req.user){
			 user_ = {'_id': req.user._id , 'username': req.user.username,  'image_url': req.user.image_url}
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
												/* console.log(new_doc_options)
												doc.doc_options = new_doc_options;

												doc.save(function(err,docsaved) {
												if (err) {
													
												} 
												else {
												  	// console.log(chalk.green('doc saved') );
												  }
												});
						*/
						}
					


					console.log('public doc rendered')	
					res.render('index', {
						user : user_,
						doc_title : doc.title,
						raw_content : doc.content,
						is_view : 'document',
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


exports.prerender = function(doc) {
	// console.log('Mb server side loop')
	var output = {}
	var trace = {}

	trace.sections = []
	trace.segments = []
	trace.segments_flattten = '';
	var tempsegement_start;
	var tempsegement_start_at;
	var newsegment;

	var tempsegement_content= '';
	var tempsegement_content_single = '';

	
	var layout_zones = ['wide','slidewide','left','center', 'inline', 'right', 'under', 'global']

		

    var segments = []
	// opening wrapping all div

	var compiled_full = '<div>'
	
	// output.prerendered 	= true



	var sections =   _.filter(doc.markups, function(td){ return  td.type == 'container'; });
	sections.forEach(function(s,si) {
	//	output.sections.push(s)
		trace.sections[si] = {index: si, start:s.start, end:s.end, segments: new Array('') }
	})




	var local_count = 0
	_.each(sections, function(s,si) {

		
		//console.log(segments)
		var s_text = '';
		var c_text = '';
		var s_letters = []
		var s_objects = []

		layout_zones.forEach(function (key) {
			s_objects[key] = []
		})
		
		

		s_objects.inline = []
		s.segments = ['jk']


		//console.log('</section><section>')


		var compiled = ''

		
		for (var pos= s.start; pos<=s.end; pos++){ 

			var s_letter = {'letter': doc.content[pos]}
			s_letter.position = {'absolute': pos, relative: pos - s.start, local:local_count}

			local_count++;
			s_letters.push(s_letter)
			s_text += doc.content[pos]
			//console.log('zou-'+doc.content[pos])
		}


		trace.sections[si].text = s_text
		trace.sections[si].letters = s_letters
	//	console.log(doc.markups._id)
		

		var s_markups = _.filter(doc.markups,function (m) {
			 return m.type !== 'container' && m.start >= s.start && m.end <= s.end;
		});



		// var o_markups = []

		// inject type


		_.each(s_markups,function(m) {
				var offstart =  m.start - s.start
				var offend =  m.end - s.start

				// section_class++
				
				
			    var mkin = {'position':m.position, 'type':m.type,'subtype':m.subtype, 'metadata':m.metadata}
				var p = m.position
				if(s_objects[p]){
					s_objects[p].push(mkin)
				}
			    

			    //console.log(m._id);


				for (var pos_mk = offstart; pos_mk<=offend; pos_mk++){
					if(!s_letters[pos_mk].oo){
						s_letters[pos_mk].oo = []
					}

					var mkin = {'type':m.type, 'subtype':m.subtype, 'm_id' : m._id} 
					//console.log(m)


					s_letters[pos_mk].oo.push(mkin)
				}
		})


		var compiled_inline = '';
		
		
		var mx_length = 0


		_.each(s_letters, function(l,i) {
		

				
					//console.log(i)
			



					/// var segment = new Object({size:0, content: '', opening:'', closing:''})

	    			
	    			var next_class = []
	    			var prev_class = []
	    			var current_class = [];

	    			var is_first = (i == 0) ? true : false
	    			var is_last  = (i == s_letters.length-1) ? true : false

					l.is_first = is_first
					l.is_last = is_last

					l.classes = { ids:new Array(),'current': new Array(),'current_flat': 'lt ', 'next': new Array(), 'prev': new Array()}
					l.classes.current_ = {ids:new Array(), classes :new Array(), flat:'lt '}
					l.segment = {'opening': null, 'closing': null}

	    			//l.position.relative=i
					//_____________________________________________________________
	    			/*
						three pass loop to inject "current, next and previous" classes object
	    			*/
					//  i+ -1 (prev) i+ 0 (current) i+1 (next)
					var class_arr;
					for (class_arr = 0; class_arr<=2; class_arr++){
						var fix_index = class_arr-1;
						var class_arr_index = i+fix_index
						// console.log('fix_index'+fix_index)
						//console.log(class_arr_index)
						if( s_letters[class_arr_index] && s_letters[class_arr_index].oo && s_letters[class_arr_index].oo.length > 0 ){
						 	
						 	var  sl = s_letters[class_arr_index].oo

							 sl.forEach(function(c){
							 	var class_string = c.type+'_'+c.subtype


							 	
							 	

							 	if(fix_index == -1){
							 		prev_class.push(class_string);
									l.classes.prev.push(class_string);
							 			// todo
							 	}
							 	if(fix_index == 1){
							 		next_class.push(class_string);
									l.classes.next.push(class_string);
							 		
							 	}
							 	else if(fix_index == 0){
							 		current_class.push(c.type+'_'+c.subtype);
									l.classes.current.push(c.type+'_'+c.subtype);
									l.classes.ids.push(c.m_id)
							 		// todo
							 		
							 	}

							})

							if(fix_index == 0){
								// todo : rename as {l.classes.current_flat (string) }
								var classes_flat  = 'lt '
								 _.each(l.classes.current, function(c,ci){
									classes_flat += c+' ';
									l.classes.current_flat += c+' ';
								})
							}


						}

					}
					//_____________________________________________________________


					/*

					if(l.oo && (l.oo.length > 0 ) ){
						l.oo.forEach(function(c){
							
						})


						// todo : rename as {l.classes.current_flat (string) }
						var classes_flat  = 'lt '
						
						 _.each(l.classes.current, function(c,ci){
							classes_flat += c+' ';
							l.classes.current_flat += c+' ';
						})


					}

					
				
					if( s_letters[i+1] && s_letters[i+1].oo && s_letters[i+1].oo.length > 0 ){
						// next = true;
						 var sl = s_letters[i+1].oo
						 sl.forEach(function(c){
							//next_class.push(c.type+'_'+c.subtype);
							//l.classes.next.push(c.type+'_'+c.subtype);
						}) 
					}
					
					
					if(s_letters[i-1] && s_letters[i-1].oo && s_letters[i-1].oo.length > 0 ){
						// prev = true
						 var sl = s_letters[i-1].oo
						 sl.forEach(function(c){
							
						})
						
					}

				 _.each(prev_class, function(c,ci){
							//classes_flat += c+' ';
						})
						   _.each(next_class, function(c,ci){
							//classes_flat += c+' ';
						})

					*/





					tempsegement_content_single +="<span class='"+classes_flat+"'>"+l.letter+"</span>"





					
					if(current_class.length>0){
						// current letter has at least one class
						
						if( _.isEqual(prev_class,current_class))  {
							compiled_inline +=  l.letter
							tempsegement_content +=l.letter


							
							

						}
						else{
							//classes_flat =''; // debug
							

							

							tempsegement_start= "<span class='"+classes_flat+"'>"
							tempsegement_content +=l.letter
							tempsegement_start_at= i

							compiled_inline += "<span class='"+classes_flat+"'>"
							compiled_inline +=  l.letter

						//	var segment = new Object({size:0, content: l.letter, closing:'' ,opening : "<span class='hc ci--"+i+"  "+classes_flat+"'>"})

							
						
						
							

							l.segment.opening=true;
							
							
						}
						if(next_class.length>0 && _.isEqual(next_class , current_class) ) {
									///??? 	//	compiled_inline +=  l.letter
										//	????? tempsegement_content +=l.letter
						
						}
						else{
							// content_length_reach=0;
							compiled_inline += '</span>'
							l.segment.closing=true;
							
						

						

						}
					}
					else{
						
						// current letter has no class

						if(prev_class.length>0 || i==0 ){
							// prev was a self closing letter or first letter then open span

							compiled_inline +="<span class='lt'>"
							l.segment.opening=true;


							tempsegement_start= "<span class='"+classes_flat+"'>"
							tempsegement_start_at= i

							//var segment = {size:0, content: '---', closing:'' ,opening : "<span>"}

							
						}
						
						compiled_inline += l.letter
						tempsegement_content +=l.letter
						
						if(next_class.length>0 || is_last == true ){
										
							// next is a letter with classes or is last letter then close span
							compiled_inline +='</span>'
							l.segment.closing=true;
						}
					}	

					l.classes.ids= _.uniq(l.classes.ids) 

					// "finally" if the letter is a "closing segment" letter
					if(l.segment.closing === true){
						    newsegment = {
						    	start_at:tempsegement_start_at,
						    	classes: l.classes.current, 
						    	class_size:l.classes.ids.length,
						    	ids: l.classes.ids, 
						    	content_single : tempsegement_content_single, 
						    	end_at:i,content:tempsegement_content,
						    	chars_length : (i - tempsegement_start_at + 1)
						    }

							newsegment.flatten =  tempsegement_start+tempsegement_content+'</span>';

							// add to output
							segments.push(newsegment)
							trace.sections[si].segments.push(newsegment)

							// reset content string
							tempsegement_content =''
							tempsegement_content_single =''
					}
 					// c_text +="<span class='is_last-"+is_last+" is_first-"+is_first+" "+classes_flat+" count-"+i+" has_prev-"+prev_class+" has_next-"+next_class+"'>"+l.letter+"</span>"

		})

		//console.log(segments)
		
		trace.segments = segments
		trace.segments_count = _.size(segments)

		// without layout (experimental)
		segments.forEach(function (seg) {
			trace.segments_flattten += seg.flatten
		});

		s.segments = new Array(segments);

		

		// SUB
		// var sectionLayout = exports.tolayout()
		// console.log(sectionLayout )

		
		//  compile each layout side
		var compiled_sides = ''


		// var layout_zones = ['inline']
	

		layout_zones.forEach(function (key) {

			var compiled_side = ''
			var compiled_side_inside = ''
			var compiled_side_class = ''


			 // add title in center zone if first section 
             if(key=='center' && si===0){
             		compiled_side_inside += "<h1>"+doc.title+"</h1>"
             }

             // adds global for last section
             if(key=='global' && si== sections.length-1 ){

             		if(!s_objects[key]){
             			   //compiled_side_inside += "<h2></h2>"
             		}
					else{
						 compiled_side_inside += "<h2>Global</h2>"
					}
             }

             if(key=='inline'){
             		compiled_side_inside += compiled_inline
             }
            
		  	if(s_objects[key] && s_objects[key].length > 0 && key !=='inline'){
		  			compiled_side_class += ' is_empty-false ' 
		  		    
					var ooo = s_objects[key];
					ooo.forEach(function(o,ioo){
						
					compiled_side_inside += "<div class='markup_box markup_box--"+o.type+" markup_index--"+ioo+"'>"
					

					if(o.type=="media"){
						compiled_side_inside += "<span><img src='"+o.metadata+"' /></span>"

					}
					else{
						compiled_side_inside += "<span>"+o.metadata+"</span>"
					}


					compiled_side_inside += "</div>"
		
					
				})
			}
			else{
				if(key =='inline'){
					compiled_side_class += 'is_empty-false' 
				}
				else if(key=='center' && si===0){
             	
					compiled_side_class += 'is_empty-false' 
            	 }
				else{
					compiled_side_class += 'is_empty-true' 
				}
				
			}


			compiled_side += "<div class='side_"+key+" "+compiled_side_class+"'>"+compiled_side_inside+"</div>"



			// each side string
			compiled_sides += compiled_side
		});


		// wrap layout in section 
		compiled += "<section class='section-index--"+si+"'>"
		compiled += compiled_sides
		compiled += '</section>'





		
		// 'pretext':s_text, 'letters': s_letters, 'mk': o_markups, 'c_text': c_text, 'objects':s_objects, 
		//var out_s = {'compiled': compiled}
		//output.sections.push(out_s)
		compiled_full += compiled

	})
	compiled_full +='</div>'
	   //var o = new Object({'subject':'doc titlz - newsletter', 'bodytext': output.compiled_full})
	   // mails.sendmailer(o)
	


	 output.compiled_full_array = trace



	output.sections___ = trace.sections;
	output.compiled_full = compiled_full;

	return output

}

	/**
	* @description  single document record
	* @params : slug $get
	* @function 
	* @link 
	* @todo nothing
	*/


	exports.doc_get = function(req, res) {
			console.log(req.query.secret)
		var query = Document.findOne({ 'slug':req.params.slug })
		query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password -secret', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {
			if (err){
				res.json(err)
			} 
			else{
				if(doc){
					var out 			= {}

					
				
					doc = doc.toObject()
					out.doc_owner = false;
					out.doc_owner 	= exports.test_owner_or_key(doc,req)

					doc.doc_owner 	= exports.test_owner_or_key(doc,req)
				
					if(req.user){
						 out.user	= req.user.toObject()
					}
				
					out.doc = doc

					if(doc.doc_owner !== true){
							out.doc.secret 		= 'api_secret'
							if(doc.published =='draft'){	
									var message = 'This doc is a draft, are you the document owner ? are you logged in or using secret key ?';
									res.json('err', { title: 'no access', message: message})
									return;
							}

					}
					// test rights

					out.modeapi			= req.params.output

					//if(req.params.output && req.params.output=='segments'){
					//	out.doc.markups = []
					//	out.doc.doc_options=  []
					//	//out.doc = []
					//	out.userin ={}
					//	var outobjects = exports.prerender(doc);
					//	out.doc.segments = outobjects.compiled_full_array.segments;

					//}
                  //  out = _.extend(out, exports.prerender(doc)); 
					out.doc.sections 	= []
					out.doc.markups_ 	= []

					
					

					doc.markups.forEach(function(mk) {
                   		
            			if(mk.type == 'container'){
            				out.doc.sections.push(mk)


            			}
            			else{
            				out.doc.markups_.push(mk)
            			}



});
			



					//	out.doc.compiled_full = outobjects.compiled_full_array.compiled_full
					//out.doc.compiled_full_array = out.compiled_full_array
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
	// console.log(req.params.slug)
	var query = Document.findOne({ 'slug':req.params.slug });
	// complete query 
	query.populate('user','-email -hashed_password -salt').populate( {path:'markups.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'markups.doc_id', select:'-markups -secret', model:'Document'}).populate('markups.doc_id.user').populate('room', {secret:0}).exec(function (err, doc) {
		if (err){
			res.json(err)
		} 
		else{


			console.log('doc_sync')
			var sections = []
			console.log(req.body.edittype)
			//console.log(req.body.doc_content)
			//console.log('doc.markups')
			//console.log('#######')
			//console.log(doc.markups)
			//console.log('#######################')
			//console.log(req.body.markups)
			//console.log('#######')
			var markup_count_updated = 0
			// LOOP each editing doc markups to find and upadate coresponding one 
			_.each(doc.markups, function(doc_mk, i){
					doc.markups[i].touched = false
					//console.log(mk)
					var match = _.find(req.body.markups, function(m){ return m.id  == doc_mk._id; });
					if(match){
						doc.markups[i].start 	=  parseInt(match.start)
						doc.markups[i].end 		=  parseInt(match.end)
						doc.markups[i].touched = true
						markup_count_updated++
					//	console.log('match found:')
					//	console.log(doc.markups[i])

					
					}
					else{

						//console.log(chalk.red('doc_sync should not mismatch >>' ) );
						//console.log(doc_mk)
					}

				
            		if(doc_mk.type == 'container'){
            			sections.push(doc_mk)
            		}
            		
			});

			var content_size_pre = doc.content.length
			var content_size_after =  req.body.doc_content.length


				doc.content = req.body.doc_content;
				console.log('doc content updated from '+content_size_pre+' to'+content_size_after)
				console.log('delta'+(content_size_after-content_size_pre))



				// +req.body.doc_content)

				console.log('modified markups='+markup_count_updated)

				doc.markModified('markups');
				// save content
				

			   var out 			= {}
               

               if(req.user){
					 out.user 	= req.user.toObject()
				}
				out.is_owner 		= exports.test_owner_or_key(doc,req)
					


					console.log(chalk.green('doc sync') );
				  		//console.log(doc.markup );
				


					//doc.sections = []
					//_.each(doc.markups, function(doc_mk, i){})


					out.doc_title 		= doc.title
					doc.updated 		= new Date()


						doc.save(function(errors, doc) {
									out.doc 			= doc.toObject()
									var now = new Date();    
									out.doc.secret 		= 'api_secret'
									out.edittype 		= req.body.edittype
									res.json(out)
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
	//var raw_content      =     req.body.raw_content;
	//var raw_content      = 'The quick brown fox jumps over the lazy dog.'
		var raw_content      = 'Your Text'

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
	var new_doc = new Document({'title':filtered_title, 'slug': slug, 'content': filtered_content, 'published': published })

	 new_doc.markups = new Array()
	 new_doc.doc_options = new Array()

	 var text_size = _.size(raw_content)-1;



	 var markup_section_base  = new Markup( {'user_id':req.user._id, 'username':req.user.username, 'start':0, 'end':text_size,  'type': 'container', 'subtype':'section', 'position':'inline', 'status':'approved'} )
	 new_doc.markups.push(markup_section_base)
	/*

		  var markup_section_two  = new Markup( {'user_id':req.user._id, 'username':req.user.username, 'start':19, 'end':43,  'type': 'container', 'subtype':'section', 'position':'inline'} )
		  new_doc.markups.push(markup_section_two)


		   var markup_one  = new Markup( {'user_id':req.user._id, 'username':req.user.username, 'start':4, 'end':8,  'type': 'markup', 'subtype':'h1', 'position':'inline'} )
		  new_doc.markups.push(markup_one)

	*/

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

	var   footer_center_html = new meta_options( {'option_name':'footer_center_html', 'option_value':"<i class=\'fa fa-file-text-o\'></i> powered by <a href=\'http://musicbox.mx/\'>MusicBox</a> - 2015",  'option_type': '' } )
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
		



	}
	//doc.populate('user', 'name username image_url').exec(function(err,doc) {
	doc.save(function(err,doc) {
		if (err) {
   			res.json(err);
        } else {

        	var email_object = new Object({'subject':'[new document] - ', 'bodytext':'new document created!'})
        	mails.sendmailer(email_object)
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
					 out.user 	= req.user.toObject()
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
						 out.user 	= req.user.toObject()
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
						 out.user	= req.user.toObject()
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
						 out.user 	= req.user.toObject()
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
		//console.log(req)
		if(req.user){
			if(req.user._id.equals(doc.user._id) ){	
			//	console.log('user is owner')
				return true;	
			}
			else{

				
				if( (req.body.secret && doc.secret==req.body.secret) || (req.query.secret && doc.secret==req.query.secret) ){
				//	console.log('secret match')
					return true;
				}
				else{
			//		console.log('and secret dont match(tell no one: '+doc.secret+'   )')
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

	var user = new User({'username':'bob', 'email':'homeof@gmail.com', 'password':'secret'});
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

	var   footer_center_html = new meta_options( {'option_name':'footer_center_html', 'option_value':"<i class=\'fa fa-file-text-o\'></i> powered by <a href=\'http://github.com/tomplays/MusicBox/\'>MusicBox beta*</a> - 2016",  'option_type': '' } )
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
