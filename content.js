$( document ).ready(function() {
  var body = document.body;
  var chatBox;
  var savedStyle;
  var chatOpacity;
  var videoFSBtn;
  var chatCloseButton;
  var minimize = false;
  var settings = false;
  var playerColumn;
  var tabContainer;
  var fsContainer = document.createElement('div');
  var chatSettings = document.createElement('div');
  var chatSettingsBoxContainer = document.createElement('div');
  var chatSettingsBox = "<div class='CS_box'>"+
                          "<div class='CS_box_content'>"+
                            "<label for='CS_opacity'>Chatbox opacity</label>"+
                            "<input id='CS_opacity' type='range' min='25' max='100'></input>"+
                            "<label for='CS_color_opacity'>Chatbox bg alpha</label>"+
                            "<input id='CS_color_opacity' type='range' min='0' max='100'></input>"+
                            "<label for='CS_hide_sticky'>Hide sticky cheer</label>"+
                            "<input id='CS_hide_sticky' type='checkbox'></input>"+
                           "</div>"+
                        "</div>";
  var chatMinimze = document.createElement('div');

  declareEssentialsOnTime();

  function  declareEssentialsOnTime(){
    //wait for the chatbox container to load
    var findChatBox = setInterval(function() {
       if ($('#right_col').length) {
          chatBox = $('#right_col');
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
          appendDom();
       }
    }, 100);
  }
  


  function clickFullscreen(){
    videoFSBtn = document.querySelector('.player-button--fullscreen');
    chatCloseButton = document.querySelector('#right_close');

    chatBox.draggable({disabled:true});

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
    videoFSBtn.click();    
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
      } else{
        body.classList.remove('TFCO_hideSticky');
      }
    });
  }

  function addChatSettings(){
     settings = true;

     chatSettings.classList.add('TFCO_chatSettings', 'TFCO_chatButton');
     chatBox[0].appendChild(chatSettings);
     chatSettings.addEventListener('click', function(){
         body.classList.toggle('TFCO_settingsOpen');
      });
       chatBox[0].appendChild(chatSettingsBoxContainer);
       chatSettingsBoxContainer.innerHTML = chatSettingsBox;
  }


  function addChatMinimize(){

    minimize = true;

    //create chat minimize button
    
    chatMinimze.classList.add('TFCO_chatMinimize', 'TFCO_chatButton');
    chatBox[0].appendChild(chatMinimze);

    chatMinimze.addEventListener('click', function(){
      body.classList.toggle('TFCO_minimized');
    });
  }


  function onEnterFullscreen(){
      console.log('go fullscreen');
      chatBox.draggable({
        disabled: false
      });
      chatBox.resizable({
        disabled: false
      });
      rangeOnChangeOpacity();
      rangeOnChangeColorOpacity();
      hideStickyCheers();
      if(savedStyle){
          chatBox[0].setAttribute('style', savedStyle);
      }
  }

  function onExitFullscreen(){
      body.classList.remove('TFCO_minimized');
      body.classList.remove('TFCO_settingsOpen');
      if (body.classList.contains('TFCO_fullScreenMode')){
        savedStyle = chatBox[0].style.cssText;
      }
      body.classList.remove('TFCO_fullScreenMode');
      chatBox.removeAttr("style");
      chatBox.draggable({
        disabled: true,
      });
      chatBox.resizable({
        disabled: true
      });
      console.log('exit fullscreen');
  }

  var handlerTimeout;

  //when entering fullscreen and out
  //timeout for mac
  function changeHandler(){
    clearTimeout(handlerTimeout);
    handlerTimeout = setTimeout(function(){
        //ENTER FULLSCREEN
        if( window.innerHeight === screen.height) {
          onEnterFullscreen();
        //EXIT FULLSCREEN
        } else {
          onExitFullscreen();
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
    fsToolBar = "<div class='fullscreenBtn'>Go!</div>";
    fsContainer.innerHTML = fsToolBar;
    fsContainer.classList.add('fsContainer');
    fsButton = document.querySelector('.fullscreenBtn');
    fsButton.addEventListener('click', clickFullscreen);

  }

  
});
