/**
 * albums + album covers / home page
 * 
 * flickr.photosets.getList
 * flickr.photos.getSizes
 */
var async = require('async');
var request = require('request');


exports.index = function(req, res){
    var flickr = req.app.get('flickr');

    request(req.app.get('flickr_api_base_url')+'&user_id='+flickr.user_id+'&method=flickr.photosets.getList', function (error, response, body) {
    	var json = JSON.parse(body);
    	var ps = json.photosets.photoset;
    	
    	async.concat(ps, function(p, callback){
    		request(req.app.get('flickr_api_base_url')+'&user_id='+flickr.user_id+'&method=flickr.photos.getSizes&photo_id='+p.primary, function (error, response, body1){
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
           	res.render('index', {covers: covers});    		
    	});
    });	
};
