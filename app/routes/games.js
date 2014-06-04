'use strict';

var traceur = require('traceur');
var Game = traceur.require(__dirname + '/../models/game.js');

exports.index = (req, res)=>{
  Game.findOpenGames(games=>
  {
    res.render('games/index', {games: games, title: 'Play Game'});
  });
};