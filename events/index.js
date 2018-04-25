const Thread          = require('../api/models').Thread
      , ThreadMessage = require('../api/models').ThreadMessage
      , User          = require('../api/models').user
      , redisCache    = require('redis').createClient()
      , jwt           = require('jsonwebtoken')
      , CONFIG        = require("../config").app

/**
 * Start a thread
 * @param {Body} request {message, threadOwner}
 * @param {WebSocket} socket 
 */
const createThread = function (request, socket) {
    
    let newThreadMessage = new ThreadMessage(request.Body.message)
    let newThread = new Thread()

    newThreadMessage.save(function(err, savedThreadMessage) {
      if(err) { socket.emit("post new", {"status":"error", "message": "could not post thread."})}
      newThread.threadOwner = request.body.threadOwner
      newThread.messages.push(savedThreadMessage)

      newThread.save(function(err, savedThread) {
        if(err) { socket.emit("post new", {"status":"error", "message": "could not post thread."})}
  
        socket.emit("post new", {
          "status": "success",
          "data": savedThread
        })
      })
    })
    
};

/**
 * Update an already existing thread
 * @param {Body} request {message, threadId}
 * @param {WebSocket} socket 
 */
const updateThread = function (request, socket) {

    let newThreadMessage = new ThreadMessage(req.body.message)

    newThreadMessage.save(function(err, savedThreadMessage) {
      if(err) { return socket.emit("thread updated", {"status": "error", "message": "Could not post message."}); }

      Thread.findByIdAndUpdate(
          request.body.threadId,
          {
            $push: { "messages": savedThreadMessage }
          },
          {new: true, lean: true}
      ).exec(function(err, updatedThread) {

          if(err) { return socket.emit("thread updated", {"status": "error", "message": "Could not post message."}); }
          
          socket.emit("thread updated", {
            "status":"success",
            "data": updatedThread
          })
      })

    })
    
};

/**
 * Delete an entire thread
 * @param {Body} request {token, threadId}
 * @param {WebSocket} socket 
 */
const deleteThread = function (request, socket) {

    jwt.verify(request.body.token, CONFIG.secret, function(err, decoded) {
        let threadOwner = decoded.id;

        Thread.findOne(
          {
            threadOwner: threadOwner,
            _id : request.body.threadId
          }
        ).exec(function(err, thread) {
          
          if(err) { return socket.emit("thread deleted", {"status": "error", "message": "Unable to delete thread."}) }
          if(!thread) 
          { return socket.emit("thread deleted", {
            "status": "error", 
            "message": "You don't have the permission to delete this thread."
            }) 
          }

          thread.expired = true;
          thread.save(function(err, expiredThread) {
            if(err) {return socket.emit("thread deleted", {"status": "error", "message": "Unable to delete thread."}) }
  
            socket.emit("thread deleted", {
              "status": "success", 
              "data": expiredThread._id
            })
          })
          
        })   
    })
};


/**
 * Edit a message in a particular thread
 * @param {Body} request {threadId, messageId, newMessage}
 * @param {WebSocket} socket 
 */
const editMessage = function (request, socket) {
    ThreadMessage.findOneAndUpdate(
        {
          "_id" : request.body.messageId
        },
        {
          message: request.body.newMessage
        },
        {new: true, lean: true}
    ).exec(function(err, editedMessage) {
        
        if(err) { return socket.emit("message edited", {"status": "error", "message": "Unable to edit message"}) }
        if(!editedMessage) 
        { return socket.emit("message edited", {
          "status": "error", 
          "message": "The message you are trying to delete has already been deleted."
          }) 
        }

        socket.emit("message edited", {
          "status": success,
          "threadId": request.body.threadId,
          "newMessage": editedMessage
        })
    })
};

/**
 * Fetch thread on user connected || on request
 * @param {WebSocket} Socket
 */
const _fetchExistingThreads = function (offset = 0, socket) {
    Thread.find({expired: false})
      .skip(offset).limit(10)
      .populate({"path": "messages", select: {"message": 1, "createdAt": 1}, options: { sort: {createdAt: -1}}})
      .sort({"updatedAt": -1})
      .exec(function(err, threads) {
        
        if(err) { return socket.emit("all threads", {"status":"error", "message": "Unable to fetch threads"}); }
        if(!threads) { return socket.emit("all threads", {"status":"error", "message": "No threads to display"}); }

        socket.emit("all threads", {
          "status": "success",
          "data": threads
        })

      })
};

module.exports = {
  createThread,
  updateThread,
  deleteThread,
  editMessage,
  _fetchExistingThreads
}
