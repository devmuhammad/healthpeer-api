'use strict';
//Require Mongoose
var mongoose = require ('mongoose');
//Define a schema
var Schema = mongoose.Schema


var UserSchema = new Schema ({
    email:{type: String, required: true, max: 100},
    userName:{type: String, required: true, max: 100},
    firstName:{type: String,  max: 100},
    lastName:{type: String,  max: 100},
    password:{type: String, required: true, max: 100},
    dofBirth:{type: Date},
    gender:{type:String},
    phoneNumber:{type:String},
    passwordResetKey:{
      passHash:{type:String},
      token:{type:String}
    },
    medicalInfo:{type: Schema.Types.ObjectId, ref:'medicalInfo'},
  },
{
  timestamps: true
});

// Compile model from schema
module.exports = mongoose.model('User', UserSchema)