'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname+'/../models/user.js');

exports.lookup = (req, res, next)=>{
  User.findById(req.session.userId, user=>{
    console.log(user);
    res.locals.user = user;
    next();
  });
};

exports.logout = (req, res)=>{
  User.logout(req.session.userId, ()=>{
    req.session.userId = null;
    res.redirect('/');
  });
};
