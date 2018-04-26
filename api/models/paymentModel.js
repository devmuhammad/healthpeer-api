'use strict';
var mongoose = require ('mongoose');
var Schema = mongoose.Schema

var userPaymentSchema = new Schema ({

    userId:{type:String},
    userName:{type:String},
    email:{type:String},
    phoneNumber:{type:String},
    quantity:{type:String},
    payStatus:{type:String},
    uniqueRef:{type:String},
    chargeMethod:{type:String},
    bankCode:{type:String},
    cardId:{type:String},
    accountNumber:{type:String},
    accountName:{type:String},
    amount:{type:String},
    amountCharged:{type:String},
    responseCode:{type:String},
    responseMsg:{type:String},
    medium:{type:String},
    ipAddress:{type:String}

},{
    timestamps: true
  });
  
  module.exports = mongoose.model('userPayment', userPaymentSchema)