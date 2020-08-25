
/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 * 
 * A class that wraps functionality around Websocket API to make things
 * easier establish connection and handling data events.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
class WebSocketSession {
  /**
   * Transform a string of UTF-8 to ByteArray.
   *
   * We need to to convert the string to an ArrayBuffer to stream
   * manually as binary, and to be able to handle som special characters
   * the encoding needs to be set as UTF-8. Images will also be handled
   * as they are transformed to a Base64 string.
   * @param str A string to be transformed to a ByteArray
   */
  static stringToArrayBuffer(str) {
    // https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
    return new TextEncoder("utf-8").encode(str);
  }

  constructor() {
    this.listeners = {};
  }

  /**
   * Establish a websocket connection.
   * @param token JWT to be used for authorization
   */
  async connect(token) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      try {
        const url = `${window.app.websocketUrl}?auth=${token}`;
        this.websocket = new WebSocket(url);
        this.websocket.binaryType = 'arraybuffer';

        // The websocket was successfully connected
        this.websocket.onopen = (event) => {
          console.log('[websocket.esm.js::connect] Websocket opened');
          (this.listeners['onopen'] || []).forEach((l) => l(event));
        };

        // The websocket was closed
        this.websocket.onclose = (event) => {
          console.log(`[websocket.esm.js::connect] Websocket closed -> [${event.code}] ${event.reason}`);
          (this.listeners['onclose'] || []).forEach((l) => l(event));
        };

        // An error occurred while establishing or during a websocket connection
        this.websocket.onerror = (event) => {
          console.error('[websocket.esm.js::connect] Websocket error');
          (this.listeners['onerror'] || []).forEach((l) => l(event));
        };

        // A message was retrieved from the websocket server
        this.websocket.onmessage = (event) => {
          (this.listeners['onmessage'] || []).forEach((l) => l(event));
        };

      } catch (error) {
        console.error('[websocket.esm.js::connect.catch] Websocket error: ' + error);
        (this.listeners['onerror'] || []).forEach((l) => l(error));
      }
    }
  }

  /**
   * Add listeners on websocket events.
   * @param key Event key
   * @param listener A listener function
   */
  addEventListener(key, listener) {
    const listeners = this.listeners[key] || (this.listeners[key] = []);
    listeners.push(listener);
  }

  /** Disconnects the websocket */
  disconnect() {
    this.websocket.close();
    this.websocket = null;
    this.listeners = {};
  }

  /**
   * Send object as binary (ArrayBuffer) to the websocket server.
   * @param obj Object to be sent
   */
  sendBinary(obj) {
    const json = JSON.stringify(obj);
    const arrayBuffer = WebSocketSession.stringToArrayBuffer(json);
    this.websocket.send(arrayBuffer); // Send as binary (streaming larger data)
  }
}

export default new WebSocketSession();
