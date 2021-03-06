'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Activity = new Schema({
  nom: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  color: { 
    type: String
  },
});


module.exports = mongoose.model('Activity', Activity);