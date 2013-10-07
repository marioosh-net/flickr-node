/*
 * authorize OAuth
 */

exports.auth = function(req, res){
	var oa = req.app.get('oa');
	
	if(req.app.get('config').auth) {
		res.send('app configured. route inactive.');
	} else {
	
		if(req.param('callback')) {
			var oauth_token = req.param('oauth_token');
			var oauth_verifier = req.param('oauth_verifier');
			oa.getOAuthAccessToken(oauth_token, req.session.oauth_token_secret, oauth_verifier, function(err, oauth_access_token, oauth_access_token_secret, results){
				var secured = {
					'results': results,
					'oauth_access_token': oauth_access_token,
					'oauth_access_token_secret': oauth_access_token_secret
				}
				req.app.get('config').auth = secured;
				
				var config = req.app.get('config');
				config.auth = secured;
				config.user_id = secured.results.user_nsid;
				
				var fs = require('fs');
				fs.writeFile('./config.json', JSON.stringify(config, null, 1), function(err){
					req.app.set('config', require('../config.json')); 
				});
				res.redirect('/');
			});
		} else {
			// get request token
			oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results){
				console.log('Redirecting to http://www.flickr.com/services/oauth/authorize?oauth_token='+oauth_token+' ...');
				req.session.oauth_token_secret = oauth_token_secret; // save oauth_token_secret in session
				res.redirect('http://www.flickr.com/services/oauth/authorize?oauth_token='+oauth_token);
			});
		}
	}
};
