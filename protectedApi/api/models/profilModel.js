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
  },
  ribbon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ribbon'
  },
  ribbonDisponible: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Ribbon'
  }]
});



mongoose.model('Profil', Profil);
