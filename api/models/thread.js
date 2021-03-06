const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const ThreadMessage = require('./threadMessages')

let threadSchema = new Schema({
  threadOwner: { type: Schema.Types.ObjectId, required: true},
  messages: {type: [Schema.Types.ObjectId], index: true, ref: "ThreadMessage"},
  expired: { type: Boolean, required: true, default: false}
}, {timestamps: true})

module.exports = mongoose.model("Thread", threadSchema);