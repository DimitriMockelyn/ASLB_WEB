'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Evenement = new Schema({
  name: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  is_cours: {
    type: Boolean,
    default: false
  },
  tokenConsumer: {
    type: Boolean,
    default: true
  },
  date_debut: {
    type: Date,
    required: true
  },
  duree: {
    type: Number,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  }],
  absents: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  }],
  fileAttente: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Queue'
  }],
  createur: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },  
  animateur: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },
  coanimateurs: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  }],
  typeEvenement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TypeEvenement',
    required: true
  },
  niveau: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NiveauEvenement'
  },
  limite: {
    type: Number
  },
  description: {
    type: String
  }
});


module.exports = mongoose.model('Evenement', Evenement);