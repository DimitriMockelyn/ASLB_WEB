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
  createur: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },  
  animateur: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },
  typeEvenement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TypeEvenement',
    required: true
  },
  limite: {
    type: Number
  },
  description: {
    type: String
  }
});


module.exports = mongoose.model('Evenement', Evenement);