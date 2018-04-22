'use strict';
var mongoose = require ('mongoose');
var Schema = mongoose.Schema

var consultantTransactionSchema = new Schema ({
    userId:{type:String},
    userName:{type:String},
    email:{type:String},
    phoneNumber:{type:String},
    uniqueRef:{type:String},
    bankCode:{type:String},
    accountNumber:{type:String},
    amountWithdrawn:{type:String},
    responseCode:{type:String},
    responseMsg:{type:String},
    
},{
    timestamps: true
  });
  
  module.exports = mongoose.model('consultantTransaction', consultantTransactionSchema)