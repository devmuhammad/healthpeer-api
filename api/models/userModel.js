
'use strict';
var mongoose = require ('mongoose');
var Schema = mongoose.Schema

var UserSchema = new Schema ({
    email:{type: String, required: true},
    userName:{type: String, required: true, max: 100},
    firstName:{type: String,  max: 100},
    lastName:{type: String,  max: 100},
    password:{type: String, required: true, max: 100},
    dofBirth:{type: Date},
    userImg:{ data: Buffer, contentType: String },
    balance:{type:Number},
    state:{type: String},
    gender:{type:String},
    medicalInfo:{
        bp:{type:String, default:'0/0'},
        weight:{type:String, default:'--'},
        height:{type:String, default:'--'},
        bloodGroup:{type:String,default:'O+'},
        genotype:{type:String,default:'AA'},
        consultationHistory:[{ type: Schema.Types.ObjectId, ref : 'consultHistory'}]
    },
    payments:{type: [Schema.Types.ObjectId], ref:'paymentModel'},
    phoneNumber:{type:String},
    passwordResetKey:{
      passHash:{type:String},
      token:{type:String}
    },
    bloodBank: { type: [Schema.Types.ObjectId], ref: "BloodBank", index:true },
    accountType: { type: String, required: true, enum: ["Patient", "Consultant"]},
  },
{
  discriminatorKey: 'accountType',
  collection: 'users', 
  timestamps: true,
});

var User = mongoose.model('User', UserSchema);

// Compile model from schema
module.exports = User;
