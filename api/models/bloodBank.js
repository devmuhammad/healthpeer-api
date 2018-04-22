var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

let bloodBankSchema = new Schema({
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  
}, {timestamps:true});

module.exports = mongoose.model("Session", sessionSchema)