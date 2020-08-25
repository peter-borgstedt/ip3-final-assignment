/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Miscellaneous utility methods.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */

/**
 * Normalize a string for insert in HTML content.
 * @param {string} text Text to be normalized
 */
export const normalizeText = (text) => {
  if (text) {
    // Remove any formatting and add <br/> to any new lines
    return text.replace(/\n/g, '<br/>');
  }
  return text;
};

/**
 * Get a short timestamp. If today only show hour and minutes,
 * else include year month and day.
 * @param {*} date Date to create a short timestamp for
 */
export const getShortTimestamp = (date) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  if (date > now) {
    return `${hours}:${minutes}`;
  }

  const year = `${date.getFullYear()}`;
  const month = `${date.getMonth()}`.padStart(2, '0');
  const day = `${date.getDay()}`.padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * Check if a string is a JSON object.
 * @param {string} str String to be tested
 */
export const isJSON = (str) => {
  if (str && typeof str === 'string') {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      // Do nothing
    }
  }
  return false;
};
