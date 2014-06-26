/* -*- coding: utf-8 -*-
============================================================================= */
/*jshint asi: true*/

var debug = require('debug')('overwolf-demo:app')

var _ = require("lodash"),
    $ = require("jquery")

exports.dragResize = function(edge){
    overwolf.windows.getCurrentWindow(function(result){
        if (result.status=="success"){
            overwolf.windows.dragResize(result.window.id, edge);
        }
    });
};

exports.dragMove = function(){
    overwolf.windows.getCurrentWindow(function(result){
        if (result.status=="success"){
            overwolf.windows.dragMove(result.window.id);
        }
    });
};

exports.closeWindow = function(){
    overwolf.windows.getCurrentWindow(function(result){
        if (result.status=="success"){
            overwolf.windows.close(result.window.id);
        }
    });
};
            
exports.start = function() {
	$(document).ready(function() {
		console.log('Starting Application')
	})
}

exports.clickMe = function() {
    var now = (new Date()).toString()
    console.log('Clicked. Current Time:', now)
}
