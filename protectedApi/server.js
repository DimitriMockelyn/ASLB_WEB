'use strict';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  User = require('./api/models/userModel'),
  Evenement = require('./api/models/evenementModel'),
  TypeEvenement = require('./api/models/typeEvenementModel'),
  TokenUser = require('./api/models/tokenUserModel'),
  Partenaire = require('./api/models/partenaireModel'),
  Ribbon = require('./api/models/ribbonModel'),
  Sexe = require('./api/models/sexeModel'),
  Entreprise = require('./api/models/entrepriseModel'),
  News = require('./api/models/newsModel'),
  Commentaire = require('./api/models/commentaireModel'),
  Presentation = require('./api/models/presentationModel'),
  NiveauEvenement= require('./api/models/niveauEvenementModel'),
  Notifications= require('./api/models/notificationModel'),
  Message = require('./api/models/messageModel'),
  Profil = require('./api/models/profilModel'),
  Queue = require('./api/models/queueModel'),
  Badge = require('./api/models/badgeModel'),
  BadgeRecu = require('./api/models/badgeRecuModel'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ASLBDB');

var adminController = require('./api/controllers/adminController');
var {getConfig} = require('./config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Set CORS header and intercept "OPTIONS" preflight call from AngularJS
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cache-Control,X-Requested-With');
    if (req.method === "OPTIONS") 
        res.send(200);
    else 
        next();
}

app.use(allowCrossDomain);

app.use(function(req, res, next) {
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', getConfig().url);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,Cache-Control,X-Requested-With');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
	
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
var routes = require('./api/routes/evenementRoutes');
routes(app);



app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);

console.log('RESTful API server started on: ' + port);
adminController.initData();
module.exports = app;