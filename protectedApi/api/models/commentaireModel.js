'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Commentaire = new Schema({
  commentaire: {
    type: String
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  note: {
    type: Number
  },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },  
  evenement: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Evenement'
  },
  prive: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model('Commentaire', Commentaire);