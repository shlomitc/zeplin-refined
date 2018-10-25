function getCookies() {
  return document.cookie.split(';').reduce((cookies, cookie) => {
    let [key, value] = cookie.split('=');
    cookies[key.trim()] = value;
    return cookies;
  }, {})
}


function init() {
  const mainPage = document.querySelector('main');

  const panel = document.createElement('div');
  panel.className = 'zr-panel';

  const screensContainer = document.createElement('div');
  screensContainer.className = 'zr-panel-screens-container';

  panel.appendChild(screensContainer);

  mainPage.parentNode.insertBefore(panel, mainPage.nextSibling);

  return {
    panel,
    screensContainer
  };
}

function getCurrentProjectId() {

  //https://app.zeplin.io/project/projectId/dashboard
  //https://app.zeplin.io/project/projectId
  //https://app.zeplin.io/project/projectId/screen/screenId

  const paths = document.location.href.split('/');
  return paths[paths.indexOf('project') + 1];
  // return document.location.href.match(/project\/(.*)(screen|dashboard|$)/)[1];
}

function getCurrentProjectData() {
  const url = `https://api.zeplin.io/v2/projects/${getCurrentProjectId()}`;
  const {userToken} = getCookies();

  const data = {
    url,
    config: {
      mode: 'cors',
      headers: {
        'zeplin-token': userToken
      }
    }
  };

  return fetch(data.url, data.config).then(res => res.json()).catch(e => []);
}

function getCurrentProjectScreensData() {
  return getCurrentProjectData()
    .then(projectData => {
      return projectData.screens.map((screen) => ({
        name: screen.name,
        img: screen.latestVersion.snapshot.url,
        id: screen._id,
        url: `https://app.zeplin.io/project/${getCurrentProjectId()}/screen/${screen._id}`
      }))
    });
}

function whereAmI() {
  if (document.location.href.match(/\/screen/)) {
    return 'screen';
  } else if (document.location.href.match(/project\/(.*)+/)) {
    return 'project';
  } else {
    return 'projects';
  }
}

function addFavoriteBadge() {
  const screens = [].slice.call(document.querySelectorAll('.screen'));
  screens.forEach((screen) => {
    const favorite = document.createElement('div');
    favorite.className = 'zr-favorite-badge';
    favorite.dataset.id = screen.dataset.id;
    favorite.onclick = 'alert(1)';
    screen.appendChild(favorite);
  });
}

function addBoard(screensContainer) {
  getCurrentProjectScreensData()
    .then(screens => {
      screens.forEach((screen) => {
        const screenNode = document.createElement('div');
        screenNode.className = 'zr-screen';
        screenNode.id = screen.id;
        screenNode.innerHTML = `
        <a href="${screen.url}">
          <img width="100" height="100" src="${screen.img}">
          ${screen.name}
        </a>
      `;
        screensContainer.appendChild(screenNode)
      });
    });

}

(() => {
  const {screensContainer} = init();
  switch (whereAmI()) {
    case 'projects' :
      break;
    case 'project' :
      addBoard(screensContainer);
      break;
    case 'screen' :
      addFavoriteBadge();
      addBoard(screensContainer);
      break;
  }
})();
