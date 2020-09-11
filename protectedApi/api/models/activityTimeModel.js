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
  }
});

mongoose.model('ActivityTime', ActivityTime);
