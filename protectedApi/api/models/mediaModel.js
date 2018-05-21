'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Media = new Schema({
  name: {
    type: String,
    required: true
  },
  url:{
    type: String
  },
  logo: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Number,
    default: Date.now
  }
});


module.exports = mongoose.model('Media', Media);