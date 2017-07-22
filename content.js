$( document ).ready(function() {

  var chatBox, chatHeader, savedStyle, tabSavedStyle, chatOpacity, chatAlpha, chatPositionAndSize, videoFSBtn, chatCloseButton, playerColumn, playerButtonsRight, tabContainer, fsToolBar, fsButton, windowWidth, slimModeE, hideStickyCheersE, chatContainer, bgTheme;
  var body = document.body;
  var minimize = false;
  var settings = false;
  var mouse_in = false;
  var darkTheme = false;
  var currentOpacity = 1;
  var currentColorOpacity = 0.85;
  var fsPlayerBtn = document.createElement('button');
  var fsContainer = document.createElement('div');
  var chatSettings = document.createElement('div');
  var chatMinimze = document.createElement('div');
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
                            "<div class='input_pair'>" +
                              "<div class='input_label'>Dark theme</div>" +
                              "<div class='checkbox_dark_theme'>" +
                                "<input id='CS_dark_theme' type='checkbox'></input>"+
                                "<label for='CS_dark_theme'></label>"+
                              "</div>"+
                            "</div>"+
                           "</div>"+
                        "</div>";
  
  // timer delay for showing chat overlay
  var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
  var timer = 10;
  if (isMac){
    timer = 300
  }

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
  
  handleZoom();
  
  window.onresize = function onresize(){
    handleZoom();
  }

  function handleZoom (){
      var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
      if(browserZoomLevel != 100 && browserZoomLevel != 150){
        fsPlayerBtn.classList.add('disabled');
        setTimeout(function(){
          fsPlayerBtn.classList.remove('disabled');
        }, 15000);
      } else {
        fsPlayerBtn.classList.remove('disabled');
      }
  }

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

    //wait for the tab-container to load
    var findChatContainer = setInterval(function() {
       if ($('.chat-container').length) {
          chatContainer = $('.chat-container');
          clearInterval(findChatContainer);
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
      handle: chatHeader[0],
      containment: "document"
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
    onEnterFullscreen();
    body.classList.add('TFCO_fullScreenMode');
  }

  var enterFullscreenHandlerTimeout;

  function clickFullscreen(){
    videoFSBtn = document.querySelector('.player-button--fullscreen');
    if(!(window.innerHeight === screen.height)) {
      videoFSBtn.click();
      
      clearTimeout(enterFullscreenHandlerTimeout);
      enterFullscreenHandlerTimeout = setTimeout(function(){
        addChat();    
      },timer);
    } else if( (window.innerHeight === screen.height) && body.classList.contains('TFCO_fullScreenMode')) {
      videoFSBtn.click();  
    } else {
      addChat();
    }
    // videoFSBtn.click();
    //   addChat();  
  }

  // STORAGE 
  function saveChanges() {
    windowWidth = window.screen.availWidth;
    // Check that there's some code there.
    var myObj = {};
    myObj.currentOpacity = currentOpacity;
    myObj.currentColorOpacity = currentColorOpacity;
    myObj.chatPositionAndSize = savedStyle;
    myObj.slimModeE = slimModeE;
    myObj.darkTheme = darkTheme;
    myObj.hideStickyCheersE = hideStickyCheersE;
    myObj.windowWidth = windowWidth;
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'myObj': myObj}, function() {
      console.log("options saved");
    });
  }

  function loadChanges() {
     // Save it using the Chrome extension storage API.
    chrome.storage.sync.get('myObj', function(items) {
      if (!chrome.runtime.error) {
        var ww = items.myObj.windowWidth
        // if saved window size is bigger then the available one, reset position and size
        if (ww > (window.screen.availWidth + 50)){
          items.myObj.chatPositionAndSize = null;
        }

        currentColorOpacity = items.myObj.currentColorOpacity;

        chatContainer[0].style.opacity = items.myObj.currentOpacity;
        $('#CS_opacity').val(items.myObj.currentOpacity*100);
        // chatContainer[0].style.backgroundColor = "rgba(" + bgTheme + "," + items.myObj.currentColorOpacity + ") !important";
          chatContainer[0].style.setProperty("background-color", "rgba(" + bgTheme + "," + currentColorOpacity + ")", "important");

        $('#CS_color_opacity').val(items.myObj.currentColorOpacity*100);

        chatBox[0].setAttribute('style', items.myObj.chatPositionAndSize);
        if(items.myObj.slimModeE){
          $(".checkbox_slim_mode label").click();
        }
        if(items.myObj.darkTheme){
          $(".checkbox_dark_theme label").click();
        }
        if(items.myObj.hideStickyCheersE){
         $(".checkbox_hide_sticky label").click();
        }
      }
      console.log("options loaded");
    });
  }



  function rangeOnChangeOpacity(){
    $(document).on('input change', '#CS_opacity', function() {
      currentOpacity = this.value/100
        chatContainer[0].style.opacity = currentOpacity;
    });
  }

  

  function rangeOnChangeAlpha(){
    $(document).on('input change', '#CS_color_opacity', function() {
      currentColorOpacity = this.value/100 ;
        chatContainer[0].style.setProperty("background-color", "rgba(" + bgTheme + "," + currentColorOpacity + ")", "important");
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

  function setDarkTheme(){
      if ($('input#CS_dark_theme').is(':checked')) {
        body.classList.add('TFCO_darkTheme');
        darkTheme = true;
        bgTheme = '0,0,0';
        // chatContainer[0].style.backgroundColor = "rgba(" + bgTheme + "," + currentColorOpacity + ") !important";
        chatContainer[0].style.setProperty("background-color", "rgba(" + bgTheme + "," + currentColorOpacity + ")", "important");
      } else{
        body.classList.remove('TFCO_darkTheme');
        darkTheme = false;
        bgTheme = '239,238,241';
        chatContainer[0].style.setProperty("background-color", "rgba(" + bgTheme + "," + currentColorOpacity + ")", "important");
      }
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
      chatBox.draggable({
        disabled: false,
        start:function(event,ui){
          $(this).removeClass('ui-draggable-dragging')
        }
      });
      chatBox.resizable({
        disabled: false
      }); 
      rangeOnChangeOpacity();
      rangeOnChangeAlpha();
      hideStickyCheers();
      slimMode();
      setDarkTheme();
      loadChanges();

      $("input#CS_dark_theme").change(function() {
        setDarkTheme();
      });
  }

  function onExitFullscreen(){
      body.classList.remove('TFCO_minimized');
      body.classList.remove('TFCO_settingsOpen');
      if (body.classList.contains('TFCO_fullScreenMode')){
        savedStyle = chatBox[0].style.cssText;
        tabSavedStyle = chatContainer[0].style.cssText;
      }
      saveChanges();
      body.classList.remove('TFCO_fullScreenMode');
      chatBox.removeAttr("style");
      chatContainer.removeAttr("style");
      chatBox.draggable({
        disabled: true
      });
      chatBox.resizable({
        disabled: true
      });
      console.log('exit fullscreen');
  }

  var exitFullscreenHandlerTimeout;
  
  //when entering fullscreen and out
  //timeout for mac
  
  function changeHandler(){
    handleZoom();
    clearTimeout(exitFullscreenHandlerTimeout);
    exitFullscreenHandlerTimeout = setTimeout(function(){
        //ENTER FULLSCREEN
        if(!(window.innerHeight === screen.height)) {
          onExitFullscreen();
        }
    },timer);
  }

  if (document.addEventListener){
      document.addEventListener('webkitfullscreenchange', changeHandler, false);
      document.addEventListener('mozfullscreenchange', changeHandler, false);
      document.addEventListener('fullscreenchange', changeHandler, false);
  }

  function appendPlayerBtn(){
      fsPlayerBtn.classList.add('TFCO-PlayerBtn', 'player-button');
      fsPlayerBtn.addEventListener('click', clickFullscreen);
  }
});
