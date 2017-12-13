'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({
  message: {
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


module.exports = mongoose.model('Message', Message);