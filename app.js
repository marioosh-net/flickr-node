
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
// var photosets = require('./routes/photosets');
var photos = require('./routes/photos');
var oauthmy = require('./routes/oauth');
var exif = require('./routes/exif');
var http = require('http');
var path = require('path');
var OAuth = require('OAuth');

// flickr
var flickr = require('./config');

var app = express();

// all environments
app.set('flickr_api_base_url', flickr.base_url+'?format=json&nojsoncallback=1&oauth_consumer_key='+flickr.consumer_key);
app.set('flickr', flickr);
app.set('photos', photos);
app.set('http', http);
app.set('port', process.env.PORT || 3000);

var oa = new OAuth.OAuth("https://www.flickr.com/services/oauth/request_token",
		"https://www.flickr.com/services/oauth/access_token",
		flickr.consumer_key,
		flickr.consumer_secret,
		"1.0",
		'http://127.0.0.1:'+app.get('port')+'/auth?callback=1',
		"HMAC-SHA1");
app.set('oa', oa);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('1234567890QWERTY'));
app.use(express.session());
/**
 * middleware...
 * expose to .ejs some objects
 */
app.use(function (req, res, next) {
    res.locals.session = req.session;
    
    /**
     * for test authenticated requests
     */
    req.session.auth = { results:
    { fullname: 'Mario Oiram',
        user_nsid: '96083601@N05',
        username: 'mario790329' },
     oauth_access_token: '72157636044924706-e2e797a4ef481cb5',
     oauth_access_token_secret: '4a5a4e212550d84e' };
    
    next();
});

app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * routes
 */
app.get('/', routes.index);
app.get('/album/:id', photos.list);
app.get('/direct/:id', routes.index);
app.get('/exif/:id/:secret', exif.list);
app.get('/auth', oauthmy.auth);
app.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
