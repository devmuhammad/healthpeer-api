'use strict';
var mongoose = require ('mongoose');
var Schema = mongoose.Schema


var consultantInfoSchema = new Schema ({
       
    email:{type: String, required: true, max: 100},
    userName:{type: String, required: true, max: 100},
    firstName:{type: String,  max: 100},
    lastName:{type: String,  max: 100},
    password:{type: String, required: true, max: 100},
    dofBirth:{type: Date},
    gender:{type:String},
    phoneNumber:{type:String},
    speciality:{type:String},
    folioNumber:{type:String},
    yofPractice:{type:String},
    currentJob:{type:String},
    passwordResetKey:{
      passHash:{type:String},
      token:{type:String}
    },
        
    
},{
  timestamps: true
});

module.exports = mongoose.model('consultantInfo', consultantInfoSchema)