import Message from '/scripts/components/message.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Image Message <ip-message-image>
 * (extending Message <ip-message)
 * 
 * Represent the content of a message in a channel that a user has written.
 * The message contains an attached image the text content, when it was created,
 * details about the author; profile image, name and email.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class MessageImage extends Message {
  render() {
    super.render();

    this._style += `
      .image {
        max-width: 320px;
        min-width: 0px;
        width: calc(100% - 2rem);
        border: 1px solid #ccc;
        margin: 0.25rem 0 0 0;
        background: #eee;
        border-radius: 4px;
      }

      .arrow {
        position: relative;
        padding: 0px;
        margin: 4px 0 0 0;
        border: none;
        outline: none;
        background: none;
        font-family: monospace;
        font-size: 12px;
        text-align: left;
        color: #777;

        cursor: pointer;
      }

      .arrow::after {
        display: inline-block;
        position: absolute;
        content: '';

        top: -1px;
        left: 6px;

        border-style: solid;
        border-width: 5.0px 3.0px 0 3.0px;
        border-color: #777 transparent transparent transparent;

        position: relative;
      }

      .arrow--closed::after {
        transform: rotate(-90deg);
        transition: transform 0.1s linear;
        -webkit-transform: rotate(-90deg);
        -webkit-transition: transform 0.1s linear;
      }

      #image-container {
        display: flex;
        width: 100%;
        flex-direction: column;
      }

      #image-visibility-toggle {
        word-break: break-all;
      }
    `;

    this._template = `
      <img id="profileImage">

      <div id="content">
        <div id="header">
          <div>
            <span id="username">-</span>
            <span id="timestamp">-</span>
          </div>
        </div>

        <div id="message">-</div>

        <div id="image-container">
          <button id="image-visibility-toggle" class="arrow"></button>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Set and preload image
    const image = await this.loadImage(this.content.imageUrl);
    image.classList.add('image');

    await super.afterRender();

    // Attach the image to the shadowRoot
    const container = this.shadowRoot.getElementById('image-container');
    container.append(image);

    // Add display toggle of image, able to hide it or show it 
    const imageVisibilityToggle = this.shadowRoot.getElementById('image-visibility-toggle');
    imageVisibilityToggle.textContent = this.content.imageUrl.split("/").pop();

    imageVisibilityToggle.addEventListener('click', () => {
      if (imageVisibilityToggle.classList.toggle('arrow--closed')) {
        image.remove();
      } else {
        // Create a MutationObserver and wait until the image has been
        // attached and is available in the DOM, then get the offsetHeight and
        // send it to the channel implementation using an event that will then
        // scroll down so the whole image is displayed, otherwise the image
        // will sometimes just be partialy displayed which is not that user friendly
        const observer = new MutationObserver((mutations) => {
          const offset = mutations[0].target.offsetHeight;
          this.bus.dispatchEvent(`channel-scrolldown-${this.content.channelId}`, offset);
          observer.disconnect();
        });

        observer.observe(this.shadowRoot, {
          childList: true,
          subtree: true            
        });

        container.append(image);
      }
    });
  }
}

customElements.define('ip-message-image', MessageImage);
