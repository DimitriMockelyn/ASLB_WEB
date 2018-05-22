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

exports.isEvenementOwner = function(req, res, next) {
  if (req.user && req.params.evenementId) {
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        return res.status(401).json({ message: 'Evenement non trouvé' });
      }
      if (evenement.createur._id.toString() === req.user._id.toString() || evenement.animateur._id.toString() === req.user._id.toString()) {
        return next();
      } else {
      return res.status(401).json({ message: 'Vous n\'êtes pas le propriétaire de cet évenement' });
      }
    }).populate('createur').populate('animateur');
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
              if (evt.typeEvenement && evt.typeEvenement.code !== 'ASLB') {
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
            return res.json({count:TOKEN_NB - events.length, countAttente, countInscrit});
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
          if (evenement.typeEvenement && evenement.typeEvenement.code === 'ASLB') {
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
                    if (evt.typeEvenement && evt.typeEvenement.code !== 'ASLB') {
                      events.push(evt);
                    }
                  })
                  if (err) {
                    throw err;
                  }
                  if (events.length < TOKEN_NB || user.isAdmin) {
                    return next();
                  } else {
                    return res.status(401).json({ message: 'Vous ne pouvez pas vous inscrire a plus de '+TOKEN_NB.toString()+' cours à la fois' });
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
  User.find({ $or: [{'nom': filter}, {'email': filter}, {'prenom':filter}]}, function(err, users_db) {
    if (err) {
      res.send(err);
    }
    fill_user_data(users_db, false,  (users_res) => {
      return res.json(users_res);
    })
  }).populate('sexe', '_id label').populate('entreprise', '_id label');
}

exports.export_users = function(req, res) {
  var filter = new RegExp(req.body.filter, 'i');
  User.find({ $or: [{'nom': filter}, {'email': filter}, {'prenom':filter}]}, function(err, users_db) {
    if (err) {
      res.send(err);
    }
    fill_user_data(users_db, true, users => {      
      var fields = ['nom', 'prenom', 'email','numero','sexe.label', 'entreprise.label', 'numeroTelephone',
      'date_activation', 'date_fin', 'dossier_complet', 'adhesion', 'decharge', 'reglement', 'certificat', 'cotisation', 'nombreInscription',
       'noteMoyenneDonnee', 'noteMoyenneRecue' , 'nombreAbsences', 'nombreCoach']
      var fieldNames  = ['person.nom', 'person.prenom', 'person.email','Numéro d\'adhérent','sexe.label', 'entreprise.label', 'person.telephone', 'person.date_activation', 'person.date_fin', 'person.dossier_complet',
      'Adhésion', 'Décharge', 'Règlement', 'Certificat', 'Côtisation', 
      'Nombre d\'inscriptions dans les '+GLISSEMENT_JOURS_STATS+' derniers jours', 'Note moyenne donnée sur '+GLISSEMENT_JOURS_STATS+' jours', 
      'Note moyenne recue sur '+GLISSEMENT_JOURS_STATS+' jours', 'Nombre d\'absences sur '+GLISSEMENT_JOURS_STATS+' jours', 'Nombre d\'activités données sur '+GLISSEMENT_JOURS_STATS+' jours']
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
    users[index]['date_fin'] = formatDate ? ( users_db[index]['date_fin'] ? moment(users_db[index]['date_fin'], moment.ISO_8601).format('DD/MM/YYYY') : '')  : users_db[index]['date_fin'];
    users[index]['nombreInscription'] = 0;
    users[index]['nombreNotesDonnee'] = 0;
    users[index]['noteMoyenneDonnee'] = 0.0;
    users[index]['nombreNotesRecue'] = 0;
    users[index]['noteMoyenneRecue'] = 0.0;
    users[index]['nombreAbsences'] = 0;
    users[index]['nombreCoach'] = 0;
    users[index]['numeroTelephone'] = users_db[index]['telephone'];
    users[index]['isAdmin'] = users_db[index]['isAdmin'];
    users[index]['canCreate'] = users_db[index]['canCreate'];
    users[index]['actif'] = users_db[index]['actif'];
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
        }).populate('evenement', '_id animateur');
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


exports.update_date_activation = function(req, res) {
  User.findByIdAndUpdate(req.params.id, {
    date_activation : req.body.date_activation, 
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
    email: req.body.email
  }, function(err, userActif) {
    if (err) {
      return res.json({updated: false});
    } else {
      return res.json({updated: true});
    }
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