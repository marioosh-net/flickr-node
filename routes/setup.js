/*
 * configuration page controller
 */

var utils = require('../utils.js');
var request = require('request');

exports.get = function(req, res){
	var config = utils.config();
	if(utils.checkConfig(config)) {
		res.send('app configured. route inactive.');
	} else {
		modes = {};
		if(config.mode) {
			config.mode.forEach(function(v){
				modes['m'+v] = true;
			});
		}
		res.render('setup',{config:config, modes:modes});
	}
}

exports.post = function(req, res){
	var config = utils.config();

	if(!req.body.mode || !req.body.consumer_key /*|| !req.body.consumer_secret*/
		|| req.body.mode=='' || req.body.consumer_key=='' /*|| req.body.consumer_secret==''*/
		) {
		res.send('configuration error: mode and apiKey required');
		return;			
	}

	/**
	 * check is user_id required
	 * user_id is not required when one of mode value is 2,3,4 or 5
	 */
	var user_id_required = false;
	var mode = [].concat(req.body.mode);
	if(!mode.some(function(val){return val != 1;})) {
		user_id_required = true;
		if(!req.body.user_id || req.body.user_id=='') {
			res.send('configuration error: userId required');
			return;			
		}
	}

	/**
	 * check is consumer_secret required
	 */
	if(!user_id_required) {
		if(!req.body.consumer_secret || req.body.consumer_secret=='') {
			res.send('configuration error: auth required so secret required');
			return;			
		}		
	}

	/**
	 * save config and redirect to / or /auth (if required)
	 */
	var saveAndRedirect = function(){
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
			req.app.set('config', utils.config()); 
		});
		
		if(utils.requiredAuth(config)) {
			/* required auth */
			res.redirect('/auth');
		} else {
			res.redirect('/');
		}			
	};

	if(user_id_required) {
		/**
		 * check user_id exists
		 */
		var url = utils.getBaseUrl(false,req.body.consumer_key)+'&method=flickr.people.getInfo&user_id='+req.body.user_id;
		request(url, {json: true}, function (error, response, body){
			if(body.stat == 'fail') {
				res.send('configuration error: '+body.message);
				return;
			} else {
				req.app.set('flickr_api_base_url',utils.getBaseUrl(false,req.body.consumer_key));
				saveAndRedirect();
			}
		});
	} else {
		saveAndRedirect();
	}
}
