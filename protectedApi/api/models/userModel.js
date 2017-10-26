'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var User = new Schema({
  prenom: {
    type: String,
    trim: true,
    required: true
  },
  nom: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  date_activation: {
    type: Date
  },
  date_creation: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  actif: {
    type: Boolean,
    default: false
  },
  canCreate: {
    type: Boolean,
    default: false
  }
});

User.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};


mongoose.model('User', User);
