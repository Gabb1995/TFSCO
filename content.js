$( document ).ready(function() {

  var body =document.querySelector('body');
  var chatBox;
  
  var minimize = false;
  var checkExist = setInterval(function() {
     if ($('#right_col').length) {
        chatBox = $('#right_col');
        clearInterval(checkExist);
        fsContainer.classList.remove('disabled');
     }
  }, 100);

  function clickFullscreen(){
    var videoFSBtn = document.querySelector('.player-button--fullscreen');
    var chatCloseButton = document.querySelector('#right_close');

    initializeDrag();
    if (!minimize){
        addChatMinimize();
    }
    //make sure click only happens once.
    var counter = 0;
    if(counter === 0){
      counter ++;
      //if chat is closed, toggle it open.
      if(chatBox[0].classList.contains('closed')){
        chatCloseButton.click();
      }
      body.classList.add('TFCO_fullScreenMode');
      videoFSBtn.click();
      chrome.runtime.sendMessage({action: "toggleFullscreen"});
    }
    
  }


  function initializeDrag(){
    //initialize draggable plugin and disable it immediatly
    chatBox.draggable();
    chatBox.draggable('disable');
  }

  function addChatMinimize(){

    minimize = true;

    //create chat minimize button
    var chatMinimze = document.createElement('div');
    chatMinimze.classList.add('TFCO_chatMinimize');
    chatBox[0].appendChild(chatMinimze);

    chatMinimze.addEventListener('click', function(){
      chrome.runtime.sendMessage({action: "toggleMinimized"});
      body.classList.toggle('TFCO_minimized');
    });
  }

  var handlerTimeout;

  //when entering fullscreen and out
  function changeHandler(){
    var savedStyle;

    clearTimeout(handlerTimeout);
    handlerTimeout = setTimeout(function(){
        if( window.innerHeight === screen.height) {
          console.log('go fullscreen');
          chrome.runtime.sendMessage({action: "enterFullscreen"});
          chatBox.draggable('enable');
          chatBox.resizable();
          if(savedStyle){
              chatBox[0].setAttribute('style', savedStyle);
          }
      
        } else {
          console.log('exit fullscreen');

          chrome.runtime.sendMessage({action: "exitFullscreen"});
          body.classList.remove('TFCO_minimized');
          if (body.classList.contains('TFCO_fullScreenMode')){
            savedStyle = chatBox[0].style.cssText;
          }
          body.classList.remove('TFCO_fullScreenMode');
          chatBox.removeAttr("style");
          chatBox.draggable('disable');
        }
    },500);
  }

  if (document.addEventListener){
      document.addEventListener('webkitfullscreenchange', changeHandler, false);
      document.addEventListener('mozfullscreenchange', changeHandler, false);
      document.addEventListener('fullscreenchange', changeHandler, false);
      document.addEventListener('MSFullscreenChange', changeHandler, false);
  }

  function appendDom(){
    var fsToolBar;
    var fsButton;
    fsToolBar = "<div class='fsToolBar'>"+
                  "<div class='fsToolBar-title>Fullscreen with chat</div>"+
                  "<div class='fsToolBar-chatOpacity'>"+
                    "<label>Chat opacity</label>"+
                    "<input type='number' />"+
                  "</div>"+
                  "<div class='fullscreenBtn'>Go!</div>"+
                "</div>"+
                "<div class='loading'>Waiting for chat to load...</div>";

    fsContainer.innerHTML = fsToolBar;
    fsButton = document.querySelector('.fullscreenBtn');
    fsButton.addEventListener('click', clickFullscreen);

  }

  var playerColumn;
  var fsContainer = document.createElement('div');

  fsContainer.classList.add('fsContainer', 'disabled');


  var checkExistTwo = setInterval(function() {
     if ($('.player-column').length) {
        clearInterval(checkExistTwo);
        playerColumn = $('.player-column');
        playerColumn[0].appendChild(fsContainer);
        appendDom();
     }
  }, 100);
});
