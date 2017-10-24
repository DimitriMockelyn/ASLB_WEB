'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User'),
  Evenement = mongoose.model('Evenement'),
  moment = require('moment');


exports.register = function(req, res) {
  var newUser = new User(req.body);
  newUser.nom = newUser.nom.toUpperCase();
  newUser.prenom = newUser.prenom.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(401).json({ message: 'Le compte n\'a pas pu être crée ou existe déjà' });
    } else {
      user.hash_password = undefined;
      return res.json(user);
    }
  });
};

exports.sign_in = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Mauvais compte / mot de passe' });
    }
    return res.json({ token: jwt.sign({ email: user.email, nom: user.nom, prenom: user.prenom, _id: user._id }, 'RESTFULAPIs', {expiresIn: 3600}) });
  });
};

exports.me = function(req, res) {
  if (req.user) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
        let data = user;
        data['hash_password'] = undefined;
        return res.json(data);
    });
  } else {
    return res.json({});
  }
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Il faut être connecté pour réaliser cette action' });
  }
};

exports.isMembreActif = function(req, res, next) {
  if (req.user) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
      if (err) {
        throw err;
      }
      if (user.date_activation && moment().subtract(1, 'years').isBefore(moment(user.date_activation))) {
        return next();
      } else {
        return res.status(401).json({ message: 'Il faut être connecté avec un compte actif pour réaliser cette action' });
      }
    })
  } else {
    return res.status(401).json({ message: 'Il faut être connecté pour réaliser cette action' });
  }
};

exports.isEvenementOwner = function(req, res, next) {
  if (req.user && req.params.evenementId) {
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        return res.status(401).json({ message: 'Evenement non trouvé' });
      }
      if (evenement.createur._id.toString() === req.user._id.toString()) {
        return next();
      } else {
      return res.status(401).json({ message: 'Vous n\'êtes pas le propriétaire de cet évenement' });
      }
    }).populate('createur');
  } else {
    return res.status(401).json({ message: 'Vous n\'êtes pas le propriétaire de cet évenement' });
  }
};

exports.canMembreCreerCours = function(req, res, next) {
  if (req.user) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
      if (err) {
        throw err;
      }
      if (user.canCreate || user.email === 'dimitri.mockelyn@gmail.com') { //TODO remove second condition
        return next();
      } else {
        return res.status(401).json({ message: 'Vous ne pouvez pas créer de cours' });
      }
    })
  } else {
    return res.status(401).json({ message: 'Il faut être connecté pour réaliser cette action' });
  }
};