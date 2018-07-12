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

function requestBadgeAvatar(badge, user) {
  if (user.avatar) {
    createBadgeSimple(badge, user);
  };
}

function requestBadgeProfil(badge, user) {
  User.findById(user._id, function(err,user) {
    
    if (err || !user) {
      return ;
    }
    if (user.profil && user.profil._id) {
      createBadgeSimple(badge, user);
    };
  }).populate('profil', '_id description activitesVoulues raisonSport autreActivites records');
}

function requestBadgeEvenementCount(badge, user, FILTER_EVENEMENTS, LIMIT) {
  BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {
  var existingIds = [];
  if (badges) {
    badges.map(badgeAcquis => {existingIds = existingIds.concat(badgeAcquis.evenements)});
  }
  Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},FILTER_EVENEMENTS,{_id: {$nin: existingIds}}]}, function(err,res) {
   createBadgeForEvenements(badge, user,res, LIMIT);
  }).sort({date_debut: 1}).limit(LIMIT);
 });
}

function requestBadgeEvenementTypeCount(badge, user, CODE_EVENEMENT, FILTER_EVENEMENTS, LIMIT ) {
  BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {
  var existingIds = [];
  if (badges) {
    badges.map(badgeAcquis => {existingIds = existingIds.concat(badgeAcquis.evenements)});
  }
  TypeEvenement.find({code:CODE_EVENEMENT}, function(err, typeEvent){
    Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},FILTER_EVENEMENTS,{typeEvenement: typeEvent},{_id: {$nin: existingIds}}]}, function(err,res) {
      createBadgeForEvenements(badge, user,res, LIMIT);
    }).populate('typeEvenement','_id code').sort({date_debut: 1}).limit(LIMIT)
  })
 });
}

function requestBadgeEvenementAllTypeCount(badge, user, FILTER_EVENEMENTS, LIMIT ) {
  BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {
  var existingIds = [];
  if (badges) {
    badges.map(badgeAcquis => {existingIds = existingIds.concat(badgeAcquis.evenements)});
  }
  let mapEvents = new Map();
  TypeEvenement.find({}, function(err, typeEvents){
      typeEvents.map(typeEvt => {
        if (typeEvt.code !== 'ASLB') {
          mapEvents.set(typeEvt._id.toString(), []);
        }
      })
      Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},FILTER_EVENEMENTS,{typeEvenement: typeEvents},{_id: {$nin: existingIds}}]}, function(err,res) {
          res.map(evt => {
            if (mapEvents.has(evt.typeEvenement._id.toString()) && mapEvents.get(evt.typeEvenement._id.toString()).length < LIMIT) {
              mapEvents.get(evt.typeEvenement._id.toString()).push(evt);
            }
          })
          var toDoBadges = true;
          var allEvts = [];
          mapEvents.forEach(value => {
            if (value.length < LIMIT) {
              toDoBadges = false;
            } else {
              allEvts = allEvts.concat(value);
            }
          });
          console.log(mapEvents);
          if (toDoBadges) {
            createBadgeForEvenements(badge, user,allEvts, allEvts.length);
          }
      }).populate('typeEvenement','_id code').sort({date_debut: 1})
    })
 });
}

function requestBadgeNoteEvenementsCount(badge, user, LIMIT) { 
  BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {
  var existingIds = [];
  if (badges) {
    badges.map(badgeAcquis => {existingIds = existingIds.concat(badgeAcquis.evenements)});
  }
  Commentaire.find({auteur: user}, function(err, comms){
  var commsIds = [];
  comms.map(comm => {commsIds.push(comm.evenement)});
    Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},{_id: {$in: commsIds}},{_id: {$nin: existingIds}}]}, function(err,res) {
      createBadgeForEvenementsNotes(badge, user, comms, res, LIMIT);
    }).populate('typeEvenement','_id code').sort({date_debut: 1}).limit(LIMIT)
  })
 });
}

function requestBadgeNoteTypeEvenementsCount(badge, user, CODE_EVENEMENT, LIMIT) { 
  BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {
  var existingIds = [];
  if (badges) {
    badges.map(badgeAcquis => {existingIds = existingIds.concat(badgeAcquis.evenements)});
  }
  Commentaire.find({auteur: user}, function(err, comms){
  var commsIds = [];
  comms.map(comm => {commsIds.push(comm.evenement)});
    TypeEvenement.find({code:CODE_EVENEMENT}, function(err, typeEvent){
      Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},{_id: {$in: commsIds}},{typeEvenement: typeEvent},{_id: {$nin: existingIds}}]}, function(err,res) {
        createBadgeForEvenementsNotes(badge, user, comms, res, LIMIT);
      }).populate('typeEvenement','_id code').sort({date_debut: 1}).limit(LIMIT)
    })
  })
 });
}

 function requestBadgeEvenementInMonthCount(badge, user, FILTER_EVENEMENTS, LIMIT) {
    BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {
    var existingIds = [];
    var filterDate = [];
    if (badges) {
    badges.map(badgeAcquis => {
        badgeAcquis.evenements.map(evtBadge => {
          existingIds = existingIds.concat(evtBadge._id);
          var dateDebut = moment(new Date(evtBadge.date_debut), moment.ISO_8601).startOf('month').toDate();
          var dateFin = moment(new Date(evtBadge.date_debut), moment.ISO_8601).endOf('month').toDate();
          filterDate.push({$or: [{
          date_debut: {$lt: dateDebut}
          },{
            date_debut: {$gt: dateFin}
          }]})
        });
      });
    }
    if (filterDate.length === 0) {
      filterDate.push({ date_debut: {$lt: Date.now()}});
    }
    Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},{$and: filterDate},FILTER_EVENEMENTS,{_id: {$nin: existingIds}}]}, function(err,res) {
    createBadgeForEvenementsInMonth(badge, user,res, LIMIT);
    }).sort({date_debut: 1})
  }).populate('evenements', '_id date_debut');
}

function requestBadgeTypeEvenementInMonthCount(badge, user,CODE_EVENEMENT, FILTER_EVENEMENTS, LIMIT) {
  BadgeRecu.find({$and:[{user: user},{badge: badge}]}, function(err, badges) {
  var existingIds = [];
  var filterDate = [];
  if (badges) {
  badges.map(badgeAcquis => {
      badgeAcquis.evenements.map(evtBadge => {
        existingIds = existingIds.concat(evtBadge._id);
        var dateDebut = moment(new Date(evtBadge.date_debut), moment.ISO_8601).startOf('month').toDate();
        var dateFin = moment(new Date(evtBadge.date_debut), moment.ISO_8601).endOf('month').toDate();
        filterDate.push({$or: [{
        date_debut: {$lt: dateDebut}
        },{
          date_debut: {$gt: dateFin}
        }]})
      });
    });
  }
  if (filterDate.length === 0) {
    filterDate.push({ date_debut: {$lt: Date.now()}});
  }
  TypeEvenement.find({code:CODE_EVENEMENT}, function(err, typeEvent){
    Evenement.find({$and:[{ date_debut: {$lt: Date.now()}},{$and: filterDate},FILTER_EVENEMENTS,{typeEvenement: typeEvent},{_id: {$nin: existingIds}}]}, function(err,res) {
    createBadgeForEvenementsInMonth(badge, user,res, LIMIT);
    }).sort({date_debut: 1})
  })
}).populate('evenements', '_id date_debut');
}


exports.insert_badges_default = function() {

  Badge.findOneAndUpdate({titre: '5 Evenements'}, {
    titre: '5 Evenements',
    code:'Bronze',
    isMultiple: false,
    requestCheck: 'requestBadgeEvenementCount(badge, user, {participants: user}, 5)'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: '5 Crossfit'}, {
    titre: '5 Crossfit',
    code:'Bronze',
    isMultiple: true,
    requestCheck: 'requestBadgeEvenementTypeCount(badge, user, \'FG\',{participants: user}, 5)'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: '5 Evenements en un mois'}, {
    titre: '5 Evenements en un mois',
    code:'Argent',
    isMultiple: true,
    requestCheck: 'requestBadgeEvenementInMonthCount(badge, user, {participants: user}, 4)'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: 'Noter 2 evenements'}, {
    titre: 'Noter 2 evenements',
    code:'Bronze',
    isMultiple: true,
    requestCheck: 'requestBadgeNoteEvenementsCount(badge, user, 2)'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: 'Animer 3 Evenements en un mois'}, {
    titre: 'Animer 3 Evenements en un mois',
    code:'Or',
    isMultiple: true,
    requestCheck: 'requestBadgeEvenementInMonthCount(badge, user, {animateur: user}, 2)'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: 'Faire 1 de chaque'}, {
    titre: 'Faire 1 de chaque',
    code:'Argent',
    isMultiple: false,
    requestCheck: 'requestBadgeEvenementAllTypeCount(badge, user, {participants: user}, 1)'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Badge.findOneAndUpdate({titre: 'Faire 3 de chaque'}, {
    titre: 'Faire 3 de chaque',
    code:'Or',
    isMultiple: false,
    requestCheck: 'requestBadgeEvenementAllTypeCount(badge, user, {participants: user}, 3)'
  }, {upsert: true, 'new': true}, function(err, model) {
  });
}


exports.initBadges = function(user) {
  Badge.find({actif: true}, function(err, badgesTest) {
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

function createBadgeSimple(badge, user) {
    var brecu = new BadgeRecu();
    brecu.badge = badge;
    brecu.user = user;
    brecu.save(function(err,rsfinal){
      if (badge.isMultiple) {
        checkBadge(badge,user);
      }
    });
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

exports.loadAllBadges = function(req, res) {
  Badge.find({}, function(err, badges) {
      if (err) {
        res.send(err);
      }
      res.json(badges);
  });
}

exports.editBadges = function(req, res) {
  if (req.body.id) {
  Badge.findOneAndUpdate({_id:req.body.id}, req.body, {new: true}, function(err, news) { 
      if (err) {
        console.log(err)
        res.send(err);
      }
      res.json({updated: true}); 
    });  
  } else {
    var badge = new Badge(req.body);
    badge.save(function(err, bd) {
      if (err)
        res.send(err);
      res.json(bd);
    });
  }
}