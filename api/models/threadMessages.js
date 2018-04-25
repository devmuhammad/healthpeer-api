const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

let threadMessageSchema = new Schema({
  message: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("ThreadMessage", threadMessageSchema);