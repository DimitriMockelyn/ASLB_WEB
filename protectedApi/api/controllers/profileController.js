'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User'),
  Evenement = mongoose.model('Evenement'),
  TokenUser = mongoose.model('TokenUser'),
  mailer = require('../utils/mailer'),
  json2csv = require('json2csv'),
  uuidv4 = require('uuid/v4'),
  fs =  require('fs'),
  moment = require('moment'),
  Sexe = mongoose.model('Sexe'),
  Profil = mongoose.model('Profil'),
  Queue = mongoose.model('Queue'),
  Commentaire = mongoose.model('Commentaire'), 
  evenementController = require('./evenementController'),
  Entreprise = mongoose.model('Entreprise');

  var {getConfig} = require('../../config');

  var formidable = require('formidable');

  var TOKEN_NB = 3;
  var GLISSEMENT_JOURS_STATS = 30;


exports.infos_generales = function(req, res) {
  User.findById(req.params.id, function(err,user) {
    
    if (err || !user) {
      return res.json({error: err});
    }
      let data = {};
      data['prenom'] = user['prenom'];
      data['nom'] = user['nom'];
      data['email'] = user['email'];
      data['dateNaissance'] = user['dateNaissance'];
      data['sexe'] = user['sexe'];
      data['entreprise'] = user['entreprise'];
      data['avatar'] = user['avatar'];
      data['date_creation'] = user['date_creation'];
      Evenement.find({$and: [
        {participants: user}, 
        { date_debut: {$lt: Date.now()}}]}, function(err, evenementsPasses) {
          data['evenementsPasses'] = evenementsPasses;
          Evenement.find({$and: [
            {participants: user}, 
            { date_debut: {$gt: Date.now()}}]}, function(err, evenementsFuturs) {
              data['evenementsFuturs'] = evenementsFuturs;
              return res.json(data);
            }).populate('typeEvenement','_id name color');
          
        }).populate('typeEvenement','_id name color');
      
  }).populate('sexe', '_id label')
  .populate('entreprise', '_id label');
}

exports.infos_profil = function(req, res) {
  User.findById(req.params.id, function(err,user) {
    
    if (err || !user) {
      return res.json({error: err});
    }
      let data = user;
      data['hash_password'] = undefined;
      return res.json(data);
  }).populate('profil', '_id description activitesVoulues raisonSport autreActivites records');
}