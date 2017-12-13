'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TypeEvenement = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true, 
    unique: true
  },
  description: {
    type: String
  },
  color: {
    type: String
  },
  image: {
    type: String
  }
});


module.exports = mongoose.model('TypeEvenement', TypeEvenement);