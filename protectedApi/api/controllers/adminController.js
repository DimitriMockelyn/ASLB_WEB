'use strict';

var mongoose = require('mongoose'),
  Evenement = mongoose.model('Evenement'),
  TypeEvenement = mongoose.model('TypeEvenement'),
  User= mongoose.model("User"),
  Partenaire = mongoose.model('Partenaire'),
  News= mongoose.model('News'),
  Sexe=mongoose.model('Sexe'),
  Entreprise=mongoose.model('Entreprise'),
  mailer = require('../utils/mailer');



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

  TypeEvenement.findOneAndUpdate({code: 'AUTRE'}, {
    name: 'Autre',
    code:'AUTRE'
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

  Entreprise.findOneAndUpdate({code: 'KLEE'}, {
    label: 'Klee Group',
    code:'KLEE'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Entreprise.findOneAndUpdate({code: 'TOK'}, {
    label: 'Tokheim',
    code:'TOK'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Entreprise.findOneAndUpdate({code: 'MIS'}, {
    label: 'MISCO',
    code:'MIS'
  }, {upsert: true, 'new': true}, function(err, model) {
  });

  Entreprise.findOneAndUpdate({code: 'AUT'}, {
    label: 'Autre',
    code:'AUT'
  }, {upsert: true, 'new': true}, function(err, model) {
  });
    
  Partenaire.findOneAndUpdate({name: 'La Boursidière'}, {
    name: 'La Boursidière',
    url: 'http://www.laboursidiere.com',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUDXCyyoJ4jxwRDHB8-_d6GaLkxkxVqoljEsFLzxQPDlMMWXJt0A',
    description:'<div>Vous connaissiez la Boursidière, centre d’affaires '+
    'emblématique du sud de l’Ile-de-France, qui '+
    'a vu s’épanouir les fleurons de l’économie tels '+
    'Renault, Sun Microsystem, Bouygues Telecom… </div>'+
    '<br/>'+
    '<div style=\'font-weight:bold\'>Vous allez maintenant découvrir '+
    'La Boursidière 2.0. '+
    '</div><br/>'+
    '<div>Un working hub, né de la rénovation de La '+
    'Boursidière et promis à un nouvel avenir par des '+
    'investissements à sa mesure. '+
    'Sa situation demeure exceptionnelle : à seulement '+
    '10 minutes de Paris, dans un écrin de verdure, '+
    'facilement accessible en transports en commun '+
    'ou par l’A86 et son accès dédié. Mais aujourd’hui, '+
    'son attrait se voit décuplé par une nouvelle '+
    'façade, de nouveaux jardins et de nouveaux '+
    'services en phase avec les attentes des entreprises '+
    'et celles de leurs salariés. '+
    'L’étude « Mon bureau idéal en Ile-de-France » réalisée '+
    'sur Facebook, démontre que La Boursidière 2.0 '+
    'correspond en de nombreux points au bureau '+
    'idéal en Ile-de-France.</div>'
    }, {upsert: true, 'new': true}, function(err, model) {
  });

  //TODO for the lolz, a supprimer quand plus de données :)
  Partenaire.findOneAndUpdate({name: 'Dimitri Mockelyn'}, {
    name: 'Dimitri Mockelyn',
    url: 'https://www.strava.com/athletes/23700855',
    logo: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/23700855/6809599/2/large.jpg',
    description:'<div>Dimitri Mockelyn est un jeune cadre dynamique travaillant à La Boursidière depuis novembre 2014.</div><br/>'+
    '<div>Simple et modeste, c\'est un homme plein de qualités. Beau, fort, intelligent, attentionné, raffiné, drôle, endurant, impliqué et passionné font partie des superlatifs'+
    ' utilisés courramment pour le décrire. Doté d\'une force d\'esprit hors du commun, il se met à la course à pied en 2015 et ne quitte plus ses baskets depuis.</div><br />'+
    '<div>Au delà de ses atouts physique, sa capacité à résoudre les problèmes les plus compliqués l\'enmène souvent vers des terrains inconnus pour apprendre de nouvelles choses.</div><br />'+
    '<div>Tout recemment, il s\'est lancé dans le projet fou de monter une association avec 2 de ses amis du footing, et d\'en faire le site internet from scratch.</div><br />'+
    '<div>Il apprend en meme temps à gérer le texte riche en base de données, <div style=\'color:deeppink; font-weight:bold;font-size:24px;\'>et cette phrase va maintenant vous faire mal aux yeux.</div></div><br />'+
    '<div>Voici une otarie qui tourne : <img style=\'height: 150px;\' src=\'https://i.giphy.com/media/I1LdIdXTx3ZE4/giphy.webp\'/></div>'
    }, {upsert: true, 'new': true}, function(err, model) {
  });
    

}

exports.list_all_partenaires = function(req, res) {
  Partenaire.find({}, function(err, ptns) {
    if (err) {
      res.send(err);
    }
    res.json(ptns);
  });
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


exports.create_partenaire = function(req, res) {
  var new_ptn = new Partenaire(req.body);
  new_ptn.save(function(err, news) {
    if (err)
      res.send(err);
    res.json({created: true});
  });
};

exports.edit_partenaire = function(req, res) {
  var data = {
    name: req.body.name,
    logo: req.body.logo,
    url: req.body.url,
    description: req.body.description
  }
  Partenaire.findOneAndUpdate({_id:req.params.id}, data, {new: true}, function(err, news) {
    if (err)
      res.send(err);
    res.json({updated: true});
  });
};