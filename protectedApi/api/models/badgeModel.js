'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Badge = new Schema({
    titre: {
      type: String,
      required: true
    },
    code: {
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
    },
    actif: {
      type: Boolean,
      default: true
    }
});


module.exports = mongoose.model('Badge', Badge);