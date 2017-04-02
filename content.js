$( document ).ready(function() {

  var chatBox, chatHeader, savedStyle, tabSavedStyle, chatOpacity, chatAlpha, chatPositionAndSize, chatOpacityAndAlpha, videoFSBtn, chatCloseButton, playerColumn, playerButtonsRight, tabContainer, fsToolBar, fsButton, windowWidth, slimModeE, hideStickyCheersE;
  var body = document.body;
  var minimize = false;
  var settings = false;
  var mouse_in = false;
  var fsPlayerBtn = document.createElement('button');
  var fsContainer = document.createElement('div');
  var chatSettings = document.createElement('div');
  var chatSettingsBoxContainer = document.createElement('div');
  var chatSettingsBox = "<div class='CS_box'>"+
                          "<div class='CS_box_content'>"+
                            "<div class='input_pair'>" +
                              "<div class='input_label'>Chatbox opacity</div>"+
                              "<input id='CS_opacity' type='range' min='25' max='100'></input>"+
                            "</div>"+
                            "<div class='input_pair'>" +
                              "<div class='input_label'>Chatbox bg alpha</div>"+
                              "<input id='CS_color_opacity' type='range' min='0' max='100'></input>"+
                            "</div>"+
                            "<div class='input_pair'>" +
                              "<div class='input_label'>Hide sticky cheer</div>" +
                              "<div class='checkbox_hide_sticky'>" +
                                "<input id='CS_hide_sticky' type='checkbox'></input>"+
                                "<label for='CS_hide_sticky'></label>"+
                              "</div>"+
                            "</div>"+
                            "<div class='input_pair'>" +
                              "<div class='input_label'>Slim mode</div>" +
                              "<div class='checkbox_slim_mode'>" +
                                "<input id='CS_slim_mode' type='checkbox'></input>"+
                                "<label for='CS_slim_mode'></label>"+
                              "</div>"+
                            "</div>"+
                           "</div>"+
                        "</div>";
  var chatMinimze = document.createElement('div');


  // check if we are already initialized if not reinitialize
  var checkReady = setInterval(function() {
       if (document.querySelector('.fullscreenBtn') === null) {
           minimize = false;
           settings = false;
           declareEssentialsOnTime();
       }
    },2000);

  $("body").mouseup(function(){ 
        if(!mouse_in) body.classList.remove('TFCO_settingsOpen');
  });


  declareEssentialsOnTime();

  function  declareEssentialsOnTime(){
    //wait for the chatbox container to load
    var findChatBox = setInterval(function() {
       if ($('#right_col .chat-room').length) {
          chatBox = $('#right_col');
          chatHeader = $('.chat-header');
          clearInterval(findChatBox);
       }
    }, 100);

    //wait for the tab-container to load
    var findTabContainer = setInterval(function() {
       if ($('.tab-container').length) {
          tabContainer = $('.tab-container');
          clearInterval(findTabContainer);
       }
    }, 100);

    //wait for the player-column to load
    var findPlayerColumn = setInterval(function() {
       if ($('.player-column').length) {
          clearInterval(findPlayerColumn);
          playerColumn = $('.player-column');
          playerColumn[0].appendChild(fsContainer);
          // appendDom();
       }
    }, 100);

    //wait for the player-buttons to load
    var findPlayerButtons = setInterval(function() {
       if ($('.player-buttons-right').length) {
          clearInterval(findPlayerButtons);
          playerButtonsRight = $('.player-buttons-right');
          playerButtonsRight[0].appendChild(fsPlayerBtn);
          appendPlayerBtn();
       }
    }, 100);
  }
  
  function addChat(){
   
    chatCloseButton = document.querySelector('#right_close');
    chatBox.draggable({
      disabled:true,
      handle: chatHeader[0]
    });
    chatBox.resizable({disabled:true});

    if (!minimize){
        addChatMinimize();
    }
     if (!settings){
      addChatSettings();
    }

    //if chat is closed, toggle it open.
    if(chatBox[0].classList.contains('closed')){
      chatCloseButton.click();
    }
    body.classList.add('TFCO_fullScreenMode');
  }

  function clickFullscreen(){
    videoFSBtn = document.querySelector('.player-button--fullscreen');
    // if(!(window.innerHeight === screen.height)) {
    //   videoFSBtn.click();
    //   addChat();    
    // } else if( (window.innerHeight === screen.height) && body.classList.contains('TFCO_fullScreenMode')) {
    //   videoFSBtn.click();  
    // } else {
    //   addChat();
    // }
    videoFSBtn.click();
      addChat();  
  }

  // STORAGE 
  function saveChanges() {
    // Check that there's some code there.
    var myObj = {};
    myObj.chatOpacityAndAlpha = tabSavedStyle;
    myObj.chatPositionAndSize = savedStyle;
    myObj.slimModeE = slimModeE;
    myObj.hideStickyCheersE = hideStickyCheersE;

    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'myObj': myObj}, function() {
      console.log("saved items");
    });
  }

  function loadChanges() {
     // Save it using the Chrome extension storage API.
    chrome.storage.sync.get('myObj', function(items) {
      if (!chrome.runtime.error) {

        tabContainer[0].setAttribute('style', items.myObj.chatOpacityAndAlpha);
        chatBox[0].setAttribute('style', items.myObj.chatPositionAndSize);
        if(items.myObj.slimModeE){
          $(".checkbox_slim_mode label").click();
        }
        if(items.myObj.hideStickyCheersE){
         $(".checkbox_hide_sticky label").click();
        }
      }
    });
  }



  function rangeOnChangeOpacity(){
    $(document).on('input change', '#CS_opacity', function() {
        tabContainer[0].style.opacity = this.value / 100;
    });
  }

  function rangeOnChangeColorOpacity(){
    $(document).on('input change', '#CS_color_opacity', function() {
       tabContainer[0].style.backgroundColor = "rgba(0,0,0,"+this.value / 100+")";
    });
  }

  function hideStickyCheers(){
    $("input#CS_hide_sticky").change(function() {
      if ($('input#CS_hide_sticky').is(':checked')) {
        body.classList.add('TFCO_hideSticky');
        hideStickyCheersE = true;
      } else{
        body.classList.remove('TFCO_hideSticky');
        hideStickyCheersE = false;
      }
    });
  }

  function slimMode(){
    $("input#CS_slim_mode").change(function() {
      if ($('input#CS_slim_mode').is(':checked')) {
        body.classList.add('TFCO_slimMode');
        slimModeE = true;
      } else{
        body.classList.remove('TFCO_slimMode');
        slimModeE = false;
      }
    });
  }


  function toggleSettingsClass(){
      body.classList.toggle('TFCO_settingsOpen');
  }

  function addChatSettings(){
     settings = true;

     chatSettings.classList.add('TFCO_chatSettings', 'TFCO_chatButton');
     chatBox[0].appendChild(chatSettings);

     chatSettings.addEventListener('click', toggleSettingsClass);

     chatBox[0].appendChild(chatSettingsBoxContainer);
     chatSettingsBoxContainer.innerHTML = chatSettingsBox;
     //clicking outside the settings will close it.
     $(chatSettingsBoxContainer).hover(function(){ 
          mouse_in = true; 
      }, function(){ 
          mouse_in = false; 
      });

     $(chatSettings).hover(function(){ 
          mouse_in = true; 
      }, function(){ 
          mouse_in = false; 
      });
  }

  function toggleMinimizeClass(){
      body.classList.toggle('TFCO_minimized');
  }

  function addChatMinimize(){

    minimize = true;
    //create chat minimize button
    
    chatMinimze.classList.add('TFCO_chatMinimize', 'TFCO_chatButton');
    chatBox[0].appendChild(chatMinimze);

    chatMinimze.addEventListener('click', toggleMinimizeClass);
  }

  function onEnterFullscreen(){
      console.log('go fullscreen');
      if (windowWidth != $(window).width()){
        savedStyle = null;
        windowWidth = $(window).width();
      }
      windowWidth = $(window).width();
      chatBox.draggable({
        disabled: false
      });
      chatBox.resizable({
        disabled: false
      });
      rangeOnChangeOpacity();
      rangeOnChangeColorOpacity();
      hideStickyCheers();
      slimMode();
      loadChanges();
  }

  function onExitFullscreen(){
      body.classList.remove('TFCO_minimized');
      body.classList.remove('TFCO_settingsOpen');
      if (body.classList.contains('TFCO_fullScreenMode')){
        savedStyle = chatBox[0].style.cssText;
        tabSavedStyle = tabContainer[0].style.cssText;
      }
      saveChanges();
      body.classList.remove('TFCO_fullScreenMode');
      chatBox.removeAttr("style");
      tabContainer.removeAttr("style");
      chatBox.draggable({
        disabled: true
      });
      chatBox.resizable({
        disabled: true
      });
      console.log('exit fullscreen');
  }

  var handlerTimeout;

  //when entering fullscreen and out
  //timeout for mac
  var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
  var timer = 10;
  function changeHandler(){
    if (isMac){
      timer = 300
    }
    clearTimeout(handlerTimeout);
    handlerTimeout = setTimeout(function(){
        //ENTER FULLSCREEN
        if( window.innerHeight === screen.height) {
          onEnterFullscreen();
        //EXIT FULLSCREEN
        } else {
          onExitFullscreen();
        }
    },timer);
  }

  if (document.addEventListener){
      document.addEventListener('webkitfullscreenchange', changeHandler, false);
      document.addEventListener('mozfullscreenchange', changeHandler, false);
      document.addEventListener('fullscreenchange', changeHandler, false);
      document.addEventListener('MSFullscreenChange', changeHandler, false);
  }

  function appendDom(){
    fsToolBar = "<div class='fullscreenBtn'>Start chat in fullscreen!</div>";
    fsContainer.innerHTML = fsToolBar;
    fsContainer.classList.add('fsContainer');
    fsButton = document.querySelector('.fullscreenBtn');
    fsButton.addEventListener('click', clickFullscreen);
  }

  function appendPlayerBtn(){
      fsPlayerBtn.classList.add('TFCO-PlayerBtn', 'player-button');
      fsPlayerBtn.addEventListener('click', clickFullscreen);
  }
});
