'use strict'

chrome.runtime.onInstalled.addListener(function(){
  alert('installed'); 
  chrome.tabs.executeScript({
    file: "timeTimer.js"
  });

  
});

