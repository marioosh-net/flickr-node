/**
 * albums + album covers / home page
 * 
 * flickr.photosets.getList
 * flickr.photos.getSizes
 */
var async = require('async');
var request = require('request');


exports.index = function(req, res){
	var photoset_id = req.params.id;
	
	if(!req.app.get('config').user_id) {
		res.redirect('/setup');
		return;
	}

	var mode2 = false;
	var flickr_photosets_getList_url = req.app.get('flickr_api_base_url')+'&user_id='+req.app.get('config').user_id+'&method=flickr.photosets.getList'
	+'&primary_photo_extras=url_q';
	if(req.app.get('config').auth != null && req.app.get('config').mode != 1) {
		mode2 = true;
		flickr_photosets_getList_url += '&oauth_token='+req.app.get('config').auth.oauth_access_token + '&user_id='+req.app.get('config').auth.results.user_nsid;
	}
	
    request(flickr_photosets_getList_url, function (error, response, body) {
    	var json = JSON.parse(body);
    	var ps = json.photosets.photoset;
    	
    	var albums = [];
    	for(var i=0;i<ps.length;i++){
    		/**
    		 * at MODE2 private sets will be visible if has description == ' ' or contains '[public]'
    		 */
    		var contains = ps[i].description._content == ' ' || ps[i].description._content.indexOf('[public]') != -1;
    		if(!mode2 || (mode2 && contains)) {
    			albums.push({id: ps[i].id, title: ps[i].title._content, primary:ps[i].primary, thumb:ps[i].primary_photo_extras.url_q});
    		}
    	}
    	
    	if(photoset_id) {
    		// render albums titles only
    		// plus get and render photos
			req.app.get('photos').getPhotos(req, photoset_id, function(data){
		    	albums = albums.sort(function(a,b){
		    		return a.title > b.title ? -1 : (a.title < b.title ? 1 : 0);
		    	});
				res.render('index', {covers: albums, photoset_id: photoset_id,
					thumbs: data.thumbs,
					photoset: data.photoset
				});
			});
    	} else {
    		res.render('index', {covers: albums, photoset_id: photoset_id});
    	}
    });	
};

