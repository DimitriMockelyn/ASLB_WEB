'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Machine = new Schema({
  nom: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Machine', Machine);