'use strict';

// var traceur = require('traceur');
// var Game = traceur.require(__dirname + '/../models/game.js');

// exports.index = (req, res)=>{
//   Game.findOpenGames(games=>
//   {
//     res.render('games/index', {games: games, title: 'Play Game'});
//   });
// };

exports.index = (req, res, next)=>{
  var games = [{_id:'538f7018ebcb5274ef6d4c8d'}];
    res.render('games/index', {title: 'Game Index Page', games:games});
};

exports.play = (req, res, next)=>{
  res.render('games/play', {title: 'Game ID Page'});
};
