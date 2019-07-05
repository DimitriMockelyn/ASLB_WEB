'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;


/**
 * DayOff Schema
 */
var DayOff = new Schema({
  reason: {
    type: String,
    trim: true,
    required: true
  },
  date: {
    type: Date
  }
});

mongoose.model('DayOff', DayOff);
