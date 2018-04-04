'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  TypeEvenement = mongoose.model('TypeEvenement'),
  User= mongoose.model("User"),
  Badge = mongoose.model('Badge'),
  BadgeRecu= mongoose.model('BadgeRecu'),
  Presentation= mongoose.model('Presentation'),
  NiveauEvenement= mongoose.model('NiveauEvenement'),
  Profil = mongoose.model('Profil'),
  moment = require('moment'),
  Commentaire= mongoose.model('Commentaire');



exports.initBadges = function(user) {
  Badge.find({}, function(err, badgesTest) {
    badgesTest.map(badge => {
      if (badge.isMultiple ) {
        checkBadge(badge, user);
      } else {
        //On ne le teste que si on en a pas encore
        BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badgesExistants) {
          if (badgesExistants && badgesExistants.length > 0) {

          } else {
            checkBadge(badge, user);
          }
        })
      }  
    })  
  })
}

function checkBadge(badge, user) {
  console.log('Verification du badge '+badge.titre);
  eval(badge.requestCheck);
}

function createBadgeForEvenements(badge, user, evenements, expectedSize) {
  if (evenements && evenements.length === expectedSize) {
    var brecu = new BadgeRecu();
    brecu.badge = badge;
    brecu.user = user;
    brecu.evenements = evenements;
    brecu.save(function(err,rsfinal){
      if (badge.isMultiple) {
        checkBadge(badge,user);
      }
    });

  }
}

function createBadgeForEvenementsNotes(badge, user, commentaires, evenements, expectedSize) {
  if (evenements && evenements.length === expectedSize) {
    var brecu = new BadgeRecu();
    brecu.badge = badge;
    brecu.user = user;
    brecu.evenements = evenements;
    brecu.save(function(err,rsfinal){
      if (badge.isMultiple) {
        checkBadge(badge,user);
      }
    });

  }
}


function createBadgeForEvenementsInMonth(badge, user, evenements, expectedSize) {
  if (evenements && evenements.length >= expectedSize) {
    //On recherche les evenements dans le meme mois
    //Ils sont trié par ordre croissant
    var selectedEvents = [];
    var dateDebut = moment(new Date(evenements[0].date_debut), moment.ISO_8601).startOf('month');
    var dateFin = moment(new Date(evenements[0].date_debut), moment.ISO_8601).endOf('month');
    for (let index in evenements) {
      var date = moment(new Date(evenements[index].date_debut), moment.ISO_8601);
        if (date.isBefore(dateFin) && date.isAfter(dateDebut)) {
          selectedEvents.push(evenements[index]);
          if (selectedEvents.length == expectedSize) {
            createBadgeForEvenements(badge,user,selectedEvents,expectedSize);
            return;
          }
        } else {
          selectedEvents = [];
          var dateDebut = moment(new Date(evenements[index].date_debut), moment.ISO_8601).startOf('month');
          var dateFin = moment(new Date(evenements[index].date_debut), moment.ISO_8601).endOf('month');
          selectedEvents.push(evenements[index]);
        }
    }

  }
}