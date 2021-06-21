'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;


/**
 * DayOff Schema
 */
var ActivityTime = new Schema({
  heureDebut: {
    type: String,
    trim: true,
    required: true
  },
  heureFin: {
    type: String,
    trim: true,
    required: true
  },
  jour: {
    type: String
  },
  activitesTimeType:  [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Activity'
  }]
});

mongoose.model('ActivityTime', ActivityTime);
