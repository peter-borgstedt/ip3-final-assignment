import RouterModule from '/scripts/core/router.esm.js';


/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 * 
 * Setup the main application container and the initiates the routing module.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
class App extends HTMLElement {
 constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // https://stackoverflow.com/a/60026710
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 100vw;
          height: 100vh;
        }

        #loader {
          display: flex;
          position: absolute;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          transition: opacity 0.3s ease-out;
          opacity: 0;
          z-index: 10;
        }

        #backdrop {
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        #backdrop {
          background: rgba(255,255,255,0.75);
          pointer-events: none; /* Able to click on elements behind the backdrop */ 
          z-index: 10;
          backdrop-filter: grayscale(100%);
        }
      </style>

      <!--div id="backdrop"></div-->

      <router-module></router-module>
    `;
  }

  /**
   * Check if token is valid and has not expired.
   * TODO: use refresh-tokens when signing in
   */
  async isTokenValid() {
    const { local, session } = await import('/scripts/services/storage.esm.js');
    const token = local.get('token') || session.get('token');
    return token && Date.now() < token.decoded.exp * 1000; // Epoch
  }

  connectedCallback() {
    // Sets up routes for the main routing
    customElements.whenDefined('router-module').then(async () => {
      this.shadowRoot.querySelector('router-module').init({
        name: 'app',
        routes: {
          '/signin': {
            view: async () => (await import('/scripts/views/signin.esm.js')).default,
            // If there already is a valid token, redirect to the main view
            guard: async () => {
              if (await this.isTokenValid()) {
                RouterModule.set({ url: '/chat' });
                return false;
              }
              return true;
            }
          },
          '/register': {
            view: async () => (await import('/scripts/views/register.esm.js')).default,
          },
          '/chat/{id}': {
            view: async () => (await import('/scripts/views/chat.esm.js')).default,
            // If the token is invalid, redirect to the login view
            guard: async () => {
              if (!await this.isTokenValid()) {
                RouterModule.set({ url: '/signin' });
                return false;
              }
              return true;
            },
            // children: ['/channels/{id}']
          },
          '': {
            view: () => undefined, // No view
            // Check whether there is a valid token and redirect the user to a suitable view,
            // if not valid redirect to sign in view, if valid redirect to main view
            guard: async () => {
              const isTokenValid = await this.isTokenValid();
              RouterModule.set({ url: isTokenValid ? '/chat' : '/signin' });
              return false; // Just route; always fail guard
            }
          }
        }
      });
      RouterModule.set();
    });
  }
}

customElements.define('ip-app', App);
