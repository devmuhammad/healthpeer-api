var mongoose = require ('mongoose');
var Schema = mongoose.Schema
var User = require('./userModel')

const Consultant = User.discriminator('Consultant', new mongoose.Schema({
    balance :{type:Number, default: 0},
    speciality:{type:String},
    folioNumber:{type:String},
    yofPractice:{type:String},
    currentJob:{type:String},
    availability: {type: Boolean, required: true, default: false},
    consultationType: { type: Array, required: false},
    totalSessions: { type: Number, required: true, default: 0},
    transactions: { type: [Schema.Types.ObjectId], ref:"consultantTransaction"}
  }),
);

module.exports = mongoose.model('Consultant')