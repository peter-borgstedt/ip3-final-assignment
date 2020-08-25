import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Message <ip-message>
 * 
 * Represent the content of a message in a channel that a user has written.
 * The message contains the text content, when it was created, details about 
 * the author; profile image, name and email.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Message extends Component {
  render() {
    this._style = `
      :host {
        display: flex;
        flex-direction: row;
        position: relative;

        min-height: 0;

        transition: opacity 1s ease-out;
        opacity: 0;

        background: var(--channel-message-background);
      }

      :host(:hover) {
        background: var(--channel-message-hover-background);
      }

      :host(.show) {
        opacity: 1;
      }

      #profileImage {
        width: 32px;
        height: 32px;
        border-radius: 3px;
      }

      #content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 0.5rem;
        min-width: 0;
      }

      #header {
        display: flex;
      }

      #header > *:not(:first-child) {
        padding-left: 0.5rem;
      }

      #username {
        font-family: Arial;
        font-size: 0.8rem;
        font-weight: bold;
        text-decoration: none;

        color: var(--channel-message-username-color);
      }

      #timestamp {
        color: var(--channel-message-timestamp-color);
        font-size: 0.59rem;
      }

      #message {
        color: var(--channel-message-text-color);
        font-size: 0.8rem;
        word-break: break-word;
      }

      #message-delete {
        display: inline-flex;
        align-self: center;
        justify-self: center;
        position: absolute;
        visibility: hidden;

        right: 0;

        border: none;
        outline: none;
        background: transparent;
        color: var(--channel-message-delete-background);

        font-size: 1rem;
        user-select: none;
        cursor: pointer;
        padding: 0 0.5rem 0 0;
      }

      #message-delete:active,
      #message-delete:focus,
      #message-delete:hover {
        background: inherit;
        outline: inherit;
        border: inherit;
      }


      #message-delete:hover {
        color: var(--channel-message-delete-hover-background);
      }

      :host(:hover) #message-delete {
        visibility: visible;
      }
    `;

    this._template = `
      <img id="profileImage">

      <div id="content">
        <div id="header">
          <div>
            <a id="username">?</a>
            <span id="timestamp">?</span>
          </div>
        </div>
        <div id="message">?</div>
      </div>
    `;
  }

  /**
   * Creates or updates content of message.
   * @param author User details of author
   */
  async buildMessage(author) {
    // Get a normalized text adjusted for HTML and a formatted timestamp
    const { normalizeText, getShortTimestamp } = await import('../common/utils.esm.js');

    // If the author has a profile image, preload it before displaying the message
    if (author.profileImageUrl) {
      await this.loadImage(author.profileImageUrl); // Preload

      // Image has been preloaded, set image source
      const profileImage = this.shadowRoot.getElementById('profileImage');
      profileImage.src = author.profileImageUrl;
    }

    // Set username of author (email as link)
    this.username = this.shadowRoot.getElementById('username');
    this.username.textContent = `${author.forename} ${author.surname}`;
    this.username.href = `mailto:${author.email}`;

    // Set time stamp when message was created
    this.timestamp = this.shadowRoot.getElementById('timestamp');
    this.timestamp.textContent = `(${getShortTimestamp(this.content.timestamp)})`;

    // Set text content of message
    this.message = this.shadowRoot.getElementById('message');
    this.message.innerHTML = normalizeText(this.content.text);

    // Add a delete button if current has created the message
    this.addDeleteButton(author);
  }

  /**
   * Add a delete button on message if the current user is the author of the message
   * @param {object} author User details of the message creator
   */
  async addDeleteButton(author) {
    // Check if current user is the author (to enable the possibility to delete it)
    const context = (await import('/scripts/services/context.esm.js')).default;
    const clientUser = await context.getUser();

    // If author is the current user add a delete button to the message 
    if (clientUser.id === author.id) {
      const messageDelete = document.createElement('button');
      messageDelete.setAttribute('id', 'message-delete');
      const messageDeleteIcon = document.createElement('i');

      messageDeleteIcon.className = 'material-icons';
      messageDeleteIcon.textContent = 'backspace';
      messageDelete.appendChild(messageDeleteIcon);

      // When clicked remove message by dispatching event to the bus
      messageDelete.addEventListener('click', () => {
        // Set button as disabled so it cannot be clicked again
        // while message is being deleted
        messageDelete.setAttribute('disabled', '');
  
        // Send an event out that will be broadcasted using websocket to all users
        // that is subscribing on the channel
        this.bus.dispatchEvent('message-delete', {
          id: this.content.id,
          userId: author.id,
          channelId: this.content.channelId
        });
      });

      this.shadowRoot.appendChild(messageDelete);
    }
  }

  async afterRender() {
    await this.buildMessage(this.content.user);
  }

  async afterLoad() {
    /** On profile update of specific user id */
    this.addBusEventListener(`profile-changed-${this.content.user.id}`, (user) => {
      this.content.user = user;
      this.buildMessage(user);
    });

    /** On removal of message */
    this.addBusEventListener(`message-${this.content.channelId}-${this.content.id}`, () => {
      this.remove();
    });
  }

  /**
   * Preload image.
   * @param url URL of image
   * @returns an image
   */
  async preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onabort = () => reject(`Could not finish loading image ${url}`);
      img.onerror = () => reject(`Could not load image ${url}`);
    });
  }

  /**
   * Preload image and handle any error,
   * will always return an HTMLImageElement.
   * @param {string} url 
   * @return an image
   */
  async loadImage(url) {
    // Set and preload image
    try {
      return await this.preloadImage(url);
    } catch (error) {
      console.log(error);
    }
    return new Image();
  }

  connectedCallback() {
    // Do nothing, the component is prebuilt
  }

  /**
   * Set message content.
   * @param messageContent Object with content
   */
  async setContent(messageContent) {
    this.content = messageContent;
    await this.build();

    // A UX thing, give some feedback by puttng a little delay before
    // popping up, it will give more consistency as as some messages
    // goes fast other a bit of delay depending if its an image or text...
    const timeoutRef = setTimeout(() => {
      this.classList.add('show');
      clearTimeout(timeoutRef);
    }, 50);
  }
}

customElements.define('ip-message', Message);
