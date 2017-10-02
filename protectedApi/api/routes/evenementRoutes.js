'use strict';

module.exports = function(app) {
	var todoList = require('../controllers/evenementController'),
	userHandlers = require('../controllers/userController.js');

	// todoList Routes
	app.route('/evenements')
		.get(todoList.list_all_evenements)
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, todoList.create_a_evenement);

	app.route('/evenements/:evenementId')
		.get(todoList.read_a_evenement)
		.put(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isEvenementOwner, todoList.update_a_evenement)
		.delete(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isEvenementOwner, todoList.delete_a_evenement);

	app.route('/evenements/addSelf/:evenementId')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, todoList.add_self_to_evenement);
	app.route('/evenements/removeSelf/:evenementId')
		.post(userHandlers.loginRequired, todoList.remove_self_to_evenement);

	app.route('/auth/register')
		.post(userHandlers.register);

	app.route('/auth/sign_in')
		.post(userHandlers.sign_in);

	app.route('/me')
		.get(userHandlers.me);

		
};
