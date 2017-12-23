'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var Profil = new Schema({
  description: {
    type: String
  },
  activitesVoulues: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TypeEvenement'
  }],
  raisonSport: {
    type: String
  },
  autreActivites: {
    type: String
  },
  records: {
    type: String
  }
});



mongoose.model('Profil', Profil);
