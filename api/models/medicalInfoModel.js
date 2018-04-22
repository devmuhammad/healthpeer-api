'use strict';
//Require Mongoose
var mongoose = require ('mongoose');
//Define a schema
var Schema = mongoose.Schema


var medicalInfoSchema = new Schema ({
        //_id:false,
        weight:{type:String, default:'60kg'},
        height:{type:String, default:'6ft2'},
        bloodGroup:{type:String,default:'O+'},
        genotype:{type:String,default:'AA'},
        consultationHistory:[{ type: Schema.Types.ObjectId, ref : 'consultHistory'}]
        
},{
  timestamps: true
});

// Compile model from schema
module.exports = mongoose.model('medicalInfo', medicalInfoSchema);