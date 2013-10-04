/**
 * list photos in photoset
 * 
 * flickr.photosets.getPhotos
 * flickr.photos.getSizes
 */
var async = require('async');
var request = require('request');

var getPhotos = function(req, photoset_id, callback1) {
	var photoset_id = req.params.id;

	var oa = req.app.get('oa');
	
	var flickr_photosets_getPhotos_url = req.app.get('flickr_api_base_url')+'&photoset_id='+photoset_id+'&method=flickr.photosets.getPhotos';
	
	if(req.session.auth != null) {
		//flickr_photosets_getPhotos_url = oa.signUrl(flickr_photosets_getPhotos_url, req.session.auth.oauth_access_token, req.session.auth.oauth_access_token_secret, 'GET');
		flickr_photosets_getPhotos_url += '&oauth_token='+req.session.auth.oauth_access_token;
		console.log(flickr_photosets_getPhotos_url);
		/*
		oa.get(flickr_photosets_getPhotos_url, req.session.auth.oauth_access_token, req.session.auth.oauth_access_token_secret, function (err, data, response){
		  console.log('==>Access the protected resource with access token');
		  console.log(JSON.stringify(JSON.parse(data), null, 1));
		});
		*/
	}
	
    request(flickr_photosets_getPhotos_url, function (error, response, body) {
    	var json = JSON.parse(body);
    	// console.log(JSON.stringify(json, null, 1));
    	var photos = json.photoset.photo;
    	
    	async.concat(photos, function(p, callback){
    		var flickr_photos_getSizes_url = req.app.get('flickr_api_base_url')+'&user_id='+req.app.get('flickr').user_id+'&method=flickr.photos.getSizes&photo_id='+p.id;
    		if(req.session.auth != null) {
    			//flickr_photos_getSizes_url = oa.signUrl(flickr_photos_getSizes_url, req.session.auth.oauth_access_token, req.session.auth.oauth_access_token_secret, 'GET');
    			flickr_photos_getSizes_url += '&oauth_token='+req.session.auth.oauth_access_token;
    		}
    		request(flickr_photos_getSizes_url, function (error, response, body1){
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
    		/*
           	res.render('photos', {
           		thumbs: covers, 
           		photoset: {
           			id: photoset_id,
           			title: json.photoset.title
           		}
           	});
           	*/
    		callback1({
           		thumbs: covers, 
           		photoset: {
           			id: photoset_id,
           			title: json.photoset.title
           		}
           	});
    	});
    });	
};

exports.getPhotos = getPhotos;

exports.list = function(req, res){
	getPhotos(req, req.params.id, function(data) {
		if(req.query.play != null) {
			res.render('play', data);
		} else {
			res.render('photos', data);
		}
	});
};
