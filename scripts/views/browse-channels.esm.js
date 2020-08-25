import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Channel <ip-browse-channels>
 *
 * Contains layout and content of existing channels.
 * Lists all current (subscribed and unsubscribed) channels with the possibility
 * to join any that are not already subscribed upon and remove subscription on those
 * that are.
 * 
 * Layout contains a search input for quick filtering and below a "table" listing
 * the channels.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class BrowseChannels extends Component {
  render() {
    this._style = `
      :host {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        background: var(--subscription-background);
      }

      #top-bar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 3rem;
        border-bottom: 1px solid var(--subscription-border-color);
        padding-left: 1rem;
        color: var(--subscription-header-color);
      }

      input {
        height: 1.75rem;
        border-radius: 4px;
        border: 1px solid var(--subscription-input-border-color);

        margin: 0;
        padding: 0;
        outline: 0;

        background: var(--modal-input-background);
        color: var(--modal-input-color);
      }

      input[type="text"] {
        font-size: 0.8rem;
        padding: 0 0 0 0.25rem;
      }

      input[type="text"]:focus {
        box-shadow: 0 0 0 1px var(--subscription-input-focus-border-color), 0 0 0 5px var(--subscription-input-focus-outline-color);
        border-color: transparent;
      }

      button {
        font-weight: bold;
        height: 1.5rem;
        background: white;
        margin: 0 0.5rem 0 0.5rem;
        cursor: pointer;
        outline: none;
        border: none;
      }

      button:hover {
        box-shadow: 0 1px 3px 0 rgba(0,0,0,.08);
        background: #f5f5f5;
      }

      button:active, button:focus {
        box-shadow: none;
        background: #f5f5f5;
        outline: 0;
      }

      .input-container {
        display: flex;
        flex-direction: column;
      }

      .layout-rows {
        display: flex;
        flex-direction: row;
      }

      .layout-columns {
        display: flex;
        flex-direction: column;
      }

      #rows {
        color: var(--subscription-channel-color);
        font-size: 0.8rem;
        font-color: red;
      }

      #rows > div {
        border-top: 1px solid var(--subscription-channel-border-color);
        height: 2rem;
      }

      #rows > div:last-child {
        border-bottom: 1px solid var(--subscription-channel-border-color);
      }

      #rows > div:hover {
        background: var(--subscription-channel-hover-background);
      }

      .channel-name {
        flex: 1;
        align-self: center;
        padding-left: 0.25rem;
      }

      .channel-description {
        align-self: center;
        font-style: italic;
        font-size: 0.7rem;
      }

      .subscription-button {
        display: flex;
        align-self: center;
        height: max-content;
        background: transparent;
        color: var(--subscription-channel-icon-color);
      }

      .subscription-button:active,
      .subscription-button:focus,
      .subscription-button:hover {
        background-color: inherit;
        outline: inherit;
        box-shadow: inherit;
      }

      .subscription-button:hover {
        color: var(--subscription-channel-hover-icon-color);
      }

      .subscription-icon {
        font-size: 1rem;
      }
    `;

    this._template = `
      <div id="top-bar">
        Browse existing channels
      </div>

      <div class="input-container" style="margin: 1rem">
        <input id="search" type="text" id="search" autocomplete="off" placeholder="Quick search">
      </div>

      <div id="rows" class="layout-columns" style="flex: 1; margin: 1rem"></div>
    `;
  }

  async load() {
    this.context = (await import('/scripts/services/context.esm.js')).default;
  }

  async afterLoad() {
    const rows = this.shadowRoot.getElementById('rows');
    const search = this.shadowRoot.getElementById('search');
    const channels = await this.context.getChannels();

    /** 
     * When input is added in the search / filter field
     * the list of records that does not contain any of it will
     * be filtered out (removed from the list).
     */
    search.addEventListener('input', (event) => {
      const value = event.target.value;

      if (value) {
        const filtered = channels.filter((channel) => {
          return channel.name.toLowerCase().includes(value.toLowerCase());
        });

        rows.textContent = ''; // Clear all (fast)
        this.populateChannelRecords(rows, filtered);
      } else {
        rows.textContent = ''; // Clear all (fast)
        this.populateChannelRecords(rows, channels);
      }
    });

    /**
     * Channel is being subscribed upon, change so if clicked
     * again it will be unsubscribed
     */
    this.addBusEventListener('channel-subscribed', (channel) => {
      const record = this.shadowRoot.getElementById(channel.id);
      record.dataset.subscription = true;

      const icon = record.querySelector('.subscription-icon');
      icon.textContent = 'remove';

      const button = record.querySelector('.subscription-button');
      button.removeAttribute('disabled');
    });

    /**
     * Channel is being unsubscribed upon, change so if clicked
     * again it will be subscribed
     */
    this.addBusEventListener('channel-unsubscribed', (channel) => {
      const record = this.shadowRoot.getElementById(channel.id);
      record.dataset.subscription = false;

      const icon = record.querySelector('.subscription-icon');
      icon.textContent = 'add';

      const button = record.querySelector('.subscription-button');
      button.removeAttribute('disabled');
    });

    // Update list of channels
    this.populateChannelRecords(rows, channels);
  }

  /**
   * Create and add elements from an array of channel data as chldren to
   * a container element.
   * @param rows An element that contains children representing channels 
   * @param channels A list of channel data that will be added on the "rows" element
   */
  populateChannelRecords(rows, channels) {
    for (const channel of channels) {
      rows.append(this.createChannelRecord(channel));
    }
  }

  /**
   * Creates a channel record (element) in the list of channels 
   * @param channel Channel data (name, description, id etc)
   */
  createChannelRecord(channel) {
    const record = document.createElement('div');
    record.className = 'layout-rows';
    record.setAttribute('id', channel.id);
    record.dataset.subscription = channel.subscription;

    const content = document.createElement('div');
    content.style.flex = 1;
    content.style.display = 'flex';

    const name = document.createElement('div');
    name.className = 'channel-name';
    name.textContent = `${channel.name} (${channel.id})`;
  
    const description = document.createElement('div');
    description.className = 'channel-description';
    description.textContent = channel.description;

    const button = document.createElement('button');
    button.className = 'subscription-button';

    const icon = document.createElement('i');
    icon.className = 'material-icons subscription-icon';
    icon.textContent = channel.subscription ? 'remove' : 'add';

    button.appendChild(icon);

    /**
     * Either subscribe or unsubscribe on a channel depending on its current state,
     * if it is already being subscribed it will be unsusbscribed, if it is not it
     * will be subscribed upon.
     */
    button.addEventListener('click', (event) => {
      event.preventDefault();

      button.setAttribute('disabled', '');

      const subscription = record.dataset.subscription;
      const eventType = subscription == 'true' ? 'channel-unsubscribe' : 'channel-subscribe';

      this.bus.dispatchEvent(eventType, channel);
    });

    content.append(name);
    content.append(description);

    record.append(content);
    record.append(button);

    return record;
  }
}

customElements.define('ip-browse-channels', BrowseChannels);
