import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Sidebar <ip-sidebar>
 *
 * Contains layout and content associated with the sidebar.
 * The sidebar contains a drawer that displays existing subscribed channels,
 * controls to create a new channel or subscribe/unsubscribe on existing channels.
 * There are also controls for editing profile, changing color theme and logging out.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Channels extends Component {
  constructor() {
    super();
    this.build(); // We want to build this before it has been connected
    this.open = true;
  }

  connectedCallback() {
    // Intentionally empty to avoid build after component has been attached to the DOM
  }

  render() {
    this._style = `
      :host {
        display: flex;
        flex-direction: column;

        position: relative;
        width: 14.5rem;
        min-width: max-content;

        color: black;
        background: var(--sidebar-background);

        border-right: 1px solid var(--panel-border-color-100);
      }

      :host:after {
        position: absolute;
        content: '';
        top: 0;
        right: 0;
        width: 4px;
        height: 100%;
        /** Gives a little depth in the line; shadow */
        background: linear-gradient(to left, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0) 100%)
      }

      .action {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        height: 1.5rem;
        user-select: none;
      }

      .action-icon {
        display: flex;
        justify-content: center;
        font-size: 1rem;
        margin: 0 0.5rem 0 0.5rem;
        width: 25px;
      }

      .action-label {
        font-size: 0.8rem;
        font-weight: bold;
      }

      .panel-top .action-label {
        color: var(--sidebar-action-top-text-color);
      }

      .panel-top .action-icon {
        color: var(--sidebar-action-top-icon-color);
      }

      .panel-top .action:hover {
        background: var(--sidebar-action-top-hover-background);
      }

      .panel-top .action:hover .action-label {
        color: var(--sidebar-action-top-hover-text-color);
      }

      .panel-top .action:hover .action-icon {
        animation: shake 0.25s infinite;
        color: var(--sidebar-action-top-hover-icon-color);
      }

      .panel-bottom .action-label {
        color: var(--sidebar-action-bottom-text-color);
      }

      .panel-bottom .action-icon {
        color: var(--sidebar-action-bottom-icon-color);
      }

      .panel-bottom .action:hover {
        background: var(--sidebar-action-bottom-hover-background);
      }

      .panel-bottom .action:hover .action-label {
        color: var(--sidebar-action-bottom-hover-text-color);
      }

      .panel-bottom .action:hover .action-icon {
        animation: shake 0.25s infinite;
        color: var(--sidebar-action-bottom-hover-icon-color);
      }

      #resizable-anchor {
        display: inline;
        position: absolute;
        top: 0;
        right: -1px;
        width: 2px;
        height: 100%;
        cursor: col-resize;
        z-index: 1;

        user-select: none;
        -webkit-user-select: none; /* Safari */

        transition: background-color 100ms linear, opacity 300ms cubic-bezier(0.2,0,0,1), transform 300ms cubic-bezier(0.2,0,0,1);
        -webkit-transition: background-color 100ms linear, opacity 300ms cubic-bezier(0.2,0,0,1), transform 300ms cubic-bezier(0.2,0,0,1);
      }

      #resizable-anchor:hover:not(.closed) {
        background: var(--sidebar-border-resizable-hover-color);
      }

      #resizable-anchor:hover #resizable-anchor-toggle {
        background: var(--sidebar-border-resizable-toggle-hover-background);
        color: var(--sidebar-border-resizable-toggle-hover-color);
      }

      .closed #resizable-anchor-toggle {
        background: var(--sidebar-border-resizable-toggle-closed-background);
        color: var(--sidebar-border-resizable-toggle-closed-color);
      }

      #resizable-anchor-toggle {
        display: flex;
        align-items: center;
        justify-content: center;

        position: absolute;

        top: calc(50% - 10px);
        right: 0px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        border-radius: 100%;
        border: none;

        font-size: 1rem;

        line-height: 24px;
        text-align: center;

        box-shadow: 0 0 0 1px rgba(9, 30, 66, 0.1), 0 2px 4px 1px rgba(9, 30, 66, 0.1);

        background-color: var(--sidebar-border-resizable-toggle-open-background);
        color: var(--sidebar-border-resizable-toggle-open-color);

        cursor: pointer;

        opacity: 1;
        outline: 0;

        transition: background-color 100ms linear, color 100ms linear, opacity 300ms cubic-bezier(0.2,0,0,1), transform 300ms cubic-bezier(0.2,0,0,1);
        -webkit-transition: background-color 100ms linear, color 100ms linear, opacity 300ms cubic-bezier(0.2,0,0,1), transform 300ms cubic-bezier(0.2,0,0,1);

        transform: translate(50%);
        -webkit-transform: translate(50%);

        z-index: 1;
      }

      .panel {
        display: flex;
        flex-direction: column;

        white-space: nowrap;
        text-overflow: ellipsis;

        min-width: max-content;
        padding: 1rem 0 1rem 0;

        overflow: hidden;
      }

      .panel-top {
        background: var(--sidebar-top-background);
        min-height: 0;
      }

      .panel-bottom {
        background: var(--sidebar-bottom-background);
        min-height: 0;
      }

      .panel--channels {
        flex: 1;
        display: flex;
        flex-direction: column;

        min-width: max-content;
        min-height: 0;

        padding-top: 0.5rem;

        border-top: 1px solid var(--sidebar-border-horizontal-color);
        border-bottom: 1px solid var(--sidebar-border-horizontal-color);
      }

      #login-status {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        min-width: max-content;

        margin-bottom: 0.5rem
      }

      #login-status-username-label {
        font-size: 0.7rem;
        color: var(--sidebar-text-color);
        margin: 0 0.5rem 0 0.5rem;
      }

      /*
       * Taken and modified:
       * https://www.w3schools.com/howto/howto_css_shake_image.asp
       */
      @keyframes shake {
        0% { transform: translate(0px, 0px) rotate(-10deg); }
        25% { transform: translate(-1px, 1px) rotate(0deg); }
        50% { transform: translate(1px, -1px) rotate(0deg); }
        75% { transform: translate(1px, 1px) rotate(-5deg); }
        100% { transform: translate(-1px, -1px) rotate(0deg); }
      }

      #overflow-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        position: relative;
      }

      #profile-image {
        max-width: 96px;
        border-radius: 8px;
        margin: 0.5rem;
        align-self: center;
        border: 1px solid #888;
      }
    `;

    this._template = `
      <div id="overflow-container">
        <div class="panel panel-top">
          <div id="login-status">
            <span id="login-status-username-label"></span>
          </div>

          <div id="user-button" class="action">
            <i class="action-icon material-icons">accessibility_new</i>
            <span class="action-label">Profile</span>
          </div>

          <div id="palette" class="action">
            <i class="action-icon material-icons">palette</i>
            <span class="action-label">Theme</span>
          </div>
        </div>

        <div class="panel--channels">
          <ip-channel-drawer id="channels"></ip-channel-drawer>
        </div>

        <div class="panel panel-bottom">
          <div id="logout" class="action">
            <i class="action-icon material-icons">exit_to_app</i>
            <span class="action-label">Logout</span>
          </div>
        </div>
      </div>
    `;
  }

  async load() {
    this.context = (await import('/scripts/services/context.esm.js')).default;
  }

  async afterLoad() {
    // Add logged in username at the top
    const user = await this.context.getUser();
    const usernameLabel = this.shadowRoot.getElementById('login-status-username-label');
    usernameLabel.textContent = `${user.forename} ${user.surname}`;

    // Add a drawer with a list of channels and the possibility to
    // open a popup meny with options to create a new, subscribe or unsubscribe a channel
    const drawer = this.shadowRoot.querySelector('ip-channel-drawer');
    drawer.addEventListener('item-selected', (event) => {
      event.preventDefault();
      this.bus.dispatchEvent('channel-selected', event.detail);
    });
    drawer.addItems(this.context.subscribed);

    // Add an interactive "button" to the profile view
    this.profile = this.shadowRoot.getElementById('user-button');
    this.profile.addEventListener('click', (event) => {
      event.preventDefault();
      this.bus.dispatchEvent('profile-open');
    });

    // Change color theme of layout by replacing some CSS variables set in the
    // documentElement (root).
    const palette = this.shadowRoot.getElementById('palette');
    palette.addEventListener('click', (event) => {
      event.preventDefault();
      this.bus.dispatchEvent('theme-open');
    });

    // Logout button disconnecting the user from the server and ending
    // the session by removing the token from local or session storage
    const logout = this.shadowRoot.getElementById('logout');
    logout.addEventListener('click', (event) => {
      event.preventDefault();
      this.context.logout();
    });

    /**
     * Add event listeners when a channel has been created, subscribed or unsubscribed upon.
     */
    this.addBusEventListener('channel-created', (channel) => drawer.addItem(channel));
    this.addBusEventListener('channel-subscribed', (channel) => drawer.addItem(channel));
    this.addBusEventListener('channel-unsubscribed', (channel) => drawer.removeItem(channel.id));
    this.addBusEventListener('channel-deleted', (channelId) => {
      drawer.removeItem(channelId);
    });

    // Enable resizing of sidebar
    this.enableResizing();
    this.enableShowHide();
  }

  /**
   * Enable possibility for the user to resize the sidebar view, making
   * the left window bigger or smaller.
   */
  enableResizing() {
    this._clickEventListener = this._resizeInit.bind(this);
    this._mouseMoveEventListener = this._resizeStart.bind(this);
    this._mouseUpEventListener = this._resizeStop.bind(this);

    const anchor = document.createElement('div');
    anchor.id = 'resizable-anchor';

    const anchorToggle = document.createElement('div');
    anchorToggle.id = 'resizable-anchor-toggle';
    anchorToggle.className = 'material-icons';
    anchorToggle.textContent = 'first_page';

    anchor.appendChild(anchorToggle);
    this.shadowRoot.appendChild(anchor);

    anchor.addEventListener('mousedown', this._clickEventListener);
  }

  /** Sets listeners for sidebar resizing */
  _resizeInit (e) {
    if (this.open) {
      // Store the initial values to be able to calculate the new width
      // when resizing the sidebar
      this._startX = e.clientX;
      this._startY = e.clientY;
      this._startWidth = parseInt(document.defaultView.getComputedStyle(this.shadowRoot.host).width, 10);
      this._startHeight = parseInt(document.defaultView.getComputedStyle(this.shadowRoot.host).height, 10);
  
      document.addEventListener('mousemove', this._mouseMoveEventListener);
      document.addEventListener('mouseup', this._mouseUpEventListener);
    }
  }

  /** When a resizing of the sidebar has started continously set the new width */
  _resizeStart (e) {
    const newWidth = (this._startWidth + e.clientX - this._startX) + 'px';
    this.shadowRoot.host.style.width = newWidth;
  }

  /** When a resize has been stopped, remove all listeners for resizing */
  _resizeStop (_e) {
    document.removeEventListener('mousemove', this._mouseMoveEventListener);
    document.removeEventListener('mouseup', this._mouseUpEventListener);
  }

  /**
   * Enable toggle button that open (expands) or closes (contracts) the sidebar with its content.
   * When a toggle occur the sidebar will transition the width either to 0px or the previous
   * width it was in, giving it a smooth animated expand and contract to the side. 
   */
  enableShowHide() {
    const anchor = this.shadowRoot.getElementById('resizable-anchor');
    const toggle = this.shadowRoot.getElementById('resizable-anchor-toggle');
    const overflowContainer = this.shadowRoot.getElementById('overflow-container');

    // When clicked on toggle display or hide the sidebar
    toggle.addEventListener('click', () => {
      this.open = !this.open; // Toggle the sidebar state (open or closed)

      if (!this.open) {
        // If closed, store the previous width
        this.previousWidth = this.shadowRoot.host.style.width;
        overflowContainer.style.overflow = 'hidden';
      }

      // When the transition has ended change the arrow of the toggle button
      const transitionEndEventListener = () => {
        toggle.textContent = this.open ? 'first_page' : 'arrow_right';
        // Adjust the character a little
        toggle.style['padding-left'] = this.open ? '' : '5px';

        if (this.open) {
          anchor.classList.remove('closed');
          overflowContainer.style.overflow = '';
        } else {
          anchor.classList.add('closed');
        }

        if (this.open) {
          // If open set the min width to max-content so it cannot be
          // resized to 0px
          this.shadowRoot.host.style['min-width'] = 'max-content';
        }

        // Remove transition style property
        this.shadowRoot.host.style.transition = 'none';
        // Remove the transitionend event listener
        this.shadowRoot.host.removeEventListener('transitionend', transitionEndEventListener);
      };
      
      // Add transitionend eventlistener
      this.shadowRoot.host.addEventListener('transitionend', transitionEndEventListener);

      // Add transition style property
      this.shadowRoot.host.style.transition = 'width 0.3s ease-out';

      // If closed set the min-width to 0px (so it can be hidden)
      if (!this.open) {
        this.shadowRoot.host.style['min-width'] = '0px';
      }

      // Set the width to either 0px (if closing) or to the previous width (if opening),
      // this will trigger the transition that will let the sidebar smoothly appear or
      // disappear from the side
      this.shadowRoot.host.style.width = this.open ? this.previousWidth : '0px';
    });
  }
}

customElements.define('ip-sidebar', Channels);
