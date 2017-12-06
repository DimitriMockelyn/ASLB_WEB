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
  Entreprise = mongoose.model('Entreprise');

  var {getConfig} = require('../../config');

  var formidable = require('formidable');

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

exports.update_mes_informations = function(req, res) {
  if (req.user) {
    User.findOneAndUpdate({
      email: req.user.email
    }, {email : req.body.email, nom: req.body.nom, prenom: req.body.prenom, sexe: req.body.sexe, entreprise: req.body.entreprise, dateNaissance: req.body.dateNaissance}, {new: true}, function(err, user) {
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

exports.load_users = function(req, res) {
  var filter = new RegExp(req.body.filter, 'i');
  User.find({ $or: [{'nom': filter}, {'email': filter}, {'prenom':filter}]}, function(err, users) {
    if (err) {
      res.send(err);
    }
    for (let index in users) {
      users[index]['hash_password'] = undefined;
    }
    return res.json(users);
  }).populate('sexe', '_id label').populate('entreprise', '_id label');
}

exports.export_users = function(req, res) {
  var filter = new RegExp(req.body.filter, 'i');
  User.find({ $or: [{'nom': filter}, {'email': filter}, {'prenom':filter}]}, function(err, users) {
    if (err) {
      res.send(err);
    }
    for (let index in users) {
      users[index]['hash_password'] = undefined;
    }
    var fields = ['nom', 'prenom', 'email','sexe.label', 'entreprise.label']
    json2csv({ data: users, fields: fields,quotes:'', del: ';' }, function(err, csv) {
      res.setHeader('Content-disposition', 'attachment; filename=data.csv');
      res.set('Content-Type', 'text/csv');
      return res.status(200).send(csv);
    });
  }).populate('sexe', '_id label').populate('entreprise', '_id label');
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
        return res.json({success: false});
      }
      return res.json({success: true});
    })    
  });
}

exports.update_date_activation = function(req, res) {
  User.findByIdAndUpdate(req.params.id, {date_activation : req.body.date_activation}, function(err, userActif) {
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
  });
}

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

function isMembreActif(user) {
  return user.date_activation && moment().subtract(1, 'years').isBefore(moment(user.date_activation));
}