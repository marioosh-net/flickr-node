/*
 * flickr.photos.getExif
 */
var async = require('async');
var request = require('request');
var utils = require('../utils.js');

exports.list = function(req, res){
	var photo_id = req.params.id;
	var photo_secret = req.params.secret;

    request(utils.getBaseUrl()+'&photo_id='+photo_id+'&secret='+photo_secret+'&method=flickr.photos.getExif', function (error, response, body) {
    	var json = JSON.parse(body);
    	var exifs = json.photo.exif;
    	
    	var exif_selected = [];
    	for(var i=0; i<exifs.length; i++) {
    		if(exifs[i].tag == 'Model' ||
    			exifs[i].tag == 'Software' || 
    			exifs[i].tag == 'FNumber' || 
    			exifs[i].tag == 'ExposureProgram' || 
    			exifs[i].tag == 'ISO' || 
    			exifs[i].tag == 'DateTimeOriginal' ||
    			exifs[i].tag == 'Flash' ||
    			exifs[i].tag == 'FocalLength' ||
    			exifs[i].tag == 'ExposureMode' ||
    			exifs[i].tag == 'WhiteBalance' ||
    			exifs[i].tag == 'FocalLengthIn35mmFormat') {
    			exif_selected.push(
    				{
    					label: exifs[i].label, 
    					raw: exifs[i].raw._content,
    					tag: exifs[i].tag
    				}
    			);
    		}
    	}
    	res.render('exif', {exif: exif_selected});
    });
};
