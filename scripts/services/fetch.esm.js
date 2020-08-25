/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * A class that wraps functionality around Fetch API to make things
 * easier when doing requests.
 *
 * References:
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * 
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
class Fetch {
  constructor() {
    this.get = this.bindRetrieveMethod('get');
    this.post = this.bindMethod('post');
    this.put = this.bindMethod('put');
    this.patch = this.bindMethod('patch');
    this.delete = this.bindMethod('delete');
  }

  /**
   * Checks whether an object is a JSON object.
   *
   * @param obj Any type data type
   * @returns true if a string and parsable to JSON, false otherwise
   */
  static isJSON(obj) {
    if (obj && typeof obj === 'string') {
      try {
        JSON.parse(obj);
        return true;
      } catch (e) {
        // Do nothing
      }
    }
    return false;
  }

  async call(params) {
    const { url, method, body, useCredentials } = params;

    const options = {
      method: method.toUpperCase(),
      headers: {},
    };

    // If credentials should be used add the token in the request headers
    if (useCredentials) {
      const { local, session } = await import('./storage.esm.js');
      const { encoded } = local.get('token') || session.get('token');
      options.headers.Authorization = encoded;
    }
  
    if (body) {
      options.body = body;
    }

    // Add content-type for valid methods that contains a body
    if (['POST', 'PUT', 'PATCH'].includes(options.method)) {
      if (Fetch.isJSON(body)) {
        // If body is of json set content-type as json
        options.headers['Content-Type'] = 'application/json';
      } else if (typeof body === 'string') {
        // If body is of string set content-type as text
        options.headers['Content-Type'] = 'text/plain';
      }
    }

    // Do request call
    const response = await fetch(url, options);
    if (response.ok) {
      return response; // Return response object if the call was okay
    }

    // If call failed, retrieve some data from the response object why it did so
    throw {
      statusCode: response.status,
      statusText: response.statusText,
      error: response.text
    };
  }

  /**
   * Binds a retrieve method (GET) with some prepared arguments to a new method
   * @param method The HTTP method to be used for the request call
   */
  bindRetrieveMethod (method) {
    return (url, useCredentials) => this.call({ url, method, body: undefined, useCredentials });
  }

  /**
   * Binds a method with some prepared arguments to a new method
   * @param method The HTTP method to be used for the request call
   */
  bindMethod (method) {
    return (url, body, useCredentials) => this.call({ url, method, body, useCredentials });
  }
}

export default new Fetch();