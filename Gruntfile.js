"use strict";

module.exports = function(grunt) {
	
	// auto load
	require("load-grunt-tasks")(grunt, {scope: ['devDependencies']});
	
	// timer
	// require("time-grunt")(grunt);

	grunt.initConfig({

		 pkg: grunt.file.readJSON('package.json'),
		// vendor: grunt.file.readJSON(".bowerrc").directory,
		// cfg : grunt.file.readJSON('config.json'),
		
		
		
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: 'client/src',
						dest: 'client/dist',
						src: [
							"css/main.css",
							"css/compiled/*",
							"bower_components/es6-promise/promise.min.js",
							"bower_components/fetch/fetch.js"
						]
					},
					{
						expand: false,
						dot: true,
						dest: 'client/dist/index.html',
						src: "client/src/index.html"
						
					}



				]
			},
		},
		less: {				
				options: {
					 paths: ["client/src/css"],
					 compress: true
				},
				src: {
					 // no need for files, the config below should work
						 expand: true,
						 cwd: "client/src/css",
						 src: "*.less",
						 dest: "client/src/css/compiled",
						 ext: ".css",
				}
		},
		jade: {
			compile: {
					options: {
					 	client: false,
               		 	pretty: true,
						data: {
							debug: false,	
							api_url : 's',
							port: 'p'	
						}
					},
					files: {
				      "client/src/index.html": "client/src/index.jade"
				 	},
			}
		},
		watchify: {
	      client: {
	        src: './client/src/js/mb_.js',
	        dest:'client/dist/js/bundle.js'
	      },
   		},

		watch: {
			
			templates: {
				options: { livereload: true },
				files: ['client/src/index.jade'], // compiling  auto-dedug
				tasks: ['jade', 'copy:dist']			},

			styles: {
				options: { livereload: true },
				files: ['client/src/css/*.less'], // less auto-compilation
				tasks: ['less', 'copy:dist']
			},
			js_client: {
				options: { livereload: true },
				files: ['client/src/js/mb_.js'], // less auto-compilation
			},
			js_lib: {
				options: { livereload: true },
				files: ['src/*.js'], // less auto-compilation
				tasks: ['watchify','copy:dist']
			}


		}

	});
	grunt.registerTask('default', [ 'watchify','watch']); // 'connect:livereload'


};