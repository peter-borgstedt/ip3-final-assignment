import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Channel <ip-channel>
 *
 * Contains layout and content concerning a channel. A channel contains messages that has been sent,
 * the users that has sent them and some details about the channel itself.
 * 
 * The layout consists of a header part displaying the details about the channel, a content part containing
 * the messages and lastly an input control for writing and sending messages with text and images.
 * 
 * References:
 * https://stackoverflow.com/questions/20776045/reverse-scrolling
 * https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
 * https://stackoverflow.com/questions/34213227/scrollable-div-to-stick-to-bottom-when-outer-div-changes-in-size
 * 
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Channel extends Component {
  constructor() {
    super();

    this.limit = 10; // Pagination limit
    this.pagination = null; // Pagination index

    this.isLoadingData = false;
    this.allIsLoaded = false; // All messages have been loaded
  }

  async render() {
    this._style = `
      :host {
        flex: 1;
        display: flex;
        min-height: 0px;
        background: var(--channel-background);
      }

      #wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0px;
        color: #222;
      }

      #drag-drop-backdrop {
        display: none;
        align-items: center;
        justify-content: center;
        position: absolute;

        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        opacity: 0.85;
        background: white;

        z-index: 5;
      }

      .drag-drop-backdrop-visible * {
        display: flex;
      }

      #top-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 3rem;

        border-bottom: 1px solid var(--channel-header-border-color);
        background: var(--channel-header-background);
      }

      .channel-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
        font-family: Consolas, monaco, "Ubuntu Mono", courier, monospace;
        font-size: 0.8rem;
        color: var(--channel-header-title-color);
      }

      .channel-description {
        font-size: 0.6rem;
        color: var(--channel-header-description-color);
      }

      .channel-menu,
      .channel-subscriptions {
        display: flex;
        margin-right: 1rem;
        user-select: none;
      }

      .channel-subscriptions {
        user-select: none;
        color: var(--channel-header-subscription-color);
      }

      .channel-menu-button {
        color: var(--channel-header-action-icon-color);
      }

      .channel-menu-button:hover {
        color: var(--channel-header-action-hover-icon-color);
      }

      .messages-overflow-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: auto;

        /* The scrolling part took me over a day to be able to get right in Chrome, Firefox and Safari...
         * https://medium.com/carousell-insider/assembling-robust-web-chat-applications-with-javascript-an-in-depth-guide-9f36685fc1bc
         * https://github.com/philipwalton/flexbugs/issues/108
         * https://bugzilla.mozilla.org/show_bug.cgi?id=1042151
         *
         * An option:
         * transform:rotate(180deg);
         * direction: rtl;
         */
      }

      .messages {
        flex: 1;
        margin: 0 1rem 0 1rem;

        /* A cross platform solution, "flex-direction: column-reverse" is not supported widely, issues in firefox and safari */
        transform: scaleY(-1);
      }
      
      .messages > * {
        /*
        * https://medium.com/carousell-insider/assembling-robust-web-chat-applications-with-javascript-an-in-depth-guide-9f36685fc1bc
        * https://github.com/philipwalton/flexbugs/issues/108
        * https://bugzilla.mozilla.org/show_bug.cgi?id=1042151
        *
        * An option:
        * transform:rotate(180deg);
        */
        transform: scaleY(-1);

        margin: 0.7rem 0 0.7rem 0;
      }

      smiley-spinner {
        flex: 1;
      }

      #container {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
      }

      .subscriptions {
        font-size: 1rem;
        vertical-align: middle;
      }

      .subscriptions-label {
        display: inline-block;
        position: relative;
        bottom: -0.1rem;
        margin-left: 0.2rem;
        font-size: 0.6rem;
      }

      #content-state-container {
        display: flex;
        flex-direction: column;
        position: relative;
        align-items: center;

        visibility: hidden;

        transition: opacity 2s linear;
      }

      .content-state-all-loaded {
        opacity: 0;
      }

      /* Show only when hovering over chat window */
      .content-state {
        display: flex;
        flex-direction: column;
        position: absolute;
        align-items: center;

        margin-top: 0.25rem;

        z-index: 1;
        height: max-content;
      }

      #content-state-label {
        font-family: Arial;
        font-size: 0.5rem;
        font-weight: bold;
        text-transform: uppercase;
        color: #bbb;
      }

      :host(:hover) #content-state-container {
        visibility: visible;
      }

      /*
       * Use SVG like this instead so we can define the color with CSS, otherwise
       * we need to inline the SVG or set the style color in the SVG itself
       * https://stackoverflow.com/a/56669846
       */
      .svg-icon {
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;

        background: #bbb;

        -webkit-mask-size: cover;
        mask-size: cover;
      }

      .svg-scroll {
        -webkit-mask-image: url(/assets/mouse.svg);
        mask-image: url(/assets/mouse.svg);
      }

      .svg-happy {
        margin-top: 0.25rem;

        -webkit-mask-image: url(/assets/happy.svg);
        mask-image: url(/assets/happy.svg);
      }

      .no-children-pointer-select * {
        pointer-events: none;
      }
    `;

    this._template = `
      <div id="wrapper">
        <div id="top-bar">
          <div class="channel-details">
            <div>${this.content.name} (${this.content.id})</div>
            <div class="channel-description">${this.content.description}</div>
          </div>

          <div class="channel-subscriptions">
            <i class="material-icons subscriptions">group</i>
            <div class="subscriptions-label">${this.content.subscriptions}</div>
          </div>

          <div class="channel-menu">
            <ip-dropdown right>
              <button class="channel-menu-button material-icons">menu</button>
            </ip-dropdown>
          </div>
        </div>

        <div id="container">
          <div id="drag-drop-backdrop">
            Drag & drop any image for attaching it to a new message!
          </div>

          <div id="content-state-container">
            <div class="content-state">
              <div id="content-state-label">Scroll for more</div>
              <div id="content-state-icon" class="svg-icon svg-scroll"></div>
            </div>
          </div>

          <smiley-spinner></smiley-spinner>

          <ip-control></ip-control>
        </div>
      </div>
    `;
  }

  /**
   * Inserts multiple messages into the messages view
   * @param fetchedMessages An array of messages from server side (PostgreSQL)
   */
  async insertMessages(fetchedMessages) {
    const { records, hasMore } = fetchedMessages;
    // If any messages add them to the channel
    if (records.length) {
      for (const message of records) {
        await this.add(message, true);
      }
      // Get the current pagination position (index of last item)
      this.pagination = records[records.length - 1].index;
    }

    // If all is loaded the auto loading of more messages when
    // scrolling will be disabled
    this.allIsLoaded = !hasMore;

    const stateContainer = this.shadowRoot.getElementById('content-state-container');
    const state = this.shadowRoot.getElementById('content-state-label');
    const icon = this.shadowRoot.getElementById('content-state-icon');
    
    // Notify the user that all has been loaded with a happy face,
    // and slowly fade it out
    if (this.allIsLoaded) {
      state.textContent = 'All loaded';
      stateContainer.classList.add('content-state-all-loaded');
      icon.classList.remove('svg-scroll');
      icon.classList.add('svg-happy');

      stateContainer.addEventListener('transitionend', () => {
        // When transition has ended, remove the element (as it is no longer needed)
        stateContainer.remove(); // Remove element (not needed when all is loaded)
      });
    }
  }

  async connectedCallback() {
    // The channel views are preloaded
    if (!this.loaded) {
      super.connectedCallback();
      this.loaded = true; // Display content
    }
    this.scrollDown(); // Always scroll down to latest message
  }

  async afterRender() {
    this.shadowRoot.host.classList.add('drag-and-drop');
    // Contains all messages
    this.messages = document.createElement('div');
    this.messages.setAttribute('id', 'messages');
    this.messages.classList.add('messages');

    // Is the overflow area of message (handling scrolling)
    this.messageOverflowContainer = document.createElement('div');
    this.messageOverflowContainer.classList.add("messages-overflow-container");
    this.messageOverflowContainer.append(this.messages);

    // Is the input controller (lower panel)
    const control = this.shadowRoot.querySelector('ip-control');

    // Is the drag & drop back drop which displays when dragging image over the content
    const dragDropBackdrop = this.shadowRoot.getElementById('drag-drop-backdrop');

    // Drag and drop image attachment
    const wrapper = this.shadowRoot.getElementById('wrapper');

    // Needs to be cancelled to be able to drop, see details:
    // https://www.w3schools.com/html/html5_draganddrop.asp
    wrapper.addEventListener('dragover', (event) => event.preventDefault());

    // Below is a fix for Safari that has some severe difficulties when
    // drag and drop which enteres and leaves the drop zone due to
    // children that exist in it; solution is to set pointer-select: none
    // to all of them during drag which will fix the visual effect that
    // is displayed while dragged
    // https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    let dropZoneEntered = false;
    wrapper.addEventListener('dragenter', (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (!dropZoneEntered) {
        wrapper.classList.add('no-children-pointer-select');
        dragDropBackdrop.style.display = "flex";
        dropZoneEntered = true;
      }
    });

    wrapper.addEventListener('dragleave', (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (event.target == wrapper) {
        wrapper.classList.remove('no-children-pointer-select');
        dragDropBackdrop.style.display = "none";
        dropZoneEntered = false;
      }
    });
  
    wrapper.addEventListener('drop', (event) => {
      event.stopPropagation();
      event.preventDefault();

      dropZoneEntered = false;

      wrapper.classList.remove('no-children-pointer-select');
      dragDropBackdrop.style.display = "none";

      // Only accept image files
      const type = event.dataTransfer.items[0].type;
      if (event.dataTransfer.files.length && type.startsWith('image/')) {
        const [ file ] = event.dataTransfer.files;
        control.dispatchEvent(new CustomEvent('drag-drop-attachment', { detail: file }));
      }
    });

    const { getMessages } = await import('/scripts/services/api.esm.js');

    // Use 'wheel' instead of 'scroll' as we want to get events even if
    // the current space is not scrollable
    this.messageOverflowContainer.addEventListener('wheel', async (event) => {
      // The below commented row is if the container is reversed (see comments in CSS),
      // I keep this here if needing too look back at this in future similar projects
      // const offset = this.messageOverflowContainer.scrollHeight - this.messageOverflowContainer.clientHeight;

      /** Load more data (if any) when scrolled to the top */
      if (this.messageOverflowContainer.scrollTop === 0 && !this.isLoadingData && !this.allIsLoaded) {
        const previousScrollHeight = this.messages.scrollHeight;
        this.isLoadingData = true;

        // 1 is the lowest index
        const from = this.pagination ? Math.max(this.pagination, 1) : undefined;
        const fetchedMessages = await getMessages(this.content.id, from, this.limit);

        await this.insertMessages(fetchedMessages);

        // We want to set the scroll position on the previous place before
        // the content was added, to do so we need to use the diff between
        // the old scrollHeight with the new
        this.messageOverflowContainer.scrollTop = this.messages.scrollHeight - previousScrollHeight;

        this.isLoadingData = false; // Finish loading data
      }
    }, {
      passive: true // https://www.chromestatus.com/feature/5745543795965952
    });

    /** Load messages on channel activation */
    const fetchedMessages = await getMessages(this.content.id, null, this.limit);
    await this.insertMessages(fetchedMessages);

    // When all is set and data loaded then remove the animated loader
    const spinner = this.shadowRoot.querySelector('smiley-spinner');
    spinner.replaceWith(this.messageOverflowContainer);

    // When initial messages are loaded scroll down to bottom
    this.scrollDown();
  }

  async afterLoad() {
    // New messages we want to prepend so we get them in the bottom
    this.addBusEventListener(`channel-${this.content.id}`, async (message) => {
      await this.add(message, false);
      this.scrollDown();
    });

    // Updates the subscription count with one when a new user
    // has subscribed on channel (joined)
    this.addBusEventListener(`channel-subscribed-${this.content.id}`, () => {
      const subscriptions = this.shadowRoot.querySelector('.subscriptions-label');
      subscriptions.textContent = Number(subscriptions.textContent) + 1;
    });

    // Updates the subscription count with minus one when a new user
    // has unsubscribed on channel (leaved) 
    this.addBusEventListener(`channel-unsubscribed-${this.content.id}`, () => {
      const subscriptions = this.shadowRoot.querySelector('.subscriptions-label');
      subscriptions.textContent = Number(subscriptions.textContent) - 1;
    });

    this.addBusEventListener('channel-unsubscribed', () => {
      this.remove();
    });

    // Removes the channel if the user that has created the channel
    // has choosen to remove it (which can be the current user or other user)
    this.addBusEventListener(`channel-deleted-${this.content.id}`, () => {
      this.remove();
    });

    // When a new message has been entered it will forward it to the websocket-proxy
    // which then will send it to the server
    const control = this.shadowRoot.querySelector('ip-control');
    control.addEventListener('message', (event) => {
      event.preventDefault();

      this.bus.dispatchEvent('message', {
        ...event.detail,
        channelId: this.content.id,
      });
    });

    // Set menu items
    const dropdown = this.shadowRoot.querySelector('ip-dropdown');

    const channelUnsubscribe = document.createElement('a');
    channelUnsubscribe.setAttribute('slot', 'items');
    channelUnsubscribe.setAttribute('id', 'channel-unsubscribe');
    channelUnsubscribe.textContent = 'Unsubscribe on channel';
    dropdown.append(channelUnsubscribe);

    // The current user has unsubscribed on channel
    // const channelUnsubscribe = this.shadowRoot.getElementById('channel-unsubscribe');
    channelUnsubscribe.addEventListener('click', (event) => {
      event.preventDefault();
      this.bus.dispatchEvent('channel-unsubscribe', this.content);
    });

    const context = (await import('/scripts/services/context.esm.js')).default;
    const user = await context.getUser();

    if (this.content.creatorId === user.id) {
      const channelDelete = document.createElement('a');
      channelDelete.setAttribute('slot', 'items');
      channelDelete.setAttribute('id', 'channel-delete');
      channelDelete.textContent = 'Delete channel';
      dropdown.append(channelDelete);

      // The current user and creator of channel has removed it
      // const channelDelete = this.shadowRoot.getElementById('channel-delete');
      channelDelete.addEventListener('click', (event) => {
        event.preventDefault();
        this.bus.dispatchEvent('channel-delete', this.content);
      });

      // Add an event listener for scrolling down to parts of the content,
      // this is used when closing and opening attached images in messages,
      // when the image is opened we want to scroll down so the whole image
      // is displayed
      this.addBusEventListener(`channel-scrolldown-${this.content.id}`, (offset) => {
        console.log('got stuff', offset);
        this.messageOverflowContainer.scrollTop = offset;
      });
    }

  }

  /**
   * Creates a message of specific type (text, image) 
   * @param {object} messageContent The content of the message
   */
  async createMessage(messageContent) {
    const context = (await import('/scripts/services/context.esm.js')).default;

    const content = {
      id: messageContent.id,
      channelId: this.content.id,
      user: await context.getUser(messageContent.userId),
      timestamp: new Date(messageContent.created),
      text: messageContent.data.text
    };

    // Message only contains text
    if (messageContent.type === 'text') {
      const message = document.createElement('ip-message');
      await message.setContent(content);
      return message;
    // Message contains either only an image or an image with text
    } else if (messageContent.type === 'image') {
      const message = document.createElement('ip-message-image');
      await message.setContent({ ...content, imageUrl: messageContent.data.imageUrl });
      return message;
    }
  }

  /**
   * Creates a message element and adds its to the messages view.
   * @param {object} messageContent Message content (user, timestamp, text, image etc) 
   * @param {boolean} append If message be inserted after or before existing messages
   */
  async add(messageContent, append) {
    const message = await this.createMessage(messageContent);

    if (append) {
      this.messages.append(message);
    } else {
      this.messages.prepend(message);
    }
  }

  /** Scroll down the messages view to the bottom. */
  scrollDown() {
    this.messageOverflowContainer.scrollTop = this.messages.scrollHeight;
  }

  /**
   * Sets the content of this channel, suchs as channel id, description,
   * the subscribing users etc.
   * @param channelContent Content related to the channel
   */
  setContent(channelContent) {
    this.content = channelContent;
  }
}

customElements.define('ip-channel', Channel);
