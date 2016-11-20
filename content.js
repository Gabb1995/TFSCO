$( document ).ready(function() {

  var body =document.querySelector('body');
  var chatBox;
  var savedStyle;
  var chatOpacity;

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
    addChatSettings();
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


  function rangeOnChange(){
    $(document).on('input change', '#CS_opacity', function() {
       chatBox[0].style.opacity = this.value / 100;
    });
  }

  function addChatSettings(){
     var chatSettings = document.createElement('div');
     chatSettings.classList.add('TFCO_chatSettings', 'TFCO_chatButton');
     chatBox[0].appendChild(chatSettings);
     chatSettings.addEventListener('click', function(){
         body.classList.toggle('TFCO_settingsOpen');
      });


      var chatSettingsBoxContainer = document.createElement('div');
      var chatSettingsBox = "<div class='CS_box'>"+
                              "<label for='CS_opacity'></label>"+
                              "<input id='CS_opacity' type='range' min='10' value='50' max='100'></input>"+
                            "</div>";
       chatBox[0].appendChild(chatSettingsBoxContainer);
       chatSettingsBoxContainer.innerHTML = chatSettingsBox;
  }


  function addChatMinimize(){

    minimize = true;

    //create chat minimize button
    var chatMinimze = document.createElement('div');
    chatMinimze.classList.add('TFCO_chatMinimize', 'TFCO_chatButton');
    chatBox[0].appendChild(chatMinimze);

    chatMinimze.addEventListener('click', function(){
      chrome.runtime.sendMessage({action: "toggleMinimized"});
      body.classList.toggle('TFCO_minimized');
    });
  }

  var handlerTimeout;

  //when entering fullscreen and out
  function changeHandler(){
   

    clearTimeout(handlerTimeout);
    handlerTimeout = setTimeout(function(){
        //ENTER FULLSCREEN
        if( window.innerHeight === screen.height) {
          console.log('go fullscreen');
          chrome.runtime.sendMessage({action: "enterFullscreen"});
          chatBox.draggable('enable');
          chatBox.resizable();
          rangeOnChange();
          if(savedStyle){
              chatBox[0].setAttribute('style', savedStyle);
              document.getElementById('#CS_opacity').value = chatOpacity;
          }
        //EXIT FULLSCREEN
        } else {
          chrome.runtime.sendMessage({action: "exitFullscreen"});
          body.classList.remove('TFCO_minimized');
          if (body.classList.contains('TFCO_fullScreenMode')){
            savedStyle = chatBox[0].style.cssText;
            chatOpacity = chatBox[0].style.opacity;
          }
          body.classList.remove('TFCO_fullScreenMode');
          chatBox.removeAttr("style");
          chatBox.draggable('disable');
          console.log('exit fullscreen');
        }
    },100);
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
    fsToolBar = "<div class='fullscreenBtn'>Go!</div>"+
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
