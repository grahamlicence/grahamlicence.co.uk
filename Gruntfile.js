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
    
    // load non grunt prefixed tasks
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('handlebars-helper-moment');

    grunt.initConfig({
          // Read the package.json file for config values.
          //   package.json keeps devDependencies as well, which make it easy 
          //   for us to track and install node dependencies 
        
        pkg: grunt.file.readJSON('package.json'),

        // asset paths
        project: {
            sassDir: '<%= pkg.settings.sassPath %>',
            cssDir: '<%= pkg.settings.cssPath %>',
            jsDir: '<%= pkg.settings.scriptsPath %>'
        },
        
        compass: {
            dev: {
                options: {
                    sassDir: '<%= project.sassDir %>',
                    cssDir: '<%= project.cssDir %>',
                    outputStyle: 'expanded',
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
                    'dist/javascript/vendor/*.js',
                    'dist/javascript/main.min.js'
                ],
                dest: '<%= project.jsDir %>/dist.min.js'
            }
        },

        // Combines depulicated media queries
        cmq: {
            options: {
                log: false
            },
            your_target: {
                files: {
                    '<%= project.cssDir %>': ['<%= project.cssDir %>/*.css']
                }
            }
        },

          // Uglify seems to be the industry standard for minification and obfuscation nowadays. 
        
        uglify: {
            build: {
                src: [
                    'dist/javascript/build/*'
                ],
                dest: 'dist/javascript/main.min.js'
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
                cwd: '<%= project.cssDir %>',
                src: ['*.css', '!*.min.css'],
                dest: '<%= project.cssDir %>',
                ext: '.min.css'
            }
        },

        connect: {
          dev: {
            options: {
                open: true,
                port: 8000,
                hostname: 'localhost',
                base: './dist/'
            }
          }
        },

        // main assemble build files
        assembleFiles: [{
            cwd: './src/content/',
            dest: './dist/',
            expand: true,
            src: '**/*.hbs'
        }],

        assemble: {
            options: {
                collections: [{
                  name: 'cartoon',
                  sortby: 'posted',
                  sortorder: 'descending'
                }],
                helpers: './src/helpers/**/*.js',
                layout: 'page.hbs',
                layoutdir: './src/layouts/',
                partials: './src/partials/**/*'
            },
            prod: {
                options: {
                    production: true
                },
                files: '<%= assembleFiles %>'
            },
            dev: {
                options: {
                    production: false
                },
                files: '<%= assembleFiles %>'
            }
        },

        // it's bit buggy on windows https://github.com/RayViljoen/grunt-sitemap/issues/9
        // remove line 16 url += '/'; on compile node_module script
        sitemap: {
            dist: {
                siteRoot: 'dist',
                changefreq: 'weekly'
            }
        },

        // notify when tasks completed, should work out of the box on OSX
        // needs http://snarl.fullphat.net/ or similar for windoes
        notify: {
            watch: {
                options: {
                    title: 'Sass',
                    message: 'Build complete'
                }
            },
            assemble: {
                options: {
                    title: 'Assemble HTML',
                    message: 'Build complete'
                }
            },
            build: {
                options: {
                    title: 'Minify assets',
                    message: 'Build complete'
                }
            }
        },

        watch: {
            css: {
                files: 'sass/**/*.scss',
                tasks: ['compass', 'notify:watch'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: 'src/**/*.hbs',
                tasks: ['assemble:dev', 'notify:assemble']
            }
        }
    });

    // minify assets for release
    grunt.registerTask('test',['assemble:posts']);

    // minify assets for release
    grunt.registerTask('release', ['compass', 'cmq', 'cssmin', 'uglify', 'concat', 'assemble:prod', 'sitemap', 'notify:build']);

    // build and watch html/css
    grunt.registerTask('default', ['compass', 'assemble:dev', 'connect', 'watch']);
};
