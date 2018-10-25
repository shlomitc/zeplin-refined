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
  console.log('*** [contentScript][34] ***', getCurrentProjectId());
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


const {screensContainer} = init();

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
