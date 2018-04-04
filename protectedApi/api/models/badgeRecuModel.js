'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BadgeRecu = new Schema({
  badge: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Badge'
  },
  evenements: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Evenement'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  }
});


module.exports = mongoose.model('BadgeRecu', BadgeRecu);