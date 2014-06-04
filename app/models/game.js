var gameCollection = global.nss.db.collection('games');
var Mongo = require('mongodb');
var _ = require('lodash');

class Game{
  save(fn)
  {
    if(this._id)
    {
      gameCollection.save(this, ()=>fn(this));  
    }
    else
    {
      gameCollection.save(this, (e, game)=>fn(game));
    }
  }

  static create(userId, fn)
  {
    var game = new Game();
    game.p1Id = Mongo.ObjectID(userId);
    game.p2Id = null;
    game.move = null;
    game.whoMoved1st = null;
    game.save(game=>fn(game));
  }

  static findById(gameId, fn) {
    gameId = Mongo.ObjectID(gameId);
    gameCollection.findOne({_id:gameId}, (e,game)=>{
      game = _.create(Game.prototype, game);
      fn(game);
    });
  }
}

module.exports = Game;