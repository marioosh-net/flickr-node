
/*
 * GET albums listing.
 */

var async = require('async');
var request = require('request');

exports.list = function(req, res){
	var photo_id = req.params.id;
	var photo_secret = req.params.secret;
	
    var flickr = req.app.get('flickr');
    var base_url = req.app.get('flickr_api_base_url');

    request(base_url+'&photo_id='+photo_id+'&secret='+photo_secret+'&method=flickr.photos.getExif', function (error, response, body) {
    	var json = JSON.parse(body);
    	var exifs = json.photo.exif;
    	var exif_selected = [];
    	for(var i=0; i<exifs.length; i++) {
    		if(exifs[i].tag == 'Model' ||
    			exifs[i].tag == 'Software' || 
    			exifs[i].tag == 'ModifyDate' ||
    			exifs[i].tag == 'FNumber' || 
    			exifs[i].tag == 'ExposureProgram' || 
    			exifs[i].tag == 'ISO' || 
    			exifs[i].tag == 'DateTimeOriginal' ||
    			exifs[i].tag == 'Flash' ||
    			exifs[i].tag == 'FocalLength' ||
    			exifs[i].tag == 'ExposureMode' ||
    			exifs[i].tag == 'WhiteBalance' ||
    			exifs[i].tag == 'FocalLengthIn35mmFormat') {
    			exif_selected.push({label: exifs[i].label, raw: exifs[i].raw._content});
    		}
    	}
    	console.log(JSON.stringify(exif_selected));
    	// res.render('exif', {exif: json.photo.exif});
    	res.render('exif', {exif: exif_selected});
    	
    });
};
