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

  destroy(fn)
  {
    gameCollection.remove({_id: this._id}, fn);
  }

  join(userId)
  {
    if(String(this.p1Id) !== userId)
    {
      this.p2Id = this.p2Id ? this.p2Id : userId;
    }
  }

  setMove(playerNumber, move)
  {
    switch(playerNumber)
    {
      case 1:
        this.p1move = move;
        break;
      case 2:
        this.p2move = move;
        break;
      default:
    }
  }

  getMoves()
  {
    var moves = [];
    if(this.p1move)
    {
      moves.push(this.p1move);
    }
    if(this.p2move)
    {
      moves.push(this.p2move);
    }
    return moves;
  }

  static create(userId, fn)
  {
    var game = new Game();
    game.p1Id = Mongo.ObjectID(userId);
    game.p2Id = null;
    game.p1move = null;
    game.p2move = null;
    game.save(game=>fn(game));
  }

  static findById(gameId, fn) {
    gameId = Mongo.ObjectID(gameId);
    gameCollection.findOne({_id:gameId}, (e,game)=>{
      game = _.create(Game.prototype, game);
      fn(game);
    });
  }

  static findOpenGames(fn)
  {
    gameCollection.find({p2Id: null}).toArray((e, games)=>
    {
      fn(games);
    });
  }
}

module.exports = Game;