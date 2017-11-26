'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Entreprise = new Schema({
  code: {
    type: String,
    required: true, 
    unique: true
  },
  label: {
    type: String,
    required: true, 
    unique: true
  }
});


module.exports = mongoose.model('Entreprise', Entreprise);