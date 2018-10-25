const parser = new DOMParser();

function init() {
  const mainPage = document.querySelector('main');

  const panel = document.createElement('div');
  panel.className = 'zr-panel';

  mainPage.parentNode.insertBefore(panel, mainPage.nextSibling);

  return {
    panel
  };
}

function getCurrentProjectId() {
  return document.location.href.match(/project\/(.*)(\/screen)?/)[1];
}

function getCurrentProjectUrl() {
  return `https://app.zeplin.io/project/${getCurrentProjectId()}`;
}

function getScreensInProject() {
  return fetch(getCurrentProjectUrl())
    .then(html => parser.parseFromString(html, "text/html"));
}

const {panel} = init();

getScreensInProject()
  .then(allProjects => console.log(allProjects));