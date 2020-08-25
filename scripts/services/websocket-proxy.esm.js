/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * A websocket proxy and interceptor which adds an abstraction layer over the
 * websocket service to manage the events more easily.
 * 
 * Uses the event bus to retrieve and forward messages internally in the web application
 * and forwards (sends) events to the websocket service directly and with some
 * transformation of the data before.
 *
 * Handles the following INCOMING events;
 * interactions of current and associated users; which in the same channels as the user:
 * - creation of a message
 * - removal of a message (only the message creator can remove the message)
 * - creating of new channel
 * - removal of an existing channel (only the channel creator can remove the channel)
 * - subscription on a existing channel
 * - unsubscription on a existing channel
 * - changes in the profile
 *
 * Handles the following OUTGOING events;
 * interactions of current user:
 * - creation of a message
 * - removal of a message (only the message creator can remove the message)
 * - creation of a message
 * - creating of new channel
 * - deletion of an existing channel
 * - subscription on a existing channel
 * - unsubscription on a existing channel
 * - changes in the profile
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
class WebsocketProxy {
  async start(user) {
    this.user = user;
    this.bus = (await import('/scripts/core/eventbus.esm.js')).default;
    this.websocket = (await import('/scripts/services/websocket.esm.js')).default;

    // Listens to incoming message events from the websocket
    this.websocket.addEventListener('onmessage', (message) => {
      const { type, data } = JSON.parse(message.data);
      switch (type) {
        case 'message': {
          this.incomingMessage(data);
          break;
        }
        case 'message-deleted': {
          this.incomingMessageDelete(data);
          break;
        }
        case 'channel-subscribed': {
          this.incomingChannelSubscribed(data);
          break;
        }
        case 'channel-unsubscribed': {
          this.incomingChannelUnsubscribed(data);
          break;
        }
        case 'channel-deleted': {
          this.incomingChannelDeleted(data);
          break;
        }
        case 'profile-changed': {
          this.incomingProfileChange(data);
          break;
        }
        default:
          throw new Error("Unknown websocket action type: " + type);
      } 
    });

    /** Setup event listeners that will forwarding the events to the outgoing websocket */
    this.bus.addEventListener('message', 'wsp', this.outgoingMessage.bind(this));
    this.bus.addEventListener('message-delete', 'wsp', this.outgoingMessageDelete.bind(this));
    this.bus.addEventListener('channel-subscribe', 'wsp', this.outgoingChannelSubscribe.bind(this));
    this.bus.addEventListener('channel-unsubscribe', 'wsp', this.outgoingChannelUnsubscribe.bind(this));
    this.bus.addEventListener('channel-delete', 'wsp', this.outgoingChannelDelete.bind(this));
    this.bus.addEventListener('profile-update', 'wsp', this.outgoingProfileUpdate.bind(this));
  }

  /** 
   * An incoming chat message belonging to a subscribed channel;
   * will be sent forward using the event bus to the correct (channel-)
   * view and append it to the content.
   * @param {object} data Content of message (with associated channel and user)
   */
  incomingMessage(data) {
    console.log('[websocket-proxy.esm.js::incoming]: message', data);

    // Push message data forward to correct channel
    this.bus.dispatchEvent(`channel-${data.channelId}`, data);
  }

  /** 
   * An incoming removal of a chat message belonging to a subscribed channel;
   * will be sent forward using the event bus to the correct (channel-)
   * view and remove it from the content.
   * @param {object} data Content of message (with associated channel and user)
   */
  incomingMessageDelete(data) {
    console.log('[websocket-proxy.esm.js::incoming]: message-deleted', data);

    // Push message data forward to correct channel
    this.bus.dispatchEvent(`message-${data.channelId}-${data.id}`, data);
  }

  /** 
   * An incoming subscription of a channel;
   * will be sent forward using the event bus to the correct (channel-)
   * view and either add it to the current user or increment the amount of
   * subscribed clients on the channel (if the subscription is another user).
   * @param data The channel details
   */
  incomingChannelSubscribed(data) {
    console.log('[websocket-proxy.esm.js::incoming]: channel-subscribed', data);
    if (data.userId === this.user.id) {
      // Event will add the channel from the sidebar
      this.bus.dispatchEvent('channel-subscribed', data);
    } else {
      // Event will add subscription count from channel
      this.bus.dispatchEvent(`channel-subscribed-${data.id}`);
    }
  }

  /** 
   * An incoming unsubscription of a channel;
   * will be sent forward using the event bus to the correct (channel-)
   * view and either add it to the current user or increment the amount of
   * subscribed clients on the channel (if the subscription is another user).
   * @param {object} data Channel details
   */
  incomingChannelUnsubscribed(data) {
    console.log('[websocket-proxy.esm.js::incoming]: channel-unsubscribed', data);

    if (data.userId === this.user.id) {
      // Event will remove the channel from the sidebar
      this.bus.dispatchEvent('channel-unsubscribed', data);
    } else {
      // Event will remove subscription count from channel
      this.bus.dispatchEvent(`channel-unsubscribed-${data.id}`);
    }
  }

  /** 
   * An incoming removal of a channel;
   * will be sent forward using the event bus to the correct (channel-)
   * view and remove it completely and its content.
   * @param {string} data The channel ID to be removed
   */
  incomingChannelDeleted(data) {
    console.log('[websocket-proxy.esm.js::incoming]: channel-deleted', data);

    // Remove channel for all clients if channel has been deleted
    this.bus.dispatchEvent(`channel-deleted`, data);
    this.bus.dispatchEvent(`channel-deleted-${data}`);
  }

  /**
   * A change in the user profile, is being sent when a user has changed
   * any profile details; name, email or profile image. When this occur the data is
   * broadcasted to connections with a relation to this user; connections that are in
   * the same channel as the user. All related connections will get their view updated
   * for this users; a new profile image would immediently update all the messages of that user
   * in a view (without any need to "refresh" the whole site).
   * 
   * Using PUSH events rather than POLL, and with a websocket we get that feature, so
   * lets leverage that for most interactions.
   *
   * @param {object} data A profile change set (contains only properties that have been changed)
   */
  incomingProfileChange(data) {
    console.log(`[websocket-proxy.esm.js::incoming]: profile-changed (${data.id})`, data);
    this.bus.dispatchEvent('profile-changed', data);
    this.bus.dispatchEvent(`profile-changed-${data.id}`, data);
  }

  /**
   * An outgoing new message (created by the client), will be fowards to the websocket
   * and sent to the server which then will be processed and broadcasted to connections (clients)
   * that are associated with the channel and append to the content.
   * @param {object} data Content of message (with associated channel and user)
   */
  outgoingMessage(data) {
    console.log('[websocket-proxy.esm.js::outgoing]: message', data);

    // Send as binary (BufferArray / byte array) as there are pretty
    // much no limit on how much we can send through this, it is also
    // sent data in chunks, the server side has been configured to be able to
    // handle a lot, and we can send all kind of data of all formats because
    // it in the end all of it is just an array of bytes...
    const { type, channelId, ...content } = data;

    this.websocket.sendBinary({
      type: 'message',
      data: { type, channelId, content }
    });
  }

  /**
   * An outgoing removal of message (deleted by the client), will be fowards to the websocket
   * and sent to the server which then will be processed and broadcasted to connections (clients)
   * that are associated with the channel and remove it from the content.
   * @param {object} data Content of message (with associated channel and user)
   */
  outgoingMessageDelete(data) {
    console.log('[websocket-proxy.esm.js::outgoing]: message-delete', data);
    const { id, channelId } = data;
    this.websocket.sendBinary({
      type: 'message-delete',
      data: { id, channelId }
    });
  }

  /**
   * An outgoing subscription of channel (made by the client), will be fowards to the websocket
   * and sent to the server which then will be processed and broadcasted to connections (clients)
   * that are associated with the channel and update the content (incrementing the subscription count
   * for associated users or adding it to the list of subscribed channels for the current user).
   * @param {object} data Channel details
   */
  outgoingChannelSubscribe(data) {
    console.log('[websocket-proxy.esm.js::outgoing]: channel-subscribe', data);

    this.websocket.sendBinary({
      type: 'channel-subscribe',
      data: data
    });
  }

  /**
   * An outgoing unsubscription of channel (made by the client), will be fowards to the websocket
   * and sent to the server which then will be processed and broadcasted to connections (clients)
   * that are associated with the channel and update the content (decrementing the subscription count
   * for associated users or removing it to the list of subscribed channels for the current user).
   * @param {object} data Channel details
   */
  outgoingChannelUnsubscribe(data) {
    console.log('[websocket-proxy.esm.js::outgoing]: channel-unsubscribe', data);

    this.websocket.sendBinary({
      type: 'channel-unsubscribe',
      data: data
    });
  }

  /**
   * An outgoing removal of channel (made by the client), will be fowards to the websocket
   * and sent to the server which then will be processed and broadcasted to connections (clients)
   * that are associated with the channel and remove it and all its content.
   * @param {object} data Channel details
   */
  outgoingChannelDelete(data) {
    console.log('[websocket-proxy.esm.js::outgoing]: channel-delete', data);

    this.websocket.sendBinary({
      type: 'channel-delete',
      data: data
    });
  }

  /**
   * An outgoing update of profile details (made by the client), will be fowards to the websocket
   * and sent to the server which then will be processed and broadcasted to connections (clients)
   * that are associated with any of the channels subscribed by the user and update its content.
   * @param {object} data A profile change set (contains only properties that have been changed)
   */
  outgoingProfileUpdate(data) {
    console.log('[websocket-proxy.esm.js::outgoing]:: profile-update', data);

    this.websocket.sendBinary({
      type: 'profile-update',
      data: data
    });
  }
}

export default new WebsocketProxy();
