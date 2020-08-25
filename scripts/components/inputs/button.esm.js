import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Button <ip-button>
 *
 * A wrapper around an input of type button.
 * Consists of some custom styling and handling.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Button extends Component {
  constructor() {
    super();
    this.value = this.getAttribute('value') || 'Untitled';
  }

  render() {
    this._style = `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 18px;

        color: #444;
        width: 100%;

        border: none;
        margin: 15px 0 0;
      }

      .sun-flower-button {
        position: relative;
        width: 100%;
        height: 42px;

        font-size: 22px;
        color: white;

        text-align: center;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);

        border: 0;

        background: rgb(0, 128, 0);
        box-shadow: inset 0 -2px rgb(0, 114, 0);
        -webkit-box-shadow: inset 0 -2px rgb(0, 114, 0);

        border-bottom: 2px solid rgb(0, 100, 0);
        cursor: pointer;
      }

      .sun-flower-button:active {
        top: 1px;
        -webkit-box-shadow: none;
        box-shadow: none;
      }

      .sun-flower-button:focus {
        outline: none;
      }
    `;

    this._template = `
      <input type="submit" value="${this.value}" class="sun-flower-button" id="button">
    `;
  }

  afterRender() {
    const button = this.shadowRoot.getElementById('button');
    button.addEventListener('click', () => {
      this.dispatchEvent(new Event('submit', { bubbles: true, composed: true }));
    });
  }
}

customElements.define('ip-button', Button);
