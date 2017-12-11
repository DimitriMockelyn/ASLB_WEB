'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NiveauEvenement = new Schema({
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


module.exports = mongoose.model('NiveauEvenement', NiveauEvenement);