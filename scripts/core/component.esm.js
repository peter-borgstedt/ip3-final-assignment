/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 * 
 * Abstract Webcomponent: Component
 * 
 * Consists of generic functionality that extends the web componenents life cycle
 * and adds predefined style, methods and services to be used within it.
 *
 * Life cycle of web components extending this class.
 * 1. constructor (creation of instance)
 * 2. connectedCallback (element has been connected to document-DOM)
 * 3. render (set html-template and css-template)
 * 4. afterRender (html and css is injected into the shadow-DOM and available)
 * 5. load (load any asynchronous resources)
 * 6. afterLoad (data has been loaded)
 * 7. disconnectedCallback (element has been removed from document-DOM)
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Component extends HTMLElement {
  static get observedAttributes() { return []; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Add CSS style into the shadowRoot with some default
   * style that is applied on all web components extending this class
   * @param css CSS style to be applied
   */
  setStyle(css) {
    // Constructable Stylesheet Objects is the referred to set external stylesheets for a shadowroot,
    // however at the moment only Chrome support this. It is under development for Firefox (and probably other browsers as well).
    // References:
    // https://css-tricks.com/encapsulating-style-and-structure-with-shadow-dom/
    // https://wicg.github.io/construct-stylesheets/
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1595444 (new CSSStyleSheet causes a TypeError: Illegal constructor)
    // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet (ticket for implementing support in Firefox)
   
    if (css) {
      const style = document.createElement('style');
      style.rel = 'stylesheet';
      style.type = 'text/css'; 

      css += `
        @import url("/fonts/fonts.css");

        .material-icons {
          direction: ltr;
          font-family: 'Material Icons';
          font-weight: normal;
          font-style: normal;
          letter-spacing: normal;
          text-transform: none;
          white-space: nowrap;
          word-wrap: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        * {
          box-sizing: border-box;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
        }

        :host {
          font-family: sans-serif;
          font-weight: normal;
          font-variant-ligatures: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `;

      if (style.styleSheet) {
        style.styleSheet.cssText = css; 
      } else {
        style.appendChild(document.createTextNode(css));
      }

      this.shadowRoot.appendChild(style);
    }
  }

  /**
   * The router will set any path parameters‚ query parameters or
   * custom data included in the location event.
   * @params routerData Properties retrieved by the router
   */
  async init(routerData) {
    console.log('routerdata', this.tagName, routerData)
    this.routerData = routerData;
  }

  /**
   * Add HTML to the shadowRoot.
   * @param html HTML to be injected
   */
  setTemplate(html) {
    if (html) {
      this.shadowRoot.innerHTML = html;
    }
  }

  /**
   * Builds the component and adds some extra steps to the
   * components life cycle for easier management.
   */
  async build() {
    // If method render exists, call it
    if (this.render) {
      // Render sets the html and css in the overridden class
      this.render();
      this.setTemplate(this._template); // Is set in render()
      this.setStyle(this._style); // Is set in render()
    }

    // If method afterRender exist, call it after
    // HTML and CSS has been injected
    if (this.afterRender) {
      await this.afterRender();
    }

    // Adds a universal event bus for all components for easy access
    // to events outside of its scope
    // Use imperative imports for dynamics and faster loading
    // https://v8.dev/features/dynamic-import
    // https://javascript.info/modules-dynamic-imports
    this.bus = (await import('/scripts/core/eventbus.esm.js')).default;

    // If method load exists, call it
    if (this.load) {
      // Load any additional asynchronous resources
      await this.load();
    }

    // If method afterLoad exists, call it
    if (this.afterLoad) {
      // All loaded data will exist this method is called
      // and can be used in any logic
      await this.afterLoad();
    }
  }

  // The web component is connected to the DOM
  async connectedCallback() {
    console.log(`[${this.localName}]: has been connected to the DOM`);
    try {
      // Build components and adds some extra steps into the components life cycle
      await this.build();
    } catch (error) {
      // Catch any error in Promise to get rid of uncatched error in promise
      console.error(error);
    }
  }

  // The web component is disconnected from the DOM
  disconnectedCallback() {}

  // As called when element attributes have been changed
  attributeChangedCallback(name, _oldValue, newValue) {
    if (this.observedAttributes.includes(name)) {
      this[name] = newValue;
    }
  }

  addBusEventListener(event, func) {
    this.bus.addEventListener(event, this.getHashCode(), func);
  }

  removeBusEventListener(event) {
    this.bus.removeEventListener(event, this.getHashCode());
  }
}
