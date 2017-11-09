'use strict';

module.exports = function(app) {
	var eventHandler = require('../controllers/evenementController'),
	userHandlers = require('../controllers/userController.js'),
	adminHandler = require('../controllers/adminController');

	// todoList Routes
	app.route('/evenements')
		.get(eventHandler.list_all_evenements)
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.canMembreCreerCours, eventHandler.create_a_evenement);

	app.route('/evenements/next')
		.get(eventHandler.list_all_incoming_evenements)
		
	app.route('/evenements/:evenementId')
		.get(eventHandler.read_a_evenement)
		.put(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isEvenementOwner, eventHandler.update_a_evenement)
		.delete(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isEvenementOwner, eventHandler.delete_a_evenement);

	app.route('/evenements/addSelf/:evenementId')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, eventHandler.add_self_to_evenement);
	app.route('/evenements/removeSelf/:evenementId')
		.post(userHandlers.loginRequired, eventHandler.remove_self_to_evenement);

	app.route('/auth/register')
		.post(userHandlers.register);

	app.route('/auth/sign_in')
		.post(userHandlers.sign_in);

	app.route('/me')
		.get(userHandlers.me);
	app.route('/typeEvenements')
		.get(eventHandler.list_all_type_evenements);

	app.route('/activate')
		.post(userHandlers.activate);
	
	app.route('/changePassword')
		.post(userHandlers.changePassword);
	
	app.route('/sendMailReset')
		.post(userHandlers.sendMailReset);

	app.route('/myEvenements')
		.get(eventHandler.list_my_evenements);
		
	app.route('/partenaires')
		.get(adminHandler.list_all_partenaires)
		.put(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isAdmin, adminHandler.create_partenaire)

	app.route('/partenaires/:id')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isAdmin, adminHandler.edit_partenaire)

	app.route('/news')
		.get(adminHandler.list_all_news)
		.put(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isAdmin, adminHandler.create_news)

	app.route('/news/:id')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isAdmin, adminHandler.edit_news)

	app.route('/users')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isAdmin, userHandlers.load_users)

	app.route('/usersAutocomplete')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.load_users_autocomplete)

	app.route('/toggleCreation/:id')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isAdmin, userHandlers.toggle_creation)
	app.route('/toggleAdmin/:id')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isAdmin, userHandlers.toggle_admin)
	app.route('/updateUser/:id')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isAdmin, userHandlers.update_date_activation)

	app.route('/uploadAvatar')
		.post(userHandlers.loginRequired, userHandlers.changeAvatar)
};
