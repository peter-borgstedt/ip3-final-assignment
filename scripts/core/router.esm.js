/**
 * This part will hook in to the history state changes and dispatch global
 * events that can later be listened to.
 * 
 * TODO: has an issue that the history is not stored thus problem when going back/forward
 */
window.history.pushState = (f => function() { // Use a closure
  console.log('[router.esm.js::pushState]', ...arguments);
  var ret = f.apply(this, arguments);

  // window.dispatchEvent(new Event('pushstate'));
  window.dispatchEvent(new CustomEvent('locationchange', { detail: arguments[0] })); // Send data forward
  return ret;
})(history.pushState);

window.history.replaceState = (f => function() {
  console.log('[router.esm.js::replaceState]', ...arguments);
  var ret = f.apply(this, arguments);

  // window.dispatchEvent(new Event('replacestate'));
  window.dispatchEvent(new CustomEvent('locationchange', { detail: arguments[0] }));
  // document.title = e.state.pageTitle;
  return ret;
})(history.replaceState);

window.window.addEventListener('popstate', function() {
  console.log('[router.esm.js::popState]', ...arguments);

  // window.dispatchEvent(new Event('popstate'));
  window.dispatchEvent(new CustomEvent('locationchange', { detail: arguments[0] }));
});

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Webcomponent: Router <ip-router>
 *
 * Contains logic for simple routing to different views depending on the
 * current location. It never refreshes the content and handles the routing
 * internally.
 *
 * There are logic for unused features of having several routing elements,
 * but this was later replaced for an inner handling in a view due to the complexity
 * and lack of time. I will let the logic remain here as it might be useful for
 * any later projects.
 * 
 * This one of the more complex implementation of this webapplication.
 *
 * References:
 * https://medium.com/@yanai101/popstate-and-history-api-the-missing-part-dc49f75676d
 * https://github.com/whatwg/html/issues/2174
 * https://stackoverflow.com/a/4585031
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Router extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Store the style independently as we want to resuse it
    this.styled = document.createElement('style');
    this.styled.rel = 'stylesheet';
    this.styled.type = 'text/css'; 

    // Use flex as display for the router which will
    // expand the whole surface with its content
    const css = `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        min-height: 0;
        overflow: hidden;
      }
    `;

    if (this.styled.styleSheet) {
      this.styled.styleSheet.cssText = css; 
    } else {
      this.styled.appendChild(document.createTextNode(css));
    }

    // Add event listener on "locationchange" which occurs when a user
    // changes anything in the browser location/URL-bar or if done programmatically 
    window.addEventListener('locationchange', this.handler.bind(this));
  }

  connectedCallback() {
    console.log(`[${this.name}::router::connectedCallback]`);
  }

  disconnectedCallback() {
    console.log(`[${this.name}::router::disconnectedCallback]`);
  }

  /**
   * Sets a new location
   * @params params Object containing location details { data, tile, url }
   */
  static async set(params = {}) {
    console.log(`[*::router::set] ${JSON.stringify(params)}`);

    const { data = {}, title = '', url = location.pathname || '/', routerID = '*' } = params;

    // Push a state change which will also be retrieved by the router that will
    // change the view (if it exist)
    window.history.pushState({ data, routerID }, title, url);
  }

  /**
   * Get meta for a configured routing URL which may be contain
   * path parameters, e.g. "/chat/{id}"
   */
  getPathMeta(path) {
    // If any path parameters should be included, get the details,
    const parameters = path.match(/({\w+})/g); // Get meta for path parameters

    // If there are path parameters for the url then remove it to retrieve the base path
    if (parameters && parameters.length) {
      const basePath = path.substr(0, path.indexOf(parameters[0]) - 1);
      return {
        basePath: basePath || '/', // Default to "/" if string is empty
        parameters: parameters.map(p => p.replace(/[{}]/g, '')) // Add list of path parameters
      };
    }
    return { basePath: path || '/', parameters: [] };
  }

  /**
   * Initialize the routing configuration
   * @params config Object containing routes defining how the routing should be made
   */
  init(config) {
    console.log(`[${config.name}::router::init]`);

    // Name of route module (supporting multiple/nested routing modules)
    this.name = config.name;

    // Setup all configured routes
    this.routes = Object.entries(config.routes).reduce((acc, [path, route ]) => {
      // Get basepath and any parameters that this route may have
      const { basePath, parameters } = this.getPathMeta(path);

      // Accumulate the basePath to object key with the its route and parameters 
      acc[basePath] = { ...route, parameters };

      // If the route have children (sub routes) add these to the accumulation
      // object as well, this is not used within the application as I removed it with a simpler
      // less dynamic solution due to lack of time, this part adds support for (multiple/nested routings)
      if (route.children) {
        acc[basePath].children = route.children.map((child) => this.getPathMeta(child));
      }
      return acc;
    }, {});
  }

  /**
   * This checks whether the routing element is in view, if not then ignore any routing,
   * this is part of the support adde for multi/nested routing, which is a bit complicated.
   *
   * Reference:
   * https://gomakethings.com/how-to-test-if-an-element-is-in-the-viewport-with-vanilla-javascript/
   */
  isInViewPort() {
    var bounding = this.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Get path parameters from the location url and map them to the
   * defined path parameters for the route.
   * @param route Route with path parameters
   * @param segments Path segments after the route path
   */
  getPathParameters(route, segments) {
    if (route.parameters) {
      return route.parameters.reduce((acc, name, index) => {
        acc[name] = segments[index];
        return acc;
      }, {});
    }
    return {};
  }

  /**
   * Get route depending on the path.
   * @param path A location/URL path
   */
  getRoute(path) {
    // Get base path and any potential query parameters in the URL
    const [ basePath, qp ] = path.split('?');

    // Extract any existing query parameters 
    const queryParameters = {};
    if (qp) {
      const parameters = qp.split('&');

      parameters.reduce((acc, parameter) => {
        const [ key, value ] = parameter.split("=");
        acc[key] = value;
        return acc;
      }, queryParameters);
    }

    // Get route object, the path segments and the full route path 
    const { route, segments, routePath } = basePath.split('/').reduce((acc, segment) => {
      // For every path segments in a URL accumulate it to a string
      // until matching a potential configured route
      if (segment) {
        acc.accumulatedPath += `/${segment}`;
      }

      // Check if the current accumulated string match any configured routes
      const route = this.routes[acc.accumulatedPath || '/'];
      if (route) {
        // Store route and route path in the accumulation object
        acc.route = route;
        acc.routePath = `${acc.accumulatedPath}`;
      } else if (segment && acc.route) {
        // Any segments after a vaid routing url will be stored
        // as path segments that might be a sub route or path parameters
        // depending on the routing configuration
        acc.segments.push(segment);
      }

      return acc;
    }, { // Set some initial values for the accumulation object
      accumulatedPath: '', routePath: '', segments: []
    });

    // If no route was found log it for debugging
    if (!route) {
      console.log(`[${this.name}::router::handler] -> path ${path} is not a valid path`);
      return;
    }

    // If there are child routes defined, then check if any of them match
    // the current location URL
    if (route.children) {
      for (const { basePath, parameters } of route.children) {
        // Get sub path without any beginning slash
        const subPath = basePath.startsWith('/') ? basePath.slice(1) : basePath;

        // Get the path segments of child route
        const childSegments = subPath.split('/');

        // If there is a match of the child routes path segments with the
        // path segments of the current location URL (with any potential path
        // parameters) then a child route exists 
        if ((childSegments.length + parameters.length) === segments.length) {
          const pathParameters = this.getPathParameters(route, segments);

          // The parent route will be routed to which will have a view that
          // contains another routing module that will handle the child route
          return { ...route, routePath, pathParameters, queryParameters };
        }
      }
    }

    // The path segments retrieved does not match the path segments of the current url
    if (segments.length && route.parameters.length !== segments.length) {
      console.log(`[${this.name}::router::handler] -> path ${path} with parameters [${segments.join(', ')}] is not a valid path`);
      return;
    }

    // Get path parameters depending there are any configured for the route
    // and retrieve them from the path segments collected
    const pathParameters = this.getPathParameters(route, segments);

    return { ...route, routePath, pathParameters, queryParameters };
  }

  /**
   * Handles any routing changes that has been changed either by
   * changing location in the browsers location/URL-bar or if done
   * programmatically.
   *
   * Retrieves a "locationchange" event dispatched from the overridden functions
   * of window.history.  
   * @param event A location change event 
   */
  async handler(event) {
    console.log('router-event', event.detail);

    const { data = {}, routerID } = event.detail;

    if (routerID !== '*' && routerID !== this.name) {
      console.log(`[${this.name}::router::handler] -> ignored event for ${routerID}`);
      return; // Ignore this router
    }

    // Retrieve the current location path
    const path = window.location.pathname;

    // Get any potential existing route for current path
    const route = this.getRoute(path);

    // If there are no route configured for the route log out for debugging
    if (!route) {
      console.log(`[${this.name}::router::handler] -> path ${path} ignored`);
      return;
    }

    // If there is a route and it has a guard, run the guard before continuing
    if (route && (route.guard ? await route.guard() : true)) {
      // Check if the route contains a view object
      if (!route.view) {
        console.log(`[${this.name}::router::handler] -> path ${path} cannot be resolved`);
        return;
      }

      // Check if the route contains a view function
      const view = await route.view();
      if (!view) {
        console.log(`[${this.name}::router::handler] -> path ${path} resolved to undefined`);
        return;
      }

      // Clear existing content in the routing element
      this.shadowRoot.textContent = ''; // Quick removal (apparently faster than using innerHTML)

      // Append style as this was removed in previous content removal
      this.shadowRoot.appendChild(this.styled);

      // Get path and query parameters of route
      const { pathParameters, queryParameters } = route;

      // If view is protype of HTMLElement then instantiate it and then inject it
      if (view.prototype instanceof HTMLElement) { // Not instantiated
        const v = new view(); 
        if (v.init) {
          // Set path and query parameters in the init function before
          // injecting the view into the shadowRoot of the router
          v.init({ data, pathParameters, queryParameters });
        }
        this.shadowRoot.appendChild(v);
      // If the view is an instance of a HTMLElement then inject it
      } else if (view instanceof HTMLElement) { // Instantiated
        if (view.init) {
          view.init({ data, pathParameters, queryParameters });
        }
        this.shadowRoot.appendChild(view); 
      // If the content is of a string then it might be text or HTML
      } else if (typeof view === 'string') { // Pure HTML or just text content
        this.shadowRoot.innerHTML = view;
      }

      // If the content of the view cannot be determined log out for debugging
      console.log(`[${this.name}::router::handler]: -> ${route.routePath || '/' }`);
    } else {
      // If the guard stopped the view from continuing then log it out for debugging
      console.log(`[${this.name}::router::handler]: -> ${path} was stopped by guard`);
    }
  }
}

customElements.define('router-module', Router);
