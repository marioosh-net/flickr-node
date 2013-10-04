flickr-node
===============

[Flickrj](http://flickrj.sourceforge.net/) gallery powered by [node.js](http://nodejs.org/)

Installation
------------
Clone the repository

    git clone git://github.com/marioosh-net/flickr-node.git</code></pre>

Change directory to project path and get neccessay modules for node.js

    cd flickr-node
    npm install

Edit config.js file 

    exports.use_https = false;
    exports.consumer_key = 'Your API Key';
    exports.user_id = 'Your userId for example 96083601@N05';
    exports.consumer_secret = 'Your secret';

Run node.js app (defalt port is 3000) 

    node app.js
    
To run on specified port number

    PORT=8080 node app.js
