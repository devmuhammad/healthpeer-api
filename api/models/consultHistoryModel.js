'use strict';
//Require Mongoose
var mongoose = require ('mongoose');
//Define a schema
var Schema = mongoose.Schema


var consultHistorySchema = new Schema ([
       
          {date:Date},
          {title:String},
          {diagnosis:String},
          {prescription:[
              {drugname:String},
              {dose:String}
          ]}
        
    
        ],{
  timestamps: true
});

// Compile model from schema
module.exports = mongoose.model('consultHistory', consultHistorySchema)