'use strict';

chrome.runtime.onInstalled.addListener(() => {
  console.log('*** [background][4] ***', 'hello world');
  // chrome.storage.sync.set({color: '#3aa757'}, () => {
  //   console.log("The color is green.");
  // });
});
