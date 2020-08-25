import Component from '/scripts/core/component.esm.js';

const EDIT_PROFILE_DETAILS_VIEW = 0;
const EDIT_PROFILE_IMAGE_VIEW = 1;

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Profile <ip-profile>
 *
 * Consists of a modal view that dynamically changes between two template views
 * depending on what the user is editing. The two views are the user details and
 * the user profile image.
 *
 * Any updated fields will be sent to the server and other clients which have an
 * interest of the update, such as other users of a channel this user is subscribing on.
 * The profile image can be changed by the user by selecting a local file which then is loaded
 * and displayed. The image is presented with the possibility to be cropped before sent
 * to the server (replacing any existing one).
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Profile extends Component {
  constructor() {
    super();
    this.changes = {};
  }

  render() {
    this._style = `
      @import url("/libraries/cropperjs/cropper.css");

      :host {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      label {
        font-size: 0.7rem;
        font-weight: bold;
        color: var(--modal-label-color);
        margin: 0;
      }

      input {
        height: 1.75rem;
        border: none;
        border-bottom: 1px solid var(--modal-input-border-color);

        margin: 0;
        padding: 0;
        outline: 0;

        background: var(--modal-input-background);
        color: var(--modal-input-color);
      }

      input[type="text"],
      input[type="email"],
      input[type="password"] {
        font-size: 0.8rem;
        padding: 0 0 0 0.25rem;
      }

      label:focus,
      input[type="text"]:focus,
      input[type="email"]:focus,
      input[type="password"]:focus {
        border-color: var(--modal-input-focus-border-color);
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

      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: center;
      }

      button, .button {
        font-weight: bold;
        height: 1.75rem;
        background: var(--modal-button-background);
        color: var(--modal-button-color);
        margin: 0.5rem;
        border-radius: 4px;
        border: 1px solid var(--modal-button-border-color);
        cursor: pointer;
      }

      button:hover, .button:hover {
        box-shadow: 0 1px 3px 0 rgba(0,0,0,.08);
        background: var(--modal-button-hover-background);
        color: var(--modal-button-hover-color);
        border-color: var(--modal-button-hover-border-color);
      }

      button:active, button:focus, .button:active, .button:focus {
        box-shadow: none;
        background: #eee;
        outline: 0;
      }

      .input-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 1rem 0.5rem 0;
        font-size: 18px !important;
      }

      #profile-image {
        margin: 0;
        padding: 0;
        outline: 0;
        border-radius: 4px;

        object-fit: fit;
        max-height: 128px;
        max-width: 128px;
        align-self: center;
      }

      #remove-profile-image {
        font-size: 0.8rem;
        text-decoration: none;
        color: var(--profile-remove-image-color);
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none; /* Safari */
      }

      #remove-profile-image:hover {
        text-decoration: underline;
      }

      #remove-profile-image:active {
        color: darkgreen;
      }

      #remove-profile-image:visited {
        color: none;
      }

      .layout-rows {
        display: flex;
        flex-direction: row;
      }

      .image-editor {
        items-align: center;
        justify-content: center;
      }

      .layout-columns {
        display: flex;
        flex-direction: column;
      }

      img {
        display: block;
        max-width: 100%; /** Needs to be 100% for CropperJS to work */
        image-orientation: from-image; /** For CropperJS to know the orientation */
        margin: 0;
        padding: 0;
      }

      #preview-small {
        width: 32px;
        height: 32px;
        border-radius: 3px;
        margin: 0.5rem;
      }

      #preview-medium {
        width: 128px;
        height: 128px;
        border-radius: 8px;
        margin: 0.5rem;
      }

      .preview-label {
        flex: 1;
        align-items: center;
        justify-content: center;
      }

      .preview-outline {
        flex: 1;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: #333;
      }

      .layout-rows > .preview-label:first-child {
        margin: 0 1rem 0 0;
      }

      .layout-rows > .preview-outline:first-child {
        margin: 0 0.5rem 1rem 0;
      }

      .layout-rows > .preview-outline:last-child {
        margin: 0 0 1rem 0.5rem;
      }

      #profile-label {
        text-align: center;
        padding-bottom: 0.25rem;
      }

      #upload-profile-label {
        width: 125px;
      }
    `;

    this._template = `
      <!-- Template when editing the image -->
      <template id="edit-profile-image">
        <div class="layout-rows" style="flex: 1; align-items: center; justify-content: center;">
          <div class="preview-label layout-columns">
            <label>Preview message sized</label>
          </div>
          <div class="preview-label layout-columns">
            <label>Preview profile sized</label>
          </div>
        </div>

        <div class="layout-rows" style="flex: 1">
          <div class="preview-outline layout-columns">
            <canvas id="preview-small" width="32px" height="32px"></canvas>
          </div>

          <div class="preview-outline layout-columns">
            <canvas id="preview-medium" width="128px" height="128px"></canvas>
          </div>
        </div>

        <div class="layout-rows image-editor">
          <!-- TODO: should be injected instead -->
          <img id="image">
        </div>
      </template>

      <!-- Template when editing the profile -->
      <template id="edit-profile"t>
        <div class="layout-rows">
          <div class="layout-columns" style="flex: 1">
            <div class="input-container">
              <label for="forename">Forename</label>
              <input type="text" id="forename" name="forename" required autocomplete="off">
            </div>

            <div class="input-container">
              <label for="surname">Surname</label>
              <input type="text" id="surname" name="surname" required autocomplete="off">
            </div>

            <div class="input-container">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required autocomplete="off">
            </div>

            <div class="input-container">
              <label for="new-password">New password</label>
              <input type="password" id="new-password" name="newPassword" autocomplete="off">
            </div>

            <div class="input-container">
              <label for="new-confirmed-password">Confirm password</label>
              <input type="password" id="new-confirmed-password" name="newConfirmedPassword" autocomplete="off">
            </div>

            <div id="alert"></div>
          </div>

          <div class="layout-columns">
            <label id="profile-label" for="profile-image">Profile picture</label>

            <!-- TODO: better to inject this -->
            <img type="img" id="profile-image">

            <div class="layout-rows" style="justify-content: center;">
              <label class="button" for="upload-profile-image" id="upload-profile-label">Upload Image</label>
              <input type="file" id="upload-profile-image" accept="image/*">
            </div>

            <a id="remove-profile-image" style="align-self: center">Remove photo</a>
          </div>
        </div>
      </template>

      <ip-modal>
        <!-- Title changes depending on interaction -->
        <div id="title" slot="title">Edit your Profile</div>
        
        <!-- Dynamic slot which changes view depending on interaction -->
        <div id="slot-view"></div>
      </ip-modal>
    `;
  }

  /**
   * Updates the change-set when input is entered in any of
   * the fields.
   */
  inputChangedListener(event) {
    // Field name
    const name = event.target.getAttribute('name');

    const newValue = event.target.value; // A changed value
    const currentValue = this.user[name]; // Value stored in database

    // Only add valid changes, if any data is changed and then changes back
    // to its current value, remove it from the change set 
    if (currentValue !== newValue && this.changes[name] !== newValue) {
      this.changes[name] = newValue; // Valid change
    } else {
      // If value is equal with the existing stored value remove it from changes
      delete this.changes[name]; // No change
    }
  }

  /**
   * Validates data before accepting the submit of changes.
   * If any input is not valid the user will be informed about them.
   *
   * TODO: coloring on errors instead of reportValidity and disable button?
   */
  validate() {
    const confirmedPassword = this.shadowRoot.getElementById('new-confirmed-password');
    confirmedPassword.setCustomValidity(''); // Reset any existing validity set previously

    // Validate so the new password match the confirmed password
    const { newPassword, newConfirmedPassword } = this.changes;
    if (newPassword && newPassword !== newConfirmedPassword) {
      // Sets a custom failed validity report to user 
      confirmedPassword.setCustomValidity('Needs to match the new password');
    }

    // Wrap all inputs in an array and iterate through them to remove some redundant code
    const inputs = [
      this.shadowRoot.getElementById('forename'),
      this.shadowRoot.getElementById('surname'),
      this.shadowRoot.getElementById('email'),
      this.shadowRoot.getElementById('new-password'),
      confirmedPassword
    ];

    for (const input of inputs) {
      if (!input.reportValidity()) {
        return false;
      }
    }
    return true;
  }

  /**
   * Set the modal view to editing the profile details.
   * @param profileImageData Image (base64 encoded data url)
   */
  setEditProfileDetails(profileImageData) {
    // Clone the template view for injecting into the DOM
    const templateEditProfile = this.shadowRoot.getElementById('edit-profile').content.cloneNode(true);

    // Set fields with initial values and add input listener to keep track on
    // any changes on these fields made by the user
    const forename = templateEditProfile.getElementById('forename');
    forename.addEventListener('input', this.inputChangedListener.bind(this));
    forename.value = this.user.forename;

    const surname = templateEditProfile.getElementById('surname');
    surname.addEventListener('input', this.inputChangedListener.bind(this));
    surname.value = this.user.surname;

    const email = templateEditProfile.getElementById('email');
    email.addEventListener('input', this.inputChangedListener.bind(this));
    email.value = this.user.email;

    // A more secure way would be to force the user to write the current
    // password as well (however this I left out to keep it a bit simple)
    const newPassword = templateEditProfile.getElementById('new-password');
    newPassword.addEventListener('input', this.inputChangedListener.bind(this));

    // The confirmed password needs to equal the new password
    const newConfirmedPassword = templateEditProfile.getElementById('new-confirmed-password');
    newConfirmedPassword.addEventListener('input', this.inputChangedListener.bind(this));

    // Invokes change of the profile image
    const uploadImageButton = templateEditProfile.getElementById('upload-profile-image');
    uploadImageButton.addEventListener('change', async (event) => {
      // Opens the file explorer letting the user select a file which then will be loaded
      // and displayed with the possibility to be cropped before sent to the server
      const file = event.target.files[0];
      
      // Set selected file to null (to be able to reselect the same file in a row)
      event.target.value = null;

      const { readFile } = await import('/scripts/common/file.esm.js');
      readFile(file, (imageData) => {
        // Change view to edit profile image
        this.setEditProfileImage(imageData);
      });
    });

    const removeImageButton = templateEditProfile.getElementById('remove-profile-image');
    removeImageButton.addEventListener('click', (event) => {
      event.preventDefault();
        // Set image as null in changes for removal
        this.changes.profileImageData = null;
        const profileImage = this.shadowRoot.getElementById('profile-image');
        profileImage.src = "";
    });

    // Get the modal view that content is being applied on to
    const modal = this.shadowRoot.querySelector('ip-modal');

    // Set text on the modal confirm button
    modal.setAttribute('confirm-button-text', 'Save');

    // If a new image has been selected use it otherwise pick the image from the user details
    const profileImageUrl = profileImageData ? profileImageData : this.user.profileImageUrl;

    if (profileImageUrl) {
      // Preload profile image and display the editing view after loaded
      const profileImage = templateEditProfile.getElementById('profile-image');
      profileImage.onload = () => {
        // To avoid any flicker, open the modal when image is loaded
        modal.setAttribute('open', ''); // Will display the modal
      };

      profileImage.src = profileImageUrl;
    } else {
      modal.setAttribute('open', ''); // Will display the modal
    }

    // The slot view is the container that will swap between the two different views;
    // edit profile details and edit profile image
    const slotView = this.shadowRoot.getElementById('slot-view');
    slotView.textContent = ''; // Quick clean of content (more efficient than innerHTML)

    slotView.append(templateEditProfile); // Display template in view
    this.currentView = EDIT_PROFILE_DETAILS_VIEW;
  }

  /**
   * Set the modal view to editing the profile image.
   * @param imageData Image (base64 encoded data url)
   */
  setEditProfileImage(imageData) {
    const templateEditProfileImage = this.shadowRoot.getElementById('edit-profile-image').content.cloneNode(true);
    const image = templateEditProfileImage.getElementById('image');

    image.src = imageData.result;
    image.onload = () => {
      const title = this.shadowRoot.getElementById('title');
      title.textContent = 'Edit profile image';

      // Set text on the modal confirm button
      const modal = this.shadowRoot.querySelector('ip-modal');
      modal.setAttribute('confirm-button-text', 'Save');

      this.initCrop(); // Start cropperjs
      this.currentView = EDIT_PROFILE_IMAGE_VIEW;
    };

    const viewSlot = this.shadowRoot.getElementById('slot-view');
    viewSlot.textContent = '';
    viewSlot.append(templateEditProfileImage);
  }

  async load() {
    // Get user data from user context
    this.context = (await import('/scripts/services/context.esm.js')).default;
    this.user = await this.context.getUser();
  }

  /**
   * After resources has been loaded (see Component for information about the life cycle),
   * this is where this view starts.
   */
  afterLoad() {
    // Modal which content will be applied on to
    const modal = this.shadowRoot.querySelector('ip-modal');

    modal.addEventListener('close', () => this.remove()); // Also remove this component
    modal.addEventListener('cancel', () => modal.close());
    modal.addEventListener('confirm', () => {
      // Submit has been invoked on edit profile details (the main window)
      // and if any changes was done will validate and send a message to the
      // server with the updates which will broadcast them to clients of interest
      if (this.currentView === EDIT_PROFILE_DETAILS_VIEW) {
        // If any changes and if all changes are valid
        if (!Object.keys(this.changes).length) {
          modal.close();
        } else if (this.validate()) {
          // Minor adjustment if password has changed
          if (this.changes.newPassword) {
            // Map new password to a proper property for the request,
            // remove the properties newPassword and newConfirmedPassword
            this.changes.password = this.changes.newPassword;
            delete this.changes.newPassword;
            delete this.changes.newConfirmedPassword;
          }

          // Send changes to the event bus and later handled in the context
          // will which forward them to the on the server for update, an event
          // will then be sent from the server through the websocket indicating
          // that the changes has been updated, which will be used to update
          // all related user content
          this.bus.dispatchEvent('profile-update', this.changes);
          modal.close();
        } else {
          // Reset button as enabled (as they are disabled intentionally after clicked upon)
          modal.setEnabled(true);
        }
      // Submit has been incoked on edit profile image
      } else if (this.currentView === EDIT_PROFILE_IMAGE_VIEW) {
        const croppedImage = this.cropper.crop();

        // Get cropped image data (as base64)
        var imageData = croppedImage.getCroppedCanvas().toDataURL();

        // Store the changed image for update
        this.changes.profileImageData = imageData;

        // Enable buttons again (which will get disabled when clicked upon in previous view),
        // this is done to stop any double click which will send multiple events,
        // this is due to the "transitionend" event which is waited upon making the
        // dialog being up a bit longer and giving the possibility to click several times
        modal.setEnabled(true);

        // Change back to edit profile detail view
        this.setEditProfileDetails(imageData);
      }
    });

    // Set initial view to edit profile details
    this.setEditProfileDetails();
  }

  /** Start cropping image */
  async initCrop() {
    const image = this.shadowRoot.getElementById('image');

    // Preview small, representing the image on a message
    const previewSmall = this.shadowRoot.getElementById('preview-small');
    const previewSmallContext = previewSmall.getContext('2d');
    previewSmallContext.imageSmoothingQuality = "high";

    // Preview medium, representing the image in the profile (view)
    const previewMedium = this.shadowRoot.getElementById('preview-medium');
    const previewMediumContext = previewMedium.getContext('2d');
    previewMediumContext.imageSmoothingQuality = "high";
  
    // A third party library for cropping images:
    // https://github.com/fengyuanchen/cropperjs
    const Cropper = (await import('/libraries/cropperjs/cropper.esm.js')).default;

    // Details about the configuration can be found at:
    // https://github.com/fengyuanchen/cropperjs/blob/master/README.md
    this.cropper = new Cropper(image, {
      aspectRatio: 1,

      autoCrop: false,
      movable: false,
      zoomable: false,
      rotatable: false,
      scalable: false,

      minCanvasWidth: 128,
      minCanvasHeight: 128,
      minContainerWidth: 128,
      minContainerHeight: 128,
      minCropBoxWidth: 128,
      minCropBoxHeight: 128,

      crop: (event) => {
        event.preventDefault();

        // Display previews after any updates of the cropping view has been done
        const { x, y, width, height } = event.detail;
        previewSmallContext.drawImage(image, x, y, width, height, 0, 0, 32, 32);
        previewMediumContext.drawImage(image, x, y, width, height, 0, 0, 128, 128);
      },
      ready() {
        // Send a crop even so it initiates a cropped area (in the middle)
        this.cropper.crop();
      },
    });
  }
}

customElements.define('ip-profile', Profile);
