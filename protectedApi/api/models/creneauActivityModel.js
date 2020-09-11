'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CreneauActivity = new Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Activity'
  },
  createur: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },
  dateDebut: {
    type: Date,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  }],
  limite: {
    type: Number
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  locked: {
    type: Boolean
  }
});


module.exports = mongoose.model('CreneauActivity', CreneauActivity);