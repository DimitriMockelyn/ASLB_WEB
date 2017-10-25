'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenUser = new Schema({
  code: {
    type: String,
    required: true, 
    unique: true
  },
  isCreation: {
    type: Boolean
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },
});


module.exports = mongoose.model('TokenUser', TokenUser);