import RouterModule from '/scripts/core/router.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Service Module: Context
 *
 * Creating a session by establishing a websocket connection and retrieving some core
 * data such as detail of the user, the subscribing channels and sets up logic for handling
 * events when any data related to the user during interaction with the web application is changed.
 *
 * The implementation consists of:
 * - the subscribed channels of user
 * - the user detail (except password)
 * - event (bus) listeners that updates any changed data mentioned above
 * - event (bus) proxying between REST calls to the server server regarding activities by the user
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
class Context {
  constructor() {
    this.users = {};
  }

  async init() {
    try {
      this.bus = (await import('/scripts/core/eventbus.esm.js')).default;
      this.api = await import('/scripts/services/api.esm.js');

      const userContext = await this.api.getContext();

      this.subscribed = userContext.channels;
      this.user = userContext.user;

      this.wsproxy = (await import('/scripts/services/websocket-proxy.esm.js')).default;
      await this.wsproxy.start(this.user);

      // When a channel has been created by the user, send the details to the server
      // and if a succesfull response was retrieved dispatch an event with the new channel details
      // adding it to the client context
      this.bus.addEventListener('channel-create', 'context', async (createdChannel) => {
        try {
          const channel = await this.api.createChannel(createdChannel.name, createdChannel.description);
          channel.subscription = true;

          this.subscribed.push(channel);
          this.bus.dispatchEvent('channel-created', channel);
        } catch (error) {
          this.bus.dispatchEvent('channel-create-error', error);
        }
      });

      // A channel has been deleted and is retrieved from the websocket, this could
      // be an action of another user or by the user itself, remove the channel from the
      // client context
      this.bus.addEventListener('channel-deleted', 'context', async (channelId) => {
        const index = this.subscribed.findIndex((ch) => ch.id == channelId);
        this.subscribed.splice(index, 1);
      });

      // When a channel has been subscribed by the user, send the details to the server
      // and if a succesfull response was retrieved dispatch an event with the new channel details
      // adding it to the client context
      this.bus.addEventListener('channel-subscribe', 'context', async (subscribedChannel) => {
        this.subscribed.push(subscribedChannel);
      });

      // When a channel has been unsubscribed by the user, send the details to the server
      // and if a succesfull response was retrieved dispatch an event with the new channel details
      // adding it to the client context
      this.bus.addEventListener('channel-unsubscribe', 'context', async (unsubscribedChannel) => {
        // Remove item from subscribed channels
        const index = this.subscribed.findIndex((ch) => ch.id == unsubscribedChannel.id);
        this.subscribed.splice(index, 1);
      });

      // Profile updates of the user or a user associated with any of the
      // users subscribed channels
      this.bus.addEventListener('profile-changed', 'context', async (user) => {
        if (this.user.id === user.id) {
          // Update current user
          this.user = user;
        } else {
          // Update a associated user with subscribed channels
          this.users[user.id] = user;
        }
      });


    } catch (error) {
      // This basically only happens if the token has expired or is
      // invalid in any sorts (a key rotation has been done),
      // logout and let user relogin.
      console.error(`[context.esm.js::imit] Got an error: ${error.message}`);
      console.error(error);

      // Log the user out which redirects to the login page 
      this.logout();
    }
  }

  /**
   * Get all channels with details if the channel is being
   * subscribed upon or not. 
   * @returns list of channels
   */
  async getChannels() {
    const channels = await this.api.getChannels();
    const subscribedIds = this.subscribed.map((channel) => channel.id);
    return channels.map((channel) => {
      return {
        ...channel,
        subscription: subscribedIds.includes(channel.id)
      };
    });
  }


  /**
   * Get details of user (except password).
   * @param {string} id of user
   * @returns user details
   */
  async getUser(id) {
    if (!id || id === this.user.id) {
      return this.user;
    } else if (id) {
      const user = this.users[id];
      if (user) {
        return user;
      }
      return this.users[id] = await this.api.getUser(id);
    }
  }

  /**
   * Get the logged in session token.
   * @returns jwt
   */
  async getToken() {
    const { local, session } = await import('/scripts/services/storage.esm.js');
    return local.get('token') || session.get('token');
  }

  /**
   * Remove the token for logged in session.
   */
  async removeToken() {
    const { local, session } = await import('/scripts/services/storage.esm.js');
    local.remove('token');
    session.remove('token');
  }

  /**
   * When for example a token is expired or any security issues,
   * clean token and let user relogin
   */
  async logout() {
    console.log(`[context.esm.js::logout] Logging out...`);

    // Remove token
    this.removeToken();

    // Disconnect from websocket
    const websocket = (await import('/scripts/services/websocket.esm.js')).default;
    websocket.disconnect();

    // Redirect to login view
    RouterModule.set();
  }
}

export default new Context();
