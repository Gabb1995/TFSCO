var videoEl = document.querySelector('.dynamic-player .player video');
var videoFSBtn = document.querySelector('.player-button--fullscreen');
var body =document.querySelector('body');
var chatBox = $('#right_col');

var counter = 0;
counter ++
if(counter === 1){
  counter ++
  videoFSBtn.click();
}

chatBox.draggable();
chatBox.draggable('disable');
chatBox.removeAttr("style");

if (document.addEventListener)
{
    document.addEventListener('webkitfullscreenchange', changeHandler, false);
    document.addEventListener('mozfullscreenchange', changeHandler, false);
    document.addEventListener('fullscreenchange', changeHandler, false);
    document.addEventListener('MSFullscreenChange', changeHandler, false);
}

function changeHandler()
{
   if( window.innerHeight === screen.height) {
   		console.log('fullscreen');
       	chatBox.draggable('enable');
        chatBox.resizable();
       	body.classList.add('fullScreenMode');
	} else {
		console.log('not fullscreen');
		body.classList.remove('fullScreenMode');
		 chatBox.removeAttr("style");
        chatBox.draggable('disable');
	}
}


