var domList = {}
var fsPlayerBtn
var settingItems = {}
var settings = {
  ready: false,
  bgTheme: '218,216,222',
  currentAlpha: '1',
  currentOpacity: '1',
  twitchDark: false
}
var mainChatPanel = '.right-column'
var mainHeader = '.room-selector__header'
var rightCol
// generate setting items with the params given
function createSettingsItem (type, label, val1, val2) {
  var inputEl = document.createElement('div')
  inputEl.classList.add('input_pair')

  if (type === 'range') {
    inputEl.innerHTML = "<div class='input_label'>" + label + '</div>' +
                            "<input id='CS_" + label + "' type='range' min='" + val1 + "' max='" + val2 + "'></input>"
  } else if (type === 'checkbox') {
    inputEl.innerHTML = "<div class='input_label'>" + label + '</div>' +
                            "<div class='checkbox_container'>" +
                                "<input id='CS_" + label + "' type='checkbox'></input>" +
                                "<label for='CS_" + label + "'></label>" +
                            '</div>'
  }
  settingItems[label] = inputEl
}
// check if dom element exists and run a function returning the element searched
function checkDomEl (el, action, time) {
  var maxRetries = 15
  var retries = 0

  if (!(el in domList) || !settings.ready) {
    var interval = setInterval(function () {
      var element = document.querySelector(el)
      if (element) {
        // domList[el] = element;
        clearInterval(interval)
        action(element)
      } else {
        retries += 1
        console.log('element', el, 'does not exist')
        if (retries >= maxRetries) {
          clearInterval(interval)
          console.log('Somthing is wrong')
        }
      }
    }, time)
  } else {
    action(domList[el])
  }
}

// STORAGE
function saveChanges () {
  settings.screenWidth = window.screen.availWidth
  // Check that there's some code there.
  var savedSettings = {}
  savedSettings.currentOpacity = settings.currentOpacity
  savedSettings.currentAlpha = settings.currentAlpha
  savedSettings.chatPosition = settings.chatPosition
  savedSettings.chatSize = settings.chatSize
  savedSettings.slimMode = settings.slimMode
  savedSettings.hideSticky = settings.hideSticky
  savedSettings.dark = settings.dark
  savedSettings.screenWidth = settings.screenWidth
  // savedSettings.windowWidth = settings.windowWidth;
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'savedSettings': savedSettings}, function () {
  })
}

function loadChanges (element) {
  // Load it using the Chrome extension storage API.
  chrome.storage.sync.get('savedSettings', function (items) {
    if (!chrome.runtime.error) {
      // if saved window size is bigger then the available one, reset position and size
      if (items.savedSettings.screenWidth > (window.screen.availWidth + 50)) {
        items.savedSettings.chatPosition = {top: '', left: ''}
        items.savedSettings.chatSize = {height: '', width: ''}
      }

      settings.currentOpacity = items.savedSettings.currentOpacity
      settings.currentAlpha = items.savedSettings.currentAlpha
      settings.chatPosition = items.savedSettings.chatPosition
      settings.chatSize = items.savedSettings.chatSize
      settings.slimMode = items.savedSettings.slimMode
      settings.hideSticky = items.savedSettings.hideSticky
      settings.dark = items.savedSettings.dark
    }

    settings.screenWidth = window.screen.availWidth
    if (settings.prevScreenWidth > (settings.screenWidth + 50)) {
      items.savedSettings.chatPosition = {top: '', left: ''}
    }
  })
}

// create the fullscreen Btn
function createPlayerBtn () {
  fsPlayerBtn = document.createElement('button')
  fsPlayerBtn.classList.add('TFP-PlayerBtn', 'player-button')
  fsPlayerBtn.addEventListener('click', clickFullscreen)
  // append playerBtn to button list
  checkDomEl('.player-buttons-right', appendPlayerBtn, 100)
}

// append the button to the button List
function appendPlayerBtn (element) {
  element.append(fsPlayerBtn)
}

// check when fullscreen change
if (document.addEventListener) {
  document.addEventListener('webkitfullscreenchange', changedFullscreen, false)
  document.addEventListener('fullscreenchange', changedFullscreen, false)
}

// if fullscreen event changed
function changedFullscreen () {
  setTimeout(function () {
    // if we exit fullscreen restore default chat
    if (!(window.innerHeight === screen.height)) {
      checkDomEl(mainChatPanel, onExitFullscreen, 0)
    }
  }, 300)
}

// click on the twitch fullscreen button
function clickFullscreen () {
  var videoFSBtn = document.querySelector('.qa-fullscreen-button')
  var rightBar = document.querySelectorAll('[data-a-target="right-column-chat-bar"]')

  // if we enter fullscreen add the chat

  if (window.innerHeight === screen.height) {
    checkDomEl(mainChatPanel, addChat, 300)
    if (document.body.classList.contains('TFP_isFullscreen')) {
      videoFSBtn.click()
    }
  } else if (!(window.innerHeight === screen.height)) {
    videoFSBtn.click()
    setTimeout(function () {
      rightBar[0].classList.add('right-column')
      rightCol = document.querySelector('.right-column')
      rightColClasses = rightCol.getAttribute('class')
      checkDomEl(mainChatPanel, addChat, 300)
    }, 1000)
  }
}

function onExitFullscreen (element) {
  var chatContainer = $(element)

  settings.chatPosition = {top: element.style.top, left: element.style.left}
  settings.chatSize = {width: element.style.width, height: element.style.height}

  saveChanges()
  chatContainer.draggable({
    disabled: true
  })
  chatContainer.resizable({
    disabled: true
  })
  document.body.classList.remove('TFP_settingsOpen', 'TFP_isFullscreen', 'TFP_darkTheme', 'TFP_slimMode', 'TFP_hideSticky')
  chatContainer.removeAttr('style')

  if (document.body.classList.contains('tw-theme--dark')) {
    rightCol.setAttribute('class', rightColClasses)
  }

  var main = document.querySelector('main')
  main.parentNode.insertBefore(rightCol, main.nextSibling)
}

// move chat to overlay
function addChat (element) {
  var playerVideo = document.querySelector('.player-video')
  playerVideo.parentNode.insertBefore(rightCol, playerVideo.nextSibling)

  // setTimeout(function(){
  document.body.classList.add('TFP_isFullscreen')
  element.classList.remove('tw-full-height', 'tw-full-width', 'tw-c-background-alt-2')
  var chatContainer = $(element)
  chatContainer.draggable({
    disabled: false,
    handle: mainHeader,
    containment: 'document'
  })

  chatContainer.resizable({
    disabled: false,
    containment: 'document'
  })

  loadChanges(element)
  setChatProperties(element)
  addChatSettings(element)
  if (document.body.classList.contains('tw-theme--dark')) {
    rightCol.setAttribute('class', '')
  }
  // },100);
}

function setChatProperties (element) {
  setTimeout(function () {
    element.style.top = settings.chatPosition.top
    element.style.left = settings.chatPosition.left
    element.style.width = settings.chatSize.width
    element.style.height = settings.chatSize.height
  }, 0)
}

// START SETTINGS
function initSettings (element) {
  createSettingsItem('range', 'opacity', 25, 100)
  createSettingsItem('range', 'alpha', 0, 100)
  createSettingsItem('checkbox', 'darkTheme')
  createSettingsItem('checkbox', 'slimMode')
  createSettingsItem('checkbox', 'hideSticky')

  if (!element.hasChildNodes()) {
    // add the setting Items to the DOM
    Object.keys(settingItems).map(function (objectKey, index) {
      var value = settingItems[objectKey]
      element.appendChild(value)
    })
  }
  var chatPane = document.querySelector(mainChatPanel)
  // //add input handlers
  rangeOnChangeOpacity(chatPane)
  rangeOnChangeAlpha(chatPane)
  onChangeDarkTheme(chatPane)
  onChangeSlimMode(chatPane)
  onChangeHideSticky(chatPane)
}

function toggleSettingsClass () {
  document.body.classList.toggle('TFP_settingsOpen')
}

function addChatSettings (element) {
  var chatContainer = element
  if (!settings.ready) {
    // create and append chat settings button
    var chatSettings = document.createElement('div')
    chatSettings.classList.add('TFP_chatSettings', 'TFP_chatButton')
    chatContainer.appendChild(chatSettings)
    chatSettings.addEventListener('click', toggleSettingsClass)

    // create and append chat settings div
    var chatSettingsBox = document.createElement('div')
    chatSettingsBox.classList.add('CS_box')
    chatSettingsBox.innerHTML = "<div class='CS_box_content'></div>"
    chatContainer.appendChild(chatSettingsBox)

    settings.ready = true
  }

  checkDomEl('.CS_box_content', initSettings, 0)
}

function rangeOnChangeOpacity (element) {
  $('#CS_opacity').val(settings.currentOpacity * 100)
  element.style.opacity = settings.currentOpacity

  $(document).on('input change', '#CS_opacity', function () {
    settings.currentOpacity = this.value / 100
    element.style.opacity = settings.currentOpacity
  })
}

function rangeOnChangeAlpha (element) {
  $('#CS_alpha').val(settings.currentAlpha * 100)
  element.style.backgroundColor = 'rgba(' + settings.bgTheme + ',' + settings.currentAlpha + ')', 'important'

  $(document).on('input change', '#CS_alpha', function () {
    settings.currentAlpha = this.value / 100
    element.style.backgroundColor = 'rgba(' + settings.bgTheme + ',' + settings.currentAlpha + ')', 'important'
  })
}

function onChangeDarkTheme (element) {
  if (settings.dark && !($('input#CS_darkTheme').is(':checked'))) {
    $('input#CS_darkTheme').siblings('label').click()
  }
  setDarkTheme(element)
  $(document).on('input change', '#CS_darkTheme', function () {
    setDarkTheme(element)
  })
}

function onChangeSlimMode () {
  if (settings.slimMode && !($('input#CS_slimMode').is(':checked'))) {
    $('input#CS_slimMode').siblings('label').click()
  }
  setSlimMode()
  $(document).on('input change', '#CS_slimMode', function () {
    setSlimMode()
  })
}

function onChangeHideSticky () {
  if (settings.hideSticky && !($('input#CS_hideSticky').is(':checked'))) {
    $('input#CS_hideSticky').siblings('label').click()
  }
  setHideSticky()
  $(document).on('input change', '#CS_hideSticky', function () {
    setHideSticky()
  })
}

function setDarkTheme (element) {
  if ($('input#CS_darkTheme').is(':checked')) {
    document.body.classList.add('TFP_darkTheme')
    settings.dark = true
    settings.bgTheme = '0,0,0'
    element.style.backgroundColor = 'rgba(' + settings.bgTheme + ',' + settings.currentAlpha + ')', 'important'
  } else {
    document.body.classList.remove('TFP_darkTheme')
    settings.dark = false
    settings.bgTheme = '250, 250, 250'
    element.style.backgroundColor = 'rgba(' + settings.bgTheme + ',' + settings.currentAlpha + ')', 'important'
  }
}

function setSlimMode () {
  if ($('input#CS_slimMode').is(':checked')) {
    settings.slimMode = true
    document.body.classList.add('TFP_slimMode')
  } else {
    settings.slimMode = false
    document.body.classList.remove('TFP_slimMode')
  }
}

function setHideSticky () {
  if ($('input#CS_hideSticky').is(':checked')) {
    document.body.classList.add('TFP_hideSticky')
    settings.hideSticky = true
  } else {
    document.body.classList.remove('TFP_hideSticky')
    settings.hideSticky = false
  }
}

function switchToVOD () {
  var currentAddress = window.location.pathname.split('/')[1]
  if (currentAddress === 'videos') {
    mainChatPanel = '.video-chat'
    mainHeader = '.video-chat__header'
  } else {
    mainChatPanel = '.right-column'
    mainHeader = '.room-selector__header'
  }
}
// END SETTINGS

$(document).ready(function () {
  // appent fullscreen btn
  createPlayerBtn()
  // store url on load
  var currentPage = window.location.href
  switchToVOD()
  // listen for changes
  setInterval(function () {
    if (currentPage != window.location.href) {
      switchToVOD()
      currentPage = window.location.href
      if ($(document).find('.TFP-PlayerBtn').length === 0) {
        createPlayerBtn()
        settings.ready = false
      }
    }
  }, 500)
})
