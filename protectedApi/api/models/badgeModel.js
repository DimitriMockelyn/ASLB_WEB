'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Badge = new Schema({
    titre: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    requestCheck: {
      type: String
    }
});


module.exports = mongoose.model('Badge', Badge);