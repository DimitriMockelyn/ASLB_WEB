'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Partenaire = new Schema({
  name: {
    type: String,
    required: true
  },
  url:{
    type: String
  },
  logo: {
    type: String
  },
  description: {
    type: String
  },
  ordre: {
    type: Number
  }
});


module.exports = mongoose.model('Partenaire', Partenaire);