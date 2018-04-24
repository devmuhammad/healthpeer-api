var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

let sessionSchema = new Schema({
  name: {type: String, required: true},
  members: {
    patient: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    consultant: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"}
  },
  conversation: { type: Array, required: false },
  sessionComplete: { type: Boolean, required: true, default: false },
  sessionType: { 
    type: String, 
    required: true, 
    enum: [
      "General",
      "Therapy", 
      "Dietary", 
      "Psychology", 
      "Family planning", 
      "Pediatric", 
      "Dermatology", 
      "Gynaecology",
      "Obstetrics(Childbirth and midwifery)"
    ]
  }
}, {timestamps: true})

module.exports = mongoose.model("Session", sessionSchema)
