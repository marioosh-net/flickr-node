/**
 * load config and return as JSON
 */
exports.config = function() {
	var fs = require('fs');
	var file = __dirname + '/config.json';
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}
/**
 * check config completion (minimum)
 */
exports.checkConfig = function(config) {
	// if(!config.consumer_key || !config.consumer_secret || config.consumer_key == '' || config.consumer_secret == '') {
	if(!config.consumer_key || config.consumer_key == '') {
		return false;
	}
	if(!config.mode || config.mode == '') {
		return false;
	}
	if(!config.user_id && !config.auth) {
		return false;
	}
	return true;
}

/**
 * is auth required
 */
exports.requiredAuth = function(config) {
	return config.mode != null && config.mode.some(function(val){return val != 1;});
}

/**
 * produce api base url
 * if config not defined take config from config.json
 */
exports.getBaseUrl = function(config) {
	var config1 = typeof config !== 'undefined' ? config : exports.config();
	return (config1.https ? 'https://api.flickr.com/services/rest' : 'http://api.flickr.com/services/rest')+'?format=json&nojsoncallback=1&oauth_consumer_key='+config1.consumer_key;
}