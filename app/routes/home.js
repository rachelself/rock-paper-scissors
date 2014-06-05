'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.index = (req, res)=>{
  if(!req.session.userId)
  {
    res.render('home/index', {title: 'Rock Paper Scissors - Welcome!'});
  }
  else
  {
    res.redirect('/games');
  }
};

exports.login = (req, res)=>{
  res.render('home/login', {type:'login'});
};

exports.register = (req, res)=>{
  res.render('home/login', {type:'register'});
};

exports.authenticate = (req, res)=>{
  console.log(req.body);
  var obj = {email: req.body.email, name: req.body.name, password: req.body.password};
  if(req.body['auth-type'] === 'login') {

    User.login(obj, u=>{
      if(u)
      {
        req.session.userId = u._id;
        res.redirect('/games');
      }
      else
      {
        res.redirect('/');
      }
    });
  }
  else {
    User.register(obj, u=>{
      if(u)
      {
        req.session.userId = u._id;
        res.redirect('/games');
      }
      else
      {
        res.redirect('/');
      }
    });
  }
};

exports.notFound = (req, res)=>
{
  res.redirect('/');
};
