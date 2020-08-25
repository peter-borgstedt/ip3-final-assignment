import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Checkbox / Radio <ip-checkbox>
 * 
 * A wrapper around a label and input of type checkbox and radio.
 * Consists of some custom styling and handling.
 *
 * CSS magic-check is a MIT-licensed style taken from:
 * https://github.com/forsigner/magic-check
 *
 * This regards the style prefixed with "magic", colors changed and
 * replaced with variables, there has also been a minor adjustments;
 * a small issue for current layout where the checked state positioned
 * things wrongly, also size has been modified.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class CheckBox extends Component {
  constructor() {
    super();
    this.label = this.getAttribute('label') || 'Untitled';
  }

  /** Contains the input field name */
  get name () {
    return this.getAttribute('name');
  }

  /** Contains the input field value */
  get value() {
    return this.input.checked;
  }

  render() {
    this._style = `
      :host {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        color: #444;

        margin: 15px 5px 3px;

        --magic-checkbox-checked-color: green;
      }

      @keyframes hover-color {
        from {
          border-color: #c0c0c0;
        }

        to {
          border-color: var(--magic-checkbox-checked-color);
        }
      }

      label {
        color: #999;
        font-size: 16px;
        font-weight: normal;
        position: absolute;
        padding-top: -1px;
      }

      .magic-checkbox {
        position: absolute;
        display: none;
      }

      .magic-checkbox[disabled] {
        cursor: not-allowed;
      }

      .magic-checkbox + label {
        position: relative;
        display: block;
        padding-left: 25px;
        cursor: pointer;
        vertical-align: middle;
      }

      .magic-checkbox + label:hover:before {
        animation-duration: 0.4s;
        animation-fill-mode: both;
        animation-name: hover-color;
      }

      .magic-checkbox + label:before {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 14px;
        height: 14px;
        content: '';
        border: 1px solid #c0c0c0;
      }

      .magic-checkbox + label:after {
        position: absolute;
        display: none;
        content: '';
      }

      .magic-checkbox[disabled] + label {
        cursor: not-allowed;
        color: #e4e4e4;
      }

      .magic-checkbox[disabled] + label:hover,
      .magic-checkbox[disabled] + label:before,
      .magic-checkbox[disabled] + label:after {
          cursor: not-allowed;
      }

      .magic-checkbox[disabled] + label:hover:before {
        border: 1px solid #e4e4e4;
        animation-name: none;
      }

      .magic-checkbox[disabled] + label:before {
        border-color: #e4e4e4;
      }

      .magic-checkbox:checked + label:before {
        animation-name: none;
      }

      .magic-checkbox:checked + label:after {
        display: block;
      }

      .magic-checkbox + label:before {
        border-radius: 3px;
      }

      .magic-checkbox + label:after {
        top: 1px;
        left: 5px;
        box-sizing: border-box;
        width: 6px;
        height: 11px;
        transform: rotate(45deg);
        border-width: 2px;
        border-style: solid;
        border-color: #fff;
        border-top: 0;
        border-left: 0;
      }

      .magic-checkbox:checked + label:before {
        border: 1px solid var(--magic-checkbox-checked-color);
        background: var(--magic-checkbox-checked-color);
      }

      .magic-checkbox:checked[disabled] + label:before {
        border: 1px solid #c9e2f9;
        background: #c9e2f9;
      }
    `;

    const name = this.getAttribute('name');

    this._template = `
      <div class="group">
        <input name="${name}" class="magic-checkbox" type="checkbox" id="input">
        <label for="input">${this.label}</label>
      </div>
    `;
  }

  afterRender() {
    this.input = this.shadowRoot.getElementById('input');
  }
}

customElements.define('ip-checkbox', CheckBox);
