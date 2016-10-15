// var color = document.getElementById('fs-color').value;


function hello() {
	chrome.tabs.executeScript({
		file: 'content.js'
	}); 
// 	chrome.tabs.sendMessage({action: color}, function(response) {
// 	    console.log('send color to tab');
// 	});
}


document.getElementById('clickme').addEventListener('click', hello);