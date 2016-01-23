"use strict";

module.exports = function(grunt) {
	
	// auto load
	require("load-grunt-tasks")(grunt);
	
	// timer
	// require("time-grunt")(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		vendor: grunt.file.readJSON(".bowerrc").directory,
		cfg : grunt.file.readJSON('config.json'),
		
		open: {
     		 path: "<%= cfg.ROOT_URL %>:<%= cfg.PORT %>/init",
     		 app: "Google Chrome"
    	},
		less: {				
				options: {
					 paths: ["public/css"],
					 compress: true
				},
				src: {
					 // no need for files, the config below should work
						 expand: true,
						 cwd: "public/css",
						 src: "*.less",
						 dest: "public/css/compiled",
						 ext: ".css",
				}
		},
		jasmine: {
				test: {
						src: 'public/js/MusicBox/document_v1.js',
						 options: {
								specs: 'tests/spec.js',
								display: 'short',
								summary: true,
								keepRunner: true
						}
				}
		},
		jshint: {
   			 all: ['Gruntfile.js', 'public/js/MusicBox/*.js', 'api/*.js',  'api/**/*.js' ]
  		},
		connect: {
				options: {
					port : "<%= cfg.PORT %>",
					hostname : "<%= cfg.ROOT_URL %>",
					livereload: "35729"
				},
				livereload: {
						options: {
						//	open: 'true',
							base: ["views", "public"]
						}
				},
		},
/*
		minified : {
		  files: {

 						  expand: true,
				          cwd: 'public/c/MusicBox',
				          src: 'user/*.js',
				          dest: 'tmp/zami.js'

		 
		  },
		  options : {
		   // sourcemap: true,
		  
		  }
		},
*/
		jade: {
			compile: {
				options: {
					 	client: false,
               		 	pretty: true,
					data: {
						debug: false,
						root_url: '<%= cfg.ROOT_URL %>',
						lang_js_url : 'js/angular-modules/i18n/angular_fr-fr.js',
						env: 'grunt',
						socket_url : 'undef',
						socket_server_port : '<%= cfg.PORT %>',
						api_url : '<%= cfg.ROOT_URL %>',
						port: '<%= cfg.PORT %>',
						locale: 'fr-fr',
						user_in : 	{						
										username :'grunt'
									}
					}
				},
				files: [ 
				/*{
						expand: true,
						src: "views/*.jade",
						ext: ".tpl.html"
					},
				*/
					{
						expand: true,
						src: "public/js/MusicBox/**/*.jade",
						ext: ".tpl.html"
					}
				
				 ]
				}
		},
		
		forever: {
			server1: {
				options: {
					index: 'index.js'
				}
			}
		},
		// Concat angular templates
		ngtemplates: {
			dist: {
		
			src: "dist/index.html",
			dest: "dist/mbmin.js",
				options: {
					module: "MusicBox",
					usemin: "mbmin.js" // <~~ This came from the <!-- build:js --> block
				}
			}
		},
		/*
		uglify: {
			

			 options: {
			     	beautify: false,
					preserveComments: "some",
					mangle:false
			    },
			    targetA: {


	     
					src: ["public/c/MusicBox/user/*.js"],

				
				
					dest: 'public/js/MusicBox/user/min-user.js'
             			
			     
			    }
		},
		*/
		ngAnnotate: {
		   
		   
			dist: {
				

				files: [{
					expand: true,
					cwd: "public/js",
					src: ["MusicBox/**/*.js"],
					dest: "public/c"
				}]

			}
		},
		concat: {
   			 
   			 js: { 
       			 src: [ 


					    'public/bower_components/angular/angular.js',
						'public/bower_components/angular-resource/angular-resource.js',
						'public/bower_components/angular-route/angular-route.js',
						'public/bower_components/angular-sanitize/angular-sanitize.js',
						'public/bower_components/underscore/underscore.js',
						'public/bower_components/momentjs/moment.js',
						'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
						'public/js/lib/webfont.js',
						'public/bower_components/momentjs/min/moment-with-langs.min.js',
						// 'public/bower_components/momentjs/lang/fr.js',
						'public/c/MusicBox/*.js', 
						'public/c/MusicBox/user/*.js',
						'public/c/MusicBox/document/*.js', 
						'public/c/MusicBox/section/*.js', 
						'public/c/MusicBox/markup/*.js'
				 ],
       			 dest: 'public/js/min/MusicBox-js-min.js'
    		 },
    		 css: { 
       			 src: [ 
					    'public/css/bootstrap.min.css',
					    'public/css/compiled/grid.css',
					    'public/css/compiled/charset.css',
					    'public/css/compiled/custom.css'						
				 ],
       			 dest: 'public/css/min/MusicBox-css-min.css'
    		 }



		},
		useminPrepare: {
			html: "dist/index.html",
				options: {
					staging: "tmp",
					flow: {
						html: {
							steps: {
								js: ["concat", "uglifyjs"],
							//	css: ["cssmin"]
							},
							post: {}
						}
					}
				}
		},
		usemin: {
					html: "dist/index.html",
					css: ["dist/style/{,*/}*.css"],
					js: ["dist/js/{,*/}*.js"],
					options: {
						assetsDirs: ['dist','dist/image']
					}
		},

		// Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
				"dist/script/{,*/}*.js",
				"dist/style/{,*/}*.css",
				"dist/image/{,*/}*.{ico,png,jpg,jpeg,gif,webp,svg}",
				"dist/font/*"
				]
			}
		},





		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'public',
					dest: 'dist',
						src: [
						"img/**",
						"css/min",
						"bower_components/**/*",
						"js/**",
						"data.json"
						]
				}]
			},
		},
		// Generate HTML5 Cache Manifest files
		manifest: {
			options: {
				basePath: "public",
				network: ["*"],
				preferOnline: true,
				verbose: false,
				timestamp: true
			},
			dist: {
				src: ["js/MusicBox/**/*.js"],
				dest: "public/OFFmanifest.appcache"
			}
		},

		// Deployment
		rsync: {
			options: {
				//		args: ["--verbose --max-delete=50"],
				//		include: [],
				//		exclude: [],
				//		src : "dist/",
				//		recursive: true,
				//		ssh: true
					},
			test: {
				options: {
				//	dest: "<%= cfg.rsync.dev.dest %>",
				//	host: "<%= cfg.rsync.dev.host %>",
				//	dryRun: "<%= cfg.rsync.dev.test %>",
				//	delete: "<%= cfg.rsync.dev.delete %>",
				}
			},
			prod: {
				options: {
				//	src : "dist/",
				//	dest: "<%= cfg.rsync.prod.dest %>",
				//	host: "<%= cfg.rsync.prod.host %>",
				//	dryRun: "<%= cfg.rsync.prod.test %>",
				//	delete: "<%= cfg.rsync.prod.delete %>",
				}
			}
		},

		
		watch: {
			jqdsds: {
				options: { /* livereload: true */ },
				files: ['public/jsdssd/**/*.js'], // less auto-compilation
				tasks: ['ngAnnotate:dist','concat:js']
			},

			
			styles: {
				options: { livereload: true },
				files: ['public/css/*.less'], // less auto-compilation
				tasks: ['less']
			},

			
			templates: {
				options: { livereload: true },
				files: ['public/js/MusicBox/**/*.jade','views/*.jade' , 'views/**/*.jade'], // compiling  auto-dedug
				tasks: ['jade']
				// , 'copy:dist'  //  'manifest'
			},
			
			api_folder:{
				options: { livereload: true },
				files: ['api/**/*.js', 'config.json', 'index.js'], // restart server on controllers, routes and models changes
				 tasks: ['forever:server1:restart']

			}
			
		}
	});
	//grunt.registerTask('dev', ['forever']); // , 'connect:server' // 'forever', 
	grunt.registerTask('lesscss', ['less']); // , 'connect:server' // 'forever', 


	grunt.registerTask('stop', ['forever:server1:stop']); // , 'connect:server' // 'forever', 
	grunt.registerTask('default', ['forever:server1:restart','less','watch', 'jade',  'connect:livereload']);
	
	// for production templates
	grunt.registerTask('rebuild', ['jade']); 

	// 'connect:livereload'
	grunt.registerTask('build', [
				'forever:server1:restart',
				'jade',
				'copy:dist',
				'watch',
				'less',

				//'jasmine', 
				//'ngtemplates',
				'connect:livereload'
	]);
	//grunt.registerTask('newsletter', ['']);
	
	grunt.registerTask('minify', [	
		'ngAnnotate:dist',
		'concat:js',
		'concat:css'
	]);

	grunt.registerTask('jshinter', [	
		'jshint:all'
	]);


	

	grunt.registerTask('prod', ['forever:server1:restart']);




	// grunt.registerTask('minify', ['useminPrepare', 'ngtemplates','concat','usemin']);
	grunt.registerTask('initdb', ['open']);
	grunt.registerTask("deploy:test", "Deploy on TEST. server", ["rsync:test"]);
};