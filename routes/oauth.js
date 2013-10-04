/*
 * authorize OAuth
 */

exports.auth = function(req, res){
	var oa = req.app.get('oa');
	
	if(req.param('callback')) {
		var oauth_token = req.param('oauth_token');
		var oauth_verifier = req.param('oauth_verifier');
		oa.getOAuthAccessToken(oauth_token, req.session.oauth_token_secret, oauth_verifier, function(err, oauth_access_token, oauth_access_token_secret, results){
			var secured = {
				'results': results,
				'oauth_access_token': oauth_access_token,
				'oauth_access_token_secret': oauth_access_token_secret
			}
			console.log(secured);
			req.session.auth = secured;
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
};
