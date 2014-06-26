/* -*- coding: utf-8 -*-
============================================================================= */
/*jshint asi: true*/

var fs = require('fs'),
    util = require('util'),
    handlebars = require('handlebars'),
    child_process = require('child_process')

var spawn = child_process.spawn

var pid = null

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var pkg = grunt.file.readJSON('package.json')

    grunt.initConfig({
        pkg: pkg,

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.json', 'src/**/*.js', 'test/**/*.js', 'scripts/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },

        browserify: {
            app: {
                options: {
                    alias: ['./src/app.js:app']
                },
                files: {
                    "dist/files/<%= pkg.name %>-app.js": ["./src/app.js"]
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            app: {
                files: {
                    'dist/files/<%= pkg.name %>-app.min.js': ['dist/files/<%= pkg.name %>-app.js']
                }
            }
        },

        copy: {
            manifest: {
                src: 'src/manifest.json',
                dest: 'dist/manifest.json',
                options: {
                    process: function(content, srcpath) {
                        var template = handlebars.compile(content)
                        return template({
                            pkg: pkg
                        })
                    }
                }
            },
            files: {
                expand: true,
                cwd: 'src/files/',
                src: '**',
                dest: 'dist/files/'
            }
        },

        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'list'
            },
            all: {
                src: ['test/*.js']
            }
        },

        watch: {
            options: {
                livereload: true
            },
            src: {
                files: ['<%= jshint.files %>'],
                tasks: ['stop_overwolf', 'build', 'start_overwolf'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('default', ['build'])

    grunt.registerTask('build', ['jshint', 'browserify', 'uglify', 'copy:manifest', 'copy:files'])

    grunt.registerTask('test', ['build', 'simplemocha'])

    grunt.registerTask('devel', ['build', 'start_overwolf', 'watch'])

    grunt.registerTask('start_overwolf', 'Start', function() {
        var done = this.async()

        var nodewebkit = spawn('node', ['scripts/overwolf-launcher.js'], {
            stdio: 'inherit'
        })

        nodewebkit.on('close', function(code) {
            console.log('Child process exited with code:', code)
            pid = null
        })

        pid = nodewebkit.pid

        done()
    })

    grunt.registerTask('stop_overwolf', 'Stop', function() {
        var done = this.async()

        if (pid) {
            console.log('Killing', pid)
            process.kill(pid, 'SIGKILL')
            pid = null
        }
        setTimeout(function() {
            done()
        }, 2000)
    })
};
