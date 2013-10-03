
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

var sha1 = require('./node_modules/flickr-with-uploads/node_modules/oauth/lib/sha1'); 


var app = express();

// all environments
app.set('flickr_api_base_url', flickr.base_url+'?format=json&nojsoncallback=1&oauth_consumer_key='+flickr.consumer_key);
app.set('flickr', flickr);
app.set('photos', photos);
app.set('OAuth', OAuth);
app.set('http', http);
app.set('port', process.env.PORT || 3000);
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
