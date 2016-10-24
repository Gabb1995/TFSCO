var videoEl = document.querySelector('.dynamic-player .player video');
var videoFSBtn = document.querySelector('.player-button--fullscreen');
var body =document.querySelector('body');
var chatBox = $('#right_col');
var savedStyle = null;
var chatCloseButton = document.querySelector('#right_close');

//make sure click only happens once.
var counter = 0;
if(counter === 0){
  counter ++
  //if chat is closed, toggle it open.
  if(chatBox[0].classList.contains('closed')){
    chatCloseButton.click();
  }
  videoFSBtn.click();
  chrome.runtime.sendMessage({action: "toggleFullscreen"});
}

//initialize draggable plugin and disable it immediatly
chatBox.draggable();
chatBox.draggable('disable');

//create chat minimize button
var chatMinimze = document.createElement('div');
chatMinimze.classList.add('TFCO_chatMinimize');
chatBox[0].appendChild(chatMinimze);

chatMinimze.addEventListener('click', function(){
  chrome.runtime.sendMessage({action: "toggleMinimized"});
  body.classList.toggle('TFCO_minimized');
});

//when entering fullscreen and out
function changeHandler(){
   if( window.innerHeight === screen.height) {
    console.log('go fullscreen');
      chrome.runtime.sendMessage({action: "enterFullscreen"});
      chatBox.draggable('enable');
      chatBox.resizable();
      if(savedStyle){
          chatBox[0].setAttribute('style', savedStyle);
      }
      body.classList.add('TFCO_fullScreenMode');
    
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
}

if (document.addEventListener){
    document.addEventListener('webkitfullscreenchange', changeHandler, false);
    document.addEventListener('mozfullscreenchange', changeHandler, false);
    document.addEventListener('fullscreenchange', changeHandler, false);
    document.addEventListener('MSFullscreenChange', changeHandler, false);
}


