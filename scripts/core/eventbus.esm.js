/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Contains logic for listening and dispatching events which can
 * be used to proxy different events between places or directly append
 * logic when occurring.
 * 
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
class Eventbus {
  constructor() {
    // A map where key is the event name and the value a
    // set of functions to be run
    this.listeners = new Map();
  }

  /**
   * Add an event listener to the event bus.
   * @param {String} event Name of the event
   * @param {String} func Function to be invoked
   */
  addEventListener(event, id, func) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).set(id, func);
    } else {
      this.listeners.set(event, new Map([[ id, func ]]));
    }
  }

  /**
   * Remove an event listener from the event bus.
   * @param {String} event Name of the event
   * @param {String} func Function to be removed
   */
  removeEventListener(event, id) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(id);
    }
  }

  /**
   * Dispatch event which will invoke any listeners that has been
   * added for the event.
   * @param {*} event Event name
   * @param {*} obj Event object that should be distrubuted to the listeners
   */
  dispatchEvent(event, obj) {
    if (this.listeners.has(event)) {
      for (const func of this.listeners.get(event).values()) {
        func(obj);
      }
    }
  }
}

export default new Eventbus();
