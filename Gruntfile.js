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
                    alias: ['./src/app.js:app'],
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
                files: ['<%= jshint.files %>', 'src/**/*.html'],
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

    grunt.registerTask('start_overwolf', 'Start Overwolf', function() {
        var done = this.async()

        var launcher = spawn('node', ['scripts/overwolf-launcher.js'], {
            stdio: 'inherit'
        })

        if (launcher) {
        	pid = launcher.pid
        	grunt.log.ok(['Launcher started', ' PID: ' + pid])
	        launcher.on('close', function(code) {
	        	grunt.log.writeln('Launcher exited with code:', code)
	            pid = null
	        })	
        	done()
        } else {
        	grunt.log.error(['Failed to start launcher'])
        	done(false)
        }        
    })

    grunt.registerTask('stop_overwolf', 'Stop Overwolf', function() {
        var done = this.async()

        if (pid) {
        	grunt.log.writeln('Killing ' + pid)
            process.kill(pid, 'SIGKILL')
            pid = null
            grunt.log.writeln('Waiting 2 seconds')
            setTimeout(function() {
                done()
            }, 2000)
        } else {
        	grunt.log.ok(['Launcher has already finished'])
        	done()
        }
    })
};
