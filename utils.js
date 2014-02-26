/**
 * check config completion (minimum)
 */
exports.checkConfig = function(config) {
	if(!config.consumer_key || !config.consumer_secret || config.consumer_key == '' || config.consumer_secret == '') {
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
	return config.mode != null && config.mode.some(function(val){return val != 1;});
}