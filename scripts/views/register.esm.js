import Component from '/scripts/core/component.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Register <ip-register>
 *
 * Consists of a form containing fields that a new user needs to fill in
 * to be able to create an account and login to the web application.
 *
 * The form will validate the fields and any constraints that has been
 * violated will be informed to the user.
 *
 * When submitted the data will be sent to the server, if the account was
 * successfuly created the user will be redirected to the login window.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class Register extends Component {
  constructor() {
    super();

    // Set an event listener which will be invoked when the user
    // is clicking on the submit button
    this.addEventListener('submit', async (event) => {
      const {
        detail: { forename, surname, email, password, confirmedPassword }
      } = event;

      // The password entered is not matching the confirmed password
      if (password !== confirmedPassword) {
        // Highlight the password confirm field with indication of a missmatch
        const passwordConfirm = this.shadowRoot.getElementById('confirmPassword');
        passwordConfirm.setInvalid('Password does not match');
        passwordConfirm.reportValidity();
        event.preventDefault();
        return false;
      }

      try {
        const { register } = await import('/scripts/services/api.esm.js');

        // Send the registration details to the server
        await register(forename, surname, email, password);

        // Reroute (redirect) the user to the login page
        const Router = (await import('/scripts/core/router.esm.js')).default;
        Router.set({ url: '/signin', data: { forename, surname, email } });
      } catch (e) {
        // Handle any errors retrieved from the server 
        if (e.statusCode === 400) {
          const message = 'A user is already registered with this email.';

          this.showError(message);
        } else {
          this.showError('Server error, please contact the webmaster');
          console.error(e);
        }

        event.preventDefault();
        return false;
      }
    });
  }

  render() {
    this._style = `
      :host {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      h1 {
        text-align: center;
        text-transform: uppercase;
        margin: 1rem 0 1rem 0;
      }

      .sign-in {
        display: flex;
        font-size: 0.9rem;
        justify-content: center; /* align horizontal */
        align-items: center; /* align vertical */
        margin: 0.5rem;
      }

      .sign-in > a {
        margin-left: 0.5rem;
      }

      a {
        color: inherit;
      }

      a:hover {
        color: green;
      }

      #layout {
        flex: 1;
        display: flex;
        flex-direction: column;

        justify-content: center;
        align-items: center;

        color: #aaa;
        min-height: 0;
        overflow: auto;
      }

      .header {
        display: flex;
        flex-direction: column;

        justify-content: center;
        align-items: center;
      }

      #bar-top {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        height: 6.5rem;
        border-bottom: 1px solid #ccc;
      }

      #bar-bottom {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #444;
        height: 2rem;
        border-top: 1px solid #888;
      }

      #outer-alert {
        width: 100%;
        max-width: 100%;
      }

      #alert {
        height: 0.9rem;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        margin: 1.25rem 0 1.25rem 0;
        font-size: 0.9rem;
        text-align: center;
        color: red;
      }

      .alert-ease-out {
        transition: opacity 10s ease-out;
        opacity: 0;
      }

      ip-form {
        width: 24rem;
      }

      @media only screen and (max-width: 600px) {
        ip-form {
          width: calc(100% - 1rem);
        }

        h1 {
          font-size: 1.2rem;
          margin: 0.5rem 0 0 0;
        }

        #bar-bottom {
          display: none;
        }

        #layout {
          justify-content: stretch;
          align-items: center;
        }
      }

      @media only screen and (max-height: 750px) {
        #layout {
          justify-content: stretch;
          align-items: center;
        }
      }`;

    this._template = `
      <div id="bar-top"><img src="/assets/logo2.png" height="50px"></div>

      <div id="layout">
        <div class="header">
          <h1>Join the fun! :D</h1>
        </div>

        <ip-form>
          <ip-input name="forename" type="text" label="Forename" id="forename"></ip-input>
          <ip-input name="surname" type="text" label="Surname" id="forename"></ip-input>
          <ip-input name="email" type="email" label="Email" id="email"></ip-input>
          <ip-input name="password" type="password" label="Password" id="password" minlength="6"></ip-input>
          <ip-input name="confirmedPassword" type="password" label="Confirm password" id="confirmPassword" minlength="6"></ip-input>
          <div id="alert"></div>
          <ip-button value="Register" id="button"></ip-button>
          <div class="sign-in">
            <span>Already a member?&nbsp;</span>
            <a is="router-link" href="/signin">Sign in</a>
          </div>
        </ip-form>
      </div>
      <!--div id="bar-bottom"></div-->
    `;
  }

  showError(message) {
    // Display error and slowly fade it out
    const alert = this.shadowRoot.getElementById('alert');
    alert.classList.remove('info');
    alert.classList.remove('alert-ease-out');
    alert.textContent = message;

    // After 500ms fade out window
    const ref = setTimeout(() => {
      alert.classList.add('alert-ease-out');
      clearTimeout(ref);
    }, 500);
  }
}

customElements.define('ip-register', Register);

