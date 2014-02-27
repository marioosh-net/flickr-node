/**
 * albums + album covers / home page
 * 
 * flickr.photosets.getList
 *
 * in mode without authentication (1 - only public photos)
 * only public photosets are listed
 *
 * in modes with authentication needed (2,3,4,5) 
 * photosets with "special descriptions" ([public] in description or description=' ')
 * are listed
 *
 */
var async = require('async');
var request = require('request');
var utils = require('../utils.js');

exports.index = function(req, res){
	var config = utils.config();
	var photoset_id = req.params.id;
	
	if(!utils.checkConfig(config)) {
		res.redirect('/setup');
		return;		
	}

	var mode2 = config.auth != null && utils.requiredAuth(config);
	console.log('mode2:'+mode2);
	var flickr_photosets_getList_url = 
		req.app.get('flickr_api_base_url')+
		'&user_id='+config.user_id+
		'&method=flickr.photosets.getList'+
		'&primary_photo_extras=url_q'+
		(mode2?'&oauth_token='+config.auth.oauth_access_token + '&user_id='+config.auth.results.user_nsid:'');
	
	console.log('get photosets list...');
	console.log('flickr.photosets.getList:'+flickr_photosets_getList_url);
    request(flickr_photosets_getList_url, {json: true}, function (error, response, body) {
    	var ps = body.photosets.photoset;
    	body.photoset_id = photoset_id;
    	
    	var i = ps.length;
    	if(mode2) {
	    	while (i--) {
	    		/**
	    		 * at MODE2 private sets will be visible if has description == ' ' or contains '[public]'
	    		 */
	    		var special_description = ps[i].description._content == ' ' || ps[i].description._content.indexOf('[public]') != -1;
	    		if(!special_description) {
	    			ps.splice(i, 1);
	    		}
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

