/**
 * check config completion (minimum)
 */
exports.checkConfig = function(config) {
	console.log(config);
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