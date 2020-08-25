import Component from '/scripts/core/component.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Create Channel <ip-create-channel>
 *
 * Consists of a modal view with two fields, name and description of channel.
 * When all requried values are entered an event will be dispatched that
 * will be sent to the server creating the channel.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class CreateChannel extends Component {
  render() {
    this._style = `
      :host {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      label {
        font-size: 0.7rem;
        font-weight: bold;
        color: var(--modal-label-color);
        margin: 0;
      }

      input {
        height: 1.75rem;
        border: none;
        border-bottom: 1px solid #888;

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
        border-color: var(--modal-input-focus-border-color);
      }

      .input-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 1rem 1rem 0;
        font-size: 18px !important;
      }

      .layout-rows {
        display: flex;
        flex-direction: row;
      }

      .layout-columns {
        display: flex;
        flex-direction: column;
      }
    `;

    this._template = `
      <ip-modal open>
        <div id="title" slot="title">Create a channel</div>

        <div class="layout-rows">
          <div class="layout-columns" style="flex: 1">
            <div class="input-container">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required autocomplete="off">
            </div>

            <div class="input-container">
              <label for="description">Description</label>
              <input type="text" id="description" name="description" required autocomplete="off">
            </div>
          </div>
        </div>
      </ip-modal>
    `;
  }

  /**
   * Validates data before accepting the submit of changes.
   * If any input is not valid the user will be informed about them.
   *
   * TODO: coloring on errors instead of reportValidity and disable button?
   */
  validate() {
    const inputs = [
      this.shadowRoot.getElementById('name'),
      this.shadowRoot.getElementById('description'),
    ];

    for (const input of inputs) {
      if (!input.reportValidity()) {
        return false;
      }
    }
    return true;
  }

  afterLoad() {
    const modal = this.shadowRoot.querySelector('ip-modal');

    // If closed remove this component as well
    modal.addEventListener('close', () => this.remove());
    modal.addEventListener('cancel', () => modal.close());

    // Send an event that will create the channel and add it to the subscribed channels
    modal.addEventListener('confirm', async () => {
      const name = this.shadowRoot.getElementById('name');
      const description = this.shadowRoot.getElementById('description');

      name.setCustomValidity(''); // Reset any custom validation errors

      if (name.reportValidity() && description.reportValidity()) {
        // Send event which will create and subscribe on channel
        this.bus.dispatchEvent('channel-create', {
          name: name.value, description: description.value
        });

        this.addBusEventListener('channel-created', () => {
          // Will close (remove) the modal and this component
          modal.close();
        });

        this.addBusEventListener('channel-create-error', (error) => {
          if (error.statusCode === 400) {
            name.setCustomValidity('Channel already exists');
            name.reportValidity();
          } else {
            name.setCustomValidity('Could not create channe due to server error');
            name.reportValidity();
          }
        });
      }

      // Reset button as enabled (as they are disabled intentionally after clicked upon)
      modal.setEnabled(true);
    });
  }
}

customElements.define('ip-create-channel', CreateChannel);
