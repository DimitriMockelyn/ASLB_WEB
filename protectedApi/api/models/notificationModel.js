'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notifications = new Schema({
  message: {
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  },
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lu: {
    type: Boolean,
    default: false
  },
  lien: {
    type: String
  }
});


module.exports = mongoose.model('Notifications', Notifications);