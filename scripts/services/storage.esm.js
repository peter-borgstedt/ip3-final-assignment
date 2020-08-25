/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Contains logic to store data into the session and local more easily
 * with the feature of storing and retrieving data with its originated data type.
 * 
 * If the data is anything else than a string use JSON.stringify it when stored,
 * when the value is later retrieved use JSON.parse to get value with its originated type.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
const storageAbstract = (storage) => ({
  /**
   * Store item.
   * @param key Key of item
   * @param value Value to be stored for key
   */
  set: (key, value) => {
    if (value) {
      // Stringify all data except strings, if stringified add prefix "[json]"
      // to later recognize which values have been stringified.
      storage.setItem(key, typeof value === 'string' ? value : `[json]${JSON.stringify(value)}`);
    }
  },

  /**
   * Get stored item.
   * @param Key of item
   */
  get: (key) => {
    const item = storage.getItem(key);
    // If there is a prefix of "[json]" then the data has been stored stringified
    if (item && item.startsWith('[json]')) {
      return JSON.parse(item.substr(6)); // Remove prefix and parse
    }
    return item; // Value is of string
  },

  /**
   * Removes an item of storage
   * @param key Key of item
   */
  remove: (key) => storage.removeItem(key),

  /**
   * Clear whole storage.
   */
  clear: () => storage.clear()
});

export const local = storageAbstract(window.localStorage);
export const session = storageAbstract(window.sessionStorage);
