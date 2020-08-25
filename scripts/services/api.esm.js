import fetchInstance from './fetch.esm.js';

/**
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 * 
 * Service Module: Rest API
 *
 * Contains methods for doing request calls to the server.
 * 
 * It has the following methods:
 * - signing in (and retrieving token)
 * - register a new user
 * - get user context (user details, subscribed channels etc)
 * - get all channels
 * - get messages by pagi nation (for a specific channel)
 * - get user details
 * - update user detaails
 * - create a new channel
 */

/**
 * Sign in using user credentials.
 * @param email Email of user
 * @param password Password of user
 * @returns json webtoken (jwt)
 */
export const signIn = async (email, password) => {
  const restUrl = window.app.restUrl;
  const response = await fetchInstance.post(`${restUrl}/user/signin`, JSON.stringify({
    email, password
  }));
  return response.text();
};

/**
 * Creates a new user.
 * @param forename Forename of new user
 * @param surname Surname of new user
 * @param email Email of new user
 * @param password Password of new user
 * @returns user id
 */
export const register = async (forename, surname, email, password) => {
  const restUrl = window.app.restUrl;
  const response = await fetchInstance.post(`${restUrl}/user`, JSON.stringify({
    forename, surname, email, password
  }));
  return response.json();
};

/**
 * Get user context which contains data related to the signed in user such
 * as the user details and subscribed channels.
 * @returns context with details of user and subscribed channels
 */
export const getContext = async () => {
  const restUrl = window.app.restUrl;
  const response = await fetchInstance.get(`${restUrl}/user/context`, true);
  return response.json();
};

/**
 * Get all existing channels.
 * @returns a list of channel details
 */
export const getChannels = async () => {
  const restUrl = window.app.restUrl;
  const response = await fetchInstance.get(`${restUrl}/channels`, true);
  return response.json();
};

/**
 * Get all or partial messages in a channel using pagination.
 * @param channelId Id of channel
 * @param from Pagination index (from)
 * @param limit Pagination limit (to)
 * @returns a list of messages and whether the pagination has reached the end
 */
export const getMessages = async (channelId, from, limit) => {
  let queryParameters = '';
  if (from) {
    queryParameters += `?from=${from}`;
  }
  if (limit) {
    queryParameters += (queryParameters ? '&' : '?') + `limit=${limit}`;
  }

  const restUrl = window.app.restUrl;
  const url = `${restUrl}/channels/${channelId}${queryParameters}`;
  const response = await fetchInstance.get(url, true);
  return response.json();
};

/**
 * Get details for current logged in user.
 * @param {string} id ID of the user
 * @returns user details
 */
export const getUser = async (id) => {
  const restUrl = window.app.restUrl;
  const url = `${restUrl}/user/${id}`;
  const response = await fetchInstance.get(url, true);
  return response.json();
};

/**
 * Creates a new channel.
 * @param name Name of the channel
 * @param description Description of the channel
 * @returns details for new channel
 */
export const createChannel = async (name, description) => {
  const restUrl = window.app.restUrl;
  const url = `${restUrl}/channels`;
  const response = await fetchInstance.post(url, JSON.stringify({ name, description }), true);
  return response.json();
};
