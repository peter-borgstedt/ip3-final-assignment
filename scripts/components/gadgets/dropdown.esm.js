import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Drop down <ip-dropdown>
 * 
 * Contains a drop down menu with the possibility to either
 * programmatically set items or add them in using a slot.
 *
 * Items for anchor elements are prestyled, other elements used
 * needs to be styled outside in the elements defined scope.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Dropdown extends Component {
  render() {
    this._style = `
      /* The container to position the dropdown content */
      #dropdown {
        display: flex;
        flex-direction: column;
        user-select: none;
      }

      #dropdown-button {
        color: var(--dropdown-button-color);
      }

      #dropdown-button:hover {
        color: var(--dropdown-button-hover-color);
      }

      .dropdown-container {
        /* Required to get things to work relative with absolute */
        position: relative;
      }

      .dropdown-content {
        display: none;
        position: absolute;

        background-color: #f1f1f1;
        border-radius: 5px;
        min-width: max-content;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 2;
      }

      :host([right]) .dropdown-content {
        right: 0;
      } 

      /* Links inside the dropdown */
      ::slotted(a), a {
        padding: 8px 12px;
        text-decoration: none;
        display: block;
        cursor: pointer;
        font-size: 0.8rem;
        color: #888;
      }

      ::slotted(a:first-of-type), a:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }

      ::slotted(a:last-of-type), a:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }

      /* Change color of dropdown links on hover */
      ::slotted(a:hover), a:hover {
        background-color: #ddd;
        color: #444;
      }

      .hover {
        display: block;
      }

      slot > button, ::slotted(button) {
        font-size: 1.2rem;
        background: transparent;
        border: none;
        outline: none;
      }

      ::slotted(button) {
        padding: 0;
        margin: 0;
      }

      slot > button:active, ::slotted(button:active),
      slot > button.focus, ::slotted(button:focus),
      slot > button.hover, ::slotted(button:hover) {
        background: inherit;
        border: inherit;
        outline: inherit;
      }

      slot > button:hover,
      ::slotted(button:hover) {
        color: #3e8e41;
      }

    `;
    this._template = `
      <div id="dropdown">
        <slot>
          <button id="dropdown-button">+</button>
        </slot>

        <div class="dropdown-container">
          <slot id="items" name="items" class="dropdown-content"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Add click listeners on item.
   * @param items Parent HTML Element containing the elements representing an item 
   * @param item HTML Element representing an item
   */
  addItemClickListener (items, item) {
    item.addEventListener('click', (event) => {
      event.preventDefault();

      const id = item.dataset.id;

      this.dispatchEvent(new CustomEvent(id, {
        detail: item,
        composed: true
      }));

      // When clicked remove the hover class from the menu
      // so the menu will not continue being displayed afterwards
      items.classList.remove('hover');
    });
  }

  afterRender() {
    const dropdown = this.shadowRoot.getElementById('dropdown');

    // When mouse hovers over the button display the menu
    dropdown.addEventListener('mouseover', (_event) => {
      items.classList.add('hover');
    });

    // When mouse leaves the button or the menu remove the
    // hover class to remove the menu from displaying
    dropdown.addEventListener('mouseout', (_event) => {
      items.classList.remove('hover');
    });

    // The slot element containing a collections of menu items
    const items = this.shadowRoot.getElementById('items');

    // The slot element containing a collections of menu items
    const children = this.shadowRoot.querySelector('slot[name="items"]').assignedNodes();

    // Set click listeners on all slotted menu items
    if (children && Array.isArray(children)) {
      children.forEach((item) => this.addItemClickListener(items, item));
    }
  }

  /**
   * Add menu items.
   * @param content Object which properties define an element
   */
  setItems(content) {
    // The slot element for menu items
    const items = this.shadowRoot.getElementById('items');

    for (const itemData of Object.entries(content)) {
      const [ id, label ] = itemData;

      // Add content and data for item
      const item = document.createElement('a');
      item.textContent = label;
      item.dataset.id = id;

      // Add a click listener on the menu item
      this.addItemClickListener(items, item);

      items.appendChild(item);
    }
  }
}

customElements.define('ip-dropdown', Dropdown);
