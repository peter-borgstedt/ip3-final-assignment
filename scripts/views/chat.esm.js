import Component from '/scripts/core/component.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
*
* Web-component: Chat <ip-chat>
*
* Contains the overall layout of the main chat window. It consists of two views;
* to the left a side panel with user content such as subscribed channels, controls
* for editing profile and creating or subscribing new channels etc. To the right is
* the view displaying content depending on interactions in the side panel, most
* notably selecting a channel with its content suchs as the messages created with it.
*
* The view glues all these view together to one large that represents the chat.
*
* @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
*/
export default class Chat extends Component {
  constructor() {
    super();
    this.channelViews = {};
  }

  render() {
    this._style = `
      :host {
        flex: 1;
        display: flex;
        flex-direction: row;
        min-height: 0;
        font-family: Consolas, monaco, "Ubuntu Mono", courier, monospace;
        font-size: 16px;
        background: var(--chat-background);
      }

      #view-placeholder {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      #modal-placeholder {
        display: inline-block;
        position: relative;
        max-width: 0;
        min-width: 0;
      }
    `;

    this._template = `
      <app-spinner></app-spinner>
    `;
  }

  /**
   * Creates a channel view and add it in the preloaded collection.
   * @param channelid ID of channel
   */
  createChannelView(channel) {
    const view = document.createElement('ip-channel');
    view.setContent(channel);
    this.channelViews[channel.id] = view;
  }

  /**
   * Remove a channel view from the preloaded collection.
   * @param channelid ID of channel
   */
  removeChannelView(channel) {
    delete this.channelViews[channel.id];
  }

  /**
   * Sets a channel view on the right side replacing any existing content.
   * @param channelid ID of channel
   */
  setChannelView(channelid) {
    const view = this.channelViews[channelid];
    this.setView(view);
  }

  /**
   * Sets a view on the right side replacing any existing content.
   * @param view View to be set
   */
  setView(view) {
    if (this.viewPlaceHolder.children[0]) {
      this.viewPlaceHolder.children[0].replaceWith(view);
    } else {
      this.viewPlaceHolder.append(view);
    }
  }

  /**
   * Sets a modal view on the right side displaying the content over any
   * existing one but not replacing it.
   * @param view Modal view to be set
   */
  setModalView(view) {
    if (this.modalPlaceHolder.children[0]) {
      this.modalPlaceHolder.children[0].replaceWith(view);
    } else {
      this.modalPlaceHolder.append(view);
    }
  }

  async load() {
    // Load user contetx (user details, channels subscriptions etc)
    this.context = (await import('/scripts/services/context.esm.js')).default;

    // Connect to websocket (needs to be done first)
    // Subscribe to all channels when socket connection has been established,
    // afterwards the rest api can be used as we need to register the socket
    // before...
    const websocket = (await import('/scripts/services/websocket.esm.js')).default;

    // Get storage
    const { local, session } = await import('/scripts/services/storage.esm.js');

    // Open websocket connection using token
    await new Promise((resolve, reject) => {
      try {
        websocket.addEventListener('onopen', () => {
          resolve();
        });

        // Add reconnection if the browser by some reason is timingout event
        // thought ping and pong are sent between them, if server has restarted
        // the user will be redirected to login as the key for signing tokens has
        // been rotated...
        websocket.addEventListener('onclose', async (event) => {
          // Forbidden (token has failed the authentication), redirect to login page
          if (event.code === 4404) {
            // The context module might not have been successfully loaded
            const context = (await import('/scripts/services/context.esm.js')).default;
            // Reroute (redirect) the user to the login page
            context.logout();
          } else { // If any other issues, retry each 5 seconds (forever)
            const ref = setTimeout(async () => {
              clearTimeout(ref);
              console.log('[chat.esm.js::load] Websocket closed, retrying to connect...');
              await websocket.connect(token.encoded);
            }, 5000);
          }
        });

        // Reject promise if the websocket retrieves any failures
        websocket.addEventListener('onerror', (error) => reject(error));

        console.log('[chat.esm.js::load] Trying to connect to websocket');

        // Get token and connect to websocket
        const token = local.get('token') || session.get('token');
        websocket.connect(token.encoded);
      } catch(error) {
        reject(error);
      }
    });

    console.log('[chat.esm.js::load] Websocket succesfully connected');

    await this.context.init(); // Load initial data before displaying page

    console.log('[chat.esm.js::load] Context succesfully initiated');
  }

  async afterLoad() {
    console.log('[chat.esm.js::afterLoad] Invoked');

    this.shadowRoot.querySelector('app-spinner').remove();
    this.shadowRoot.appendChild(document.createElement('ip-sidebar'));

    // A place holder element for modal views
    this.modalPlaceHolder = document.createElement('div');
    this.modalPlaceHolder.setAttribute('id', 'modal-placeholder');
    this.shadowRoot.appendChild(this.modalPlaceHolder);

    // A place holder element for regular views
    this.viewPlaceHolder = document.createElement('div');
    this.viewPlaceHolder.setAttribute('id', 'view-placeholder');
    this.shadowRoot.appendChild(this.viewPlaceHolder);

    // Initialize all the channel views
    for (const channel of this.context.subscribed) {
      this.createChannelView(channel);
    }

    // Add event listeners to the event bus
    this.setupEventListeners();

    // If the channel id is defined in the location path then set view for that id 
    if (this.routerData.pathParameters.id) {
      this.setChannelView(this.routerData.pathParameters.id);
    }

    const { setTheme } = await import('/scripts/common/theme.esm.js');
    const selectedTheme = localStorage.getItem('theme');
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
  }

  /**
   * Setup listeners on events that will dynamically change
   * the view or update content of it. The events are dispatched
   * from the server and from other view within the webapplication.
   */
  setupEventListeners() {
    // The profile view has been opened (clicked)
    this.addBusEventListener('profile-open', () => {
      // Open a modal view (right side over any existing view -- no replacement)
      this.setModalView(document.createElement('ip-profile'));
    });

    // The theme view has been opened (clicked)
    this.addBusEventListener('theme-open', () => {
      // Open a modal view (right side over any existing view -- no replacement)
      this.setModalView(document.createElement('ip-theme'));
    });

    // The channel view has been opened (clicked)
    this.addBusEventListener('open-channel-create', () => {
      // Open a modal view (right side over any existing view -- no replacement)
      this.setModalView(document.createElement('ip-create-channel'));
    });

    // The browse channels view has been opened (clicked)
    this.addBusEventListener('open-channel-browse', () => {
      // Open the view (right side)
      this.setView(document.createElement('ip-browse-channels'));
    });

    // A channel has been opened (clicked)
    this.addBusEventListener('channel-selected', (channel) => {
      // Open the view (right side)
      this.setChannelView(channel.id);
    });

    // A channel has been created
    this.addBusEventListener('channel-created', (channel) => {
      // Create the channel view and then open the view (right side)
      this.createChannelView(channel);
      this.setChannelView(channel.id);
    });

    // A channel has been subscribed upon
    this.addBusEventListener('channel-subscribed', (channel) => {
      // Create a view for the channel and add it to existing collection
      this.createChannelView(channel);
    });

    // A channel has been unsubscribed upon
    this.addBusEventListener('channel-unsubscribed', (channel) => {
      // Remove the view from the collection
      this.removeChannelView(channel.id);
    });
  }
}

customElements.define('ip-chat', Chat);
