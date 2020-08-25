import Component from '/scripts/core/component.esm.js';

// Polyfill for getSelectio in shadowRoot for Safari
// https://github.com/GoogleChromeLabs/shadow-selection-polyfill
// import * as shadow from '/polyfills/shadow.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Control <ip-control>
 * 
 * Am input control highly inspired Slack.
 * 
 * Consists of an editable element that the user can insert plain or formatted text
 * (with html/css) into. Has some features for setting text as bold and italic, but
 * only added support for Chrome and Firefox; the document.execCommand is now deprecated
 * but is being used for these features, there is no replacement and the correct way
 * of doing it is to implement all functionality your self which is a whole project
 * by it self, however there are third party javascript libraries that can be used for this.
 * 
 * The controller also has the possibility to attach an image to the message. I limit this
 * however to one image, but was actually planning to let the user add more, however there are no progress
 * or loading indications when the message is sent (due to lack of time, and I had to cut some corners)
 * so the overall user experience would be strange waiting a long time without anything happening;
 * an ideal thing would be to present the message with the (local) loaded data, and present it
 * immediately, then handle the incoming message as a verification that the message was successfully delivered,
 * and if no comes a timeout would be invoked giving the user the ability to resend the message (this is
 * probably something Slack does as I've noticed a similar functionality in the client).
 *
 * If a user drag and drops and image in the channel view the image will be attached as well to the controller,
 * it will retrieve an event from the channel component with the data and attach it.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Control extends Component {
  constructor() {
    super();

    // Relates to editing divs, exec command performs actions on the div
    // also setting the default separator
    // document.execCommand('defaultParagraphSeparator', false, 'div');
    // document.execCommand('formatBlock', false, 'div');

    // We want to build all when created
    this.build();

    // Image attachments
    this.attachments = [];
  }

  async render() {
    this._style = `
      :host {
        display: flex;
        flex-direction: column;
        margin: 0 1rem 1rem 1rem;

        --panel-border-radius: 5px;
        --panel-border-style: solid;
        --panel-border-color: #888;
      }

      .input-panel {
        display: flex;
        flex-direction: row;
        min-height: 2rem;
        max-height: 25vh; /* When breaking rows, set a limit on how much before overflow/scroll  */

        background: var(--channel-control-background);

        border-style: var(--panel-border-style);
        border-color: var(--channel-control-border-color);
        border-bottom-color: #ccc;
        border-width: 1px 1px 1px 1px;
        border-top-left-radius: var(--panel-border-radius);
        border-top-right-radius: var(--panel-border-radius);

        border-bottom-color: var(--channel-control-separator-border-color);
      }

      #input {
        flex: 1;
        display: flex;
        flex-direction: row;
      }

      #editor {
        flex: 1;
        font-size: 15px;

        color: var(--channel-control-color);

        box-sizing: content-box;
        overflow: auto;
        margin-top: 2px;
        padding: 0.5rem;
        border: 0;
        outline: 0;

        user-select: text;
        -webkit-user-select: text;
        /* 
         * Break long words so the input does not grow by the lenght of the string, see:
         * https://www.w3schools.com/cssref/css3_pr_word-break.asp
         */
        word-break: break-word;
        white-space: pre-wrap;
      }

      #editor:focus { }

      .action {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 1.5rem;
        height: 1.5rem;

        font-size: 1rem;

        background: var(--channel-control-toolbar-action-icon-background);
        color: var(--channel-control-toolbar-action-icon-color);

        transition: background 0.1s ease-in-out;

        cursor: pointer;

        user-select: none;
        -webkit-user-select: none;

        outline: none;
        border: none;
      }

      .action:hover {
        background: var(--channel-control-toolbar-action-hover-icon-background);
        color: var(--channel-control-toolbar-action-hover-icon-color);
      }

      .action-toggled {
        background: var(--channel-control-toolbar-action-selected-icon-background);
        border: 1px solid var(--channel-control-toolbar-action-selected-border-color);
      }

      .action-toggled:hover {
        background: var(--channel-control-toolbar-action-hover-icon-background);
      }

      #action-panel {
        display: flex;
        flex-direction: row;
        align-items: center; /* align vertical */
        min-height: 2rem;
        background-color: var(--channel-control-toolbar-background);
        border-style: var(--panel-border-style);
        border-color: var(--channel-control-border-color);
        border-width: 0 1px 1px 1px;
        border-bottom-left-radius: var(--panel-border-radius);
        border-bottom-right-radius: var(--panel-border-radius);
      }

      #action-panel > :first-child {
        margin-left: 0.5rem;
      }

      #action-panel > :not(:first-child) {
        margin-left: 1px;
      }

      .drag-over {
        background-color: #f1f1f1;
        border-color: green;
      }

      #attachments {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        margin: 0.5rem;
      }

      .attachment {
        display: flex;
        position: relative;

        min-height: 0px;
        min-width: 0px;

        height: 100%;
      }

      .attachment-image {
        height: 100%;
        min-width: 0px;
        max-height: 3.5rem;
        border: 3px solid var(--channel-control-attachment-background);
        outline: 1px solid var(--channel-control-attachment-border-color);
      }

      .attachment:hover .attachment-image {
        border: 3px solid var(--channel-control-attachment-hover-background);
        outline: 1px solid var(--channel-control-attachment-hover-border-color);
      }

      .attachment-button {
        display: flex;
        justify-content: center;

        position: absolute;
        width: 0.85rem;
        height: 0.85rem;
        top: 4px;
        right: 4px;

        margin: 0;
        padding: 0;

        color: black;
        font-size: 0.7rem;
        font-weight: bold;

        background: white;
        border-radius: 100%;
        opacity: 0.5;

        cursor: pointer;
      }

      .attachment-button:after {
        content: 'x';
      }

      .attachment:hover .attachment-button {
        opacity: 1;
      }

      .attachment-button:hover {
        color: var(--channel-control-attachment-hover-button-color);
        background: var(--channel-control-attachment-hover-button-background);
      }

      /**
       * This is the preferred way to make it work in Firefox (and possible all browsers) as it does
       * not support virtual (programmatic) clicks on inputs created through script and possible even
       * created in the the DOM directly (not tested). This does however work in Chrome and Safari.
       * https://stackoverflow.com/a/26527957
       */
      input[type="file"] {
        visibility: hidden;
        position: absolute;
        top: 0;
        left: 100%;
      }
    `;

    this._template = `
      <div id="input-panel" class="input-panel">
        <div id="editor" contenteditable="true" spellcheck="true"></div>

        <div id="attachments">
          <div class="attachment"> 
            <!--img class="attachment-image" src="/assets/avatar.jpg">
            <div class="attachment-button"></div-->
          </div>
        </div>
      </div>

      <div id="action-panel">
        <label class="action" for="file-selector"><i class="material-icons">image</i></label>
        <input type="file" id="file-selector" accept="image/*">

        <button class="action material-icons" id="bold">format_bold</button>
        <button class="action material-icons" id="italic">format_italic</button>
      </div>
    `;
  }

  selectElement(node) {
    const range = document.createRange();
    // range.selectNode(node);
    range.setStart(node, 1);
    range.setEnd(node, 1);

    if (window.browser.isFirefox || window.browser.isSafari) {
      var d = document;
      d.getSelection().removeAllRanges();
      d.getSelection().addRange(range);
    } else {
      var r = this.shadowRoot;
      r.getSelection().removeAllRanges();
      r.getSelection().addRange(range);
    }
  }

  /**
   * Set toggle buttons Bold (<b>) and Italic (<i>) depending on what
   * element tags the selected anchor node is surrounded by.
   * 
   * If the content would be "Hello <b><i>world</i></b>" the surrounded element
   * tags are <b> and <i>.
   */
  detectAndSetButtonStates(event) {
    event.preventDefault();

    const bold = this.shadowRoot.querySelector('#bold');
    const italic = this.shadowRoot.querySelector('#italic');

    this.setButtonState(bold, document.queryCommandState('bold'));
    this.setButtonState(italic, document.queryCommandState('italic'));
  }

  setButtonState(button, toggled) {
    if (toggled) {
      button.classList.add('action-toggled');
    } else {
      button.classList.remove('action-toggled');
    }
  }

  /**
   * Sets input format style on the contenteditable <div> (the editor). 
   * Details for possible commands see:
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
   * @param {HTMLDivElement} editor The editable <div> editor
   * @param {HTMLButtonElement} button A button defining some format
   * @param {string} format Format to be applied (bold, italic, underline or strikeThrough)
   */
  setFormat(event, editor, button, format) {
    event.preventDefault();

    // This fixes a bug with the queryCommandState that sometimes
    // cannot detect the true state of coming style 
    const currentState = document.queryCommandState(format);

    // Toggle format on cursor position around the selection of text
    document.execCommand(format);

    // Set toggle button indicating the text state
    this.setButtonState(button, !currentState);

    // Re-set focus on editor as the button interferes with it
    editor.focus();
  }

  async afterRender() {
    const input = this.shadowRoot.querySelector('#input-panel');
    const editor = this.shadowRoot.querySelector('#editor');

    const fileSelector = this.shadowRoot.querySelector('#file-selector');
    fileSelector.addEventListener('change', async (event) => {
      console.log('file-change', event);

      // Create an internal file input and invoke it, then
      // listen to the change event to retrieve the result
      const file = event.target.files[0];

      // By removing "value" it is possible to send an image two times after each other,
      // this is because if an image is selected again it has already been set in the
      // file input and the change event will not be dispatched
      // https://stackoverflow.com/a/54632736
      fileSelector.value = null;

      // Needs to be imported after the event.target.files as been set
      // as the state will be removed after the asynchronous load
      const { readFile } = await import('/scripts/common/file.esm.js');

      readFile(file, (imageData) => {
        console.log(file, 'file-attach');

        if (imageData) {
          this.attachImage(imageData);
        }
        input.click();
        editor.focus();
      });
    });


    const bold = this.shadowRoot.querySelector('#bold');
    bold.addEventListener('click', (event) => this.setFormat(event, editor, bold, 'bold'));

    const italic = this.shadowRoot.querySelector('#italic');
    italic.addEventListener('click', (event) => this.setFormat(event, editor, italic, 'italic'));

    editor.addEventListener('click', (event) => this.detectAndSetButtonStates(event));
    // editor.addEventListener('keyup', (event) => this.detectAndSetButtonStates(event));

    editor.addEventListener('keydown', (event) => {
      // NOTE: 'which' and 'keycode' is depricated, see:
      // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which
      // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keycode
      if (event.code === 'Enter' && !event.shiftKey) { // Preferable way
        this.sendMessage(editor);
        event.preventDefault();
      }
    });

    /** Drag and drop image attachment */
    this.addEventListener('drag-drop-attachment', (event) => {
      this.dragDrop(event.detail);
    });
  }

  async dragDrop(file) {
    console.log('[control::dragDrop] An image file dropped', file);

    // Create an internal file input and invoke it, then
    // listen to the change event to retrieve the result
    const { readFile } = await import('/scripts/common/file.esm.js');
    readFile(file, (imageData) => {
      console.log('[control::dragDrop] Dropped image has been read', imageData);
      this.attachImage(imageData);
    });
  }

  /**
   * Attach an image to the message.
   * 
   * Notice!
   * Only allow for one attachment as I do not have time to change things for multiple
   * attachments, which can be done pretty easy but it might add half a days work
   * to add it.
   * 
   * @param {Object} Contains meta and data for an read image file 
   */ 
  attachImage(imageData) {
    this.attachment = imageData;

    const attachments = this.shadowRoot.getElementById('attachments');
    attachments.textContent = ''; // Clear

    // https://stackoverflow.com/a/3323835
    const attachment = document.createElement('div');
    attachment.className = 'attachment';

    const attachmentImage = document.createElement('img');
    attachmentImage.className = 'attachment-image';
    attachmentImage.src = imageData.result;

    const attachmentButton = document.createElement('div');
    attachmentButton.className = 'attachment-button';
    attachmentButton.addEventListener('click', () => {
      attachment.remove();
      this.attachment = undefined;
    });

    attachment.appendChild(attachmentImage);
    attachment.appendChild(attachmentButton);

    attachments.appendChild(attachment);
  }


  async sendMessage(editor) {
    const value = editor.innerHTML.trim();

    // Clear with textContent as this will not involve
    // any parsers, see https://stackoverflow.com/a/3955238
    editor.textContent = '';

    const attachments = this.shadowRoot.getElementById('attachments');
    attachments.textContent = '';

    const detail = {
      type: this.attachment ? 'image' : 'text'
    };

    if (detail.type === 'text' && !value) {
      return;
    }

    if (value) {
      detail.text = value;
    }

    if (detail.type === 'image') {
      detail.image = this.attachment.result;
      this.attachment = undefined;
    }

    this.dispatchEvent(new CustomEvent('message', { bubbles: false, composed: false, detail }));
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

customElements.define('ip-control', Control);
