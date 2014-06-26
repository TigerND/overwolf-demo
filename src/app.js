/* -*- coding: utf-8 -*-
============================================================================= */
/*jshint asi: true*/

var debug = require('debug')('overwolf-demo:app')

var _ = require("lodash"),
    $ = require("jquery")

exports.start = function() {
	$(document).ready(function() {
		console.log('Starting Application')
	})
}

exports.clickMe = function() {
    var now = (new Date()).toString()
    console.log('Clicked. Current Time:', now)
}
