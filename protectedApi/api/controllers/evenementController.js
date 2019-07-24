'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  Notifications=  mongoose.model('Notifications'),
  Commentaire = mongoose.model('Commentaire'),
  TypeEvenement = mongoose.model('TypeEvenement'),
  NiveauEvenement= mongoose.model('NiveauEvenement'),
  User= mongoose.model("User"),
  Queue = mongoose.model("Queue"),
  DayOff = mongoose.model("DayOff"),
  Partenaire = mongoose.model('Partenaire'),
  CreneauMachine= mongoose.model('CreneauMachine'),
  Machine = mongoose.model('Machine'),
  moment = require('moment'),
  json2csv = require('json2csv'),
  ical = require('ical-generator'),
  json2csv = require('json2csv'),
  mailer = require('../utils/mailer');


exports.list_all_evenements = function(req, res) {
  let filter = {};
  if (req.params.numWeek) {
    let mom = moment();
    mom.add(req.params.numWeek, 'w');
    filter={$and: [
      {
        date_debut: {
          $gte: mom.clone().startOf('week')
        }
      },
      {
        date_debut: {
          $lte: mom.clone().endOf('week')
        }
      }
    ]}
  }
  Evenement.find(filter, function(err, evenements) {
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
    Queue.find({personne: user}, function(err, files) {
      let filter = {$or: [{participants: user}, {animateur: user}, {coanimateurs: user}, {fileAttente: {$in: files}}]};
      if (req.params.numWeek) {
        let mom = moment();
        mom.add(req.params.numWeek, 'w');
        filter={$and: [
          filter,
          {
            date_debut: {
              $gte: mom.clone().startOf('week')
            }
          },
          {
            date_debut: {
              $lte: mom.clone().endOf('week')
            }
          }
        ]}
      }
      Evenement.find(filter, function(err, evenements) {
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
        events.map( event => {
          event.commentaires = computeMapCommetaire(event.commentaires);
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
        events.map( event => {
          event.commentaires = computeMapCommetaire(event.commentaires);
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
        events.map( event => {
          event.commentaires = computeMapCommetaire(event.commentaires);
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

function findCommentaireInMap(commentaireId, map) {
  let comm = undefined;
  console.log(commentaireId, map);
  for (let index in map) {
    if (map[index]._id.toString() === commentaireId.toString()) {
      comm = map[index];
    }
    if (map[index].children && map[index].children.length > 0) {
      comm = comm || findCommentaireInMap(commentaireId, map[index].children)
    }
  }
  return comm;
}

function computeMapCommetaire(commentaires) {
  let mapCommentaire = [];
  let arrCommentaire = [];
  commentaires.map(comm => {
      let obj = {...comm._doc, children: []}
      mapCommentaire.push(obj);
      arrCommentaire.push(obj);
  })
  arrCommentaire.map(comm => {
    if (comm.reponseA) {
      let commFound = findCommentaireInMap(comm.reponseA, mapCommentaire)
      console.log(commFound);
      commFound.children.push(comm);
      for (let index in mapCommentaire) {
        if (mapCommentaire[index]._id === comm._id) {
          mapCommentaire.splice(index, 1);
        }
      }
    }
  })
  return mapCommentaire;

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
        //{auteur : user},
        {evenement: evenement}
      ]}, function(err, commentaires) {
        if (err) {
          res.send(err);
        }
        if (!commentaires || commentaires.length === 0) {
          res.json({commentairePresent: false, listeCommentaires : []});
        } else {
          let result = {};
          result.listeCommentaires = computeMapCommetaire(commentaires);
          result['commentairePresent'] = false;
          commentaires.map(comm => {
            if (comm.auteur._id.toString() === user._id.toString()) {
              result._id = comm._id;
              result.evenement = comm.evenement ;
              result.commentaire = comm.commentaire ;
              result.date = comm.date ;
              result.note = comm.note ;
              result.auteur = comm.auteur._id ;
              result.prive = comm.prive;
              result['commentairePresent'] = true;
            } 
            if (comm.prive) {
              comm.commentaire = '';
            }
            
          });
          res.json(result);
        }
      }).populate('auteur', '_id prenom nom')
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
          Commentaire.findOneAndUpdate({_id:commentaires[0]._id}, {note: req.body.note, date: Date.now(), commentaire: req.body.commentaire, prive: req.body.prive}, {new: true}, function(err, newComm) {
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

exports.post_reponse_commentaire_for_user = function(req,res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      if (err) {
        res.send(err);
        return;
      }
      var comm = new Commentaire();
      comm.auteur = user;
      comm.evenement = evenement;
      comm.commentaire = req.body.reponse;
      comm.reponseA = req.body.idCommentaire;

      comm.save(function(err, newComm) {
          if (err) {
            res.send(err);
            return;
          }
          res.json(newComm);
      });
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

exports.generate_appointment = function(req, res) {
  Evenement.findById(req.params.evenementId, function(err, evenement) {
      // Create new Calendar and set optional fields
    var cal = ical({
        domain: 'sport.laboursidiere.com',
        timezone: 'Europe/Paris'
    });
    // create a new event
    var event = cal.createEvent({
      start: new Date(evenement.date_debut.getTime()),
      end: new Date(evenement.date_debut.getTime() + evenement.duree*60000),
      timestamp: new Date(),
      summary: evenement.name,
      description: evenement.description,
      organizer: evenement.animateur.prenom + ' ' + evenement.animateur.nom +' <'+evenement.animateur.email+'>'
    });
    res.json({iCal: cal.toString()})
  }).populate('animateur', '_id nom prenom email');
}

exports.generate_post_notification = function(req, res) {
  Evenement.findById(req.params.evenementId, function(err, evenement) {
    if (evenement && evenement.participants) {
      evenement.participants.map(user => {
        let notif = new Notifications();
        notif.destinataire = user;
        notif.lien = 'historique/'+req.params.evenementId;
        notif.message = req.body.notifText;

        notif.save(function(err, not) {
        })
      })
      res.json({success: true})
    }
  }).populate('animateur', '_id nom prenom email');
}

exports.generate_mail_appointment = function(req,res) {
  User.findOne({
      email: req.user.email
    }, function(err, user) {
    Evenement.findById(req.params.evenementId, function(err, evenement) {
      // Create new Calendar and set optional fields
      var cal = ical({
          domain: 'sport.laboursidiere.com',
          timezone: 'Europe/Paris'
      });
      // create a new event
      var event = cal.createEvent({
        start: new Date(evenement.date_debut.getTime()),
        end: new Date(evenement.date_debut.getTime() + evenement.duree*60000),
        timestamp: new Date(),
        summary: evenement.name,
        description: evenement.description,
        organizer: evenement.animateur.prenom + ' ' + evenement.animateur.nom +' <'+evenement.animateur.email+'>'
      });
      mailer.sendMailWithAppointment([user.email], 'Invitation : '+evenement.name, evenement.description, cal.toString());
      res.json({success: true});
    }).populate('animateur', '_id nom prenom email');
  })
}

function sendMailInscrit(id, infoEvents, idEvent) {
  User.findById(id, function(err, user) {
      let notif = new Notifications();
      notif.destinataire = user;
      notif.lien = 'agenda/'+idEvent;
      notif.message = 'Tu étais en file d\'attente pour l\'évenement suivant : ' + infoEvents + '. Une place s\'est libérée, et tu fais partie des participants a présent. N\'oublie pas tes affaires !';

      notif.save(function(err, not) {
      })
      mailer.sendMail([user.email], 
        '[aslb] Inscription automatique à un événement', 
        'Bonjour. Tu étais en file d\'attente pour l\'évenement suivant : ' + infoEvents + '. Une place s\'est libérée, et tu fais partie des participants a présent. N\'oublie pas tes affaires !. Ce message est envoyé automatiquement, merci de ne pas y répondre.');
  });
};

function sendMailDesinscrit(id, infoEvents, idEvent) {
  User.findById(id, function(err, user) {
      let notif = new Notifications();
      notif.destinataire = user;
      notif.lien = 'agenda/'+idEvent;
      notif.message = 'Un changement de capacité à été éffectué pour l\'évenement suivant : ' + infoEvents + '. Tu es passé en file d\'attente. N \'hésites pas à contacter l\'animateur pour plus d\'informations';

      notif.save(function(err, not) {
      })
      mailer.sendMail([user.email], 
        '[aslb] Inscription automatique à un événement', 
        'Un changement de capacité à été éffectué pour l\'évenement suivant : ' + infoEvents + '. Tu es passé en file d\'attente. N \'hésites pas à contacter l\'animateur pour plus d\'informations. Ce message est envoyé automatiquement, merci de ne pas y répondre.');
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
    niveau: req.body.niveau,
    tokenConsumer: req.body.tokenConsumer
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
      if (err) {
        res.send(err);
      }
      compute_new_file_attente(evenement, 
        evt => {
          evt.save(function(err, evt2) {
            if (err) {
              res.send(err);
            }
            res.json(evt2);
        });
      })
    });
  } else {
    User.findById(new_evenement.coanimateurs[index], function(err,animateur) {

      check_evenement_conflit(animateur,new_evenement, res, 'pour l\'animateur', () => {
        check_coanims_conflit_or_update(new_evenement, res, req, complementString, index+1);
      })
    })
  }
}

function compute_new_file_attente(evenementIn, next) {
  Evenement.findById(evenementIn._id, function(err, evenement) {
    if (err) {
      res.send(err);
    }
    if (!evenement.participants) {
      evenement.participants = [];
    }
    //On vérifie si on doit bouger la file d'attente
    //Si pas d'attente et capacité correcte, on quitte
    let limite = evenement.limite === 0 ? 0 : evenement.limite || 99999;
    if (evenement.fileAttente.length === 0 && evenement.participants.length <= limite) {
      return next(evenement);
    } else 
    // Si on a + de places que d'utilisateurs, mais des gens en attente
    if (evenement.fileAttente.length > 0 && evenement.participants.length < limite) {
      while (evenement.fileAttente.length > 0 && evenement.participants.length < limite) {
        //changer file attente
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
        toDelete.remove(function(err, del) {});
      }
      return next(evenement);
    } else
    //Si on a - de places que d'utilisateurs, on doit retirer les derniers ?
    if (evenement.participants.length > limite) {
      //On décale les files d'attente
      evenement.fileAttente.map((itemAttente, index) => {
        minOrdre = itemAttente.ordre;
        indexMin = index;
        itemAttente.ordre=itemAttente.ordre + evenement.participants.length-limite;
        itemAttente.save(function(err, itm) {});
      });
      return add_to_queue_or_save(evenement,limite,next);
    } else {
      return next(evenement);
    }
    
  }).populate('fileAttente', '_id personne ordre');
}

function add_to_queue_or_save(evenement, limite, next) {
  var user = evenement.participants.pop();
  var queue = new Queue();
  queue.personne = user;
  queue.ordre = 1+evenement.participants.length - limite;
  sendMailDesinscrit(user, evenement.name + ' - ' + moment(evenement.date_debut).format('DD/MM/YYYY - HH:mm'), evenement._id);
  queue.save(function(err, queueSaved) {
    evenement.fileAttente.push(queueSaved);
    if (evenement.participants.length > limite) {
      return add_to_queue_or_save(evenement,limite,next);
    } else {
      return next(evenement);
    }
  });
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
  let dateDebut = new Date(event.date_debut.getTime());
  let dateDebutJournee = new Date(event.date_debut.getTime());
  let dateFin = new Date(event.date_debut.getTime() + event.duree*60000);
  let dateFinJournee = new Date(event.date_debut.getTime());
  dateDebutJournee.setHours(0);
  dateFinJournee.setHours(23);
  //On regarde si il y a un jour ferié
  return DayOff.find({
    date: {
      $gte: dateDebutJournee,
      $lt:  dateFinJournee
    }
  }, function(err, daysoffs) {
    if (daysoffs.length > 0) {
      return res.status(401).json({ message: 'Impossible : ce jour est defini comme sans activité pour cause de: '+daysoffs[0].reason });
    }
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
  })
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

exports.export_event = function(req, res) {
  
  Evenement.find({ date_debut: {$lt: Date.now()}}, function(err, events_db) {
    if (err) {
      res.send(err);
    }
    fill_event_data(events_db, true, events => {      
      var fields = ['name', 'description', 'typeEvenement','date_debut','duree', 'nbParticipants', 'limite', 'niveau',
      'nbAttente', 'nbAbsents', 'animateur', 'coanimateurs', 'nombreNotesRecue', 'noteMoyenneRecue']
      var fieldNames  = ['Nom', 'Description', 'Type d\'evenement', 'Date de debut', 'Duree', 'Nombre de participants', 'Limite', 'Niveau',
      'Nombre de gens en file d\'attente', 'Nombre d\'absents', 'Animateur', 'Co-animateurs', 'Nombre de notes recues', 'Note moyenne recue']
      json2csv({ data: events, fields: fields, fieldNames:fieldNames, quotes:'', del: ';' }, function(err, csv) {
        res.setHeader('Content-disposition', 'attachment; filename=data.csv');
        res.set('Content-Type', 'text/csv');
        return res.status(200).send(csv);
      });
    })
  }).populate('createur', '_id prenom nom')
  .populate('niveau', '_id name code')
  .populate('participants', '_id prenom nom sexe email')
  .populate('typeEvenement', '_id code name')
  .populate({path:'fileAttente', populate:{ path:'personne', select: '_id prenom nom email sexe'}})
  .populate('animateur', '_id prenom nom email')
  .populate('coanimateurs', '_id prenom nom email')
  .sort({date_debut: 1});
}

function fill_event_data(events_db, formatDate, cb) {
  var events = [];
  for (let index in events_db) {
    events.push({});
    events[index]['_id'] = events_db[index]['_id'];
    events[index]['name'] = events_db[index]['name'].replace(/;/g,',');
    events[index]['description'] = events_db[index]['description'] ? events_db[index]['description'].replace(/;/g,',') : '';
    events[index]['typeEvenement'] = events_db[index]['typeEvenement'] ? events_db[index]['typeEvenement'].name : '';
    events[index]['date_debut'] = moment(events_db[index]['date_debut'], moment.ISO_8601).format('DD/MM/YYYY HH:mm');
    events[index]['duree'] = events_db[index]['duree'];
    events[index]['nbParticipants'] = events_db[index]['participants'].length;
    events[index]['limite'] = events_db[index]['limite'];
    events[index]['niveau'] = events_db[index]['niveau'] ? events_db[index]['niveau'].name : '';
    events[index]['nbAttente'] = events_db[index]['fileAttente'] ? events_db[index]['fileAttente'].length : 0; 
    events[index]['nbAbsents'] = events_db[index]['absents'] ? events_db[index]['absents'].length : 0;
    events[index]['animateur'] = events_db[index]['animateur'] ? events_db[index]['animateur'].prenom + ' ' + events_db[index]['animateur'].nom : '';
    let coanims = '';
    if (events_db[index]['coanimateurs'] && events_db[index]['coanimateurs'].length > 0) {
      events_db[index]['coanimateurs'].map(anim => {
        coanims = coanims + ' ' + anim.prenom + ' ' + anim.nom + ' || '
      });
    }
    events[index]['coanimateurs'] = coanims;
    events[index]['nombreNotesRecue'] = 0;
    events[index]['noteMoyenneRecue'] = 0.0;
  }
  Commentaire.find({
    evenement: events_db
  }, function(err, comms) {
    if (err) {
      throw err;
    }
    comms.map(comm => {
      events.map(evt => {
        if (comm.evenement._id.toString() === evt._id.toString()) {
          evt.nombreNotesRecue +=1;
          evt.noteMoyenneRecue += comm.note;
        }
      })
    })
    events.map(evt => {
      if (evt.nombreNotesRecue > 0) {
        evt.noteMoyenneRecue = evt.noteMoyenneRecue / evt.nombreNotesRecue;
      }
    })
    cb(events);
  }).populate('evenement', '_id animateur coanimateurs');
}