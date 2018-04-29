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
  BlocAdministrables = mongoose.model('BlocAdministrables'),
  Message = mongoose.model('Message');

  var {getConfig} = require('../../config');

  var formidable = require('formidable');

exports.load_chat = function(req, res) {
    Message.find({}, function(err, messages) {
        res.json(messages);
      }).populate('auteur', '_id prenom nom').sort({date: -1}).limit(50);
}

exports.add_message = function(req, res) {
    User.findOne({
        email: req.user.email
      }, function(err, user) {
        if (err) {
          res.send(err);
        }
        var msg = new Message();
        msg.auteur = user;
        msg.message = req.body.message;
        msg.save(function(err, result) {
            if (err) {
              res.send(err);
            }
            res.json(result);
        })
    })
}

exports.blocsByType = function(req, res) {
  BlocAdministrables.find({
      type: req.params.type
    }, function(err, blocs) {
      if (err) {
        res.send(err);
      }
      res.json(blocs);
  }).sort({ordre: 1});
}

exports.loadAllBlocs = function(req, res) {
  BlocAdministrables.find({}, function(err, blocs) {
      if (err) {
        res.send(err);
      }
      res.json(blocs);
  }).sort({ordre: 1});
}

exports.editBloc = function(req, res) {
  var data = {
    titre: req.body.titre,
    type: req.body.type,
    contenu: req.body.contenu,
    ordre: req.body.ordre
  }
  BlocAdministrables.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
}