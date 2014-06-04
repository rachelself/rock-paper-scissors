'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.index = (req, res)=>{
  console.log('-----Home index --------');
  res.render('home/index', {title: 'To Do Home Page'});
};

exports.login = (req, res)=>{
  console.log('in LOGIN');
  res.render('home/login', {type:'login'});
};

exports.register = (req, res)=>{
  res.render('home/login', {type:'register'});
};

exports.authenticate = (req, res)=>{
  console.log(req.body);
  var obj = {email: req.body.email, password: req.body.password};
  if(req.body['auth-type'] === 'login') {
    User.login(obj, ()=>{
      res.redirect('tasks/index');
    });
  }
  else {
    User.register(obj, ()=>{
      res.redirect('tasks/index');
    });
  }
};
