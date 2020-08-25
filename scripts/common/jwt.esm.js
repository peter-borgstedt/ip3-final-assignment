/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Utility methods for reading files.
 *
 * References:
 * https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */

 /**
  * Decode content.
  * @param {string} str portion of a JWT (header or data)
  */
const decodeBase64Unicode = (str) => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
};

/**
 * Parses by decoding the token.
 * @param {string} token Token to be parsed
 * @returns readable data
 */
export const parse = (token) => {
  const [ header, data ] = token.split('.');
  return {
    ...JSON.parse(decodeBase64Unicode(header)),
    ...JSON.parse(decodeBase64Unicode(data))
  };
};
