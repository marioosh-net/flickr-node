/**
 * list photos in photoset
 * 
 * flickr.photosets.getPhotos
 */
var async = require('async');
var request = require('request');

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
	
	/**
	 * full authorized access
	 * url with '&oauth_token=...'
	 */
	if(req.app.get('config').auth != null && req.app.get('config').mode != 1) {
		/**
		 * 1 solution
		 * request using oa.get()
		var oa = req.app.get('oa');
		oa.get(flickr_photosets_getPhotos_url, req.app.get('config').auth.oauth_access_token, req.app.get('config').auth.oauth_access_token_secret, function (err, data, response){
		  console.log('==>Access the protected resource with access token');
		  console.log(JSON.stringify(JSON.parse(data), null, 1));
		  ...
		});
		*/

		/**
		 * 2 solution
		 * build signed url using oa.signUrl()
		var oa = req.app.get('oa'); 
		flickr_photosets_getPhotos_url = oa.signUrl(flickr_photosets_getPhotos_url, req.app.get('config').auth.oauth_access_token, req.app.get('config').auth.oauth_access_token_secret, 'GET');
		*/
		
		/**
		 * 3 solution (simplest, works too)
		 */
		flickr_photosets_getPhotos_url += '&oauth_token='+req.app.get('config').auth.oauth_access_token + '&user_id='+req.app.get('config').auth.results.user_nsid;
	}

	console.log('flickr.photosets.getPhotos:'+flickr_photosets_getPhotos_url);
	console.log('get photos for \''+photoset_id+'\', filter:'+filter+'...');
	request(flickr_photosets_getPhotos_url, {json:true}, function(error, response, body){
		body.seturl = 'http://www.flickr.com/photos/'+req.app.get('config').user_id+'/sets/'+photoset_id;
		callback(body);
	});
}

/**
 * merge results from getFiltered calls
 */
exports.getPhotos = function(req, photoset_id, callback) {
	var func = [function filter1(callback){
		/* MODE 1 - get public photos only */
		getFiltered(req, photoset_id, 1, function(data){
			callback(null, data);
		});
	}];
	if(req.app.get('config').mode != 1 && req.app.get('config').auth != null) {
    	/* MODE 2 - get private photos visible to friends & family (second request) */
		func[1] = function filter2(callback){
			getFiltered(req, photoset_id, 4, function(data){
				callback(null, data);
			});
		};
	}
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
