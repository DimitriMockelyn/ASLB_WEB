'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlocAdministrables = new Schema({
  titre: {
    type: String,
    required: true
  },
  ordre:{
    type: Number
  },
  type: {
    type: String
  },
  contenu: {
    type: String
  }
});


module.exports = mongoose.model('BlocAdministrables', BlocAdministrables);