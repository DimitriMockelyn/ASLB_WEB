'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User'),
  Evenement = mongoose.model('Evenement'),
  TokenUser = mongoose.model('TokenUser'),
  mailer = require('../utils/mailer'),
  uuidv4 = require('uuid/v4'),
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
      var token = new TokenUser({
        code: uuidv4(),
        isCreation: true,
        user: user
      });
      token.save(function(err, tokenSaved) {
          mailer.sendMail([user.email], 'Validation de votre compte ASLB', 'Bonjour. Vous avez demandé la création de votre compte ASLB. Pour le valider, veuillez cliquer sur ce lien: '+'http://localhost:8080/#activation/'+tokenSaved.code);
          return res.json(user);
      });
    }
  });
};

exports.sign_in = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password) || !user.actif) {
      return res.status(401).json({ message: 'Mauvais compte / mot de passe ou compte inactif' });
    }
    return res.json({ token: jwt.sign({ email: user.email, nom: user.nom, prenom: user.prenom, _id: user._id }, 'RESTFULAPIs', {expiresIn: 3600}) });
  });
};

exports.activate = function(req, res) {
  TokenUser.findOne({
    code: req.body.code
  }, function(err, token) {
    if (err  || !token || !token.isCreation) {
      return res.json({activated: false});
    }
    User.findById(token.user, function(err,user) {
      if (err || !user) {
        return res.json({activated: false});
      }
      if (user.actif) {
        return res.json({activated: false});
      } else {

        User.findByIdAndUpdate(token.user, {actif: true}, function(err, userActif) {
          if (err) {
            return res.json({activated: false});
          } else {
            return res.json({activated: true});
          }
        });
        token.remove(function(err, tokenDel) {});
      }
    });
  });
}

exports.sendMailReset = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      return res.status(401).json({ message: 'Ce compte n\'existe pas' });
    }
    var token = new TokenUser({
      code: uuidv4(),
      isCreation: false,
      user: user
    });
    token.save(function(err, tokenSaved) {
        mailer.sendMail([user.email], 'Réinitialisation de votre mot de passe ASLB', 
        'Bonjour. Vous avez demandé la réinitialisation de votre mot de passe ASLB. Pour valider ce changement, veuillez cliquer sur ce lien: '+'http://localhost:8080/#changePassword/'+tokenSaved.code);
        return res.json({ mailSent: true});
    });
  });
}

exports.changePassword = function(req, res) {
  TokenUser.findOne({
    code: req.body.code
  }, function(err, token) {
    if (err  || !token || token.isCreation) {
      return res.json({changed: false});
    }
    User.findById(token.user, function(err,user) {
      if (err || !user) {
        return res.json({changed: false});
      }
      if (!user.actif) {
        return res.json({changed: false});
      } else {
        User.findByIdAndUpdate(token.user, {hash_password : bcrypt.hashSync(req.body.password, 10)}, function(err, userActif) {
          if (err) {
            return res.json({changed: false});
          } else {
            return res.json({changed: true});
          }
        });
        token.remove(function(err, tokenDel) {});
      }
    });
  });
}

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