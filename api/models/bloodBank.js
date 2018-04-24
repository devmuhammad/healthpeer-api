var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

let bloodBankSchema = new Schema({
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  bloodGroup: { type: String, required: true, enum: ["A", "AB", "O+", "O-", "B", "B+"] },
  deliveryPoint: { type: String, required: true },
  state: { type: String, required: true },
  statusOfRequest: { type: String, required: true, enum: ["PENDING", "FULFILLED"], default: "PENDING" },
  contactPhoneNumber: { type: String, required: true },
  contactPerson: { type: String, required: false },
  patientName: { type: String, required: false }
}, { timestamps:true });

module.exports = mongoose.model("BloodGroup", bloodBankSchema)