'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var News = new Schema({
  titre: {
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createur: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },
  important: {
    type: Boolean,
    default: false
  },
  luPar: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  }]
});


module.exports = mongoose.model('News', News);