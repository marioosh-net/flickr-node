/**
 * list photos in photoset
 * 
 * flickr.photosets.getPhotos
 * flickr.photos.getSizes
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
 * 
 * callback function get one parameter - data in format like below:
 * {
 "thumbs": [
  {
   "id": "XXXXX",
   "title": "west_of_memphis.jpg",
   "secret": "YYY",
   "src": {
    "thumb": "http://farm6.staticflickr.com/5512/XXXXX_YYY_q.jpg",
    "full": "http://farm6.staticflickr.com/5512/XXXXX_YYY_o.jpg",
    "lv": "http://farm6.staticflickr.com/5512/XXXXX_YYY_b.jpg",
    "medium": "http://farm6.staticflickr.com/5512/XXXXX_YYY.jpg"
   }
  }
 ],
 "photoset": {
  "id": "ZZZZZ",
  "title": "West of Memphis"
 }
}
 */
var getFiltered = function(req, photoset_id, filter, callback) {
	var flickr_photosets_getPhotos_url = req.app.get('flickr_api_base_url')+'&photoset_id='+photoset_id+'&method=flickr.photosets.getPhotos'+'&extras=tags,url_l,url_o,url_q'+'&privacy_filter='+filter;
	
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

	request(flickr_photosets_getPhotos_url, function(error, response, body){
		var json = JSON.parse(body);
		var photos = json.photoset.photo;
		// callback(error, {photos: photos, photoset: json.photoset});
		// callback(error, json);

		callback({
       		thumbs: photos, 
       		photoset: {
       			id: photoset_id,
       			title: json.photoset.title
       		}
       	});
	});
}

var getPhotos = function(req, photoset_id, callback) {
	var photoset_id = req.params.id;

	/**
	 * MODE 1
	 * get public photos only
	 */
	if(req.app.get('config').mode == 1) {
		getFiltered(req, photoset_id, 1, function(data){
			callback(data);
		});
	} else {
				
		/**
		 * MODE 2
		 * get public photos (first request)
		 */
		getFiltered(req, photoset_id, 1, function(data){
	
			if(req.app.get('config').auth != null) {
		    	/**
		    	 * get private photos visible to friends & family (second request)
		    	 */
		    	getFiltered(req, photoset_id, 4, function(data1){
		    		
		    		/**
		    		 * merge results
		    		 */
		    		data.thumbs = data.thumbs.concat(data1.thumbs);
		    		
		    		callback(data);
		    	});
			} else {
	    		callback(data);			
			}
		});
	}
};

exports.getPhotos = getPhotos;

exports.list = function(req, res){
	getPhotos(req, req.params.id, function(data) {
		if(req.query.play != null) {

      // superslides
			// res.render('play', data);

      // supersized
			res.render('play2', data);

		} else {
			res.render('photos', data);
		}
	});
};
