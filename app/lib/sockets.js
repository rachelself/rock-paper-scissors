'use strict';

var Cookies = require('cookies');

exports.connection = function(socket){
  addUserToSocket(socket);
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

function addUserToSocket(socket){
  var cookies = new Cookies(socket.handshake, {}, ['SEC123', '321CES']);
  var encoded = cookies.get('express:sess');
  var decoded;

  if(encoded){
    decoded = decode(encoded);
  }

  // 1. Find user in DB
  // 2. Add user to socket
  // 3. Inform the user they are online

  // EXAMPLE CODE

  // User.findByUserId(obj.userId, user=>{
  //   socket.set('user', user, ()=>{
  //     socket.emit('online');
  //   });
  // });

  console.log(decoded);
}

function decode(string) {
  var body = new Buffer(string, 'base64').toString('utf8');
  return JSON.parse(body);
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

// RPS Game Logic below this point

exports.connectToGame = function(socket, b, c)
{
  socket.on('join', join);
  socket.on('shoot', shoot);
  socket.on('quit', quit);
};

function quit()
{
  var socket = this;
  socket.broadcast.emit('quit');
}

function join(data)
{
  var socket = this;

  emitAll(socket, 'joined-'+data.gameId, data.user);
}

function shoot(data)
{
  var socket = this;

  var moves = data.moves;
  var moveInts = moves.map(function(move)
  {
    switch(move)
    {
      case 'rock':
        return 1;
      case 'paper':
        return 2;
      case 'scissors':
        return 3;
      default:
        return 0;
    }
  });

  if(moveInts[0] === moveInts[1])
  {
    sendResult('draw');
  }
  else if(moveInts[0] === 0)
  {
    sendResult('p2');
  }
  else if(moveInts[1] === 0)
  {
    sendResult('p1');
  }
  else if(moveInts[0] - moveInts[1] === 1)
  {
    sendResult('p1');
  }
  else if(moveInts[1] - moveInts[0] === 2)
  {
    sendResult('p1');
  }
  else
  {
    sendResult('p2');
  }

  function sendResult(result)
  {
    emitAll(socket, 'result-'+data.gameId, {result: result, moves: moves});
  }
}

function emitAll(socket, name, data={})
{
  socket.broadcast.emit(name, data);
  socket.emit(name, data);
}