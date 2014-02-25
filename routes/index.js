/**
 * albums + album covers / home page
 * 
 * flickr.photosets.getList
 */
var async = require('async');
var request = require('request');


exports.index = function(req, res){
	var config = req.app.get('config');
	var photoset_id = req.params.id;
	
	if(!config.consumer_key || !config.consumer_secret || config.consumer_key == 'YOUR_API_KEY' || config.consumer_secret == 'YOUR_API_SECRET') {
		res.render('error',{message:'config error. fill config.json with your api key and secret.'});
		return;
	}
	
	if(!config.user_id) {
		res.redirect('/setup');
		return;
	}

	var mode2 = config.auth != null && config.mode != 1 ? true : false;
	var flickr_photosets_getList_url = 
		req.app.get('flickr_api_base_url')+
		'&user_id='+config.user_id+
		'&method=flickr.photosets.getList'+
		'&primary_photo_extras=url_q'+
		(mode2?'&oauth_token='+config.auth.oauth_access_token + '&user_id='+config.auth.results.user_nsid:'');
	
	// console.log('flickr.photosets.getList:'+flickr_photosets_getList_url);
    request(flickr_photosets_getList_url, {json: true}, function (error, response, body) {
    	var ps = body.photosets.photoset;
    	body.photoset_id = photoset_id;
    	
    	var i = ps.length;
    	while (i--) {
    		/**
    		 * at MODE2 private sets will be visible if has description == ' ' or contains '[public]'
    		 */
    		var contains = ps[i].description._content == ' ' || ps[i].description._content.indexOf('[public]') != -1;
    		if(!(!mode2 || (mode2 && contains))) {
    			ps.splice(i, 1);
    		}
    	}
    	
    	ps = ps.sort(function(a,b){
    		return a.title._content > b.title._content ? -1 : (a.title._content < b.title._content ? 1 : 0);
    	});
    	
    	if(photoset_id) {
    		/**
    		 * render albums titles only + plus get and render photos
    		 */
			req.app.get('photos').getPhotos(req, photoset_id, function(data){
				res.render('index', {
					photoset_id: photoset_id,
					photoset: data.photoset,
					seturl: data.seturl,
					photosets: body.photosets
				});
			});
    	} else {
    		res.render('index', body);
    	}
    });	
};

