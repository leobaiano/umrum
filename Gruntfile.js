/* globals module */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                   '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                   '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                   '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                   ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            core: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'public/js/core.js.map'
                },
                files: {
                    'public/js/core.min.js': [
                        'src/js/libs/modernizr-2.6.3.js',
                        'src/js/libs/jquery-1.10.2.js',
                    ]
                }
            },
            site: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'public/js/site.js.map'
                },
                files: {
                    'public/js/site.min.js': [
                        'src/js/plugins/*.js',
                        'src/js/app/bootstrap.js',
                        'src/js/app/landing-page.js',
                        'src/js/app/chart.js'
                    ]
                }
            },
            application: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'public/js/application.js.map'
                },
                files: {
                    'public/js/application.min.js': [
                        'src/js/libs/handlebars.runtime-v1.3.0.js',
                        'src/js/libs/ember.1.5.1.js',
                        'src/js/app.js',
                        'src/js/views/dashboard.js',
                    ]
                }
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    require: true,
                    module: true,
                    process: true,
                    console: true,
                    Ember: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: [
                    'src/js/*.js',
                    'server.js',
                    'app/routes/*.js',
                    'app/config/*.js',
                    'tests/**/*.js'
                ]
            }
        },
        less: {
            production: {
                options: {
                    cleancss: true,
                    compress: true,
                },
                files: {
                    'public/css/main.min.css': ['src/less/bootstrap.less'],
                    'public/css/site.min.css': ['src/less/site.less'],
                    'public/css/admin.min.css': ['src/less/admin.less']
                }
            }
        },
        autoprefixer: {
            dist: {
                options: {
                    browsers: ['last 2 versions', '> 10%', 'ie 8']
                },
                files: {
                    'public/css/main.min.css': ['public/css/main.min.css'],
                    'public/css/site.min.css': ['public/css/site.min.css'],
                    'public/css/admin.min.css': ['public/css/admin.min.css']
                }
            }
        },
        copy: {
            imgs: {
                expand: true,
                cwd: 'src/img/',
                src: '**',
                dest: 'public/img'
            },
            fonts: {
                expand: true,
                cwd: 'src/fonts/',
                src: '**',
                dest: 'public/fonts'
            }
        },
        mochacli: {
            files: 'tests/',
            options: {
                reporter: 'spec',
                recursive: true,
                env: {
                    NODE_ENV: "test",
                    MONGO_URI: "mongodb://test:test123@ds053778.mongolab.com:53778/umrum-test",
                    NODE_PORT: "8000",
                    NODE_IP: "0.0.0.0",
                    GITHUB_ID: "SOME_GITHUB_ID",
                    GITHUB_SECRET: "SOME_GITHU_SECRET",
                    GITHUB_CALLBACK: "http://localhost:8000/auth/github/callback"
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test']
            },
            less: {
                files: ['src/less/*.less'],
                tasks: ['mincss'],
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['minjs']
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    ext: 'js,html,less',
                    watch: ['app', 'src'],
                    env: {
                        NODE_ENV: "dev",
                        MONGO_URI: "mongodb://test:test123@ds053778.mongolab.com:53778/umrum-test",
                        NODE_PORT: "8000",
                        NODE_IP: "0.0.0.0",
                        GITHUB_ID: "YOUR_GITHUB_ID",
                        GITHUB_SECRET: "YOUR_GITHUB_SECRET",
                        GITHUB_CALLBACK: "http://localhost:8000/auth/github/callback"
                    },
                    callback: function (nodemon) {
                        nodemon.on('log', function (e) {
                            grunt.log.writeln(e.colour);
                        });

                        nodemon.on('restart', function () {
                            grunt.log.subhead('Running compile task ... ');
                            grunt.util.spawn({
                                grunt: true,
                                args: ['compile'],
                            }, function(err, result) {
                                grunt.log.debug(result.toString());
                                if (err || result.code !== 0) {
                                    grunt.log.write('Error while compiling')
                                             .error()
                                             .error(err);
                                }
                                grunt.log.subhead('Compile task: \u001b[32mOK');
                            });
                        });
                    }
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('minjs', ['uglify']);
    grunt.registerTask('mincss', ['less', 'autoprefixer']);
    grunt.registerTask('copy-static', ['copy:imgs', 'copy:fonts']);

    grunt.registerTask('compile', ['copy-static', 'mincss', 'minjs']);

    grunt.registerTask('unittest', ['jshint', 'mochacli']);

    grunt.registerTask('server', ['compile', 'nodemon:dev']);
};
