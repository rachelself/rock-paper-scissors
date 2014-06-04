/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'todo-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var app = require('../../app/app');
var request = require('supertest');
var traceur = require('traceur');

var User;
var sue;



describe('User', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      User = traceur.require(__dirname + '/../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      User.register({email:'sue@aol.com', password:'abcd'}, function(u){
        sue = u;
        done();
      });
    });
  });

  describe('.register', function(){
    it('should successfully register a user', function(done){
      User.register({email:'bob@aol.com', password:'1234'}, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(u.password).to.have.length(60);
        done();
      });
    });

    it('should NOT successfully register a user', function(done){
      User.register({email:'sue@aol.com', password:'does not matter'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.login', function(){
    it('should successfully login a user', function(done){
      User.login({email:'sue@aol.com', password:'abcd'}, function(u){
        expect(u).to.be.ok;
        done();
      });
    });

    it('should NOT login user - bad email', function(done){
      User.login({email:'wrong@aol.com', password:'abcd'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT login user - bad password', function(done){
      User.login({email:'sue@aol.com', password:'wrong'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a user object by userId', function(done){
      User.findById(sue._id.toString(), function(u){
        expect(u).to.be.instanceof(User);
        expect(u.email).to.equal(sue.email);
        done();
      });
    });

    it('should NOT find a user object by userId', function(done){
      User.findById('123456789012', function(u){
        expect(u).to.be.empty;
        done();
      });
    });

    it('should NOT find a user object by userId', function(done){
      User.findById(null, function(u){
        expect(u).to.be.empty;
        done();
      });
    });
  });

  describe('.logout', function()
  {
    it('should log a user out', function(done)
    {
      expect(sue.isOnline).to.equal(true);
      User.logout(sue._id, function(u)
      {
        sue = u;
        expect(sue.isOnline).to.equal(false);
        done();
      });
    });

    it('should fail to log out with  bad user ID', function(done)
    {
      User.logout('123456789012', function(u)
      {
        expect(u).to.be.null;
        done();
      });      
    });
  });
});
