'use strict';

var traceur = require('traceur');
var Game = traceur.require(__dirname + '/../models/game.js');
var User = traceur.require(__dirname + '/../models/user.js');

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
    var userId = req.session.userId;
    var isP1 = String(game.p1Id) === userId;
    var isP2 = String(game.p2Id) === userId;
    var isPlayerInThisGame = isP1 || isP2;
    if(isPlayerInThisGame)
    {
      User.findById(userId, user=>
      {
        res.render('games/play', {game: game, user: user, isP1: isP1, title: 'Play Game'});
      });
    }
    else
    {
      res.redirect('/games');
    }
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

exports.shoot = (req, res)=>
{
  var gameId = req.params.gameId;
  Game.findById(gameId, game=>
  {
    var userId = req.session.userId;
    var isP1 = String(game.p1Id) === userId;
    var isP2 = String(game.p2Id) === userId;
    var isPlayerInThisGame = isP1 || isP2;
    if(isPlayerInThisGame)
    {
      var move = req.body.move;
      if(isP1)
      {
        game.setMove(1, move);
      }
      else if(isP2)
      {
        game.setMove(2, move);
      }
      game.save(()=>
      {
        var moves = game.getMoves();
        res.send({moves: moves});
      });
    }
    else
    {
      res.send(null);
    }
  });
};

exports.destroy = (req, res)=>
{
  var gameId = req.params.gameId;
  Game.findById(gameId, game=>
  {
    var userId = req.session.userId;
    var isP1 = String(game.p1Id) === userId;
    var isP2 = String(game.p2Id) === userId;
    var isPlayerInThisGame = isP1 || isP2;
    if(isPlayerInThisGame)
    {
      game.destroy();
    }
    res.send(null);
  });
};

exports.restart = (req, res)=>
{
  var gameId = req.params.gameId;
  Game.findById(gameId, game=>
  {
    var userId = req.session.userId;
    var isP1 = String(game.p1Id) === userId;
    var isP2 = String(game.p2Id) === userId;
    var isPlayerInThisGame = isP1 || isP2;
    if(isPlayerInThisGame)
    {
      game.restart();
      game.save(()=>
      {
        res.send();
      });
    }
  });
};