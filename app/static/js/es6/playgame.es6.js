/* jshint camelcase:false */
/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('.gamepiece').click(select);
  }

  function select(){
    $('.selected').removeClass('selected');
    $(this).addClass('selected');

    var selection;

    if($(this).hasClass('rock')){
      selection = 'rock';
    }else if($(this).hasClass('paper')){
      selection = 'paper';
    }else if($(this).hasClass('scissors')){
      selection = 'scissors';
    }

    updateDisplay(selection);
  }

  function updateDisplay(selection){
    // $('.picked').css('background-image', 'url(`/img/${selection}.png`)');
  }

})();
