'use strict';

// var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');

exports.index = (req, res)=>{
  // Game
  res.render('games/index', {games: [{_id: 2}], title: 'Play Game'});
};