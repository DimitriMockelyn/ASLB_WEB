'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CreneauMachine = new Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Machine'
  },
  membre: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  },
  dateDebut: {
    type: Date,
    required: true
  }
});


module.exports = mongoose.model('CreneauMachine', CreneauMachine);