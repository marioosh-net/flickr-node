/**
 * list photos in photoset
 * 
 * flickr.photosets.getPhotos
 */
var async = require('async');
var request = require('request');
var utils = require('../utils.js');

/**
 * filter:
 * 1 public photos
 * 2 private photos visible to friends
 * 3 private photos visible to family
 * 4 private photos visible to friends & family
 * 5 completely private photos
 * '' no filter 
 */
var getFiltered = function(req, photoset_id, filter, callback) {
	var flickr_photosets_getPhotos_url = req.app.get('flickr_api_base_url')+'&photoset_id='+photoset_id+'&method=flickr.photosets.getPhotos'+'&extras=tags,url_l,url_o,url_q,o_dims'+'&privacy_filter='+filter;
	
	var config = utils.config();
	/**
	 * full authorized access
	 * url with '&oauth_token=...'
	 */
	if(config.auth != null && utils.requiredAuth(config)) {
		/**
		 * 1 solution
		 * request using oa.get()
		var oa = req.app.get('oa');
		oa.get(flickr_photosets_getPhotos_url, config.auth.oauth_access_token, config.auth.oauth_access_token_secret, function (err, data, response){
		  console.log('==>Access the protected resource with access token');
		  console.log(JSON.stringify(JSON.parse(data), null, 1));
		  ...
		});
		*/

		/**
		 * 2 solution
		 * build signed url using oa.signUrl()
		var oa = req.app.get('oa'); 
		flickr_photosets_getPhotos_url = oa.signUrl(flickr_photosets_getPhotos_url, config.auth.oauth_access_token, config.auth.oauth_access_token_secret, 'GET');
		*/
		
		/**
		 * 3 solution (simplest, works too)
		 */
		flickr_photosets_getPhotos_url += '&oauth_token='+config.auth.oauth_access_token + '&user_id='+config.auth.results.user_nsid;
	}

	console.log('get photos for \''+photoset_id+'\', filter:'+filter+'...');
	console.log('flickr.photosets.getPhotos:'+flickr_photosets_getPhotos_url);
	request(flickr_photosets_getPhotos_url, {json:true}, function(error, response, body){
		body.seturl = 'http://www.flickr.com/photos/'+config.user_id+'/sets/'+photoset_id;
		callback(body);
	});
}

/**
 * merge results from getFiltered calls
 */
exports.getPhotos = function(req, photoset_id, callback) {
	var config = utils.config();

	var func = [];
	config.mode.forEach(function(mode){
		if(mode == 1 || (mode != 1 && config.auth != null)) {
			func.push(function filter(callback){
				getFiltered(req, photoset_id, mode, function(data){
					callback(null, data);
				});
			});
		}
	});
	async.parallel(func, function merge(err, results){
		var data = null;
		for(var i=0;i<results.length;i++) {
			if(i > 0) {
				data.photoset.photo = data.photoset.photo.concat(results[i].photoset.photo);
			} else {
				data = results[i];
			}
		}
	    callback(data);
	});
};

exports.list = function(req, res){
	exports.getPhotos(req, req.params.id, function(data) {
		if(req.query.play != null) {
            /* superslides */
			res.render('play', data);
        } else {
    		if(req.query.play2 != null) {
                /* supersized */
		    	res.render('play2', data);
    		} else {
	    		res.render('photos', data);
		    }
        }
	});
};
