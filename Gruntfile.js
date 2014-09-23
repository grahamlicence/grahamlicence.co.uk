/*
    Gruntfile. To run:
    - install node
    - run `npm install` in the root directory
    - type in `grunt` to do run the build
    - type in `grunt watch` whilst developing


    Check out the registerTask statements at the bottom for an idea of
    task grouping.
*/
module.exports = function(grunt) {

    /* load dependencies */
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
          // Read the package.json file for config values.
          //   package.json keeps devDependencies as well, which make it easy 
          //   for us to track and install node dependencies 
        
        pkg: grunt.file.readJSON('package.json'),
        
        compass: {
            dev: {
                options: {
                    sassDir: "<%= pkg.sass %>",                                                       
                    cssDir: "<%= pkg.css %>",
                    outputStyle: "expanded",
                    noLineComments: false,
                    sourcemap: true
                }
            }
        },

          // Concat concatenates the minified jQuery and our uglified code.
          //   We should try to refrain from re-minifying libraries because
          //   they probably do a better job of minifying their own code then us.   
        
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
            },
            dist: {
                src: [
                    'javascript/vendor/jquery-1.10.2.min.js',
                    'javascript/main.min.js'
                ],
                dest: 'site/assets/scripts/dist.min.js'
            }
        },

        // Combines depulicated media queries
        cmq: {
            options: {
                log: false
            },
            your_target: {
                files: {
                    '<%= pkg.css %>': ['<%= pkg.css %>/*.css']
                }
            }
        },

          // Uglify seems to be the industry standard for minification and obfuscation nowadays. 
        
        uglify: {
            build: {
                src: [
                    'javascript/build/*'
                ],
                dest: 'javascript/main.min.js'
            }
        },

        // Minifies the main.css file inside the styles folder into the deploy folder as main.min.css
        cssmin: {
            options: {
                compatibility : 'ie8',
                noAdvanced: true
            },
            minify: {
                expand: true,
                cwd: '<%= pkg.css %>',
                src: ['*.css', '!*.min.css'],
                dest: '<%= pkg.css %>',
                ext: '.min.css'
            }
        },

        watch: {
            css: {
                files: 'sass/**/*.scss',
                tasks: ['compass'],
                options: {
                    livereload: true
                }
            }
        }
    });


      // The default task runs when you just run `grunt`.
      //   "js" and "css" tasks process their respective files. 
    
    grunt.registerTask('css', ['compass']);
    grunt.registerTask('js', ['uglify', 'concat']);

    grunt.registerTask('default', ['css', 'js', 'watch']);
};
