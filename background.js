'use strict';

chrome.runtime.onInstalled.addListener(() => {
  console.log('*** [background][4] ***', 'hello world');
});
