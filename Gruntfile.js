'use strict';

module.exports = function(grunt) {
	
	// auto load
	require("load-grunt-tasks")(grunt);
	
	// timer
	require("time-grunt")(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		cfg : grunt.file.readJSON('config.json'),

		less: {				
			 options: {
					  paths: ["public/css"],
					  compress: true
				},

				src: {
						// no need for files, the config below should work
						expand: true,
						cwd:    "public/css",
						src:    "**/*.less",
						dest:   "public/css/min",
						ext:    ".css",   
				},     
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
		connect: {
				options: {
					port : "<%= cfg.PORT %>",
					hostname : "<%= cfg.ROOT_URL %>",
					livereload: "35729"
				},
				livereload: {
						options: {
							open: "true",
							base: ["views", "public"]
						}
				},
		},
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
				files: [ {
					expand: true,
					src: "**/*.jade",
					dest: "dist",
					cwd: "views",
					ext: '.html'
				} ]

			 
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
			cwd: "views",
			src: "**/*.jade",
			dest: "dist/template.js",
				options: {
					module: "MusicBox",
				//	usemin: "dist/script/scripts.js" // <~~ This came from the <!-- build:js --> block
				}
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
		watch: {
			js: {
				options: { livereload: true },
				files: ['public/js/**/*.js'], // less auto-compilation
				tasks: ['less']
			},

			styles: {
				options: { livereload: true },
				files: ['public/css/*.less'], // less auto-compilation
				tasks: ['less']
			},
			templates: {
				 options: { livereload: true },
				files: ['views/partials/*.jade'], // compiling  auto-dedug
				tasks: ['jade']
			},
			api_folder:{
				options: { livereload: true },
				files: ['api/**/*.js'], // restart server on controllers, routes and models changes
				tasks: ['forever:server1:restart']

			}
		}
	});
	//grunt.registerTask('dev', ['forever']); // , 'connect:server' // 'forever', 
	grunt.registerTask('lesscss', ['less']); // , 'connect:server' // 'forever', 
	grunt.registerTask('stop', ['forever:server1:stop']); // , 'connect:server' // 'forever', 
	grunt.registerTask('default', [
				'forever:server1:restart','watch', 'less','jasmine', 'connect:livereload'
	]);
	grunt.registerTask('build', [
				'forever:server1:restart',
				'jade',
				'copy:dist',
				'watch',
				 'less',
				'jasmine', 
				'ngtemplates',
				'connect:livereload'
	]);
};