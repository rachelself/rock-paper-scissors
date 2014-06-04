'use strict';

var traceur = require('traceur');
var Game = traceur.require(__dirname + '/../models/game.js');

exports.index = (req, res)=>{
  Game.findOpenGames(games=>
  {
    res.render('games/index', {games: games, title: 'Available Games'});
  });
};

exports.test = (req, res)=>{
  var game = {_id:'538f7018ebcb5274ef6d4c8d'};
  var players = {p1:'Bob', p2:'Carter'};
  res.render('games/show', {game:game, players:players, title: 'Play Game'});
};
