const Thread = require('../api/models').Thread,
      redisCache = require('redis').createClient()

/**
 * Start a thread
 * @param {Body} request {message, userId}
 * @param {WebSocket} socket 
 */
const createThread = function (request, socket) {
  
};

/**
 * Update an already existing thread
 * @param {Body} request {message, threadId}
 * @param {WebSocket} socket 
 */
const updateThread = function (request, socket) {

};

/**
 * Delete an entire thread
 * @param {Body} request {token, threadId}
 * @param {WebSocket} socket 
 */
const deleteThread = function (request, socket) {

};


/**
 * Edit a message in a particular thread
 * @param {Body} request {threadId, messageId}
 * @param {WebSocket} socket 
 */
const editMessage = function (request, socket) {

};

/**
 * Fetch thread on user connected
 */
const _fetchExistingThreads = function () {

};

module.exports = {
  createThread,
  updateThread,
  deleteThread,
  editMessage,
  _fetchExistingThreads
}