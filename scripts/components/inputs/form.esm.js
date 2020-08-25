import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Form <ip-from>
 * 
 * A wrapper around a form. Contains some logic for handling validation and
 * retrieval of form fields input values.
 *
 * References:
 * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Form extends Component {
  static get observedAttributes() { return []; }

  constructor() {
    super();

    // Add event listener when form is submitted, validate values,
    // if all is valid map values to object and dispatch an event with these
    this.addEventListener('submit', (event) => {
      if (event.target === this) {
        return; // Ignore any submit events thrown within self let it bubble up
      }

      // The slot contains all input fields and miscellaneous "decorating" html elements
      const slot = this.shadowRoot.querySelector('slot');
      // Get all elements inside the slot
      const elements = slot.assignedElements();

      const sourceElements = elements.filter((e) => {
        const tagName = e.tagName.toLowerCase();
        // Filter out all the custom elements (which will be the the custom input fields)
        return window.customElements.get(tagName);
      });

      // Check if all fields are valid, is not violating any constraints set
      const isValid = sourceElements.every((e) => {
        if (e.setInvalid) {
          e.setInvalid(''); // Reset any custom validation errors
        }
        if (e.reportValidity) {
          return e.reportValidity();
        }
        return true;
      });

      // If all is valid retrieve all values from inputs and
      // map name to value on a object
      if (isValid) {
        const detail = sourceElements.reduce((acc, element) => {
          // If attribute name and value exists map these to
          // the accumulation object
          if (element.name && element.value) {
            acc[element.name] = element.value;
          }
          return acc;
        }, {});

        // Send object containing fieldvalues 
        const event = new CustomEvent('submit', { detail, bubbles: true, composed: true });
        this.dispatchEvent(event);
      }
      event.preventDefault();
      event.stopPropagation();
    });
  }

  render() {
    this._style = ``;
    this._template = `
      <slot></slot>
    `;
  }
}

customElements.define('ip-form', Form);
