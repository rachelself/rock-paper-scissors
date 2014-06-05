/* global io */

'use strict';

$(function(){

  var socket;
  var $game = $('#game');
  var user = $game.data('user');
  var gameId = $game.data('gameid');
  var isP1 = $game.data('isp1');

  // $(window).unload(()=>
  // {
  //   ajax(`/games/${gameId}/destroy`, 'POST', {}, ()=>{});
  //   socket.emit('quit', {gameId: gameId});
  // });

  initializeSocketIo();

  function playGame(data)
  {
    console.log('PLAY GAME');
    start();

    function start()
    {
      console.log('START GAME');
      socket.removeAllListeners(`joined-${gameId}`);
      allowUserInput();

      var time = 3;
      var $timer = $('#game .timer');
      var timer = setInterval(tickClock, 1000);
      // setTimeout(tickClock, 1000);

      function allowUserInput()
      {
        $('#moves').on('click', '.gamepiece', clickMove);
        $('body').on('keydown', keyMove);
      }

      function disallowUserInput()
      {
        $('#moves').off('click');
        $('body').off('keydown');
      }

      function tickClock()
      {
        console.log(time);
        $timer.text(time);
        if(--time < 0)
        {
          clearInterval(timer);
          submitMove();
        }
        // else
        // {
        //   setTimeout(tickClock, 1000);
        // }
      }

      function submitMove()
      {
        socket.on('result-'+gameId, checkResult);

        disallowUserInput();
        $timer.text('');

        var move = $('#player').attr('data-move');
        move = move ? move : 'nothing';
        ajax(`/games/${gameId}/shoot`, 'POST', {move: move}, data=>
        {
          data = jQuery.parseJSON(data);
          if(data.moves.length >= 2)
          {
            socket.emit('shoot', {moves: data.moves, gameId: gameId});
          }
        });
      }

      function checkResult(data)
      {
        socket.removeAllListeners('result');
        switch(data.result)
        {
          case 'draw':
            $timer.text('Tie...');
            break;
          case 'p1':
            if(isP1)
            {
              $timer.text('You win!!');
            }
            else
            {
              $timer.text('You lose...');
            }
            break;
          case 'p2':
            if(!isP1)
            {
              $timer.text('You win!!');
            }
            else
            {
              $timer.text('You lose...');
            }
            break;
          default:
            $timer.text('An error has occured. Please refresh the page. '+data.result);
        }
        setTimeout(restart, 3000);
      }

      function restart()
      {
        console.log('RESTART');
        ajax(`/games/${gameId}/restart`, 'POST', {}, ()=>
        {
          clearMoves();
          start();
        });        
      }

      function clearMoves()
      {
        var playerImgs = [$('#player'), $('#opponent')];
        playerImgs.forEach($player=>
        {
          $player.attr('src', '/img/nothing.png');
          $player.attr('data-move', 'nothing');          
        });
      }

      function clickMove()
      {
        var move = $(this).attr('id');
        setMove(move);
      }

      function keyMove(e)
      {
        var key = e.keyCode;
        if(key >= 38 && key <= 40)
        {
          e.preventDefault();
        }

        var move = '';
        switch(e.keyCode)
        {
          case 37:
            move = 'rock';
            break;
          case 40:
            move = 'paper';
            break;
          case 39:
            move = 'scissors';
            break;
          default:
            move = '';
        }
        setMove(move);
      }

      function setMove(move)
      {
        var $player = $('#player');
        $player.attr('src', `/img/${move}.png`);
        $player.attr('data-move', move);
      }
    }
  }

  function initializeSocketIo(){
    socket = io.connect('/game');
    socket.on('quit', ()=>
    {
      // window.location.href = '/games';
    });
    socket.on('connect', ()=>
    {
      console.log('BEGIN');
      socket.on(`joined-${gameId}`, playGame);
      if(!isP1)
      {
        socket.emit('join', {user: user, gameId: gameId});
      }
    });
  }

  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html')
  {
    $.ajax(
    {
      url: url,
      type: type,
      dataType: dataType,
      data: data,
      success: success
    });
  }
});