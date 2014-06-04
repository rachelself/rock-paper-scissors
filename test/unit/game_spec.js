/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'rps-game-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var app = require('../../app/app');
var request = require('supertest');
var traceur = require('traceur');

var User;
var Game;
var sue;
var game;


describe('Game', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      User = traceur.require(__dirname + '/../../app/models/user.js');
      Game = traceur.require(__dirname + '/../../app/models/game.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      User.register({email:'sue@aol.com', name:'sue', password:'abcd'}, function(u){
        sue = u;
        Game.create(sue._id, function(g){
          game = g;
          done();
        });
      });
    });
  });

  describe('.create', function()
  {
    it('should create  new game', function(done)
    {
      Game.create(sue._id, function(game)
      {
        expect(game).to.be.ok;
        expect(game).to.be.an.instanceof(Game);
        expect(game._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(game.p1Id).to.be.an.instanceof(Mongo.ObjectID);
        expect(game.p1Id).to.deep.equal(sue._id);
        expect(game.p2Id).to.be.null;
        expect(game.move).to.be.null;
        expect(game.whoMoved1st).to.be.null;
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should successfully find a game by ID', function(done){
      Game.findById(game._id, function(g){
        expect(g).to.be.ok;
        expect(g).to.be.an.instanceof(Game);
        expect(g._id).to.be.an.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
});