'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
     pkg: grunt.file.readJSON('package.json'),
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
        files: ['public/css/*.less'], // which files to watch
        tasks: ['less']
      },
      templates: {
        files: ['views/partials/*.jade'], // which files to watch
        tasks: ['jade']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  // grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-forever');

  grunt.registerTask('default', ['jade','watch', 'less','jasmine']); // , 'connect:server' // 'forever', 
};