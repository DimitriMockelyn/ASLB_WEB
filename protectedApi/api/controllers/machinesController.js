'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  TypeEvenement = mongoose.model('TypeEvenement'),
  User= mongoose.model("User"),
  CreneauMachine= mongoose.model('CreneauMachine'),
  Machine = mongoose.model('Machine'),
  BlocAdministrables = mongoose.model('BlocAdministrables'),
  moment = require('moment'),
  mailer = require('../utils/mailer');


const heureDebut = 7;
const minuteDebut = 0;
const duree = 30;
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