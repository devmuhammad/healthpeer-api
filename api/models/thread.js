const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const threadMessage = require('./threadMessages')

let threadSchema = new Schema({
  threadOwner: { type: Schema.Types.ObjectId, required: true},
  messages: {type: [threadMessage], index: true, ref: "ThreadMessage"},
  expired: { type: Boolean, required: true, default: false}
}, {timestamps: true})

module.exports = mongoose.model("Thread", threadSchema);