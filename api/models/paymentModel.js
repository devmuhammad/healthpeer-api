'use strict';
var mongoose = require ('mongoose');
var Schema = mongoose.Schema

var userPaymentSchema = new Schema ({

    userId:{type:String},
    username:{type:String},
    email:{type:String},
    phoneNumber:{type:String},
    uniqueRef:{type:String},
    bankCode:{type:String},
    accountNumber:{type:String},
    amountWithdrawn:{type:String},
    
},{
    timestamps: true
  });
  
  module.exports = mongoose.model('userPayment', userPaymentSchema)