import Component from '/scripts/core/component.esm.js';

/**
 * Web-component: Sign-In (<ip-sign-in>)
 *
 * Consists of a form containing two fields, username and password. The
 * username will be the users email adress.
 *
 * The form will validates the fields and if any constraints are
 * violated the user will be informed by these.
 * 
 * If a user writes wrong email or wrong password the information of
 * error will be vague to prevent fishing of emails or trying to
 * "brute force" into the an account.
 *
 * When submitted the data will be sent to the server, if the account was
 * successfuly logged in the user will recieve a web token and be
 * redirected to the main view.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class SignIn extends Component {
  constructor() {
    super();

    this.addEventListener('submit', async (event) => {
      const { email, password, remember = false } = event.detail;

      try {
        // Get token by signing in with credentials
        const token = await this.signIn({ email, password });
        // If successfully logged in store token and redirect to main page
        await this.onConfirmation(token, remember);
      } catch (e) {
        if (e.statusCode === 403) {

          // Intentionally display a vague message, the server
          // will never respond with exactly why it returned 403, it
          // can either be that the user does not exist or that the
          // password was incorrect, this is done deliberately
          const message = 'Your account or password is incorrect.';

          const emailInputField = this.shadowRoot.getElementById('email');
          emailInputField.setInvalid(message);

          const passwordInputField = this.shadowRoot.getElementById('password');
          passwordInputField.setInvalid(message);

          this.showError(message);
        } else {
          this.showError('Server error, please contact the webmaster');
          console.error(e);
        }
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

      h1.has-sub-title {
        margin: 1rem 0 0 0;
      }

      h2 {
        font-size: 1.35rem;
        margin: 0 0 0.5rem 0;
      }

      h2 + div {
        margin: 0 0 1rem 0;
      }

      .register {
        display: flex;
        font-size: 0.9rem;
        justify-content: center;
        align-items: center;
        margin: 0.5rem;
      }

      .register > a {
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
        flex-direction: row;
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

      .alert {
        height: 0.9rem;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        margin: 1.25rem 0 1.25rem 0;
        font-size: 0.9rem;
        text-align: center;
        color: red;
      }

      .info {
        color: green;
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
          align-items: stretch;
        }
      }

      @media only screen and (max-height: 600px) {
        #layout {
          justify-content: stretch;
          align-items: center;
        }
      }
    `;

    this._template = `
      <div id="bar-top"><img src="/assets/logo.png" height="50px"></div>

      <div id="layout">
        <div class="header">
          <h1 id="title">Welcome!</h1>
        </div>

        <ip-form>
          <ip-input name="email" type="email" label="Email" id="email"></ip-input>
          <ip-input name="password" type="password" label="Password" id="password"></ip-input>
          <ip-checkbox name="remember" label="Remember me" id="remember"></ip-checkbox>
          <div id="alert" class="alert"></div>

          <ip-button value="Login" id="button"></ip-button>
          <div class="register">
            <span>Not a member yet?&nbsp;</span>
            <a is="router-link" href="/register">Create your account</a>
          </div>
        </ip-form>


      </div>
      <!--div id="bar-bottom">IP1, IP3 (2020)</div-->
    `;
  }

  async afterLoad() {
    // If any data has been set by the router then the redirection was originated from the registration view
    // and will contain details of the new account that was created
    const data = this.routerData.data;

    if (data.email) {
      const email = this.shadowRoot.getElementById('email');
      email.value = data.email;

      const title = this.shadowRoot.getElementById('title');
      title.textContent = 'Welcome';
      title.classList.add('has-sub-title');

      const subTitle = document.createElement('h2');
      subTitle.textContent = `${data.forename} ${data.surname}!`;

      const information = document.createElement('div');
      information.textContent = 'You account has been created, please login to continue';

      title.parentNode.append(subTitle)
      title.parentNode.append(information)

      this.showInfo('Enter you password...')
    }
  }

  /**
   * Signs in by entering credentials and if successfully
   * will retrieve a JSON webtoken.
   * @param credentials User entered credentials
   */
  async signIn(credentials) {
    const { email, password, remember } = credentials;
    
    // Signs in by doing a request call with credentials which
    // if successful will respond with a signed JWT from the server
    const { signIn } = await import('/scripts/services/api.esm.js');
    const encoded = await signIn(email, password);

    const jwt = await import('/scripts/common/jwt.esm.js');
    // Retrieve open content in the token
    const decoded = jwt.parse(encoded);
    return { encoded, decoded, remember };
  }

  /**
   * 
   * @param token JSON web token
   * @param remember If the token should be stored for new browser sessions
   */
  async onConfirmation(token, remember) {
    const { local, session } = await import('/scripts/services/storage.esm.js');

    if (remember) {
      // Store in session storage so it is available next time
      // even if the user is closing down the browsers
      session.remove('token'); // Remove token if exists
      local.set('token', token);
    } else {
      // Store in session storage so it is not available next time
      // the user starts a new browser session
      local.remove('token'); // Remove token if exists
      session.set('token', token);
    }

    // Reroute (redirect) the user to the main page
    const Router = (await import('/scripts/core/router.esm.js')).default;
    Router.set({ url: '/' });
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

  showInfo(message) {
    // Display error and slowly fade it out
    const alert = this.shadowRoot.getElementById('alert');
    alert.classList.add('info');
    alert.classList.remove('alert-ease-out');
    alert.textContent = message;

    // After 2500ms fade out window
    const ref = setTimeout(() => {
      alert.classList.add('alert-ease-out');
      clearTimeout(ref);
    }, 2500);
  }
}

customElements.define('ip-sign-in', SignIn);
