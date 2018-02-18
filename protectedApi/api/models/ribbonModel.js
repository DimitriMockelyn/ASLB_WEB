'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Ribbon = new Schema({
  text: {
    type: String
  },
  color_ribbon:{
    type: String
  },
  color_ribbon_light: {
    type: String
  },
  color_ribbon_dark: {
    type: String
  },
  color_ribbon_darker: {
    type: String
  }
});


module.exports = mongoose.model('Ribbon', Ribbon);