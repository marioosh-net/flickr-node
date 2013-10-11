flickr-node
===============

[Flickr](http://www.flickr.com/) gallery powered by [node.js](http://nodejs.org/)

Installation
------------
Application require installed [Node.js](http://nodejs.org/) environment.

Clone the repository

    git clone https://github.com/marioosh-net/flickr-node.git

Change directory to project path and get necessary modules for node.js

    cd flickr-node
    npm install

Run node.js app (defalt port is 3000) 

    node app.js
    
To run on specified port number

    PORT=8080 node app.js

Open [http://localhost:3000](http://localhost:3000) in Your browser. You will get setup page where You
have to choose gallery mode. Next You will be redirected to authorize app to access Your Flickr account.
In `mode=2` listed sets need to have `[public]` phrase in description.