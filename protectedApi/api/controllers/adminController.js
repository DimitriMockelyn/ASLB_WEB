'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  TypeEvenement = mongoose.model('TypeEvenement'),
  User= mongoose.model("User"),
  Partenaire = mongoose.model('Partenaire'),
  News= mongoose.model('News'),
  Sexe=mongoose.model('Sexe'),
  Entreprise=mongoose.model('Entreprise'),
  Presentation= mongoose.model('Presentation'),
  NiveauEvenement= mongoose.model('NiveauEvenement'),
  Ribbon=mongoose.model('Ribbon'),
  Media= mongoose.model('Media'),
  Profil = mongoose.model('Profil'),
  BlocAdministrables = mongoose.model('BlocAdministrables'),
  Machine = mongoose.model('Machine'),
  Badge = mongoose.model('Badge'),
  mailer = require('../utils/mailer'),
  moment = require('moment');

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

  var requestBadgeEvenementCount = 'BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {'
  +'  var existingIds = [];'
  +'  badges.map(badgeAcquis => {existingIds = existingIds.concat(badgeAcquis.evenements)});'
  +'  Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},#FILTER_EVENEMENTS#,{_id: {$nin: existingIds}}]}, function(err,res) {'
  +'   createBadgeForEvenements(badge, user,res, #LIMIT#);'
  +'  }).sort({date_debut: 1}).limit(#LIMIT#)'
  +' })';

  var requestBadgeEvenementTypeCount = 'BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {'
  +'  var existingIds = [];'
  +'  badges.map(badgeAcquis => {existingIds = existingIds.concat(badgeAcquis.evenements)});'
  +'  TypeEvenement.find({code:#CODE_EVENEMENT#}, function(err, typeEvent){'
  +'    Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},#FILTER_EVENEMENTS#,{typeEvenement: typeEvent},{_id: {$nin: existingIds}}]}, function(err,res) {'
  +'      createBadgeForEvenements(badge, user,res, #LIMIT#);'
  +'    }).populate(\'typeEvenement\',\'_id code\').sort({date_debut: 1}).limit(#LIMIT#)'
  +'  })'
  +' })';

  var requestBadgeNoteEvenementsCount = 'BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {'
  +'  var existingIds = [];'
  +'  badges.map(badgeAcquis => {existingIds = existingIds.concat(badgeAcquis.evenements)});'
  +'  Commentaire.find({auteur: user}, function(err, comms){'
  +'  var commsIds = [];'
  +'  comms.map(comm => {commsIds.push(comm.evenement)});'
  +'    Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},{_id: {$in: commsIds}},{_id: {$nin: existingIds}}]}, function(err,res) {'
  +'      createBadgeForEvenements(badge, user,res, #LIMIT#);'
  +'    }).populate(\'typeEvenement\',\'_id code\').sort({date_debut: 1}).limit(#LIMIT#)'
  +'  })'
  +' })';

  var requestBadgeEvenementInMonthCount = 'BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {'
  +'  var existingIds = [];'
  +'  var filterDate = [];'
  +'  badges.map(badgeAcquis => {'
  +'    badgeAcquis.evenements.map(evtBadge => {'
  +'      existingIds = existingIds.concat(evtBadge._id);'
  +'      var dateDebut = moment(new Date(evtBadge.date_debut), moment.ISO_8601).startOf(\'month\').toDate();'
  +'      var dateFin = moment(new Date(evtBadge.date_debut), moment.ISO_8601).endOf(\'month\').toDate();'
  +'      filterDate.push({$or: [{'
  +'       date_debut: {$lt: dateDebut}'
  +'      },{'
  +'        date_debut: {$gt: dateFin}'
  +'      }]})'
  +'    });'
  +'  });'
  +'  if (filterDate.length === 0) {'
  +'    filterDate.push({ date_debut: {$lt: Date.now()}});'
  +'  }'
  +'  Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},{$and: filterDate},#FILTER_EVENEMENTS#,{_id: {$nin: existingIds}}]}, function(err,res) {'
  +'   createBadgeForEvenementsInMonth(badge, user,res, #LIMIT#);'
  +'  }).sort({date_debut: 1})'
  +' }).populate(\'evenements\', \'_id date_debut\')'

  Badge.findOneAndUpdate({titre: '5 Evenements'}, {
    titre: '5 Evenements',
    code:'Bronze',
    isMultiple: false,
    requestCheck: requestBadgeEvenementCount.replace(/#LIMIT#/g, '5').replace(/#FILTER_EVENEMENTS#/g,'{participants: user}')
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: '5 Crossfit'}, {
    titre: '5 Crossfit',
    code:'Bronze',
    isMultiple: true,
    requestCheck: requestBadgeEvenementTypeCount.replace(/#LIMIT#/g, '5').replace(/#FILTER_EVENEMENTS#/g,'{participants: user}').replace(/#CODE_EVENEMENT#/g, '\'CROSS\'')
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: '5 Evenements en un mois'}, {
    titre: '5 Evenements en un mois',
    code:'Bronze',
    isMultiple: true,
    requestCheck: requestBadgeEvenementInMonthCount.replace(/#LIMIT#/g, '4').replace(/#FILTER_EVENEMENTS#/g,'{participants: user}')
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: 'Noter 2 evenements'}, {
    titre: 'Noter 2 evenements',
    code:'Bronze',
    isMultiple: true,
    requestCheck: requestBadgeNoteEvenementsCount.replace(/#LIMIT#/g, '2')
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: 'Animer 3 Evenements en un mois'}, {
    titre: 'Animer 3 Evenements en un mois',
    code:'Bronze',
    isMultiple: true,
    requestCheck: requestBadgeEvenementInMonthCount.replace(/#LIMIT#/g, '2').replace(/#FILTER_EVENEMENTS#/g,'{animateur: user}')
  }, {upsert: true, 'new': true}, function(err, model) {
  });
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