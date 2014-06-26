/* -*- coding: utf-8 -*-
============================================================================= */
/*jshint asi: true*/

var debug = require('debug')('overwolf-demo:app')

exports.test1 = function() {
    var now = (new Date()).toString()
    console.log('Current Time:', now)
    debug(now)
}
