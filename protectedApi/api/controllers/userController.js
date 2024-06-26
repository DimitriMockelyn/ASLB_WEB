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
  CreneauActivity = mongoose.model('CreneauActivity'),
  evenementController = require('./evenementController'),
  Notifications=  mongoose.model('Notifications'),
  Entreprise = mongoose.model('Entreprise'),
  badgeController = require('./badgeController');

  var {getConfig} = require('../../config');

  var formidable = require('formidable');

  var GLISSEMENT_JOURS_STATS = 30;

exports.register = function(req, res) {
  var newUser = new User(req.body);
  newUser.nom = newUser.nom.toUpperCase();
  newUser.prenom = newUser.prenom.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: 'Le compte n\'a pas pu être crée ou existe déjà' });
    } else {
      user.hash_password = undefined;
      var token = new TokenUser({
        code: uuidv4(),
        isCreation: true,
        user: user
      });
      token.save(function(err, tokenSaved) {
          mailer.sendMail([user.email], 'Validation de votre compte ASLB', 'Bonjour. Vous avez demandé la création de votre compte ASLB. Pour le valider, veuillez cliquer sur ce lien: '+ getConfig().url+'/#activation/'+tokenSaved.code);
          return res.json(user);
      });
    }
  });
};

exports.registerFromAdmin = function(req, res) {
  var newUser = new User(req.body);
  newUser.nom = newUser.nom.toUpperCase();
  newUser.prenom = newUser.prenom.charAt(0).toUpperCase() + newUser.prenom.slice(1);
  newUser.hash_password = 'a';
  newUser.save(function(err, user) {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: 'Le compte n\'a pas pu être crée ou existe déjà' });
    } else {
      var token = new TokenUser({
        code: uuidv4(),
        isCreation: false,
        user: user
      });
      token.save(function(err, tokenSaved) {
          mailer.sendMail([user.email], 'Initialisation de votre mot de passe ASLB', 
          'Bonjour. Vous avez demandé l\'initialisation de votre mot de passe ASLB. Pour cela, veuillez cliquer sur ce lien: '+getConfig().url+'/#changePassword/'+tokenSaved.code);
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
    badgeController.initBadges(user);
    return res.json({ token: jwt.sign({ email: user.email, nom: user.nom, prenom: user.prenom, _id: user._id, isAdmin: user.isAdmin, profilComplet: user.avatar && user.profil && user.profil._id }, 'RESTFULAPIs', {expiresIn: 3600*12}) });

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
            token.remove(function(err, tokenDel) {});
            return res.json({activated: true});
          }
        });
        
      }
    });
  });
}

exports.sendMailFirst = function(req, res) {
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
        mailer.sendMail([user.email], 'Initialisation de votre mot de passe ASLB', 
        'Bonjour. Vous avez demandé l\'initialisation de votre mot de passe ASLB. Pour cela, veuillez cliquer sur ce lien: '+getConfig().url+'/#changePassword/'+tokenSaved.code);
        return res.json({ mailSent: true});
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
        'Bonjour. Vous avez demandé la réinitialisation de votre mot de passe ASLB. Pour valider ce changement, veuillez cliquer sur ce lien: '+getConfig().url+'/#changePassword/'+tokenSaved.code);
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
      
      User.findByIdAndUpdate(token.user, {hash_password : bcrypt.hashSync(req.body.password, 10), actif: true}, function(err, userActif) {
        if (err) {
          return res.json({changed: false});
        } else {
          return res.json({changed: true});
        }
      });
      token.remove(function(err, tokenDel) {});
      
    });
  });
}

exports.changePasswordConnecte = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err,user) {
    
    if (err || !user) {
      console.log(err, user)
      return res.json({changed: false});
    }
    if (!user.actif) {
      return res.json({changed: false});
    } else {
      
      User.findByIdAndUpdate(user._id, {hash_password : bcrypt.hashSync(req.body.password, 10)}, function(err, userActif) {
        if (err) {
          return res.json({changed: false});
        } else {
          return res.json({changed: true});
        }
      });
    }
  });
}

exports.me = function(req, res) {
  if (req.user) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
        let data = user;
        data['hash_password'] = undefined;
        User.findByIdAndUpdate(user._id, {premiereConnexion : false}, function(err, userActif) {
        });
        return res.json(data);
    });
  } else {
    return res.json({});
  }
};

exports.update_mes_informations = function(req, res) {
  if (req.user) {
    User.findOneAndUpdate({
      email: req.user.email
    }, {email : req.body.email, nom: req.body.nom, prenom: req.body.prenom, sexe: req.body.sexe, entreprise: req.body.entreprise, dateNaissance: req.body.dateNaissance, telephone: req.body.telephone}, {new: true}, function(err, user) {
        if (err) {
          return res.status(401).json({ message: 'Une erreur est survenue lors de votre opération. Vérifiez que l\'adresse e-mail n\'est pas utilisée' })
        }
        let data = user;
        data['hash_password'] = undefined;
        return res.json(data);
    });
  } else {
    return res.json({});
  }
};

exports.get_mes_informations = function(req, res) {
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

exports.userExists = function(req, res, next) {
  if (req.params.id) {
    User.findById(req.params.id, function(err, user) {
      if (err) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
        return next();
    })
  } else {
    return res.status(401).json({ message: 'Aucun utilisateur n\'est demandé' });
  }
}

exports.userIsMe = function(req, res, next) {
  if (req.params.id) {
    User.findById(req.params.id, function(err, user) {
      if (err || !req.user || req.user.email !== user.email) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
        return next();
    })
  } else {
    return res.status(401).json({ message: 'Aucun utilisateur n\'est demandé' });
  }
}

exports.isMembreActif = function(req, res, next) {
  if (req.user) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
      if (err) {
        throw err;
      }
      if (isMembreActif(user)) {
        return next();
      } else {
        return res.status(401).json({ message: 'Il faut être connecté avec un compte actif pour réaliser cette action' });
      }
    })
  } else {
    return res.status(401).json({ message: 'Il faut être connecté pour réaliser cette action' });
  }
};

exports.isAdmin = function(req, res, next) {
  if (req.user) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
      if (err) {
        throw err;
      }
      if (user.isAdmin) {
        return next();
      } else {
        return res.status(401).json({ message: 'Il faut être connecté avec un compte administrateur pour réaliser cette action' });
      }
    })
  } else {
    return res.status(401).json({ message: 'Il faut être connecté pour réaliser cette action' });
  }
};

exports.isCreneauActivityFutur = function(req, res, next) {
  if (req.user && req.params.creneauId) {
  }
  if (req.params.creneauId) {
    CreneauActivity.findById(req.params.creneauId, function(err, evenement) {
      if (err) {
        return res.status(401).json({ message: 'Activité non trouvé' });
      }
      if (evenement.dateDebut.getTime() > Date.now()) {
        return next();
      } else {
      return res.status(401).json({ message: 'Vous ne pouvez pas faire cette action sur une activité passée' });
      }
    }).populate('createur');
  } else {
    return res.status(401).json({ message: 'L\'activité n\'existe pas' });
  }
}

exports.isEvenementOwner = function(req, res, next) {
  if (req.user && req.params.evenementId) {
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        return res.status(401).json({ message: 'Evenement non trouvé' });
      }
      console.log(req.user);
      if (req.user.isAdmin || evenement.createur._id.toString() === req.user._id.toString() || evenement.animateur._id.toString() === req.user._id.toString()) {
        return next();
      } else {
        if (evenement.coanimateurs) {
          var isCoanim = false;
          evenement.coanimateurs.map(anim => {
            if (anim._id.toString() === req.user._id.toString()) {
              isCoanim = true;
            }
          })
          if (isCoanim) {
            return next();
          }
        }
      return res.status(401).json({ message: 'Vous n\'êtes pas le propriétaire de cet évenement' });
      }
    }).populate('createur').populate('animateur').populate('coanimateurs');
  } else {
    return res.status(401).json({ message: 'Vous n\'êtes pas le propriétaire de cet évenement' });
  }
};

exports.isEvenementFutur = function(req, res, next) {
  if (req.params.evenementId) {
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        return res.status(401).json({ message: 'Evenement non trouvé' });
      }
      if (evenement.date_debut.getTime() > Date.now()) {
        return next();
      } else {
      return res.status(401).json({ message: 'Vous ne pouvez pas faire cette action sur un événement passé' });
      }
    }).populate('createur');
  } else {
    return res.status(401).json({ message: 'L\'évenement n\'existe pas' });
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
      if (user.canCreate) {
        return next();
      } else {
        return res.status(401).json({ message: 'Vous ne pouvez pas créer de cours' });
      }
    })
  } else {
    return res.status(401).json({ message: 'Il faut être connecté pour réaliser cette action' });
  }
};

exports.load_tokens = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (user.isAdmin) {
      return res.json({count:'∞'});
    } else {
      Queue.find({personne: user}, function(err, queues) {
        Evenement.find({$and: [{
          date_debut: {
              $gte: Date.now(),
          }},{
            $or:[{
              participants: user
            },
            {
              fileAttente: {
                $in: queues
              }
            }]
          }
        ]}, function(err, eventsIn) {
            
            if (err) {
              throw err;
            }
            let events = [];
            eventsIn.map(evt => {
              if ((evt.typeEvenement && evt.typeEvenement.code !== 'ASLB' ) && evt.tokenConsumer) {
                events.push(evt);
              }
            })
            let countInscrit = 0;
            let countAttente = 0;
            events.map(evt => {
              let found = false;
              evt.participants.map(ptc => {
                if (ptc.toString() === user._id.toString()) {
                  found = true;
                }
              });
              found ? countInscrit++ : countAttente++;
            });
            return res.json({count:user.tokens - events.length, countAttente, countInscrit});
        }).populate('typeEvenement', '_id code')
      })
    }
    })
}

exports.inscriptionTokenPossible = function(req, res, next) {
  if (req.user) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
      //On vérifie si l;evenement est de typ ASLB
      if (req.params.evenementId) {
        Evenement.findById(req.params.evenementId, function(err, evenement) {
          if (err) {
            return res.status(401).json({ message: 'Evenement non trouvé' });
          }
          if (evenement.typeEvenement && evenement.typeEvenement.code === 'ASLB' || !evenement.tokenConsumer) {
            return next();
          } else {
          Queue.find({personne: user}, function(err, queues) {
            Evenement.find({$and: [{
              date_debut: {
                  $gte: Date.now(),
              }},{
                $or:[{
                  participants: user
                },
                {
                  fileAttente: {
                    $in: queues
                  }
                }]
              }
            ]}, function(err, eventsIn) {
                  let events = [];
                  eventsIn.map(evt => {
                    if ((evt.typeEvenement && evt.typeEvenement.code !== 'ASLB') && evt.tokenConsumer) {
                      events.push(evt);
                    }
                  })
                  if (err) {
                    throw err;
                  }
                  if (events.length < user.tokens || user.isAdmin) {
                    return next();
                  } else {
                    return res.status(401).json({ message: 'Vous ne pouvez pas vous inscrire a plus de '+user.tokens.toString()+' cours à la fois' });
                  }
              }).populate('typeEvenement', '_id code').populate('fileAttente', '_id personne');
            })
          }
        }).populate('typeEvenement', '_id code')
      } else {
        return res.status(401).json({ message: 'L\'évenement n\'existe pas' });
      }
    })
      
  } else {
    return res.status(401).json({ message: 'Il faut être connecté pour réaliser cette action' });
  }
};

exports.load_users = function(req, res) {
  var filter = new RegExp(req.body.filter, 'i');
  Entreprise.find({label: filter}, function(err, entreprises) {
    User.find({ $and: [{'actif': req.body.actif},{$or: [{'nom': filter}, {'email': filter}, {'prenom':filter}, { "entreprise" : {
      $in: entreprises
    }}, {'numero': filter}]}]}, function(err, users_db) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      fill_user_data(users_db, false,  (users_res) => {
        return res.json(users_res);
      })
    }).select("-avatar").populate('sexe', '_id label').populate('entreprise', '_id label').sort('numero').skip(req.body.skip || 0).limit(req.body.limit || 99999);
  })
}

exports.load_users_count = function(req, res) {
  var filter = new RegExp(req.body.filter, 'i');
  Entreprise.find({label: filter}, function(err, entreprises) {
    User.find({  $or: [{'nom': filter}, {'email': filter}, {'prenom':filter}, { "entreprise" : {
      $in: entreprises
    }}, {'numero': filter}]}, function(err, users_db) {
      
      if (err) {
        console.log(err);
        res.send(err);
      }
      fill_user_data(users_db, false,  (users_res) => {
        return res.json({total: users_res.length});
      })
    }).select("-avatar").populate('sexe', '_id label').populate('entreprise', '_id label').sort('numero').skip(req.body.skip || 0).limit(req.body.limit || 99999);
  })
}

exports.load_users_actif = function(req, res) {
  var filter = new RegExp(req.body.filter, 'i');
  Entreprise.find({label: filter}, function(err, entreprises) {
    User.find(
      { $and: [ {'actif': true},
      { $or: [{'nom': filter}, {'email': filter}, {'prenom':filter}, { "entreprise" : {
      $in: entreprises
    }}, {'numero': filter}]}
  ]}
    
    , function(err, users_db) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      fill_user_data(users_db, false,  (users_res) => {
        return res.json(users_res);
      })
    }).select("-avatar").populate('sexe', '_id label').populate('entreprise', '_id label').sort('numero');
  })
}

exports.export_users = function(req, res) {
  var filter = new RegExp(req.body.filter, 'i');
  User.find({ $and: [{'actif': req.body.actif},{ $or: [{'nom': filter}, {'email': filter}, {'prenom':filter}]}]}, function(err, users_db) {
    if (err) {
      res.send(err);
    }
    fill_user_data(users_db, true, users => {      
      var fields = ['nom', 'prenom', 'email','numero','sexe.label', 'entreprise.label', 'dateNaissance', 'telephone',
      'date_activation', 'date_renouvellement', 'date_fin', 'dossier_complet', 'adhesion', 'decharge', 'reglement', 'certificat', 'date_emission_certificat', 'date_expiration_certificat',  'cotisation', 'nombreInscription',
       'noteMoyenneDonnee', 'noteMoyenneRecue' , 'nombreAbsences', 'nombreCoach', 'doNotDelete']
      var fieldNames  = ['person.nom', 'person.prenom', 'person.email','Numéro d\'adhérent','sexe.label', 'entreprise.label','person.dateNaissance', 'person.telephone', 'person.date_activation', 'person.date_renouvellement', 'person.date_fin', 'person.dossier_complet',
      'Adhésion', 'Décharge', 'Règlement', 'Certificat', 'person.date_emission_certificat', 'person.date_expiration_certificat', 'Côtisation', 
      'Nombre d\'inscriptions dans les '+GLISSEMENT_JOURS_STATS+' derniers jours', 'Note moyenne donnée sur '+GLISSEMENT_JOURS_STATS+' jours', 
      'Note moyenne recue sur '+GLISSEMENT_JOURS_STATS+' jours', 'Nombre d\'absences sur '+GLISSEMENT_JOURS_STATS+' jours', 'Nombre d\'activités données sur '+GLISSEMENT_JOURS_STATS+' jours', 'Ne pas supprimer']
      json2csv({ data: users, fields: fields, fieldNames:fieldNames, quotes:'', del: ';' }, function(err, csv) {
        res.setHeader('Content-disposition', 'attachment; filename=data.csv');
        res.set('Content-Type', 'text/csv');
        return res.status(200).send(csv);
      });
    })
  }).populate('sexe', '_id label').populate('entreprise', '_id label');
}

function fill_user_data(users_db, formatDate, cb) {
  var users = [];
  for (let index in users_db) {
    users.push({});
    users[index]['_id']  = users_db[index]['_id'];
    users[index]['nom'] = users_db[index]['nom'];
    users[index]['prenom'] = users_db[index]['prenom'];
    users[index]['email'] = users_db[index]['email'];
    users[index]['numero'] = users_db[index]['numero'];
    users[index]['sexe'] = users_db[index]['sexe'];
    users[index]['entreprise'] = users_db[index]['entreprise'];
    users[index]['dossier_complet'] = users_db[index].dossier_complet ? 'Oui' : 'Non';
    users[index]['adhesion'] = users_db[index].adhesion ? 'Oui' : 'Non';
    users[index]['decharge'] = users_db[index].decharge ? 'Oui' : 'Non';
    users[index]['reglement'] = users_db[index].reglement ? 'Oui' : 'Non';
    users[index]['certificat'] = users_db[index].certificat ? 'Oui' : 'Non';
    users[index]['cotisation'] = users_db[index].cotisation ? 'Oui' : 'Non';
    users[index]['date_activation'] = formatDate ? (users_db[index]['date_activation'] ? moment(users_db[index]['date_activation'], moment.ISO_8601).format('DD/MM/YYYY') : '') : users_db[index]['date_activation'];
    users[index]['date_expiration_certificat'] = formatDate ? (users_db[index]['date_expiration_certificat'] ? moment(users_db[index]['date_expiration_certificat'], moment.ISO_8601).format('DD/MM/YYYY') : '') : users_db[index]['date_expiration_certificat'];
    users[index]['date_emission_certificat'] = formatDate ? (users_db[index]['date_emission_certificat'] ? moment(users_db[index]['date_emission_certificat'], moment.ISO_8601).format('DD/MM/YYYY') : '') : users_db[index]['date_emission_certificat'];
    users[index]['date_renouvellement'] = formatDate ? (users_db[index]['date_renouvellement'] ? moment(users_db[index]['date_renouvellement'], moment.ISO_8601).format('DD/MM/YYYY') : '') : users_db[index]['date_renouvellement'];
    users[index]['date_fin'] = formatDate ? ( users_db[index]['date_fin'] ? moment(users_db[index]['date_fin'], moment.ISO_8601).format('DD/MM/YYYY') : '')  : users_db[index]['date_fin'];
    users[index]['nombreInscription'] = 0;
    users[index]['nombreNotesDonnee'] = 0;
    users[index]['noteMoyenneDonnee'] = 0.0;
    users[index]['nombreNotesRecue'] = 0;
    users[index]['noteMoyenneRecue'] = 0.0;
    users[index]['nombreAbsences'] = 0;
    users[index]['nombreCoach'] = 0;
    users[index]['dateNaissance'] = formatDate ? ( users_db[index]['dateNaissance'] ? moment(users_db[index]['dateNaissance'], moment.ISO_8601).format('DD/MM/YYYY') : '')  :  users_db[index]['dateNaissance'];
    users[index]['telephone'] = users_db[index]['telephone'];
    users[index]['isAdmin'] = users_db[index]['isAdmin'];
    users[index]['canCreate'] = users_db[index]['canCreate'];
    users[index]['actif'] = users_db[index]['actif'];
    users[index]['tokens'] = users_db[index]['tokens'];
    users[index]['doNotDelete'] = users_db[index].doNotDelete ? 'Oui' : 'Non';
  }
  var minDate = new Date(Date.now());
  minDate.setDate(minDate.getDate() - GLISSEMENT_JOURS_STATS);
  return Evenement.find({$and: [{
    date_debut: {
        $lte: Date.now(),
    }}, {
      date_debut: {
        $gte: minDate
      }
    }]}, function(err, events) {
        events.map(event => {
          event.participants.map(idParticipant => {
            users.map(user => {
              if (idParticipant.toString() === user._id.toString()) {
                user.nombreInscription += 1;
              }
            })
          })
          event.absents.map(idAbsent => {
            users.map(user => {
              if (idAbsent.toString() === user._id.toString()) {
                user.nombreAbsences += 1;
              }
            })
          })
          users.map(user => {
            if (event.animateur && event.animateur.toString() === user._id.toString()) {
              user.nombreCoach += 1;
            }
            if (event.coanimateurs && event.coanimateurs.length > 0) {
              event.coanimateurs.map(anim => {
                if (anim.toString() === user._id.toString()) {
                  user.nombreCoach += 1;
                }
              })
            }
          })
        });
        Commentaire.find({
          evenement: events
        }, function(err, comms) {
          if (err) {
            throw err;
          }
          comms.map(comm => {
            users.map(user => {
              if (comm.auteur.toString() === user._id.toString()) {
                user.nombreNotesDonnee +=1;
                user.noteMoyenneDonnee += comm.note;
              }
              if (comm.evenement.animateur.toString() === user._id.toString()) {
                user.nombreNotesRecue +=1;
                user.noteMoyenneRecue += comm.note;
              }
              if (comm.evenement.coanimateurs && comm.evenement.coanimateurs.length > 0) {
                comm.evenement.coanimateurs.map(anim => {
                  if (anim.toString() === user._id.toString()) {
                    user.nombreNotesRecue +=1;
                    user.noteMoyenneRecue += comm.note;
                  }
                })
              }
            })
          })
          users.map(user => {
            if (user.nombreNotesDonnee !== 0) {
              user.noteMoyenneDonnee =  user.noteMoyenneDonnee/user.nombreNotesDonnee;
            }
            if (user.nombreNotesRecue !== 0) {
              user.noteMoyenneRecue =  user.noteMoyenneRecue/user.nombreNotesRecue;
            }
          })
          cb(users);
        }).populate('evenement', '_id animateur coanimateurs');
    });
}

exports.load_users_group = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.send(err);
    }
    let result = {admins: [], createurCours: [], tous: []};
    for (let index in users) {
      let user = users[index];
      if (isMembreActif(user)) {
        result.tous.push(user.email);
        if (user.isAdmin) {
          result.admins.push(user.email);
        }
        if (user.canCreate) {
          result.createurCours.push(user.email)
        }
      }
    }
    return res.json(result);
  });
}

exports.load_users_autocomplete = function(req, res) {
  var filter = new RegExp(req.body.data.criteria, 'i');
  User.find({ $or: [{'nom': filter}, {'email': filter}, {'prenom':filter}]}, function(err, users) {
    if (err) {
      res.send(err);
    }
    var result = [];
    for (let index in users) {
      result.push({key: users[index]._id, label: users[index].nom + ' ' + users[index].prenom});
    }
    return res.json({data:result, totalCount: users.length});
  });
}

exports.load_active_users_autocomplete = function(req, res) {
  var filter = new RegExp(req.body.data.criteria, 'i');
  User.find({ $or: [{'nom': filter}, {'email': filter}, {'prenom':filter}]}, function(err, users) {
    if (err) {
      res.send(err);
    }
    var result = [];
    for (let index in users) {
      if (users[index].actif) {
        result.push({key: users[index]._id, label: users[index].nom + ' ' + users[index].prenom});
      }
    }
    return res.json({data:result, totalCount: users.length});
  });
}

exports.toggle_creation = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    }
    user.canCreate = !user.canCreate;
    user.save(function(err, user) {
      if (err) {
        console.log(err);
        return res.json({success: false});
      }
      return res.json({success: true});
    })    
  });
}

exports.toggle_admin = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    }
    user.isAdmin = !user.isAdmin;
    user.save(function(err, user) {
      if (err) {
        console.log(err);
        return res.json({success: false});
      }
      return res.json({success: true});
    })    
  });
}

exports.toggle_actif = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    }
    user.actif = !user.actif;
    if (!user.actif) {
      //Désinscription des activites
      Queue.find({personne: user}, function(err, queues) {
      Evenement.find({$and: [{
        date_debut: {
            $gte: Date.now(),
        }},{
          $or:[{
            participants: user
          },
          {
            fileAttente: {
              $in: queues
            }
          }]
        }
      ]}, function(err, events) {
          
          if (err) {
            throw err;
          }
          events.map(event => {
            evenementController.remove_one_from_evenement(req,res,user,event._id, evenement => {
              evenement.save(function(err, evenement) {
              });
            
          })
        });
        });
      });
      //Envoi du mail avec raison si précisée
      if (req.body.raison && req.body.raison.length > 0) {
      mailer.sendMail([user.email], 'Désactivation de votre compte ASLB', 
      'Bonjour. Votre compte ASLB à été désactivé par un admin. La raison énoncée est la suivante : "' + req.body.raison+'". Merci de prendre contact avec le bureau de l\'association si vous pensez que cette désactivation n\'est pas justifiée.');
      } else {
        mailer.sendMail([user.email], 'Désactivation de votre compte ASLB', 
        'Bonjour. Votre compte ASLB à été désactivé par un admin. Merci de prendre contact avec le bureau de l\'association si vous pensez que cette désactivation n\'est pas justifiée.');
  
      }

    }
    user.save(function(err, user) {
      if (err) {
        return res.json({success: false});
      }
      return res.json({success: true});
    })    
  });
}

exports.delete_mass = function(req, res) {
  User.deleteMany({doNotDelete: {$not: {$eq: true}} }, function(err, result) {
    if (err) {
      return res.json({updated: false});
    } else {
      return res.json({updated: true});
    }
  });
}

exports.update_date_activation = function(req, res) {
  User.findById(req.params.id, function(err, userInit) {
    if (err) {
      res.send(err);
    } 
    var oldDateRenouvellement = moment(new Date(userInit.date_renouvellement), moment.ISO_8601);
    User.findByIdAndUpdate(req.params.id, {
      date_activation : req.body.date_activation, 
      date_renouvellement : req.body.date_renouvellement, 
      date_expiration_certificat: req.body.date_expiration_certificat,
      date_emission_certificat: req.body.date_emission_certificat,
      date_fin: req.body.date_fin, 
      dossier_complet: req.body.dossier_complet,
      adhesion: req.body.adhesion,
      decharge: req.body.decharge,
      reglement: req.body.reglement,
      certificat: req.body.certificat,
      cotisation: req.body.cotisation,
      numero: req.body.numero,
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      telephone: req.body.telephone,
      dateNaissance: req.body.dateNaissance,
      tokens: req.body.tokens,
      actif: req.body.actif,
      doNotDelete: req.body.doNotDelete
    }, function(err, userActif) {
      if (err) {
        return res.json({updated: false});
      } else {
        var dateRenouvellement = moment(new Date(req.body.date_renouvellement), moment.ISO_8601);
        if (oldDateRenouvellement.isBefore(dateRenouvellement)) {
          mailer.sendMail([userActif.email], 'Validation de votre renouvellement d\'adhésion à ASLB', 'Bonjour. Votre renouvellement d\'adhésion à l\'aslb a bien été enregistré et nous vous en remercions ! A très bientôt, L\'équipe ASLB');
        }
        return res.json({updated: true});
      }
    });
    
  });
}

exports.changeAvatar = function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log('FILE', files);
    if (files.file.name.toLowerCase().endsWith('.jpg') ||
        files.file.name.toLowerCase().endsWith('.jpeg') ||
        files.file.name.toLowerCase().endsWith('.png')) {
      
      User.findOneAndUpdate({email: req.user.email}, {avatar : base64_encode(files.file.path)}, {new: true}, function(err, evenement) {
        if (err)
          res.send(err);
        res.json({updated: true});
      });
    } else {
      return res.status(401).json({ message: 'Seuls les formats JPG, JPEG, PNG sont acceptés' });
    }
  });
}

exports.list_all_sexes = function(req,res) {
  Sexe.find({}, function(err, types) {
    if (err) {
      res.send(err);
    }
    res.json(types);
  });
}

exports.list_all_entreprises = function(req,res) {
  Entreprise.find({}, function(err, types) {
    if (err) {
      res.send(err);
    }
    res.json(types);
  }).sort({code: 1});
}

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

function isMembreActif(user) {
  return  user.date_fin && user.date_activation && moment().isBefore(moment(user.date_fin)) && moment().isAfter(moment(user.date_activation)) && user.actif;
}

exports.load_profil = function(req, res) {
  if (req.user) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
        let data = user;
        data['hash_password'] = undefined;
        return res.json(data.profil);
    }).populate('profil', '_id description activitesVoulues raisonSport autreActivites records');
  } else {
    return res.json({});
  }
}

exports.edit_profil = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err,user) {
    
    if (err || !user) {
      console.log(err, user)
      return res.json({changed: false});
    }

    if (req.body._id && user.profil && user.profil.toString() === req.body._id.toString()) { //Le profil existe, on le mets a jour
      Profil.findOneAndUpdate({
        _id: req.body._id
      }, req.body, {new: true}, function(err, prf) {
          if (err) {
            console.log(err);
            return res.status(401).json({ message: 'Une erreur est survenue lors de votre opération.'})
          }
          let data = prf;
          return res.json(data);
      });
    } else if (!user.profil) {
      var prf = new Profil(req.body);
      prf.save(function(err, newPrf) {
        if (err) {
          console.log(err);
          return res.status(401).json({ message: 'Une erreur est survenue lors de votre opération.'})
        }
        user.profil = newPrf;
        user.save(function(err, usrSaved) {
          if (err) {
            console.log(err);
            return res.status(401).json({ message: 'Une erreur est survenue lors de votre opération.'})
          }
          return res.json(newPrf);
        })
      })
      // On le crée
    }
  })
}

exports.performDailyCheckActive = function() {
  /*console.log("DAILY CHECK");
  User.find({$and: [
    {actif: true},
    {
      $or:[{
        date_fin: {
            $lt: Date.now(),
        }
      }]
    }
  ]}, function(err, users_to_inactivate) {
    console.log(users_to_inactivate)
    if (users_to_inactivate.length > 0) {
      let stringMail = 'Les comptes suivant ont été désactivés car leur date de fin d\'adhésion est passeée ou leur certificat medical arrive a expiration : \n'; 
      for (let index in users_to_inactivate) {
        users_to_inactivate[index].actif = false;
        users_to_inactivate[index].save(function(err, user) {});
        stringMail = stringMail + " - " + users_to_inactivate[index].prenom + ' '+ users_to_inactivate[index].nom+'\n'
      }
      User.find({isAdmin: true}, function(err, admins) {
        let adminsEmails = [];
        for (let i in admins) {
          adminsEmails.push(admins[i].email);
        }
        console.log("SEND MAIL TO")
        console.log(adminsEmails);
        console.log(stringMail);
        mailer.sendMail(adminsEmails, '[ASLB] Desactivation automatique',stringMail);
      })
    }
  }) 
  var yesterday = Date.now() - 1000*60*60*24;
  console.log(yesterday);
  User.find({$and: [
    {actif: true},
    {
      date_expiration_certificat: {
        $lt: Date.now()
      }
    },
    {
      date_expiration_certificat: {
        $gt: yesterday
      }
    }
  ]}, function(err, users_to_warn) {
    console.log(users_to_warn)
    if (users_to_warn.length > 0) {
      let stringMail = 'Les comptes suivant ont été désactivés car leur date de fin d\'adhésion est passeée ou leur certificat medical arrive a expiration : \n'; 
      for (let index in users_to_warn) {
        let notif = new Notifications();
        notif.destinataire = users_to_warn[index];
        notif.message = 'Votre certificat medical a expiré, pensez a le renouveler pour renouveler votre inscription';

        notif.save(function(err, not) {
        })
      }
    }
  })*/
}