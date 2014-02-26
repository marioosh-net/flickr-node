/**
 * check config completion (minimum)
 */
exports.checkConfig = function(config) {
	if(!config.consumer_key || !config.consumer_secret || config.consumer_key == 'YOUR_API_KEY' || config.consumer_secret == 'YOUR_API_SECRET') {
		return false;
	}
	if(!config.user_id || !config.mode) {
		return false;
	}
	return true;
}

/**
 * is auth required
 */
exports.requiredAuth = function(config) {
	return config.mode.some(function(val){return val != 1;});
}