/*
 * authorize OAuth
 */

exports.get = function(req, res){

	if(req.app.get('config').auth) {
		res.send('app configured. route inactive.');
	} else {
		res.render('setup',{});
	}
}

exports.post = function(req, res){

	if(req.app.get('config').auth) {
		res.send('app configured. route inactive.');
	} else {
		var config = req.app.get('config');
		
		// config.user_id = req.body.user_id;		
		config.mode = req.body.mode;
		
		/**
		 * save config
		 */
		var fs = require('fs');
		fs.writeFile('./config.json', JSON.stringify(config, null, 1), function(err){
			req.app.set('config', require('../config.json')); 
		});
		
		res.redirect('/auth');
		// res.render('setup');
	}
}
