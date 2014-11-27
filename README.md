MusicBox
========
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/tomplays/MusicBox?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## LIVE DEMO
  
  * soon.

## Quick start

` git clone https://github.com/tomplays/MusicBox.git`

` cd MusicBox`

` (sudo) npm install`

` cd public/ `

` bower install` 

` cp config_sample.json config.json`

edit file with 

`(sudo) nano config.json`  (should works without editing..)

be sure mongoDB is running.

`sudo mongod`


## RUN/START 


`sudo grunt`

or `node index.js`

or `forever start index.js`

go to : [http://localhost(:port)/signup](http://localhost(:port)/signup) to create a user account
and [http://localhost/doc/create](http://localhost/doc/create) to edit your first musicbox document. (use 'homepage' as first title to avoid "null" error message. )


##  TECHNICAL STACK


- API Routes / Controllers : [ExpressJs](http://expressjs.com/)
- Templating : [Jade](http://jade-lang.com/) 
- Database : MongoDB (nosql) with [mongooseJs](http://mongoosejs.com/) node driver
- Websockets : [socket.io](http://socket.io/)
- Client-side scripts : 
  - [AngularJs](https://angularjs.org/) v.1.3
  - [UnderscoreJs](http://underscorejs.org/)
  - [MomentJs](http://momentjs.com/)
  - (more : see [bower](https://github.com/tomplays/MusicBox/blob/master/public/bower.json))
- CSS : 
  - [font-awesome](http://fortawesome.github.io/Font-Awesome/) (icons)
  - less compilation
- Color palette : [flatUi](http://flatuicolors.com/)
- Nodes modules 
  - [PasseportJs](http://passportjs.org/)
  - [nconf](https://github.com/flatiron/nconf)
  - (more see [package.json](https://github.com/tomplays/MusicBox/blob/master/package.json))
- Misc/Tools :
  - npm
  - Travis
  - Bower
  - Grunt

## Conversation 

https://gitter.im/tomplays/MusicBox

## Todos and bugs report :

[![Build Status](https://travis-ci.org/tomplays/MusicBox.png?branch=master)](https://travis-ci.org/tomplays/MusicBox)


Using (https://github.com/tomplays/MusicBox/issues?state=open) open issues

## AUTHOR

Tom Wersinger <homeof@gmail.com>

## COPYRIGHT

Copyright (C) 2014 Tom Wersinger <homeof@gmail.com>

## LICENSE

MIT License

See [LICENSE](https://github.com/tomplays/MusicBox/blob/master/LICENSE.md)

#### DISCLAIMER

This software doesn't play music, sorry.
/-)