var bcrypt = require('bcrypt');
var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class User{
  save(fn)
  {
    if(this._id)
    {
      userCollection.save(this, ()=>fn(this));  
    }
    else
    {
      userCollection.save(this, (e, user)=>fn(user));
    }
  }

  static register(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(!u){
        var user = new User();
        user.email = obj.email;
        user.password = bcrypt.hashSync(obj.password, 8);
        user.name = obj.name;
        user.wins = 0;
        user.isOnline = true;
        user.save(user=>fn(user));
      }else{
        fn(null);
      }
    });
  }

  static login(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(u){
        var isMatch = bcrypt.compareSync(obj.password, u.password);
        if(isMatch){
          u.isOnline = true;
          u = _.create(User.prototype, u);
          u.save(u=>fn(u));
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }

  static logout(userId, fn){
    userId = Mongo.ObjectID(userId);
    userCollection.findOne({_id: userId}, (e,u)=>{
      if(u){
        u.isOnline = false;
        u = _.create(User.prototype, u);
        u.save(u=>fn(u));
      }else{
        fn(null);
      }
    });
  }

  static findById(userId, fn) {
    userId = Mongo.ObjectID(userId);
    userCollection.findOne({_id:userId}, (e,user)=>{
      user = _.create(User.prototype, user);
      fn(user);
    });
  }
}

module.exports = User;
