'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  TypeEvenement = mongoose.model('TypeEvenement'),
  User= mongoose.model("User");

exports.initData = function() {
  TypeEvenement.findOneAndUpdate({code: 'CROSS'}, {
      name: 'Crossfit',
      code:'CROSS'
    }, {upsert: true, 'new': true}, function(err, model) {
  });

   TypeEvenement.findOneAndUpdate({code: 'PPG'}, {
      name: 'Préparation Physique Générale',
      code:'PPG'
    }, {upsert: true, 'new': true}, function(err, model) {
  });

  TypeEvenement.findOneAndUpdate({code: 'DANSE'}, {
    name: 'Danse',
    code:'DANSE'
  }, {upsert: true, 'new': true}, function(err, model) {
  });
    
    

}

exports.list_all_evenements = function(req, res) {
  Evenement.find({}, function(err, evenements) {
    if (err) {
      res.send(err);
    }
    evenements.forEach(function(evenement) { 
        evenement.createur = evenement.createur;
        evenement.participants = evenement.participants;
    });
    res.json(evenements);
  }).populate('createur', '_id prenom nom').populate('participants', '_id prenom nom');
};

exports.add_self_to_evenement = function(req, res) {
  Evenement.findById(req.params.evenementId, function(err, evenement) {
    if (err) {
      res.send(err);
    }
    if (!evenement.participants) {
      evenement.participants = [];
    }
    //Y a t'il encore de la place ?
    if (evenement.limite && evenement.participants.length >= evenement.limite) {
      return res.status(401).json({ message: 'Cet évenement est complet. Vous ne pouvez pas vous y inscrire' });
    }
    User.findOne({
      email: req.user.email
    }, function(err, user) {
        //On vérifie qu'on ajoute pas de doublons
        if (evenement.participants.indexOf(user._id) === -1) {
          evenement.participants.push(user);
          evenement.save(function(err, evenement) {
            if (err)
              res.send(err);
            res.json(evenement);
          });
        } else {
          res.json(evenement);
        }
    });

  });
};

exports.remove_self_to_evenement = function(req, res) {
  Evenement.findById(req.params.evenementId, function(err, evenement) {
    if (err)
      res.send(err);
      if (!evenement.participants) {
        evenement.participants = [];
      }
    User.findOne({
      email: req.user.email
    }, function(err, user) {
        //On vérifie qu'on ajoute pas de doublons
        for (var i = 0; i < evenement.participants.length; i++) {
          if (evenement.participants[i].toString() === user._id.toString()) {
              evenement.participants.splice(i, 1);
              i--;
          }
        }
        evenement.save(function(err, evenement) {
            if (err) {
              res.send(err);
            }
            res.json(evenement);
        });
      });
  });
};

exports.create_a_evenement = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    var new_evenement = new Evenement(req.body);
    new_evenement.createur = user;
    if (parseInt(new_evenement.limite,10) <= 0) {
      new_evenement.limite === null;
    }
    //Vérification de la plage horaire
    let date_debut = new Date(new_evenement.date_debut.getTime());
    let heure_debut = date_debut.getHours();
    let date_fin = new Date(date_debut.getTime() + new_evenement.duree*60000);
    let heure_fin = date_fin.getHours();
    if (heure_debut < 7 || heure_fin > 19) {
      return res.status(401).json({ message: 'Les activités sportives doivent se dérouler entre 7h et 20h' });
    }
    //Enregistrement en base
    check_evenement_conflit(new_evenement, res, () => {
      TypeEvenement.findOne({
        _id: req.body.typeEvenement
        }, function(err, typeEvt) {
          
          new_evenement.typeEvenement = typeEvt;
          new_evenement.save(function(err, evenement) {
          if (err)
            res.send(err);
          res.json(evenement);
        });
      })
    })
  })
};

exports.read_a_evenement = function(req, res) {
  Evenement.findById(req.params.evenementId, function(err, evenement) {
    if (err)
      res.send(err);
    res.json(evenement);
  });
};

exports.list_all_type_evenements = function(req,res) {
  TypeEvenement.find({}, function(err, types) {
    if (err) {
      res.send(err);
    }
    res.json(types);
  });
}

exports.update_a_evenement = function(req, res) {
  var data = {
    _id:req.params.evenementId,
    name: req.body.name,
    is_cours: req.body.is_cours,
    date_debut: new Date(req.body.date_debut),
    duree: req.body.duree,
    limite: req.body.limite,
    description: req.body.description
  }
  check_evenement_conflit(data, res, () => {
    TypeEvenement.findOne({
      _id: req.body.typeEvenement
      }, function(err, typeEvt) {
        data.typeEvenement = typeEvt;
        Evenement.findOneAndUpdate({_id:req.params.evenementId}, data, {new: true}, function(err, evenement) {
        if (err)
          res.send(err);
        res.json(evenement);
      });
    });
  })
};
// evenement.remove({}).exec(function(){});
exports.delete_a_evenement = function(req, res) {

  Evenement.remove({
    _id: req.params.evenementId
  }, function(err, evenement) {
    if (err)
      res.send(err);
    res.json({ message: 'evenement successfully deleted' });
  });
};

function check_evenement_conflit(event, res, cb) {
  if (!event.date_debut) {
    //Pas de date de debut précisé, donc c'est un update
    return cb();
  }
  let dateDebut = new Date(event.date_debut.getTime());
  let dateDebutJournee = new Date(event.date_debut.getTime());
  let dateFin = new Date(event.date_debut.getTime() + event.duree*60000);
  let dateFinJournee = new Date(event.date_debut.getTime());
  dateDebutJournee.setHours(0);
  dateFinJournee.setHours(23);

  Evenement.find({
    date_debut: {
        $gte: dateDebutJournee,
        $lt:  dateFinJournee
    }
  }, function(err, events) {
    for (let index in events) {
      let existingEvent = events[index];
      let dateDebutEvent = new Date(existingEvent.date_debut.getTime());
      let dateFinEvent = new Date(existingEvent.date_debut.getTime() + existingEvent.duree*60000);
      if ( existingEvent._id.toString() !== event._id.toString() && (
        (dateDebutEvent <= dateDebut && dateFinEvent > dateDebut) || //Debut du nouvel evenement pendant un autre
        (dateDebutEvent < dateFin && dateFinEvent >= dateFin)  //Fin du nouvel evenement pendant un autre
      )) {
        console.log(existingEvent, event);
        return res.status(401).json({ message: 'Cette activité entre en conflit avec une autre' });
      }
    }
    return cb();
  })
  
}
