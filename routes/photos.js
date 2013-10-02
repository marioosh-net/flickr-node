/**
 * list photos in photoset
 * 
 * flickr.photosets.getPhotos
 * flickr.photos.getSizes
 */
var async = require('async');
var request = require('request');

exports.list = function(req, res){
	var photoset_id = req.params.id;
	
    var flickr = req.app.get('flickr');

    request(req.app.get('flickr_api_base_url')+'&photoset_id='+photoset_id+'&method=flickr.photosets.getPhotos', function (error, response, body) {
    	var json = JSON.parse(body);
    	var photos = json.photoset.photo;
    	
    	async.concat(photos, function(p, callback){
    		request(req.app.get('flickr_api_base_url')+'&user_id='+flickr.user_id+'&method=flickr.photos.getSizes&photo_id='+p.id, function (error, response, body1){
    			var json1 = JSON.parse(body1);
				var src = {
					thumb: '', // Large Square
					full: '', // Original
					lv: '', // Large
					medium: '' // Medium 
				}
    			var sizes = json1.sizes.size;
    			for(var i = 0; i < sizes.length; i++) {
    				var s = sizes[i];
    				if(s.label == 'Large Square') {
    					src.thumb = s.source;
    				}
    				if(s.label == 'Large') {
    					src.lv = s.source;
    				}
    				if(s.label == 'Original') {
    					src.full = s.source;
    				}    				
    				if(s.label == 'Medium') {
    					src.medium = s.source;
    				}    				
    			}
    			if(src.lv == ''){
    				src.lv = src.medium;
    			}
    			var cover = {
    					id: p.id,
    					title: p.title,
    					secret: p.secret,
    					src: src
    			};
    			callback(null, cover);
    		});    		
    	}, 
    	function(err, covers){
           	res.render('photos', {
           		covers: covers, 
           		photoset: {
           			id: photoset_id,
           			title: json.photoset.title
           		}
           	});    		
    	});
    });
};
