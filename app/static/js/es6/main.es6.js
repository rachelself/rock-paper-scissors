// Global functions
function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  'use strict';
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}

(function(){

  'use strict';
  $(document).ready(init);

  function init() {
    $('#login-splash').on('click', '#login-btn1', login);
    $('#login-splash').on('click', '#register', register);
    $('.gamepiece').click(playPiece);
  }

  function playPiece(){
    var piece = $(this).attr('id');
    alert(piece);
  }

  function login() {
    ajax('/login', 'get', null, html=>{
      $('#login-splash').empty().append(html);
    });
  }

  function register() {
    ajax('/register', 'get', null, html=>{
      $('#login-splash').empty().append(html);
    });
  }

})();
