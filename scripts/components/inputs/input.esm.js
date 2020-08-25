import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Input <ip-input>
 * 
 * A wrapper around a label and input of configurable type.
 * Consists of some custom styling and handling.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Input extends Component {
  constructor() {
    super();
    this.type = this.getAttribute('type') || 'text';
    this.label = this.getAttribute('label') || 'Untitled';
  }

  /** Get the input field name */
  get name () {
    return this.getAttribute('name');
  }

  /** Get the current input field value */
  get value() {
    return this.input.value;
  }

  /** Set a new value for the input field */
  set value(value) {
    this.input.value = value;

    if (value) {
      this.label.classList.add('active')
    } else {
      this.label.classList.remove('active')
    }
  }

  /**
   * Check whether the input field has a valid value
   * that is not violating any set constraints.
   * @returns whether the value is valid or is violating any constraints
   */
  checkValidity() {
    return this.input.checkValidity();
  }

  /**
   * Check whether the input field has a valid value
   * that is not violating any set constraints, if it has
   * then report the violation to the user.
   * @returns whether the value is valid or is violating any constraints
   */
  reportValidity() {
    return this.input.reportValidity();
  }

  /**
   * Sets a custom validity message on input.
   * @param message A custom error message
   */
  setInvalid(message) {
    this.input.setCustomValidity(message);
  }

  render() {
    this._style = `
      :host {
        display: flex;
        color: #444;
      }

      :host {
        position: relative;
        margin: 1.75rem 0 0 0;
      }

      input {
        display: block;
        font-size: 1rem;
        padding: 0.5rem 0.5rem 0.5rem 0.25rem;
        width: 100%;
        border: none;
        border-bottom: 1px solid #757575;
      }

      input:focus {
        outline: none;
      }

      input:invalid {
        background-color: white;
      }

      label {
        color: #999;
        font-size: 1rem;
        font-weight: normal;
        position: absolute;
        pointer-events: none;

        left: 0.25rem;
        top: 0.55rem;
      }
      
      .transition {
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;
      }

      .active {
        top: -0.7rem;
        font-size: 0.8rem;
        color: green;
      }
    `;

    this._template = `
      <label for="input" id="label">${this.label}</label>
      <input type="${this.type}" id="input" required>
    `;
  }

  afterRender() {
    this.label = this.shadowRoot.getElementById('label');
    this.input = this.shadowRoot.getElementById('input');

    // Will highlight input on focus
    this.input.addEventListener('focus', () => {
      this.label.classList.add('transition'); // Add if not exist
      this.label.classList.add('active');
    });

    // Will remove hightlight on blur
    this.input.addEventListener('blur', () => {
      if (!this.input.value) {
        this.label.classList.remove('active');
      }
    });

    // Forward some attributes set on element to the input element
    this.input.setAttribute('minlength', this.getAttribute('minlength'));
    this.input.setAttribute('maxlength', this.getAttribute('maxlength'));
  }
}

customElements.define('ip-input', Input);
