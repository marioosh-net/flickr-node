flickr-node
===============

[Flickr](http://www.flickr.com/) gallery powered by [node.js](http://nodejs.org/)

![flickr-node](http://farm6.staticflickr.com/5497/10158823995_7690a23ceb_o.jpg)

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
have to choose gallery mode, Your API key etc. Depending on settings You will be redirected to authorize app to access Your Flickr account.
In `private modes` listed sets need to have `[public]` phrase in description or description = ' ' (space).

Demo on Heroku

   [http://flickr-node.herokuapp.com/](http://flickr-node.herokuapp.com/)
