module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);

    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration
        uglify: {
            options: {
                mangle: false,
                compress: {
                    drop_console: true
                },
                sourceMap: true,
                sourceMapIn: 'js/main.js.map',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            all: {
                files: {
                    'js/main.min.js': 'js/main.js'
                }
            }
        },

        concat: {
            options: {
                sourceMap: true,
                sourceMapName: function(des) {
                    return 'js/main.js.map';
                }
            },
            all: {
                files: [{
                    src: 'js/src/**/*.js',
                    dest: 'js/main.js'
                }]
            }
        },

        // compass: {
        //     dist: {
        //         options: {
        //             config: 'compass.rb'
        //         }
        //     }
        // },

        sass: {
            dist: {
                options: {
                    compass: false,
                    style: 'compressed',
                    sourcemap: 'auto'
                },
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['*.scss'],
                    dest: '',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            all: {
                files: {
                    'style.css': 'style.css'
                }
            }
        },

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 5
                },
                files: [{
                    expand: true,
                    cwd: 'img',
                    src: '{,*/}*.{gif,jpeg,jpg,png,svg}',
                    dest: 'build/img'
                }]
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: ['**/*.css', '**/*.php', 'img/**/*', 'js/main.js']
                },
                options: {
                    proxy: 'http://localhost/~rzky/wordpress/',
                    watchTask: true,
                    port: 8000
                }
            }
        },

        // wiredep: {
        //     bower: {
        //         src: [
        //             'index.php',
        //             'sass/style.scss'
        //         ]
        //     }
        // },

        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['sass', 'concat']
            },
            sass: {
                files: 'sass/**/*.scss',
                tasks: ['sass']
            },
            concat: {
                files: 'js/src/*.js',
                tasks: ['concat']
            },
            // uglify: {
            //     files: 'js/main.js',
            //     tasks: ['uglify']
            // },
            // bower: {
            //     files: ['bower.json'],
            //     tasks: ['wiredep']
            // },
            livereload: {
                files: ['**/*.css', '**/*.php', 'img/**/*', 'js/main.js'],
                options: {
                    livereload: true
                }
            }
        },

        copy: {
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    dest: 'build',
                    src: [
                        'bower_components/**/*',
                        'fonts/**/*',
                        '**/*.css',
                        '**/*.js',
                        '**/*.map',
                        '**/*.php',
                        'screenshot.png'
                    ]
                }]
            }
        },

        clean: {
            build: ['build']
        },

        'sftp-deploy': {
            build: {
                auth: {
                    host: '127.0.0.1',
                    authKey: 'key1'
                },
                src: 'build',
                dest: '/path/to/www',
                exclusions: [
                    '.DS_Store',
                    '.editorconfig',
                    '.ftppass',
                    '.git',
                    '.gitattributes',
                    '.gitignore',
                    '.npmignore',
                    '.htaccess',
                    '.sass-cache',
                    'bower.json',
                    'compass.rb',
                    'Gruntfile.js',
                    'node_modules',
                    'package.json',
                    'scss',
                    'sass'
                ]
            }
        }
    });

    // Default task
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('init', ['sass', 'concat']);
    grunt.registerTask('build', ['sass', 'autoprefixer', 'concat', 'uglify', 'clean', 'copy', 'imagemin']);
    grunt.registerTask('deploy', ['sftp-deploy']);
};
