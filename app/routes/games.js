'use strict';

var traceur = require('traceur');
var Game = traceur.require(__dirname + '/../models/game.js');

exports.index = (req, res)=>{
  if(req.session.userId)
  {
    Game.findOpenGames(games=>
    {
      res.render('games/index', {games: games, title: 'Available Games'});
    });
  }
  else
  {
    res.redirect('/');
  }
};

exports.new = (req, res)=>
{
  var userId = req.session.userId;
  Game.create(userId, game=>
  {
    res.redirect('/games/' + game._id);
  });
};

exports.play = (req, res)=>
{
  Game.findById(req.params.gameId, game=>
  {
    res.render('games/play', {game: game, title: 'Play Game'});
  });
};

exports.join = (req, res)=>
{
  var gameId = req.params.gameId;
  Game.findById(gameId, game=>
  {
    if(game)
    {
      game.join(req.session.userId);
      var didJoin = String(game.p2Id) === req.session.userId;
      if(didJoin)
      {
        game.save(()=>
        {
          res.redirect('/games/'+gameId);
        });
      }
      else
      {
        res.redirect('/games');
      }
    }
    else
    {
      res.redirect('/games');
    }
  });
};
