// I use ESLint (for linting JavaScript code), below row is ignores a warning...
/* eslint-disable no-undef */

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 * 
 * Bootstrap the webapplication.
 *
 * This parts basically just sets up some initial properties and
 * inserts the main web component into the document. It becomes a little
 * bit more organized separating this logic from those that relates more to
 * the application one.
 * 
 * Idea of this is basically taken from how other frameworks do (Angular etc).
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */

/**
 * Get server end points depending on environment.
 * @returns the base urls for the websocket and rest-api 
 */
const getBaseUrl = () => {
  const html = document.querySelector('html');
  console.log(`Running environment ${html.dataset.environment}`);

  if (html.dataset.environment === 'prod') {
    return {
      // webServerUrl: 'https://ip-chat-server.herokuapp.com/rest',
      // webSocketUrl: 'wss://ip-chat-server.herokuapp.com/ws',
      webServerUrl: 'https://d31k87hzkjbg8d.cloudfront.net/ipfinalassignment/rest',
      webSocketUrl: 'wss://d31k87hzkjbg8d.cloudfront.net/ipfinalassignment/ws',
    };
  }
  return {
    webServerUrl: 'http://localhost:8080/ipfinalassignment/rest',
    webSocketUrl: 'ws://localhost:8080/ipfinalassignment/ws',
  };
};

/**
 * We want to keep track on what browser is being run on,
 * this is because some features are done differently or are not available
 * in all browsers.
 *
 * Support will only be for Chrome, Firefox and Safari, because
 * there's to much work supporting them all.
 *
 * Code snippets taken from (using duck-typing):
 * https://stackoverflow.com/a/9851769
 */
const setBrowserVersions = () => {
  window.browser = {};

  // Firefox 1.0+
  window.browser.isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  window.browser.isSafari = /constructor/i.test(window.HTMLElement) ||
    (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] ||
    (typeof safari !== 'undefined' && safari.pushNotification));

  // Chrome 1 - 79
  window.browser.isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
};

/** Register or updates an existing service worker */
const registerServiceWorker = () => {
  navigator.serviceWorker.register('/worker.js')
    .then((registration) => {
      if (registration.installing) {
        // Installs a new or updates existing service worker
        console.log('Service worker installing');
      } else if (registration.waiting) {
        // Waiting for clients using old version of service worker
        // to end their session, afterward the new service worker
        // will be activated and the old removed
        console.log('Service worker installed');
      } else if (registration.active) {
        // The service worker is already active (and up to date)
        console.log('Service worker active');
      }
    })
    .catch((error) => console.error(error));
};

/**
 * Injects the app (main) webcomponent to the document
 */
const bootstrap = () => {
  const app = document.createElement('ip-app');
  document.body.appendChild(app);

  customElements.whenDefined('ip-app').then(() => {
    document.getElementById('spinner').remove();
  });
};

/**
 * Set some server configuration for the webapplication;
 * the Websocket and REST API end points.
 */
const configure = () => {
  const { webServerUrl, webSocketUrl } = getBaseUrl();
  window.app = {
    restUrl: `${webServerUrl}`,
    websocketUrl: `${webSocketUrl}`
  };
};

/** Initialize */
(() => {
  setBrowserVersions();
  configure();
  bootstrap();
  // registerServiceWorker();

  // Add a lazy loading hashcode function for checking object
  // uniquiness (like in Java), this is used for the event bus,
  // see: https://stackoverflow.com/a/5790850
  Object.prototype.getHashCode = (function(id) {
    return function() {
      return this.hashCode ? this.hashCode : (this.hashCode = '<hash|#' + (id++) + '>');
    };
  }(0));
})();
