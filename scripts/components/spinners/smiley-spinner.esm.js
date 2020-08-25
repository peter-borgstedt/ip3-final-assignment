/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * A spinner (loader) which displays an animated smiley (while content is loading).
 *
 * Using CSS and SVG from a topic regarding how to create a spinning smiley, this has been
 * slightly modified for my personal taste; colors and size.
 * 
 * See references below for details and explanation around the implementation
 * (and different varations of it).
 *
 * References:
 * https://stackoverflow.com/questions/48232891/css-rotating-smiling-face-loader
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
class Spinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        svg {
          width: 20%;
          max-width: 250px;
          height: auto;
        }

        .smile, .eyes {
          stroke: var(--smiley-spinner-color);
          stroke-width: 1.2;
          stroke-linecap: round;
          fill: transparent;
        }

        svg {
          animation: rotate 1.2s cubic-bezier(.65, 0, .75, 1) infinite;
        }

        svg .smile {
          animation: smile 1.2s cubic-bezier(.2, 0, .8, 1) infinite;
        }

        svg .eyes {
          animation: eyes 1.2s cubic-bezier(.7, 0, .4, 1) infinite;
        }
        
        @keyframes rotate {
          from {
            transform:rotate(0);
          }
          to {
            transform:rotate(720deg);
          }
        }

        @keyframes smile {
          50% { stroke-dasharray: 20, 5.1327; }
        }
        @keyframes eyes  {
          0% {
            fill: transparent;
          }
          70% {
            stroke-dasharray: 1,0, .5, 23.6327;
          }
        }

        :host {
          flex: 1;
          display: flex;
          justify-content: center; /* align horizontal */
          align-items: center; /* align vertical */
        }
      </style>

      <svg viewbox="0 0 10 10">
        <circle class="smile" cx="5" cy="5" r="4" stroke-dashoffset="-.5" stroke-dasharray="11.5,13.6327" />
        <circle class="eyes" cx="5" cy="5" r="4" stroke-dashoffset="-15.5" stroke-dasharray="0,6.6327,0,17.5" />
      </svg>
    `;
  }
}

customElements.define('smiley-spinner', Spinner);
