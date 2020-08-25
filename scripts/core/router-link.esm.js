/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Webcomponent: Router Link <ip-router-link>
 *
 * An element that extends the anchor element and uses the Router module
 * to redirect to a path/URL instead. This eliminates the page from refreshing.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default class RouterLink extends HTMLAnchorElement {
  connectedCallback() {
    this.addEventListener('click', async (event) => {
      event.preventDefault(); // Prevents the page from refreshing

      // Get the hyperlink referense (the path/URL)
      const href = this.getAttribute('href');
      console.log(`[router-link]: ${href}`);

      // Get the router module
      const Router = (await import('/scripts/core/router.esm.js')).default;
      
      // Debug logs
      const routerID = this.getAttribute('routerID') || '*';
      console.log(`[router-link::click::${routerID}] -> ${href}`);

      // Redirect using the router
      Router.set({ routerID, url: href });
    });
  }
}

customElements.define('router-link', RouterLink, { extends: 'a' });
