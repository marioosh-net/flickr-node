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
	
    request(req.app.get('flickr_api_base_url')+'&user_id='+req.app.get('flickr').user_id+'&method=flickr.photosets.getList', function (error, response, body) {
    	var json = JSON.parse(body);
    	var ps = json.photosets.photoset;
    	
    	var albums = [];
    	for(var i=0;i<ps.length;i++){
    		albums.push({id: ps[i].id, title: ps[i].title._content});
    	}
    	
    	if(photoset_id) {
    		// render albums titles only
    		// plus get and render photos
			req.app.get('photos').getPhotos(req, photoset_id, function(data){
				res.render('index', {covers: albums, photoset_id: photoset_id,
					thumbs: data.thumbs,
					photoset: data.photoset
				});
			});
    	} else {
    		// get titles and covers + render
	    	async.concat(ps, function(p, callback){
	    		request(req.app.get('flickr_api_base_url')+'&user_id='+req.app.get('flickr').user_id+'&method=flickr.photos.getSizes&photo_id='+p.primary, function (error, response, body1){
	    			var json1 = JSON.parse(body1);
	    			var cover = {
	    					id: p.id,
	    					title: p.title._content, 
	    					thumb: json1.sizes.size[1].source
	    			};
	    			callback(null, cover);
	    		});    		
	    	}, 
	    	function(err, covers){
	   			res.render('index', {covers: covers, photoset_id: photoset_id});
	    	});
    	}
    });	
};
