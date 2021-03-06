'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var games = traceur.require(__dirname + '/../routes/games.js');

  app.all('*', users.lookup);

  app.get('/', dbg, home.index);
  app.get('/login', dbg, home.login);
  app.post('/login', dbg, home.authenticate);
  app.get('/register', dbg, home.register);

  app.post('/logout', dbg, users.logout);

  app.get('/games', dbg, games.index);
  app.get('/games/:gameId', dbg, games.play);
  app.post('/games', dbg, games.new);
  app.post('/games/:gameId', dbg, games.join);
  app.post('/games/:gameId/shoot', dbg, games.shoot);
  app.post('/games/:gameId/destroy', dbg, games.destroy);
  app.post('/games/:gameId/restart', dbg, games.restart);

  app.get('*', dbg, home.notFound);

  console.log('Routes Loaded');
  fn();
}
