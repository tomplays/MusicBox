'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
     pkg: grunt.file.readJSON('package.json'),
    less: {


         dev: {


        }, 


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
      server: {
        options: {
          hostname: '',
          port: 8800
        }
      }
    },
    jade: {
      compile: {
        options: {
          data: {
            debug: false,
            root_url: 'http://localhost',
            lang_js_url : '/hello.js',
            env: 'prod'
          }
        },
       

       files: {
            // no need for files, the config below should work
           "tests/partials/*.html" : "views/partials/*.jade",
        }  
      }
    },
    forever: {
      server1: {
        options: {
          index: 'index.js'
        }
      }
    },
    watch: {
      styles: {
        files: ['public/css/*.less'], // less auto-compilation
        tasks: ['less']
      },
      templates: {
        files: ['views/partials/*.jade'], // compiling  auto-dedug
        tasks: ['jade']
      },
      api_folder:{
        files: ['api/**/*.js'], // restart server on controllers, routes and models changes
        tasks: ['forever:server1:restart']

      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  // grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-forever');
  //grunt.registerTask('dev', ['forever']); // , 'connect:server' // 'forever', 
  grunt.registerTask('stop', ['forever:server1:stop']); // , 'connect:server' // 'forever', 
  grunt.registerTask('default', ['forever:server1:restart','jade','watch', 'less','jasmine']); // , 'connect:server' // 'forever', 
};