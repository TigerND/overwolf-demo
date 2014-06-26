/* -*- coding: utf-8 -*-
============================================================================= */
/*jshint asi: true*/

var util = require('util')

console.log('Will start Overwolf at', process.cwd(), 'in 2 seconds')
setTimeout(function() {
    main()
}, 2000)

function main() {
    var spawn = require('child_process').spawn,
        nodewebkit = spawn('C:\\Program Files (x86)\\Overwolf\\Overwolf.exe', [], {
            cwd: './dist',
            env: util._extend({
                DEBUG: '*'
            }, process.env),
            stdio: 'inherit'
        })

    nodewebkit.on('close', function(code) {
        console.log('Child process exited with code:', code)
    })
}
