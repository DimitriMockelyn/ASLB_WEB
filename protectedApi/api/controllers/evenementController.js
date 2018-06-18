'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  Notifications=  mongoose.model('Notifications'),
  Commentaire = mongoose.model('Commentaire'),
  TypeEvenement = mongoose.model('TypeEvenement'),
  NiveauEvenement= mongoose.model('NiveauEvenement'),
  User= mongoose.model("User"),
  Queue = mongoose.model("Queue"),
  Partenaire = mongoose.model('Partenaire'),
  CreneauMachine= mongoose.model('CreneauMachine'),
  Machine = mongoose.model('Machine'),
  moment = require('moment'),
  json2csv = require('json2csv'),
  mailer = require('../utils/mailer');


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
  }).populate('createur', '_id prenom nom')
  .populate('participants', '_id prenom nom sexe email')
  .populate({path:'fileAttente', populate:{ path:'personne', select: '_id prenom nom email sexe'}})
  .populate('personne', '_id prenom nom email')
  .populate('animateur', '_id prenom nom email')
  .populate('coanimateurs', '_id prenom nom email')
  .sort({date_debut: 1});
};

exports.list_all_incoming_evenements = function(req, res) {
  Evenement.find({
    date_debut: {
        $gte: Date.now()
    }
  }, function(err, evenements) {
    if (err) {
      res.send(err);
    }
    evenements.forEach(function(evenement) { 
        evenement.createur = evenement.createur;
        evenement.participants = evenement.participants;
    });
    res.json(evenements);
  }).populate('createur', '_id prenom nom')
  .populate('participants', '_id prenom nom sexe email')
  .populate('typeEvenement', '_id code name')
  .populate({path:'fileAttente', populate:{ path:'personne', select: '_id prenom nom email sexe'}})
  .populate('animateur', '_id prenom nom email')
  .populate('coanimateurs', '_id prenom nom email')
  .sort({date_debut: 1});
}

exports.list_my_evenements = function(req,res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    Evenement.find({$or: [{participants: user}, {animateur: user}, {coanimateurs: user}]}, function(err, evenements) {
      if (err) {
        res.send(err);
      }
      evenements.forEach(function(evenement) { 
          evenement.createur = evenement.createur;
          evenement.participants = evenement.participants;
      });
      res.json(evenements);
    }).populate('createur', '_id prenom nom')
    .populate('participants', '_id prenom nom sexe email')
    .populate('animateur', '_id prenom nom email')
    .populate({path:'fileAttente', populate:{ path:'personne', select: '_id prenom nom email sexe'}})
    .populate('coanimateurs', '_id prenom nom email')
    .sort({date_debut: 1});
  })
}

exports.list_my_history = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    Evenement.find({$and: [
        {participants: user}, 
        { date_debut: {$lt: Date.now()}}]}, function(err, evenements) {
      if (err) {
        res.send(err);
      }
      evenements.forEach(function(evenement) { 
          evenement.createur = evenement.createur;
          evenement.participants = evenement.participants;
      });
      res.json(evenements);
    }).populate('createur', '_id prenom nom')
    .populate('participants', '_id prenom nom sexe email')
    .populate('fileAttente', '_id personne ordre')
    .populate('typeEvenement', '_id code name')
    .populate('animateur', '_id prenom nom email')
    .populate('coanimateurs', '_id prenom nom email')
    .sort({date_debut: -1});
  })
}

exports.export_my_history = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    Evenement.find({$and: [
        {participants: user}, 
        { date_debut: {$lt: Date.now()}}]}, function(err, evenements) {
      if (err) {
        res.send(err);
      }
      evenements.forEach(function(evenement) { 
          evenement.createur = evenement.createur;
          evenement.participants = evenement.participants;
      });
    }).populate('createur', '_id prenom nom')
    .populate('participants', '_id prenom nom sexe email')
    .populate('fileAttente', '_id personne ordre')
    .populate('typeEvenement', '_id code name')
    .populate('animateur', '_id prenom nom')
    .populate('coanimateurs', '_id prenom nom email')
    .sort({date_debut: -1}).lean().exec(function(err, events) {
      Commentaire.find({$and : [
        { evenement : { $in : events } },
        { auteur : user}
      ]}, function(err, commentaires) {
        events.forEach(function(event) {
          event.commentaires = [];
        });
        commentaires.forEach(function(commentaire) {
          let evenementFound = events.find(function(event) {
            return event._id.toString() === commentaire.evenement._id.toString();
          });
          evenementFound.commentaires.push(commentaire);
        });
        return exportMyHistoryForEvents(res, user, events);
      }).populate('auteur', '_id prenom nom').populate('evenement', '_id');
    })
  })
}

const exportMyHistoryForEvents = function(res, user, events) {
  let data = [];
  events.map(evt => {
    let obj = {};
    obj['date_debut'] = moment(evt['date_debut'], moment.ISO_8601).format('DD/MM/YYYY');
    obj['type'] = evt.typeEvenement ? evt.typeEvenement.name : '';
    obj['titre'] = evt.name.replace(/;/g,',');
    obj['description'] = evt.description ? evt.description.replace(/;/g,',') : '';
    obj['duree'] = evt.duree;
    obj['animateur'] = evt.animateur.prenom + ' ' + evt.animateur.nom;
    if (evt.coanimateurs && evt.coanimateurs.length > 0) {
      evt.coanimateurs.map(anim => {
        obj['animateur'] = obj['animateur'] + ' - ' + anim.prenom + ' ' + anim.nom;
      })
    }
    obj['nbParticipants'] = evt.participants.length;
    obj['note'] = evt.commentaires.length === 1 ? evt.commentaires[0].note : '';
    obj['commentaire'] = evt.commentaires.length === 1 && evt.commentaires[0].commentaire ? evt.commentaires[0].commentaire.replace(/;/g,',') : '';
    data.push(obj);
  })
  var fieldNames = ['Date', 'Type', 'Nom', 'Description', 'Durée','Animateur','Nombre de participants','Note', 'Commentaire']
  var fields  = ['date_debut', 'type', 'titre', 'description', 'duree', 'animateur','nbParticipants','note', 'commentaire']
  
  json2csv({ data: data, fields: fields, fieldNames:fieldNames, quotes:'', del: ';' }, function(err, csv) {
    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    return res.status(200).send(csv);
  });
}


exports.export_my_coach_history = function(req,res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    Evenement.find({$and: [
        {$or: [
          { animateur: user},
          {coanimateurs: user}
        ]}, 
        { date_debut: {$lt: Date.now()}}]}, function(err, evenements) {
      if (err) {
        res.send(err);
      }
      evenements.forEach(function(evenement) { 
          evenement.createur = evenement.createur;
          evenement.participants = evenement.participants;
      });
    }).populate('createur', '_id prenom nom')
    .populate('participants', '_id prenom nom sexe email')
    .populate('typeEvenement', '_id code name')
    .populate('animateur', '_id prenom nom')
    .populate('coanimateurs', '_id prenom nom email')
    .sort({date_debut: -1}).lean().exec(function(err, events) {
      Commentaire.find({ evenement : { $in : events } }, function(err, commentaires) {
        events.forEach(function(event) {
          event.commentaires = [];
        });
        commentaires.forEach(function(commentaire) {
          let evenementFound = events.find(function(event) {
            return event._id.toString() === commentaire.evenement._id.toString();
          });
          evenementFound.commentaires.push(commentaire);
        });
        return exportGlobalHistoryForEvents(res, user, events);
      }).populate('auteur', '_id prenom nom').populate('evenement', '_id');
    });
  })
}

const emptyObject = function(fields) {
  let obj = {};
  fields.map(field => {
    obj[field] = ''
  });
  return obj;
}

const exportGlobalHistoryForEvents = function(res, user, events) {
  var fieldNames = ['Date', 'Type', 'Nom', 'Description', 'Durée','Nombre de participants','Note', 'Commentaire', 'Auteur']
  var fields  = ['date_debut', 'type', 'titre', 'description', 'duree','nbParticipants','note', 'commentaire', 'auteur']
  let data = [];
  data.push({});
  events.map(evt => {
    if (evt.commentaires.length === 0) {
      evt.commentaires.push(emptyObject(fields));
    }
    evt.commentaires.map(comm => {
      let obj = {};
      obj['date_debut'] = moment(evt['date_debut'], moment.ISO_8601).format('DD/MM/YYYY');
      obj['type'] = evt.typeEvenement ? evt.typeEvenement.name : '';
      obj['titre'] = evt.name.replace(/;/g,',');
      obj['description'] = evt.description ? evt.description.replace(/;/g,',') : '';
      obj['duree'] = evt.duree;
      obj['nbParticipants'] = evt.participants.length;
      obj['note'] = comm.note;
      obj['commentaire'] = comm.commentaire ? comm.commentaire.replace(/;/g,',') : '';
      obj['auteur'] = comm.auteur ? comm.auteur.prenom + ' ' + comm.auteur.nom : '';
      data.push(obj);
    })
    data.push(emptyObject(fields));
  })

  
  json2csv({ data: data, fields: fields, fieldNames:fieldNames, quotes:'', del: ';' }, function(err, csv) {
    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    return res.status(200).send(csv);
  });
}

exports.list_my_coach_history = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    Evenement.find({$and: [
      {$or: [
        { animateur: user},
        {coanimateurs: user}
      ]},
        { date_debut: {$lt: Date.now()}}]}, function(err, evenements) {
      if (err) {
        res.send(err);
      }
      evenements.forEach(function(evenement) { 
          evenement.createur = evenement.createur;
          evenement.participants = evenement.participants;
      });
    }).populate('createur', '_id prenom nom')
    .populate('participants', '_id prenom nom sexe email')
    .populate('typeEvenement', '_id code name')
    .populate('animateur', '_id prenom nom')
    .populate('coanimateurs', '_id prenom nom email')
    .sort({date_debut: -1}).lean().exec(function(err, events) {
      Commentaire.find({ evenement : { $in : events } }, function(err, commentaires) {
        events.forEach(function(event) {
          event.commentaires = [];
        });
        commentaires.forEach(function(commentaire) {
          let evenementFound = events.find(function(event) {
            return event._id.toString() === commentaire.evenement._id.toString();
          });
          evenementFound.commentaires.push(commentaire);
        });
        res.json(events);
      }).populate('auteur', '_id prenom nom').populate('evenement', '_id');
    });
  })
}

exports.is_user_coach = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    Evenement.find({$and: [
      {$or: [
        { animateur: user},
        {coanimateurs: user}
      ]},
        { date_debut: {$lt: Date.now()}}]}, function(err, evenements) {
      if (err) {
        res.send(err);
      }
      res.json({isCoach: evenements.length > 0});
    });
  })
}

exports.get_commentaire_for_user = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        res.send(err);
      }
      Commentaire.find({$and: [
        {auteur : user},
        {evenement: evenement}
      ]}, function(err, commentaires) {
        if (err) {
          res.send(err);
        }
        if (!commentaires || commentaires.length === 0) {
          res.json({commentairePresent: false});
        } else {
          let result = {};
          result._id = commentaires[0]._id;
          result.evenement = commentaires[0].evenement ;
          result.commentaire = commentaires[0].commentaire ;
          result.date = commentaires[0].date ;
          result.note = commentaires[0].note ;
          result.auteur = commentaires[0].auteur ;
          result['commentairePresent'] = true;
          res.json(result);
        }
      })
    })
  })
}

exports.post_commentaire_for_user = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        res.send(err);
      }
      Commentaire.find({$and: [
        {auteur : user},
        {evenement: evenement}
      ]}, function(err, commentaires) {
        if (err) {
          res.send(err);
        }
        if (!commentaires || commentaires.length === 0) {
          var comm = new Commentaire(req.body);
          comm.auteur = user;
          comm.evenement = evenement;
          comm.save(function(err, newComm) {
              if (err) {
                res.send(err);
              }
              newComm.commentairePresent = true;
              res.json(newComm);
          });
        } else {
          Commentaire.findOneAndUpdate({_id:commentaires[0]._id}, {note: req.body.note, date: Date.now(), commentaire: req.body.commentaire}, {new: true}, function(err, newComm) {
            if (err) {
              res.send(err);
            }
            newComm.commentairePresent = true;
            res.json(newComm);
          });
        }
      })
    })
  })
}

exports.add_self_to_evenement = function(req, res) {
  Evenement.findById(req.params.evenementId, function(err, evenement) {
    if (err) {
      res.send(err);
    }
    if (!evenement.participants) {
      evenement.participants = [];
    }

    User.findOne({
      email: req.user.email
    }, function(err, user) {
        //On vérifie que la date de fin n'est pas trop loin
        if (evenement.date_debut.getTime() > user.date_fin.getTime()) {
           return res.status(401).json({ message: 'Cet évenement est apres votre fin d\'ashésion' });
        }
        if (evenement.animateur.toString() === user._id.toString()) {
          return res.status(401).json({ message: 'Vous ne pouvez pas vous inscrire a un événement dont vous etes deja l\'animateur' });
        }
        if (evenement.coanimateurs.indexOf(user._id) > -1) {
          return res.status(401).json({ message: 'Vous ne pouvez pas vous inscrire a un événement dont vous etes deja l\'animateur' });
        }
        //On vérifie qu'on ajoute pas de doublons
        if (evenement.participants.indexOf(user._id) === -1) {
          return check_evenement_conflit(user,evenement, res, '', () => {
            //Y a t'il encore de la place ?
            if (evenement.limite !== undefined && evenement.limite !== null && evenement.participants.length >= evenement.limite) {
              //On se met en file d'attente
              var queue = new Queue();
              queue.personne = user;
              queue.ordre = 1;
              var toSave = true;
              evenement.fileAttente.map(item => {
                if (queue.ordre <= item.ordre) {
                  queue.ordre = item.ordre +1;
                }
                if (user._id.toString() === item.personne.toString()) {
                  toSave = false;
                }
              })
              if (toSave) {
                queue.save(function(err, queueSaved) {
                  evenement.fileAttente.push(queueSaved);
                  evenement.save(function(err, evenement) {
                    if (err) {
                      res.send(err);
                    }
                    return res.status(200).json({ message: 'Cet evenement est complet. Vous avez été mis en file d\'attente' });
                  });
                  
                });
              } else {
                return res.status(401).json({ message: 'Vous etes deja en file d\'attente' }); //Deja en file d'attente
              }
              
            } else {
              evenement.participants.push(user);
              evenement.save(function(err, evenement) {
                if (err)
                  res.send(err);
                res.json(evenement);
              });
            }
          });
        } else {
          res.json(evenement);
        }
    });

  }).populate('fileAttente', '_id ordre personne');
};



 const remove_one_from_evenement = function(req, res, user, evenementId, next) {
  Evenement.findById(evenementId, function(err, evenement) {
    if (err) {
      res.send(err);
    }
    if (!evenement.participants) {
      evenement.participants = [];
    }

    //On vérifie qu'on ajoute pas de doublons
    for (var i = 0; i < evenement.fileAttente.length; i++) {
      if (evenement.fileAttente[i].personne.toString() === user._id.toString()) {
        var toDelete = evenement.fileAttente[i];
        evenement.fileAttente.splice(i, 1);
        toDelete.remove(function(err, del) {})
          i--;
      }
    }
    for (var i = 0; i < evenement.participants.length; i++) {
      if (evenement.participants[i].toString() === user._id.toString()) {
          evenement.participants.splice(i, 1);
          i--;
          //changer file attente
          if (evenement.fileAttente.length > 0) {
            var minOrdre = -1;
            var indexMin = -1;
            evenement.fileAttente.map((itemAttente, index) => {
              if (minOrdre === -1 || itemAttente.ordre < minOrdre) {
                minOrdre = itemAttente.ordre;
                indexMin = index;
              }
            })
            //On ajoute le nouveau aux participants
            evenement.participants.push(evenement.fileAttente[indexMin].personne);
            sendMailInscrit(evenement.fileAttente[indexMin].personne, evenement.name + ' - ' + moment(evenement.date_debut).format('DD/MM/YYYY - HH:mm'), evenement._id);
            var toDelete = evenement.fileAttente[indexMin];
            evenement.fileAttente.splice(indexMin, 1);
            toDelete.remove(function(err, del) {})
          }
      }
    }
    if (next) {
      next(evenement);
    }
    /*
    evenement.save(function(err, evenement) {
        if (err) {
          res.send(err);
        }
        res.json(evenement);
    });
    */
  }).populate('fileAttente', '_id personne ordre');
}

exports.remove_one_from_evenement = remove_one_from_evenement;

exports.remove_self_to_evenement = function(req, res) {
   User.findOne({
      email: req.user.email
    }, function(err, user) {
      remove_one_from_evenement(req, res, user, req.params.evenementId, evenement => {
        evenement.save(function(err, evenement) {
          if (err) {
            res.send(err);
          }
          res.json(evenement);
      });
    });
  });
};

function sendMailInscrit(id, infoEvents, idEvent) {
  User.findById(id, function(err, user) {
      let notif = new Notifications();
      notif.destinataire = user;
      notif.lien = 'agenda/'+idEvent;
      notif.message = 'Tu étais en file d\'attente pour l\'évenement suivant : ' + infoEvents + '. Une personne s\'est désinscrite, et tu fais partie des participants a présent. N\'oublie pas tes affaires !';

      notif.save(function(err, not) {
      })
      mailer.sendMail([user.email], 
        '[aslb] Inscription automatique à un événement', 
        'Bonjour. Tu étais en file d\'attente pour l\'évenement suivant : ' + infoEvents + '. Une personne s\'est désinscrite, et tu fais partie des participants a présent. N\'oublie pas tes affaires !. Ce message est envoyé automatiquement, merci de ne pas y répondre.');
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
    if (new Date(new_evenement.date_debut.getTime()).getDay() === 0 || new Date(new_evenement.date_debut.getTime()).getDay() === 6) {
      return res.status(401).json({ message: 'Vous ne pouvez pas créer d\'événement le week-end' });
    }
    if (new_evenement.date_debut.getTime() < Date.now()) {
      return res.status(401).json({ message: 'Vous ne pouvez pas créer d\'événement dans le passé' });
    }

    //Vérification de la plage horaire
    let date_debut = new Date(new_evenement.date_debut.getTime());
    let heure_debut = date_debut.getHours();
    let date_fin = new Date(date_debut.getTime() + new_evenement.duree*60000);
    let heure_fin = date_fin.getHours();
    if (heure_debut < 7 || heure_fin > 19) {
      return res.status(401).json({ message: 'Les activités sportives doivent se dérouler entre 7h et 20h' });
    }
    TypeEvenement.findOne({
      _id: req.body.typeEvenement
      }, function(err, typeEvt) {    
      new_evenement.typeEvenement = typeEvt;
      //Enregistrement en base
      //On enregistre les nouveau coanimateurs a verifier
      let index = 0;
      User.findById(req.body.animateur, function(err,animateur) {
        check_evenement_conflit(animateur,new_evenement, res, 'pour l\'animateur', () => {
            check_coanims_conflit_or_save(new_evenement, res, 'pour l\'animateur', 0);
          });
        });
      })
  })
};

function check_coanims_conflit_or_save(new_evenement, res, complementString, index) {
  if (index >= new_evenement.coanimateurs.length) {
    new_evenement.save(function(err, evenement) {
      if (err)
        res.send(err);
      res.json(evenement);
    });
  } else {
    User.findById(new_evenement.coanimateurs[index], function(err,animateur) {
      check_evenement_conflit(animateur,new_evenement, res, 'pour l\'animateur', () => {
        check_coanims_conflit_or_save(new_evenement, res, complementString, index+1);
      })
    })
  }
}

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
  }).sort({ordre:1});
}

exports.list_all_niveau_evenements = function(req,res) {
  NiveauEvenement.find({}, function(err, types) {
    if (err) {
      res.send(err);
    }
    res.json(types);
  }).sort({code:1});
}


exports.update_a_evenement = function(req, res) {
  var data = {
    _id:req.params.evenementId,
    name: req.body.name,
    is_cours: req.body.is_cours,
    date_debut: new Date(req.body.date_debut),
    duree: req.body.duree,
    limite: req.body.limite,
    description: req.body.description,
    animateur: req.body.animateur,
    coanimateurs: req.body.coanimateurs || [], 
    niveau: req.body.niveau
  }
  TypeEvenement.findOne({
    _id: req.body.typeEvenement
    }, function(err, typeEvt) {
      data.typeEvenement = typeEvt;
      User.findById(req.body.animateur, function(err,animateur) {
        check_evenement_conflit(animateur,data, res, 'pour l\'animateur', () => {
          check_coanims_conflit_or_update(data, res, req, 'pour l\'animateur', 0);
        });
      })
    }
  )
}; 

function check_coanims_conflit_or_update(new_evenement, res, req, complementString, index) {
  if (index >= new_evenement.coanimateurs.length) {
    Evenement.findOneAndUpdate({_id:req.params.evenementId}, new_evenement, {new: true}, function(err, evenement) {
      if (err)
        res.send(err);
      res.json(evenement);
      });
  } else {
    User.findById(new_evenement.coanimateurs[index], function(err,animateur) {

      check_evenement_conflit(animateur,new_evenement, res, 'pour l\'animateur', () => {
        check_coanims_conflit_or_update(new_evenement, res, req, complementString, index+1);
      })
    })
  }
}

exports.delete_a_evenement = function(req, res) {

  Evenement.remove({
    _id: req.params.evenementId
  }, function(err, evenement) {
    if (err)
      res.send(err);
    res.json({ message: 'evenement successfully deleted' });
  });
};

function check_evenement_conflit(user, event, res, complement_msg, cb) {
  console.log(user);
  let dateDebut = new Date(event.date_debut.getTime());
  let dateDebutJournee = new Date(event.date_debut.getTime());
  let dateFin = new Date(event.date_debut.getTime() + event.duree*60000);
  let dateFinJournee = new Date(event.date_debut.getTime());
  dateDebutJournee.setHours(0);
  dateFinJournee.setHours(23);
  //On recherche les evenements en conflit
  return Evenement.find({
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
        (dateDebutEvent < dateFin && dateFinEvent >= dateFin) || //Fin du nouvel evenement pendant un autre
        (dateDebut <= dateDebutEvent && dateFin > dateFinEvent) || //Debut du nouvel evenement pendant un autre
        (dateDebut < dateFinEvent && dateFin >= dateFinEvent) //Fin du nouvel evenement pendant un autre
      )) {
        //Cette activité est en conflit, on vérifie la liste des participants
        if (existingEvent.animateur.toString() === user._id.toString()) {
          return res.status(401).json({ message: 'Cette activité entre en conflit avec une autre '+complement_msg });
        }
        if (existingEvent.coanimateurs.indexOf(user._id.toString()) > -1 ) {
          return res.status(401).json({ message: 'Cette activité entre en conflit avec une autre '+complement_msg });
        }
        if (existingEvent.participants.length > 0) {
          for (let index2  = 0; index2 < existingEvent.participants.length; index2++) {
            let ptp = existingEvent.participants[index2];
            if (ptp && ptp._id.toString() === user._id.toString()) {
              return res.status(401).json({ message: 'Cette activité entre en conflit avec une autre '+complement_msg });
            }
          };
        }
        if (existingEvent.fileAttente.length > 0) {
          for (let index2  = 0; index2 < existingEvent.fileAttente.length; index2++) {
            let ptp = existingEvent.fileAttente[index2];
            if (ptp && ptp.personne.toString() === user._id.toString()) {
              return res.status(401).json({ message: 'Cette activité entre en conflit avec une autre '+complement_msg });
            }
          };
        }
        
      }
    }
    // Il n'y a pas d'evenements en conflit, on vérifie l'inscription aux machines
    CreneauMachine.find({
      $and:[{dateDebut: {
        $lt:  dateFinJournee
      }},
      {dateDebut: {
        $gte: dateDebutJournee
      }},
      {
        membre: user
      }]
    }, function(err, creneaux) {
      for (let index in creneaux) {
        const cren = creneaux[index];
        let dateDebutCreneau = moment(cren.dateDebut).clone();
        let dateFinCreneau = moment(cren.dateDebut).clone();
        dateFinCreneau.add(30,'minutes');
        if (
          (dateDebutCreneau <= dateDebut && dateFinCreneau > dateDebut) || //Debut du nouvel evenement pendant un autre
          (dateDebutCreneau < dateFin && dateFinCreneau >= dateFin) || //Fin du nouvel evenement pendant un autre
          (dateDebut <= dateDebutCreneau && dateFin > dateFinCreneau) || //Debut du nouvel evenement pendant un autre
          (dateDebut < dateFinCreneau && dateFin >= dateFinCreneau) //Fin du nouvel evenement pendant un autre
        ) {
          return res.status(401).json({ message: 'Vous avez déjà réservé une machine sur cet horaire. Veuillez retirer votre réservation pour vous inscrire à cette activité' });
        }
      }
      return cb();
    })
    
  }).populate('fileAttente', '_id personne ordre').populate('participants', '_id prenom nom email')
  
}

exports.loadAbsents = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        res.send(err);
      }
      if (evenement.animateur.toString() !== user._id.toString()
          && evenement.coanimateurs.indexOf(user._id.toString()) === -1) {
        return res.status(401).json({ message: 'Vous n\'etes pas l\'animateur de la séance' });
      }
      return res.json(evenement);
      
    }).populate('participants', '_id prenom nom email').populate('absents', '_id prenom nom');
  });
};

exports.setAbsent = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        res.send(err);
      }
      if (evenement.animateur.toString() !== user._id.toString() && evenement.coanimateurs.indexOf(user._id.toString()) === -1) {
        return res.status(401).json({ message: 'Vous n\'etes pas l\'animateur de la séance' });
      }
      if (evenement.absents.indexOf(req.body.user) < 0) {
        evenement.absents.push(req.body.user);
      }
      evenement.save(function(err, evt) {
        if (err) {
          res.send(err)
        }
        res.json({updated: true})
      })
    });
  });
};

exports.setPresent = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        res.send(err);
      }
      if (evenement.animateur.toString() !== user._id.toString() && evenement.coanimateurs.indexOf(user._id.toString()) === -1) {
        return res.status(401).json({ message: 'Vous n\'etes pas l\'animateur de la séance' });
      }
      var index = -1;
      evenement.absents.map((abss, indexLoop) => {
        if (abss.toString() === req.body.user.toString()) {
          index = indexLoop;
        }
      })
      if (index > -1) {
        evenement.absents.splice(index, 1);
      }
      evenement.save(function(err, evt) {
        if (err) {
          res.send(err)
        }
        res.json({updated: true})
      })
    });
  });
};