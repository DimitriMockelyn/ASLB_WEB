'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  TypeEvenement = mongoose.model('TypeEvenement'),
  User= mongoose.model("User"),
  CreneauMachine= mongoose.model('CreneauMachine'),
  Machine = mongoose.model('Machine'),
  Activity = mongoose.model('Activity'),
  CreneauActivity = mongoose.model('CreneauActivity'),
  ActivityTime = mongoose.model('ActivityTime'),
  BlocAdministrables = mongoose.model('BlocAdministrables'),
  moment = require('moment'),
  mailer = require('../utils/mailer');


const heureDebut = 7;
const minuteDebut = 0;
const duree = 30;
const dureeActivity = 60;
const heureDernier = 19;
const minuteDernier = 30;

const initCreneauxIfNeededForDay = function(day, month, year, next) {
  
  var newDate = moment();
  newDate.set('year', year);
  newDate.set('month', month-1); //Month are 0 based
  newDate.set('date', day);
  newDate.startOf('day');
  var endDate = newDate.clone()
  endDate.endOf('day');
  Machine.find({}, function(err, machines) {
      //On regarde, pour toutes les machines, si on a des creneaux a ce jour
      CreneauMachine.find({$and:[{
        dateDebut: {$lt: endDate}
      }, {
        dateDebut: {$gt: newDate}
      } ]
    }, function( err, creneaux) {
        let crens = [];
        let date = newDate.clone();
        date.set('hour', heureDebut).set('minute',minuteDebut);
        let dateDernier = newDate.clone()
        dateDernier.set('hour', heureDernier).set('minute',minuteDernier);
        while (!date.isAfter(dateDernier)) {
          //Création des creneaux, de 8h a 20h
          machines.map(mch => {
            let cren = new CreneauMachine();
            cren.machine = mch._id;
            cren.dateDebut = date.clone();
            crens.push(cren);
          });
          date.add(duree,'minutes');
        }
        crens = crens.filter(cren => {
          let exists = creneaux.find(existingcren => {
            return existingcren.machine.toString() === cren.machine.toString() && moment(existingcren.dateDebut).isSame(moment(cren.dateDebut))
          })
          return exists === undefined;
        });
        // save multiple documents to the collection referenced by Book Model
        CreneauMachine.collection.insert(crens, function (err, crens) {
          next();
        });
    });
  });
}

const initActivityIfNeededForDay = function(day, month, year, next) {
  
  var newDate = moment();
  newDate.set('year', year);
  newDate.set('month', month-1); //Month are 0 based
  newDate.set('date', day);
  newDate.startOf('day');
  var endDate = newDate.clone()
  endDate.endOf('day');
  var daysofweek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
  ActivityTime.find({}, function(err, actTimes) {
    Activity.find({}, function(err, activitys) {
        //On regarde, pour toutes les activitys, si on a des creneaux a ce jour
        CreneauActivity.find({$and:[{
          dateDebut: {$lt: endDate}
        }, {
          dateDebut: {$gt: newDate}
        } ]
      }, function( err, creneaux) {
          let crens = [];
          let date = newDate.clone();
          date.set('hour', heureDebut).set('minute',minuteDebut);
          let dateDernier = newDate.clone()
          dateDernier.set('hour', heureDernier).set('minute',minuteDernier);
          while (!date.isAfter(dateDernier)) {
            let unlockEnd = undefined;
            let unlockBegin = undefined;
            actTimes.forEach(function(actTime) {
              if (daysofweek.indexOf(actTime.jour) +1 === date.isoWeekday()) {
                unlockEnd = actTime.heureFin;
                unlockBegin = actTime.heureDebut;
              }
            })
            let locked = false;
            if (unlockEnd && unlockBegin) {
              var heureDebutUnlock = newDate.clone();
              var heureFinUnlock = newDate.clone();
              heureDebutUnlock.set('hour', unlockBegin.split(":")[0]).set('minute',unlockBegin.split(":")[1]);
              heureFinUnlock.set('hour', unlockEnd.split(":")[0]).set('minute',unlockEnd.split(":")[1]);
              if (date.isAfter(heureFinUnlock) || date.isBefore(heureDebutUnlock)) {
                locked = true
              }
            }
            //Création des creneaux, de 8h a 20h
            activitys.map(mch => {
              let cren = new CreneauActivity();
              cren.activity = mch._id;
              cren.dateDebut = date.clone();
              cren.locked = locked;
              crens.push(cren);
            });
            date.add(dureeActivity,'minutes');
          }
          crens = crens.filter(cren => {
            let exists = creneaux.find(existingcren => {
              return existingcren.activity.toString() === cren.activity.toString() && moment(existingcren.dateDebut).isSame(moment(cren.dateDebut))
            })
            return exists === undefined;
          });
          // save multiple documents to the collection referenced by Book Model
          CreneauActivity.collection.insert(crens, function (err, crens) {
            next();
          });
      });
    });
  });
  }

exports.load_list_activity = function(req, res) {
  const {day, month, year} = req.body;
  initActivityIfNeededForDay(day,month,year, () => {
    var newDate = moment();
    newDate.set('year', year);
    newDate.set('month', month-1); //Month are 0 based
    newDate.set('date', day);
    newDate.startOf('day');
    var endDate = newDate.clone();
    endDate.endOf('day');
    //On regarde, pour toutes les activites, si on a des creneaux a ce jour
    CreneauActivity.find({$and:[{
        dateDebut: {$lt: endDate}
      }, {
        dateDebut: {$gt: newDate}
      }]
    }, function( err, creneaux) {
        res.json(creneaux);
    }).populate('activity', '_id nom type').populate('createur', '_id nom prenom').populate('participants', '_id prenom nom email')
  });
}

exports.load_list_machine = function(req, res) {
  const {day, month, year} = req.body;
  initCreneauxIfNeededForDay(day,month,year, () => {
    var newDate = moment();
    newDate.set('year', year);
    newDate.set('month', month-1); //Month are 0 based
    newDate.set('date', day);
    newDate.startOf('day');
    var endDate = newDate.clone();
    endDate.endOf('day');
    //On regarde, pour toutes les machines, si on a des creneaux a ce jour
    CreneauMachine.find({$and:[{
        dateDebut: {$lt: endDate}
      }, {
        dateDebut: {$gt: newDate}
      }]
    }, function( err, creneaux) {
        res.json(creneaux);
    }).populate('machine', '_id nom type').populate('membre', '_id nom prenom')
  });
}

exports.create_activity_in_creneau = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    CreneauActivity.findById(req.params.creneauId, function(err, creneau) {
      creneau.createur = user;
      creneau.title = req.body.title;
      creneau.limite = req.body.limite;
      creneau.description = req.body.description;
      creneau.save(function(err, crn) {
        CreneauActivity.findById(crn._id, function(err, result) {
          res.json(result);
        }).populate('activity', '_id nom type').populate('createur', '_id nom prenom')
      })
    });
  })
}

exports.toggle_self_for_machine = function(req, res) {
  User.findOne({
    email: req.user.email
  }, function(err, user) {
    CreneauMachine.findById(req.params.id, function(err, creneau) {
      let dateFinCreneau = moment(creneau.dateDebut).clone();
      dateFinCreneau.add(duree,'minutes');
      if (!moment().isAfter(dateFinCreneau)) {
        if (creneau.membre && creneau.membre.toString() !== user._id.toString()) {
          return res.status(401).json({ message: 'Ce créneau est déjà réservé' });
        }
        //On verifie le doublon d'inscription
        CreneauMachine.find({
          $and:[{
              dateDebut: moment(creneau.dateDebut)
          }, {
            membre: user
          }, {
            _id: {$ne: creneau._id}
          }]

        }, function( err, creneauxPendant) {
          if (creneauxPendant && creneauxPendant.length > 0) {
            return res.status(401).json({ message: 'Vous ne pouvez pas monopoliser deux machines en même temps' });
          }

        //On vérifie les conflits suplémentaires : pas le droit de faire 2 machines pareil de suite
        let dateDebutCreneauPrec = dateFinCreneau.clone().add(-2*duree, 'minutes');
        CreneauMachine.find({
          $and:[{
            $or: [{
              dateDebut: dateFinCreneau
            }, {
              dateDebut: dateDebutCreneauPrec
            }]}
          , {
            membre: user
          }]

        }, function( err, creneauxAvantApres) {
          for (let index in creneauxAvantApres) {
            if (creneauxAvantApres[index].machine.type === creneau.machine.type) {
              return res.status(401).json({ message: 'Pour laisser la place aux autres, il est interdit de réserver deux fois de suite une même machine. Si elle reste libre, vous pourrez continuer à l\'utiliser' });
            }
          }

          if (creneau.membre) {
            creneau.membre = undefined;
          } else {
            creneau.membre = user;
          }
          //Avant d'enregistrer, on vérifie si il n'y a pas conflit d'evenement
          check_evenement_conflit_machine(res,creneau,user, () => {
            creneau.save(function(err, crn) {
              CreneauMachine.findById(crn._id, function(err, result) {
                res.json(result);
              }).populate('machine', '_id nom type').populate('membre', '_id nom prenom')
            })
          })

        }).populate('machine', '_id nom type')
      })
      } else {
        return res.status(401).json({ message: 'Vous ne pouvez pas faire cette action sur un creneau machine passé' });
      }
    }).populate('machine', '_id nom type')
  })
}

function check_evenement_conflit_machine(res, creneau, user, next) {
  if (!creneau.membre) {
    return next();
  }
  //Si l'utilisateur a reservé une activité au meme moment il faut lancer une erreur
  let dateDebutJournee = new Date(creneau.dateDebut.getTime());
  let dateFinJournee = new Date(creneau.dateDebut.getTime());
  let dateDebut = new Date(creneau.dateDebut.getTime());
  let dateFin = new Date(creneau.dateDebut.getTime() + duree*60000);
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
      if (
        (dateDebutEvent <= dateDebut && dateFinEvent > dateDebut) || //Debut du nouvel evenement pendant un autre
        (dateDebutEvent < dateFin && dateFinEvent >= dateFin) || //Fin du nouvel evenement pendant un autre
        (dateDebut <= dateDebutEvent && dateFin > dateFinEvent) || //Debut du nouvel evenement pendant un autre
        (dateDebut < dateFinEvent && dateFin >= dateFinEvent) //Fin du nouvel evenement pendant un autre
      ) {
        //Cette activité est en conflit, on vérifie la liste des participants
        if (existingEvent.animateur.toString() === user._id.toString()) {
          return res.status(401).json({ message: 'Vous êtes déjà inscrit à une autre activité sur cet horaire. Veuillez choisir un autre créneau.' });
        }
        if (existingEvent.coanimateurs.indexOf(user._id.toString()) > -1 ) {
          return res.status(401).json({ message: 'Vous êtes déjà inscrit à une autre activité sur cet horaire. Veuillez choisir un autre créneau.' });
        }
        if (existingEvent.participants.length > 0) {
          for (let index2  = 0; index2 < existingEvent.participants.length; index2++) {
            let ptp = existingEvent.participants[index2];
            if (ptp && ptp._id.toString() === user._id.toString()) {
              return res.status(401).json({ message: 'Vous êtes déjà inscrit à une autre activité sur cet horaire. Veuillez choisir un autre créneau.' });
            }
          };
        }
        if (existingEvent.fileAttente.length > 0) {
          for (let index2  = 0; index2 < existingEvent.fileAttente.length; index2++) {
            let ptp = existingEvent.fileAttente[index2];
            if (ptp && ptp.personne.toString() === user._id.toString()) {
              return res.status(401).json({ message: 'Vous êtes déjà inscrit à une autre activité sur cet horaire. Veuillez choisir un autre créneau.' });
            }
          };
        }
        
      }
    }
    return next();
    
  }).populate('fileAttente', '_id personne ordre').populate('participants', '_id prenom nom email');
}

exports.add_self_to_activite = function(req, res) {
  CreneauActivity.findById(req.params.creneauId, function(err, evenement) {
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
        if (evenement.dateDebut.getTime() > user.date_fin.getTime()) {
            return res.status(401).json({ message: 'Cette activité est apres votre fin d\'ashésion' });
        }
        //On vérifie qu'on ajoute pas de doublons
        if (evenement.participants.indexOf(user._id) === -1) {
          //Y a t'il encore de la place ?
          if (evenement.limite !== undefined && evenement.limite !== null && evenement.participants.length >= evenement.limite) {
            return res.status(401).json({ message: 'Cette activité est complete' }); //Deja en file d'attente
          } else {
            evenement.participants.push(user);
            evenement.save(function(err, evenement) {
              if (err)
                res.send(err);
              res.json(evenement);
            });
          }
        } else {
          res.json(evenement);
        }
    });

  })
};

const remove_one_from_evenement = function(req, res, user, evenementId, next) {
  CreneauActivity.findById(evenementId, function(err, evenement) {
    if (err) {
      res.send(err);
    }
    if (!evenement.participants) {
      evenement.participants = [];
    }

    //On vérifie qu'on ajoute pas de doublons
    
    for (var i = 0; i < evenement.participants.length; i++) {
      if (evenement.participants[i].toString() === user._id.toString()) {
          evenement.participants.splice(i, 1);
          i--;
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
  })
}

exports.remove_one_from_evenement = remove_one_from_evenement;

exports.remove_self_to_activite = function(req, res) {
    User.findOne({
      email: req.user.email
    }, function(err, user) {
      remove_one_from_evenement(req, res, user, req.params.creneauId, evenement => {
        evenement.save(function(err, evenement) {
          if (err) {
            res.send(err);
          }
          res.json(evenement);
      });
    });
  });
};


exports.update_a_activite = function(req, res) {
  CreneauActivity.findOneAndUpdate({_id:req.params.creneauId}, {limite: req.body.limite, title: req.body.title, description: req.body.description}, {new: true}, function(err, newComm) {
    if (err) {
      res.send(err);
    }
    res.json({update: true});
  });
}; 

exports.toggle_lock = function(req, res) {
  CreneauActivity.findOneAndUpdate({_id:req.params.creneauId}, {locked: req.body.locked}, {new: true}, function(err, newComm) {
    if (err) {
      res.send(err);
    }
    res.json({update: true});
  });
}; 

exports.delete_a_activite = function(req, res) {

  CreneauActivity.findOneAndUpdate({_id:req.params.creneauId}, {limite: 0, createur: undefined, title: undefined, description: undefined, participants:[]}, {new: true}, function(err, newComm) {
    if (err) {
      res.send(err);
    }
    res.json({update: true});
  });
};