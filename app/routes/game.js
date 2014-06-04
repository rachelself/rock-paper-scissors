'use strict';

//var traceur = require('traceur');
//var Game = traceur.require(__dirname + '/../models/game.js');

exports.index = (req, res, next)=>{
  var games = [{id:'538f7018ebcb5274ef6d4c8d'}];
    res.render('games/index', {title: 'Game Index Page', games:games});
};

exports.join = (req, res, next)=>{
  res.render('games/join', {title: 'Game ID Page'});
};
