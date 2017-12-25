'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Queue = new Schema({
  ordre: {
    type: Number
  },
  personne: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  }
});


module.exports = mongoose.model('Queue', Queue);