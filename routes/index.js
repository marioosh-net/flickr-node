/**
 * albums + album covers / home page
 * 
 * flickr.photosets.getList
 *
 * public mode:
 * in mode without authentication (1 - only public photos)
 * only public photosets are listed
 *
 * private mode:
 * in modes with authentication needed (2,3,4,5) 
 * photosets with "special descriptions" ([public] in description or description=' ')
 * are listed
 *
 */
var async = require('async');
var request = require('request');
var utils = require('../utils.js');
var photos = require('./photos.js');

exports.index = function(req, res){
	var config = utils.config();
	var photoset_id = req.params.id;

	/**
	 * if config not complete redirect to setup paga
	 */	
	if(!utils.checkConfig(config)) {
		res.redirect('/setup');
		return;		
	}

	var privateMode = config.auth != null && utils.requiredAuth(config);
	var flickr_photosets_getList_url = 
		utils.getBaseUrl()+
		'&user_id='+config.user_id+
		'&method=flickr.photosets.getList'+
		'&primary_photo_extras=url_q'+
		(privateMode?'&oauth_token='+config.auth.oauth_access_token + '&user_id='+config.auth.results.user_nsid:'');
	
	console.log('get photosets list...');
    request(flickr_photosets_getList_url, {json: true}, function (error, response, body) {
    	var ps = body.photosets.photoset;
    	body.photoset_id = photoset_id;
    	
    	var i = ps.length;
    	if(privateMode) {
	    	while (i--) {
	    		/**
	    		 * private mode 
	    		 *
	    		 * all sets (public and private) will be visible if has description == ' ' 
	    		 * descriptionor contains '[public]'
	    		 */
	    		var special_description = ps[i].description._content == ' ' || ps[i].description._content.indexOf('[public]') != -1;
	    		if(!special_description) {
	    			ps.splice(i, 1);
	    		}
	    	}
    	}
    	
    	/**
    	 * sort albums by title
    	 */
    	ps = ps.sort(function(a,b){
    		return a.title._content > b.title._content ? -1 : (a.title._content < b.title._content ? 1 : 0);
    	});
    	
    	if(photoset_id) {
    		/**
    		 * direct linking to album
    		 * render albums list and photos in album
    		 */
			photos.getPhotos(req, photoset_id, function(data){
				res.render('index', {
					photoset_id: photoset_id,
					photoset: data.photoset,
					seturl: data.seturl,
					photosets: body.photosets
				});
			});
    	} else {
    		/**
    		 * render albums list and album covers
    		 */
    		res.render('index', body);
    	}
    });	
};

