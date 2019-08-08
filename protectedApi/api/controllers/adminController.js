'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  TypeEvenement = mongoose.model('TypeEvenement'),
  User= mongoose.model("User"),
  Partenaire = mongoose.model('Partenaire'),
  News= mongoose.model('News'),
  Sexe=mongoose.model('Sexe'),
  Entreprise=mongoose.model('Entreprise'),
  fs =  require('fs'),
  Presentation= mongoose.model('Presentation'),
  NiveauEvenement= mongoose.model('NiveauEvenement'),
  Ribbon=mongoose.model('Ribbon'),
  Media= mongoose.model('Media'),
  Profil = mongoose.model('Profil'),
  BlocAdministrables = mongoose.model('BlocAdministrables'),
  Machine = mongoose.model('Machine'),
  Badge = mongoose.model('Badge'),
  DayOff = mongoose.model('DayOff'),
  mailer = require('../utils/mailer'),
  badgeController = require('./badgeController'),
  
  moment = require('moment');

  var formidable = require('formidable');
var {getConfig} = require('../../config');

exports.initData = function() {
  
  NiveauEvenement.findOneAndUpdate({code: 'NIV1'}, {
    name: '*',
    code:'NIV1'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  NiveauEvenement.findOneAndUpdate({code: 'NIV2'}, {
    name: '**',
    code:'NIV2'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  NiveauEvenement.findOneAndUpdate({code: 'NIV3'}, {
    name: '***',
    code:'NIV3'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Sexe.findOneAndUpdate({code: 'H'}, {
    label: 'Homme',
    code:'H'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Sexe.findOneAndUpdate({code: 'F'}, {
    label: 'Femme',
    code:'F'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Machine.findOneAndUpdate({nom: 'Vélo 1'}, {
    nom: 'Vélo 1',
    type:'Vélo'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Machine.findOneAndUpdate({nom: 'Vélo 2'}, {
    nom: 'Vélo 2',
    type:'Vélo'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Machine.findOneAndUpdate({nom: 'Vélo 3'}, {
    nom: 'Vélo 3',
    type:'Vélo'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Machine.findOneAndUpdate({nom: 'Rameur 1'}, {
    nom: 'Rameur 1',
    type:'Rameur'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Machine.findOneAndUpdate({nom: 'Elliptique 1'}, {
    nom: 'Elliptique 1',
    type:'Elliptique'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Machine.findOneAndUpdate({nom: 'Elliptique 2'}, {
    nom: 'Elliptique 2',
    type:'Elliptique'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  BlocAdministrables.find({type: 'espaces', ordre: 1}, function(err, exists) {
    if (!exists || exists.length === 0) {
      BlocAdministrables.findOneAndUpdate({type: 'espaces', ordre: 1}, {
        type: 'espaces', 
        ordre: 1,
        titre:'Les espaces de l\'aassociations',
        contenu: 'Vous trouverez les espaces de l asso'
      }, {upsert: true, 'new': true}, function(err, model) {
      });
    }
  })
  

  BlocAdministrables.find({type: 'espaces', ordre: 2}, function(err, exists) {
    if (!exists  || exists.length === 0) {
    BlocAdministrables.findOneAndUpdate({type: 'espaces', ordre: 2}, {
      type: 'espaces', 
      ordre: 2,
      titre:'Le matériel',
      contenu: 'Vous trouverez le matos de l asso'
    }, {upsert: true, 'new': true}, function(err, model) {
    });
  }
  })

  BlocAdministrables.find({type: 'partenaire', ordre: 1}, function(err, exists) {
    if (!exists  || exists.length === 0) {
    BlocAdministrables.findOneAndUpdate({type: 'partenaire', ordre: 1}, {
      type: 'partenaire', 
      ordre: 1,
      titre:'Devenir partenaire',
      contenu: 'Si votre entreprise souhaite contribuer à notre projet et nous aider à faire vivre ces activités sportives au sein de la Boursidière, n’hésitez pas à nous contacter à l’adresse suivante : aslb@laboursidiere.com.'+
      'Notre besoin est principalement financier. Votre aide, et ce quelle que soit sa nature (numéraire, matériel, etc.), nous permettra de faire face au frais récurrents (tenue de compte, hébergement), au frais d’entretien du matériel et à son renouvellement, à l’achat d’équipements tels que les t-shirts que nous offrons à l’ensemble des adhérents lors de l’inscription, à l’organisation d’événements autour du sport. Tout simplement à faire vivre notre association.'
    }, {upsert: true, 'new': true}, function(err, model) {
    });
  }
  })

  BlocAdministrables.find({type: 'contactasso', ordre: 1}, function(err, exists) {
    if (!exists  || exists.length === 0) {
    BlocAdministrables.findOneAndUpdate({type: 'contactasso', ordre: 1}, {
      type: 'contactasso', 
      ordre: 1,
      titre:'Contacter l\'association',
      contenu: '<div data-focus="display-column"><label>Pour nous contacter, 3 possibilités:</label><div data-focus="display-row"><label><!-- react-text: 13 -->Courrier : <!-- /react-text --><!-- react-text: 14 --> <!-- /react-text --></label><div class="bold"> ASSOCIATION SPORTIVE LA BOURSIDIÈRE, LA BOURSIDIERE, 92350 Plessis-Robinson.</div></div><div data-focus="display-row"><label><!-- react-text: 18 -->Courriel : <!-- /react-text --><!-- react-text: 19 --> <!-- /react-text --></label><div class="bold"> </div><div class="link bold">aslb@laboursidiere.com</div></div><label>Venez nous voir directement :</label><div data-focus="img-acces"></div></div>'
    }, {upsert: true, 'new': true}, function(err, model) {
    });
  }
  })

  BlocAdministrables.find({type: 'inscription', ordre: 1}, function(err, exists) {
    if (!exists  || exists.length === 0) {
    BlocAdministrables.findOneAndUpdate({type: 'inscription', ordre: 1}, {
      type: 'inscription', 
      ordre: 1,
      titre:'Conditions',
      contenu: 'L\'inscription est réservée aux employés du Centre d\'Affaires La Boursidière et est valable du 1er septembre au 31 août. Le prix de la cotisation est de 35€ à renouveler chaque année.'
    }, {upsert: true, 'new': true}, function(err, model) {
    });
    BlocAdministrables.findOneAndUpdate({type: 'inscription', ordre: 2}, {
      type: 'inscription', 
      ordre: 2,
      titre:'Nous rejoindre',
      contenu: '<div data-focus="column"><label><!-- react-text: 19 -->Téléchargez <!-- /react-text --><div class="link boldbig">içi</div><!-- react-text: 21 --> votre dossier d\'inscription<!-- /react-text --></label><label>La première étape avant toute inscription est de s’assurer que vous disposez bien d’un certificat médical. Prenez rendez-vous chez votre médecin si vous n’en avez pas.</label><label>Le dossier d’inscription comporte les documents ci-dessous :</label><ul><li><label>Fiche d\'adhésion (à compléter et signer)</label></li><li><label>Certificat médical (à faire remplir par son médecin traitant - valable 3 ans)</label></li><li><label>Décharge de responsabilité (à compléter et signer)</label></li><li><label>Règlement intérieur (à parapher sur chaque page et à signer sur la dernière page)</label></li></ul><label>Vous pouvez déposer votre dossier d’inscription complété dans la boîte aux lettres de l’ASLB (n°101). Elle se trouve dans la salle La Poste (demander sa localisation à l’accueil)</label><label>La cotisation annuelle est de 35 € et peut être payée en liquide, par chèque (à l’ordre de l’ASLB), par virement (IBAN fourni dans la fiche d’adhésion) ou par Paypal (cf fiche d’adhésion). .</label><label>Les paiements par virement ou PayPal sont vivement encouragés, car ils n’engendrent pas de manutention.</label></div>'
    }, {upsert: true, 'new': true}, function(err, model) {
    });
  }
  })

  badgeController.insert_badges_default();
}


exports.list_all_partenaires = function(req, res) {
  Partenaire.find({}, function(err, ptns) {
    if (err) {
      res.send(err);
    }
    res.json(ptns);
  }).sort({ordre: 1});
};

exports.list_all_news = function(req, res) {
  News.find({}, function(err, ptns) {
    if (err) {
      res.send(err);
    }
    res.json(ptns);
  }).populate('createur', '_id prenom nom').sort({date: -1});
};

exports.create_news = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    var new_news = new News(req.body);
    new_news.createur = user;
    new_news.save(function(err, news) {
      if (err)
        res.send(err);
      res.json({created: true});
    });
  })
};

exports.edit_news = function(req, res) {
  var data = {
    titre: req.body.titre,
    content: req.body.content,
    important: req.body.important
  }
  News.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};

exports.mark_news_as_read = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    News.findById(req.params.id, function(err, news) {
      console.log(news);
      if (!news.luPar) {
        news.luPar = [];
      }
      if (news.luPar.indexOf(user._id) === -1) {
        news.luPar.push(user);
        news.save(function(err, newsUpdated) {
          if (err)
            res.send(err);
          res.json({updated: true});
        });
      } else {
        res.json({updated: true});
      }
    });
  })
};

exports.delete_news = function(req, res) {
  News.remove({_id:req.params.id}, function(err, news) {
    if (err)
      res.send(err);
    res.json({removed: true});
  });
};

exports.create_partenaire = function(req, res) {
  var new_ptn = new Partenaire(req.body);
  new_ptn.save(function(err, news) {
    if (err)
      res.send(err);
    res.json({created: true});
  });
};

exports.delete_partenaire = function(req, res) {
  Partenaire.remove({_id:req.params.id}, function(err, news) {
    if (err)
      res.send(err);
    res.json({removed: true});
  });
};

exports.edit_partenaire = function(req, res) {
  var data = {
    name: req.body.name,
    logo: req.body.logo,
    url: req.body.url,
    description: req.body.description,
    ordre: req.body.ordre
  }
  Partenaire.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};

exports.create_type_evenement = function(req, res) {
  var new_ptn = new TypeEvenement(req.body);
  new_ptn.save(function(err, news) {
    if (err)
      res.send(err);
    res.json({created: true});
  });
};

exports.delete_type_evenement = function(req, res) {
  TypeEvenement.remove({_id:req.params.id}, function(err, news) {
    if (err)
      res.send(err);
    res.json({removed: true});
  });
};

exports.edit_type_evenement = function(req, res) {
  var data = {
    name: req.body.name,
    code: req.body.code,
    color: req.body.color,
    description: req.body.description,
    image: req.body.image,
    ordre: req.body.ordre,
  }
  TypeEvenement.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};

exports.list_all_presentations = function(req, res) {
  Presentation.find({}, function(err, ptns) {
    if (err) {
      res.send(err);
    }
    res.json(ptns);
  }).sort({ordre: 1});
};

exports.create_presentation = function(req, res) {
  var new_ptn = new Presentation(req.body);
  new_ptn.save(function(err, news) {
    if (err)
      res.send(err);
    res.json({created: true});
  });
};

exports.delete_presentation = function(req, res) {
  Presentation.remove({_id:req.params.id}, function(err, news) {
    if (err)
      res.send(err);
    res.json({removed: true});
  });
};

exports.edit_presentation = function(req, res) {
  var data = {
    name: req.body.name,
    image: req.body.image,
    isBureau: req.body.isBureau,
    description: req.body.description,
    ordre: req.body.ordre,
    fonction: req.body.fonction
  }
  Presentation.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};

exports.create_entreprise = function(req, res) {
  var new_ptn = new Entreprise(req.body);
  new_ptn.save(function(err, news) {
    if (err)
      res.send(err);
    res.json({created: true});
  });
};

exports.delete_entreprise = function(req, res) {
  Entreprise.remove({_id:req.params.id}, function(err, news) {
    if (err)
      res.send(err);
    res.json({removed: true});
  });
};

exports.edit_entreprise = function(req, res) {
  var data = {
    code: req.body.code,
    label: req.body.label
  }
  Entreprise.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};

exports.list_all_ribbons = function(req, res) {
  Ribbon.find({}, function(err, ptns) {
    if (err) {
      res.send(err);
    }
    res.json(ptns);
  }).sort({ordre: 1});
};

exports.create_ribbons = function(req, res) {
  var new_ptn = new Ribbon(req.body);
  new_ptn.save(function(err, news) {
    if (err)
      res.send(err);
    res.json({created: true});
  });
};

exports.delete_ribbons = function(req, res) {
  Ribbon.remove({_id:req.params.id}, function(err, news) {
    if (err)
      res.send(err);
    res.json({removed: true});
  });
};

exports.edit_ribbons = function(req, res) {
  var data = {
    text: req.body.text,
    color_ribbon: req.body.color_ribbon,
    color_ribbon_light: req.body.color_ribbon_light,
    color_ribbon_dark: req.body.color_ribbon_dark,
    color_ribbon_darker: req.body.color_ribbon_darker
  }
  Ribbon.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};

exports.toggle_ribbon_user = function(req, res) {

  User.findById(
    req.params.usrId
  , function(err, user) {
    
    Ribbon.findById(req.params.ribId, function(err, rib) {
      if (!user.profil || !user.profil._id) {
        var newPrf = new Profil();
        newPrf.ribbonDisponible = [rib];
        newPrf.save(function(err, prf) {
          user.profil = prf;
          user.save(function(err, user_saved) {
            return res.json({updated: true});
          })
        })
      } else {
        Profil.findById(user.profil._id, function(err, prf) {
          if (prf.ribbonDisponible.indexOf(req.params.ribId.toString()) > -1) {
            prf.ribbonDisponible.splice(prf.ribbonDisponible.indexOf(req.params.ribId.toString()), 1);
            if (prf.ribbon && prf.ribbon.toString() === req.params.ribId.toString()) {
              prf.ribbon = undefined;
            }
          } else {
            prf.ribbonDisponible.push(req.params.ribId.toString());
          }
          prf.save(function(err, prf) {
              return res.json({updated: true});
          })
        })
      }
    })
  }).populate('profil', '_id')
}

exports.get_ribbon_user = function(req, res) {
  User.findById(
    req.params.usrId
  , function(err, user) {
    if (user.profil) {
      Profil.findById(user.profil, function(err, prf) {
        return res.json({ribbonDisponible: prf.ribbonDisponible || []})
      })
    } else {
      return res.json({ribbonDisponible: []})
    }
  })
}

exports.toggle_actif_ribbon_user = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
      if (!user.profil || !user.profil._id) {
        var newPrf = new Profil();
        newPrf.save(function(err, prf) {
          user.profil = prf;
          user.save(function(err, user_saved) {
            return res.json({updated: true});
          })
        })
      } else {
        Profil.findById(user.profil._id, function(err, prf) {
          
          if (req.params.ribId === 'none' || (prf.ribbon && prf.ribbon.toString() === req.params.ribId.toString())) {
            prf.ribbon = undefined;
          } else if (prf.ribbonDisponible.indexOf(req.params.ribId.toString()) > -1) {
            prf.ribbon = req.params.ribId;
          }
          prf.save(function(err, prf) {
              return res.json({updated: true});
          })
        })
      }
  }).populate('profil', '_id')
}

//Partie media

exports.list_all_medias = function(req, res) {
  Media.find({}, function(err, ptns) {
    if (err) {
      res.send(err);
    }
    res.json(ptns);
  }).sort({date: -1});
};

exports.create_media = function(req, res) {
  var new_ptn = new Media(req.body);
  new_ptn.save(function(err, news) {
    if (err)
      res.send(err);
    res.json({created: true});
  });
};

exports.delete_media = function(req, res) {
  Media.remove({_id:req.params.id}, function(err, news) {
    if (err)
      res.send(err);
    res.json({removed: true});
  });
};

exports.edit_media = function(req, res) {
  var data = {
    name: req.body.name,
    logo: req.body.logo,
    url: req.body.url,
    description: req.body.description
  }
  Media.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};

//Partie machine
exports.list_all_machines = function(req, res) {
  Machine.find({}, function(err, ptns) {
    if (err) {
      res.send(err);
    }
    res.json(ptns);
  }).sort({date: -1});
};

exports.create_machine = function(req, res) {
  var new_ptn = new Machine(req.body);
  new_ptn.save(function(err, news) {
    if (err)
      res.send(err);
    res.json({created: true});
  });
};

exports.delete_machine = function(req, res) {
  Machine.remove({_id:req.params.id}, function(err, news) {
    if (err)
      res.send(err);
    res.json({removed: true});
  });
};

exports.edit_machine = function(req, res) {
  var data = {
    nom: req.body.nom,
    type: req.body.type
  }
  Machine.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};

//Partie day off
exports.list_all_day_offs = function(req, res) {
  DayOff.find({}, function(err, ptns) {
    if (err) {
      res.send(err);
    }
    res.json(ptns);
  }).sort({date: -1});
};

exports.create_day_off = function(req, res) {
  var new_ptn = new DayOff(req.body);
  new_ptn.save(function(err, news) {
    if (err)
      res.send(err);
    res.json({created: true});
  });
};

exports.delete_day_off = function(req, res) {
  DayOff.remove({_id:req.params.id}, function(err, news) {
    if (err)
      res.send(err);
    res.json({removed: true});
  });
};

exports.edit_day_off = function(req, res) {
  var data = {
    reason: req.body.reason,
    date: req.body.date
  }
  DayOff.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};

exports.upload_file = function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log('FILE', files);
    fs.createReadStream(files.file.path).pipe(fs.createWriteStream(getConfig().filePath+'/'+files.file.name));
    //fs.writeFileSync(getConfig().filePath+'/'+files.file.name, files.file.path);
    res.json({updated: true})
  });
}

exports.upload_file_inscription = function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log('FILE', files);
    fs.createReadStream(files.file.path).pipe(fs.createWriteStream(getConfig().filePath+'/Inscription_ASLB.zip'));
    //fs.writeFileSync(files.file.path, getConfig().filePath+'/Inscription_ASLB.zip');
    res.json({updated: true})
  });
}