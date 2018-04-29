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
  Profil = mongoose.model('Profil'),
  BlocAdministrables = mongoose.model('BlocAdministrables'),
  mailer = require('../utils/mailer');



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
    content: req.body.content
  }
  News.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
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
    image: req.body.image
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