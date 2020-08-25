import Component from '/scripts/core/component.esm.js';
import { themes, setTheme } from '/scripts/common/theme.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Theme <ip-theme>
 *
 * Consists of a modal view with a list of radio buttons displaying
 * name of a color theme.
 * When a radiobutton is clicked upon that color theme is selected and
 * the site "look-and-feel" changes.
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
export default class Theme extends Component {
  constructor() {
    super();

  }

  render() {
    this._style = `
      :host {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;

        --magic-checkbox-checked-color: var(--modal-input-radio-color);
      }

      label {
        color: #999;
        font-size: 0.8rem;
        font-weight: normal;
        user-select: none;
      }

      label:not(:first-of-type) {
        margin-top: 0.5rem;
      }

      input {
        height: 1.75rem;
        border: none;
        border-bottom: 1px solid #888;

        margin: 0;
        padding: 0;
        outline: 0;
      }

      .magic-radio {
        position: absolute;
        display: none;
      }

      .magic-radio[disabled] {
        cursor: not-allowed;
      }

      .magic-radio + label {
        position: relative;
        display: block;
        padding-left: 25px;
        cursor: pointer;
        vertical-align: middle;
      }

      .magic-radio + label:hover:before {
        animation-duration: 0.4s;
        animation-fill-mode: both;
        animation-name: hover-color;
      }

      .magic-radio + label:before {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 14px;
        height: 14px;
        content: '';
        border: 1px solid #c0c0c0;
      }

      .magic-radio + label:after {
        position: absolute;
        display: none;
        content: '';
      }

      .magic-radio[disabled] + label {
        cursor: not-allowed;
        color: #e4e4e4;
      }

      .magic-radio[disabled] + label:hover,
      .magic-radio[disabled] + label:before,
      .magic-radio[disabled] + label:after {
          cursor: not-allowed;
      }

      .magic-radio[disabled] + label:hover:before {
        border: 1px solid #e4e4e4;
        animation-name: none;
      }

      .magic-radio[disabled] + label:before {
        border-color: #e4e4e4;
      }

      .magic-radio:checked + label:before {
        animation-name: none;
      }

      .magic-radio:checked + label:after {
        display: block;
      }

      .magic-radio + label:before {
        border-radius: 50%;
      }

      .magic-radio + label:after {
        top: 4px;
        left: 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--magic-checkbox-checked-color);
      }

      .magic-radio:checked + label:before {
        border: 1px solid var(--magic-checkbox-checked-color);
      }

      .magic-radio:checked[disabled] + label:before {
        border: 1px solid #c9e2f9;
      }

      .magic-radio:checked[disabled] + label:after {
        background: #c9e2f9;
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
        <div id="title" slot="title">Color Themes</div>
        
        <div class="layout-rows">
          <div id="themes" class="layout-columns" style="flex: 1">
          </div>
        </div>
      </ip-modal>
    `;
  }

  populateThemes() {
    const selectedTheme = localStorage.getItem('theme') || 'default';
    console.log('selected', selectedTheme);

    const items = this.shadowRoot.getElementById('themes');

    for (const [ key, value ] of themes.entries()) {
      const radio = document.createElement('input');
      radio.setAttribute("type", "radio");
      radio.setAttribute("id", key);
      radio.setAttribute("name", "theme");
      radio.className = "magic-radio";
      radio.addEventListener("change", () => this.selected = key);

      const label = document.createElement('label');
      label.setAttribute("for", key);
      label.textContent = value.name;

      if (selectedTheme === key) {
        radio.setAttribute('checked', 'checked');
      }

      items.append(radio);
      items.append(label);
    }
  }

  afterLoad() {
    const modal = this.shadowRoot.querySelector('ip-modal');

    // If closed remove this component as well
    modal.addEventListener('close', () => this.remove());
    modal.addEventListener('cancel', () => modal.close());

    // Send an event that will create the channel and add it to the subscribed channels
    modal.addEventListener('confirm', async () => {
      if (this.selected === 'default') {
        console.log('remove', this.selected);
        localStorage.removeItem('theme');
      } else if (this.selected) {
        console.log('set', this.selected);
        localStorage.setItem('theme', this.selected);
      }
      setTheme(this.selected);

      // Reset button as enabled (as they are disabled intentionally after clicked upon)
      modal.setEnabled(true);
      modal.close();
    });

    this.populateThemes();
  }
}

customElements.define('ip-theme', Theme);
