'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  User= mongoose.model("User");



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
    new_evenement.save(function(err, evenement) {
      if (err)
        res.send(err);
      res.json(evenement);
    });
  })
};

exports.read_a_evenement = function(req, res) {
  Evenement.findById(req.params.evenementId, function(err, evenement) {
    if (err)
      res.send(err);
    res.json(evenement);
  });
};

exports.update_a_evenement = function(req, res) {
  var data = {
    name: req.body.name,
    is_cours: req.body.is_cours,
    date_debut: req.body.date_debut,
    duree: req.body.duree,
    limite: req.body.limite,
    description: req.body.description
  }
  Evenement.findOneAndUpdate({_id:req.params.evenementId}, data, {new: true}, function(err, evenement) {
    if (err)
      res.send(err);
    res.json(evenement);
  });
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
