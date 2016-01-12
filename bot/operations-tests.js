 
var io = require('socket.io-client');
var request = require('request');
var _ = require("underscore");

var nconf = require('nconf');
//var Xray = require('x-ray');
//var x = Xray();

nconf.argv().env().file({file:'../config.json'});


var server_url = nconf.get('ROOT_URL')+':'+nconf.get('PORT')
console.log('connecting to :'+server_url)
var socket = io.connect(server_url); 

var sh = require('sh');



var slug = 'draft-03073258369695395'

function runner(socket){


// https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard
 /*
x('http://motherboard.vice.com/en_us', 'body', [{

rrr: 'h3 a',
 items: x('article', [{
  //  title: 'h3 a',
       hr: 'h3 a@href'

  }]),
     title: '.firstHeading',
    footer: '#mw-content-text img@src',
}])


 // .paginate('.next_page@href')
 // .limit(3)
 (function(err, r) {
  console.log(r) 

  _.each(r[0].items, function(i){
  	console.log(i.hr.replace('http://motherboard.vice.com/read/', '').replace(/-/g, ' '))
  }) 
  // sh('open '+r[0].footer) 
  // Google 
})

*/




	var content_push_value =  new Date()

	var mapObj = [
					{
					   'word':'2015',
					   'metadata':'analysis whoot',
					   'type': 'datavalue',
						'subtype': 'x',
						'position':'under'
					 
					}
					,
					{
					   'word':'h',
					   'metadata':'-',
					   'type': 'markup',
						'subtype': 'h1',
						'position':'inline'
					 
					}/*,
					{
					   'word':' one ',
					   'metadata':'1',
					   'type': 'datavalue',
						'subtype': 'x',
						'position':'under'
					 
					}
					,{
					   'word':' two ',
					   'metadata':'2',
					   'type': 'datavalue',
					   'subtype': 'x',
					   'position':'under'
					 
					}
					*/
];

	

		var actions_array = []
		request(server_url+'/api/v1/doc/'+slug, function(errorz, dd, res) {
			console.log('got doc :'+slug)
				// console.log(res.doc)
				resp = JSON.parse(res)
			//	console.log(resp.doc.content)
				var tstring = resp.doc.content;
socket.emit('postdata', 
												{ 
													time			: new Date(),
													object			: 'document',
													identifier		: slug,
													secret			: '5618a3b0be8398be16781a13',
													user: { 
															username:'tom', 
															user_id: '560facdd5c9adcd3187a7bae',
															secret	: '560facdd5c9adcd3187a7bad',
													},
													actions : 
																[{
																	type:'markup_push',
																		markup: {
																			type: 'markup',
																			subtype: 'em',
																			start:3,
																			end:8,
																			position:'inline',
																			metadata: ''
																		}
																	}]
															
												}
						);




/*

socket.emit('postdata', 
												{ 
													time			: new Date(),
													object			: 'document',
													identifier		: slug,
													secret			: '5618a3b0be8398be16781a13',
													user: { 
															username:'tom', 
															user_id: '560facdd5c9adcd3187a7bae',
															secret	: '560facdd5c9adcd3187a7bad',
													},
													actions : 
																[{
																	type:'content_push',
																	
																			start:0,
																			end:23,
																			value: content_push_value
																		
																	}]
															
												}
						);


				
*/


				_.each(mapObj, function(obs){

						console.log(obs.word+' > '+obs.metadata)
						var word = obs.word
					var reg = new RegExp(word, "gi");


					var count = 0
					tstring = tstring.replace(reg, function(matched){
						count++
						return word+'---'+count;
					});



					for (i = 1; i <= count; i++) { 
				 		var str_in = word
				 		var str1 = str_in+"---"+i
				 		var sized_in = str_in.length

				 		var sized = str1.length
				 		console.log('sized:'+sized)

						var re = new RegExp(str1, "i");
					//	console.log(re)

				 	    var n =  tstring.search(re);
						console.log(n)


/*
						socket.emit('postdata', 
												{ 
													time			: new Date(),
													object			: 'document',
													identifier		: slug,
													secret			: '5618a3b0be8398be16781a13',
													user: { 
															username:'tom', 
															user_id: '560facdd5c9adcd3187a7bae',
															secret	: '560facdd5c9adcd3187a7bad',
													},
													actions : 
																[{
																	type:'markup_push',
																		markup: {
																			type: obs.type,
																			subtype: obs.subtype,
																			start:n,
																			end:n+sized_in-1,
																			position:obs.position,
																			metadata: obs.metadata
																		}
																	}]
															
												}
						);


*/
						tstring = tstring.replace(str1, function(){
								return word;
						});
					}
					//console.log(tstring)
				}) // each words
 			//	process.exit();
		}) // request

}


socket.on('connect', function () { 
	console.log('connected')
		runner(socket);
});


