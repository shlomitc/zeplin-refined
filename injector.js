const request = new XMLHttpRequest();
request.open('GET', chrome.extension.getURL('contentScript.js'), false);
request.send(null);

const script = document.createElement('script');
script.textContent = request.responseText;
document.head.prepend(script);
