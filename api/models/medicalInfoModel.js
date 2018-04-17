'use strict';
//Require Mongoose
var mongoose = require ('mongoose');
//Define a schema
var Schema = mongoose.Schema


var medicalInfoSchema = new Schema ({
    
        weight:{type:String},
        height:{type:String},
        bloodGroup:{type:String},
        genotype:{type:String},
        consultHistory:[{ type: Schema.Types.ObjectId, ref : 'consultHistory'}]
        
},{
  timestamps: true
});

// Compile model from schema
module.exports = mongoose.model('medicalInfo', medicalInfoSchema)