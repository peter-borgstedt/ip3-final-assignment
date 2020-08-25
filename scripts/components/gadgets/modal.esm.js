/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: X <ip-x>
 * 
 * A modal that displays slotted content. The modal has two button that
 * will dispatch events, cancel and confirm.
 * 
 * Buttons can be configured with different values and actions on these
 * can be changed by adding event listener on the events that are
 * dispatched.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
class Modal extends HTMLElement {
  // Observe any changes on these attributes for the element, these attributes
  // will invoke the method attributeChangedCallback on change, see details:
  // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
  static get observedAttributes() {
    return [ 'open', 'confirm-cancel-text', 'confirm-button-text' ];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.isOpen = false;

    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
        }

        :host {
          display: flex;
          position: absolute;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          transition: opacity 0.3s ease-out;
          opacity: 0;
          z-index: 10;
        }

        :host, #backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }


        #backdrop {
          background: rgba(0,0,0,0.5);
          pointer-events: none; /* Able to click on elements behind the backdrop */ 
          z-index: 10;
        }

        :host([open]) #backdrop,
        :host([open]) {
          pointer-events: all;
          opacity: 1;
        }

        #content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          width: 640px;
          height: max-content;
          max-height: 100%;
          min-height: 0px;
          margin: 1.5rem;

          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.26);

          background: var(--modal-background);

          z-index: 11;
        }

        @media only screen and (max-width: 800px) {
          #content {
            width: calc(100% - 2rem);
          }
        }
        

        header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--modal-border-color);
        }

        slot[name="title"] {
          font-size: 1.1rem;
          font-weight: bold;
          margin: 0;
          color: var(--modal-header-color);
        }

        #main {
          padding: 1rem;
          overflow: auto;
        }

        #actions {
          border-top: 1px solid var(--modal-border-color);
          padding: 1rem;
          display: flex;
          justify-content: flex-end;
        }

        #actions > button {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0.25rem;
          padding: 0 0.5rem 0 0.5rem;
          height: 1.75rem;

          color: var(--modal-button-color);
          background: var(--modal-button-background);

          border: 1px solid var(--modal-button-border-color);
          border-radius: 4px;
          outline: 0;
        }

        #actions > button:hover {
          background: var(--modal-button-hover-background);
          color: var(--modal-button-hover-color);
          border-color: var(--modal-button-hover-border-color);
        }
      </style>

      <div id="backdrop"></div>

      <div id="content">
        <header>
          <slot name="title">Please Confirm Payment</slot>
        </header>

        <section id="main">
          <slot></slot>
        </section>

        <section id="actions">
          <button id="cancel-btn">Cancel</button>
          <button id="confirm-btn">Okay</button>
        </section>
      </div>
    `;

    // Element displaying a backdrop, a shadow above existing content
    this.backdrop = this.shadowRoot.querySelector('#backdrop');

    // Buttons for cancelling and confirm / submitting
    this.cancelButton = this.shadowRoot.querySelector('#cancel-btn');
    this.confirmButton = this.shadowRoot.querySelector('#confirm-btn');

    // When the backdrop is clicked on (outside of modal) the modal will be closed
    this.backdrop.addEventListener('click', () => {
      this.setEnabled(false);
      this.dispatchEvent(new Event('cancel', { bubbles: false, composed: false }));
    });

    // When cancel button is clicked an event is dispatched, the button will be disabled
    // and the modal still open. The closing of the modal needs to be done by the outer
    // implementation by listening on the event
    this.cancelButton.textContent = this.getAttribute('cancelButtonText') || 'Cancel';
    this.cancelButton.addEventListener('click', () => {
      this.setEnabled(false);
      this.dispatchEvent(new Event('cancel', { bubbles: false, composed: false }));
    });

    // When confirm button is clicked an event is dispatched, the button will be disabled
    // and the modal still open. The closing of the modal needs to be done by the outer
    // implementation by listening on the event
    this.confirmButton.addEventListener('click', () => {
      // Disable buttons to stop any double click which will send multiple events,
      // this is due to the "transitionend" event which is waited upon making the
      // dialog being up a bit longer and giving the possibility to click several times
      this.setEnabled(false);
      this.dispatchEvent(new Event('confirm', { bubbles: false, composed: false }));
    });
    this.confirmButton.textContent = this.getAttribute('confirmButtonText') || 'Ok';
  }

  // Occurs when changes are done on selected attributes (see observedAttributes)
  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case 'open': {
        this.isOpen = this.hasAttribute('open'); // Displays the modal
        break;
      }
      case 'confirm-button-text': {
        this.confirmButton.textContent = newValue; // Change text on confirm button
        break;
      }
      case 'cancel-button-text': {
        this.cancelButton.textContent = newValue; // Cahnge text on cancel button
        break;
      }
    }
  }

  connectedCallback() {
    // When modal is connected add a key listener on ESC key which will dispatch a 
    // cancel event (and close window depending on outer implementaation)
    this._onEscapeKeyListener = (e) => {
      if (e.code === 'Escape') {
        this.dispatchEvent(new Event('cancel'));
      }
    };
    document.addEventListener('keydown', this._onEscapeKeyListener);
  }

  disconnectedCallback() {
    // Do cleanup by removing the key listener (for exit on ESC key)
    document.removeEventListener('keydown', this._onEscapeKeyListener);
  }

  setEnabled(enabled) {
    // Disable buttons to avoid double events, however we want to be able
    // to activate them later, that's why we disable and do not remove the
    // event listener, making it more flexiablwe (see Profile as example)
    if (enabled) {
      this.backdrop.removeAttribute('disabled', '');
      this.cancelButton.removeAttribute('disabled', '');
      this.confirmButton.removeAttribute('disabled', '');
    } else {
      this.backdrop.setAttribute('disabled', '');
      this.cancelButton.setAttribute('disabled', '');
      this.confirmButton.setAttribute('disabled', '');
    }
  }

  open() {
    this.setAttribute('open', '');
    this.isOpen = true;
  }

  /**
   * Closes the window. A transition from opacity 1 to 0 will occur, fading it out before
   * removing it completely.
   */
  close() {
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    }
    this.isOpen = false;

    // For smooth close down the window will transition from opacity 1 to 0,
    // wait until this is done before removing element
    this.addEventListener('transitionend', () => {
      this.dispatchEvent(new Event('close', { bubbles: false, composed: false }));
      this.remove();
    }); // Remove modal completely
  }
}

customElements.define('ip-modal', Modal);
