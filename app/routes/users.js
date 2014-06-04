'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname+'/../models/user.js');

exports.lookup = (req, res, next)=>{
  User.findById(req.session.userId, user=>{
    res.locals.user = user;
    next();
  });
};
