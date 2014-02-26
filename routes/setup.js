/*
 * authorize OAuth
 */

var utils = require('../utils.js');

exports.get = function(req, res){
	var config = req.app.get('config');
	if(config.auth) {
		res.send('app configured. route inactive.');
	} else {
		modes = {};
		if(config.mode) {
			config.mode.forEach(function(v, i){
				modes[v] = true;
			});
		}
		config.modes = modes;
		res.render('setup',config);
	}
}

exports.post = function(req, res){

	if(req.app.get('config').auth) {
		res.send('app configured. route inactive.');
	} else {
		var config = req.app.get('config');

		/*
		if(config.user_id) {
			var url = req.app.get('flickr_api_base_url')+'&method=flickr.people.getInfo&user_id='+config.user_id;
			request(url, {json: true}, function(data){
				if(data.stat == 'fail') {
					res.send('wrong user_id');
					return;
				}
			});
		}
		*/
		
		// config.user_id = req.body.user_id;		
		config.mode = [];
		config.mode = config.mode.concat(req.body.mode);
		config.user_id = req.body.user_id;
		config.consumer_key = req.body.consumer_key;
		config.consumer_secret = req.body.consumer_secret;
		
		/**
		 * save config
		 */
		var fs = require('fs');
		fs.writeFile('./config.json', JSON.stringify(config, null, 1), function(err){
			req.app.set('config', require('../config.json')); 
		});
		
		if(utils.requiredAuth(config)) {
			/* required auth */
			res.redirect('/auth');
		} else {
			res.redirect('/');
		}
	}
}
