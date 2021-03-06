var express = require('express');
var routes = require('./routes');
var photos = require('./routes/photos');
var oauthmy = require('./routes/oauth');
var setup = require('./routes/setup');
var exif = require('./routes/exif');
var http = require('http');
var path = require('path');

/**
 * express app
 */
var app = express();

// all environments
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
    //res.locals.session = req.session;
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
app.get('/setup', setup.get);
app.post('/setup', setup.post);
app.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/');
});

http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
  console.log('Express server listening on port ' + app.get('port'));
});
