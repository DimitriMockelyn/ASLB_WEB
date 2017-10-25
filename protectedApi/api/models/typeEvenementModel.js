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
  }
});


module.exports = mongoose.model('TypeEvenement', TypeEvenement);