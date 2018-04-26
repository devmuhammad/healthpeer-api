var mongoose = require ('mongoose');
var Schema = mongoose.Schema
var User = require('./userModel')

const Patient = User.discriminator('Patient', new mongoose.Schema({
    availableSessionCount: { type: Number, required: true, default: 0 },
    payments: [{type: Schema.Types.ObjectId, ref:'paymentModel'}],
    medicalInfo:{type: Schema.Types.ObjectId, ref:'medicalInfo'},
  }),
);

module.exports = mongoose.model('Patient')