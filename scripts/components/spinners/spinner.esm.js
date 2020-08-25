/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Web-component: Default Spinner <ip-spinner>
 * 
 * A simple spinner (loader) displaying circles bouncing (while content is loading).
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
class Spinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        #spinner {
          flex: 1;
          display: flex;
          justify-content: center; /* align horizontal */
          align-items: center; /* align vertical */
        }

        /** Spin-kit */
        #spinner > div {
          width: 50px;
          height: 50px;
          background-color: #333;

          border-radius: 100%;
          display: inline-block;
          -webkit-animation: bouncedelay 1.4s infinite ease-in-out both;
          animation: bouncedelay 1.4s infinite ease-in-out both;
        }

        #spinner .bounce1 {
          -webkit-animation-delay: -0.32s;
          animation-delay: -0.32s;
        }

        #spinner .bounce2 {
          -webkit-animation-delay: -0.16s;
          animation-delay: -0.16s;
        }

        @keyframes bouncedelay {
          0%, 80%, 100% { 
            -webkit-transform: scale(0);
            transform: scale(0);
          } 40% { 
            -webkit-transform: scale(1.0);
            transform: scale(1.0);
          }
        }

        @-webkit-keyframes bouncedelay {
          0%, 80%, 100% { -webkit-transform: scale(0) }
          40% { -webkit-transform: scale(1.0) }
        }

        :host {
          all: inherit;
        }
      </style>

      <div id="spinner" class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    `;
  }
}

customElements.define('app-spinner', Spinner);
