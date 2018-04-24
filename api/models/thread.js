const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

let threadMessage = new Schema({
  message: {type: String, required: true}
}, {timestamps: true});

let threadSchema = new Schema({
  threadOwner: { type: Schema.Types.ObjectId, required: true},
  messages: {type: [threadMessage], index: true},
  expired: { type: Boolean, required: true, default: false}
}, {timestamps: true})

module.exports = mongoose.model("Thread", threadSchema);