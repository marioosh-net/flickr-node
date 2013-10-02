
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var photosets = require('./routes/photosets');
var http = require('http');
var path = require('path');

// flickr
var flickr = {
    base_url: 'http://api.flickr.com/services/rest',
    consumer_key: '433ea818849c5c5ed6ac545b243196b1',
    user_id: '96083601@N05',
    consumer_secret: '17aebaefbdd995ef',
    oauth_token: '72157636044924706-e2e797a4ef481cb5',
    oauth_token_secret: '4a5a4e212550d84e'
};

var sha1 = require('./node_modules/flickr-with-uploads/node_modules/oauth/lib/sha1'); 


var app = express();

// all environments
app.set('flickr_api_base_url', flickr.base_url+'?format=json&nojsoncallback=1&oauth_consumer_key='+flickr.consumer_key);
app.set('flickr', flickr);
app.set('http', http);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/photosets', photosets.list)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
