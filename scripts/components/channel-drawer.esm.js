import Component from '/scripts/core/component.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Drawer <ip-channel-drawer>
 * 
 * Consists of a list of items, a list header and a control button.
 * The items can be expanded or condensed by clicking on the list header,
 * the control button can be configured with a drop down menu.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Drawer extends Component {
  constructor() {
    super();
    this.open = true;
  }

  render() {
    this._style = `
      :host {
        flex: 1;
        display: flex;
        flex-direction: column;

        color: #555;

        min-height: 0px;
        position: relative;
      }

      .header {
        display: flex;
        flex-direction: row;
      }

      .arrow-container {
        display: flex;
        justify-content: center;

        width: 25px;

        margin: 0 0.5rem 0 0.5rem;
      }

      .arrow {
        display: flex;
        border-style: solid;
        border-width: 5px 0 5px 8px;
        border-color: transparent transparent transparent var(--sidebar-channel-header-cursor-color);

        transition: transform 0.1s linear;
        -webkit-transition: transform 0.1s linear;
      }

      .toggle-label {
        margin: 0 1.5rem 0 0;
      }

      .toggle.open .arrow {
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);

        transition: transform 0.1s linear;
        -webkit-transition: transform 0.1s linear;
      }

      .toggle:hover .arrow {
        border-color: transparent transparent transparent var(--sidebar-channel-header-hover-cursor-color);
      }

      .toggle {
        flex: 1;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: bold;
        color: var(--sidebar-channel-header-text-color);
        user-select: none;
      }

      .toggle:hover {
        color: var(--sidebar-channel-header-hover-text-color);
      }

      #items {
        display: none;
        flex-direction: column;
        font-size: 0.8rem;
        text-transform: lowercase;
        user-select: none;
      }

      #items.open {
        display: flex;
      }

      .drawer-icon {
        display: inline-block;
        position: relative;
        width: 1rem;
        margin: 0.15rem 0.5rem 0 1.45rem;
        text-align: center;
      }

      .drawer-icon:after {
        content: var(--sidebar-channel-item-icon);
        color: var(--sidebar-channel-item-icon-color);
      }

      .drawer-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        height: 1.5rem;
        cursor: pointer;
      }

      .selected {
        background-color: var(--sidebar-channel-item-selected-background);
      }

      .selected > .drawer-icon:after {
        color: var(--sidebar-channel-item-selected-icon-color);
      }

      .selected > .drawer-label {
        color: var(--sidebar-channel-item-selected-text-color);
      }

      .drawer-item:not(.selected):hover > .drawer-icon:after {
        color: var(--sidebar-channel-item-hover-icon-color);
      }

      .drawer-item:not(.selected):hover > .drawer-label {
        color: var(--sidebar-channel-item-hover-text-color);
      }

      .drawer-item:not(.selected):hover {
        background: var(--sidebar-channel-item-hover-background);
      }

      .drawer-label {
        color: var(--sidebar-channel-item-text-color);
      }

      ip-dropdown {
        margin-right: 0.5rem;
      }

      .overflow-container {
        flex: 1;
        overflow: auto;
      }

      .dropdown-button {
        display: flex;
        flex-direction: column;
        user-select: none;

        height: 1.5rem;
        width: 1.5rem;

        border-radius: 4px;

        align-items: center;
        justify-items: center;

        color: var(--dropdown-button-color);
      }

      .dropdown-button:hover {
        color: var(--dropdown-button-hover-color);
        background: var(--dropdown-button-hover-background);
      }
    `;

    this._template = `
      <div class="header">
        <div id="toggle-button" class="toggle open">
          <div class="arrow-container">
            <i class="arrow open"></i>
          </div>
          <span class="toggle-label">Channels</span>
        </div>

        <ip-dropdown>
          <button class="dropdown-button">+</button>
        </ip-dropdown>
      </div>
      <div class="overflow-container">
        <div id="items" class="open"></div>
      </div>
    `;
  }

  /**
   * Toggles the items to be visible (expanded) or invisible (condensed).
   */
  toggle() {
    this.open = !this.open;

    if (this.open) {
      this.toggleButton.classList.add('open');
      this.items.classList.add('open');
    } else {
      this.toggleButton.classList.remove('open');
      this.items.classList.remove('open');
    }
  }

  afterLoad() {
    // Store the items placeholder for appending items
    this.items = this.shadowRoot.getElementById('items');

    // Store the toggle button when toggling hide/show state
    this.toggleButton = this.shadowRoot.getElementById('toggle-button');

    // When toggle button is clicked on, toggle visibility of the list of items
    this.toggleButton.addEventListener('click', () => {
      this.toggle(this.open);
    });

    // Proxy the events to the context event bus
    const onEventProxy = async (event) => {
      event.preventDefault();
      this.bus.dispatchEvent(event.type, event.detail);
    };

    // Set menu items
    const dropdown = this.shadowRoot.querySelector('ip-dropdown');
    dropdown.setItems({
      // Id, Label
      'open-channel-create': 'Create channel',
      'open-channel-browse': 'Subscribe on channel'
    });

    dropdown.addEventListener('open-channel-create', onEventProxy);
    dropdown.addEventListener('open-channel-browse', onEventProxy);
  }

  /**
   * Add a collection of items to the list.
   * @param items List of items to be added
   */
  addItems(items) {
    for (const item of items) {
      this.addItem(item);
    }
  }

  /**
   * Set item element as selected.
   * @param item Item element
   * @param itemData Item (channel) data
   * @param shouldDispatch If a select event should be dispatched
   */
  setSelected(item, itemData, shouldDispatch) {
    // Remove selection class on previous selected item
    if (this.selectedItem) {
      this.selectedItem.classList.remove("selected");
    }

    // Set clicked item as selected
    item.classList.add("selected");
    this.selectedItem = item;

    if (shouldDispatch) {
      // Dispatch event that item has been selected
      this.dispatchEvent(new CustomEvent('item-selected', { detail: itemData, composed: true }));
    }
  }

  /**
   * Add item to list.
   * @param itemData Data for an item to be accessed in the list
   */
  addItem(itemData) {
    const item = document.createElement('div');
    item.className = 'drawer-item';
    item.setAttribute('id', itemData.id);

    // When clicked dispatch an event with the item as event object
    item.addEventListener('click', (event) => {
      event.preventDefault();

      this.setSelected(item, itemData, true);
    });

    const icon = document.createElement('i');
    icon.className = 'drawer-icon material-icons';

    const label = document.createElement('span');
    label.className = 'drawer-label';
    label.textContent = itemData.name;

    item.appendChild(icon);
    item.appendChild(label);

    this.items.appendChild(item);
  }

  /**
   * Remove an item from the list
   * @param itemId Id of item
   */
  removeItem(itemId) {
    const item = this.shadowRoot.getElementById(itemId);
    if (item) {
      item.remove();
    }
  }

  /**
   * Select (highlight) an item from the list
   * @param itemId Id of item
   */
  selectItem(itemData) {
    const item = this.shadowRoot.getElementById(itemData.id);
    if (item) {
      this.setSelected(item, itemData, false);
    }
  }
}

customElements.define('ip-channel-drawer', Drawer);
