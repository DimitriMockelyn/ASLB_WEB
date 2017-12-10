'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Presentation = new Schema({
  name: {
    type: String,
    required: true
  },
  image:{
    type: String
  },
  isBureau: {
    type: Boolean
  },
  description: {
    type: String
  },
  ordre: {
    type: Number
  }, 
  fonction: {
    type: String
  }
});


module.exports = mongoose.model('Presentation', Presentation);