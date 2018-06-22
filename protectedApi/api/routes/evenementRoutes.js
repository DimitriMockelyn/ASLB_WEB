'use strict';

module.exports = function(app) {
	var eventHandler = require('../controllers/evenementController'),
	userHandlers = require('../controllers/userController.js'),
	homeController = require('../controllers/homeController'),
	profileController = require('../controllers/profileController'),
	adminHandler = require('../controllers/adminController'),
	machinesController = require('../controllers/machinesController');

	// todoList Routes
	app.route('/evenements')
		.get(eventHandler.list_all_evenements)
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.canMembreCreerCours, eventHandler.create_a_evenement); 

	app.route('/evenementsWeek/:numWeek')
		.get(eventHandler.list_all_evenements)

	app.route('/evenements/next')
		.get(eventHandler.list_all_incoming_evenements)

	app.route('/evenements/history')
		.get(userHandlers.loginRequired, eventHandler.list_my_history)
		
	app.route('/evenements/:evenementId')
		.get(eventHandler.read_a_evenement)
		.put(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isEvenementOwner, userHandlers.isEvenementFutur, eventHandler.update_a_evenement)
		.delete(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isEvenementOwner, userHandlers.isEvenementFutur, eventHandler.delete_a_evenement); 

	app.route('/evenements/addSelf/:evenementId')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, userHandlers.isEvenementFutur, userHandlers.inscriptionTokenPossible, eventHandler.add_self_to_evenement);
	app.route('/evenements/removeSelf/:evenementId')
		.post(userHandlers.loginRequired, userHandlers.isEvenementFutur, eventHandler.remove_self_to_evenement);

	app.route('/evenements/generateAppointment/:evenementId')
		.post(userHandlers.loginRequired, userHandlers.isEvenementFutur, eventHandler.generate_appointment);

	app.route('/evenements/sendMailAppointment/:evenementId')
		.post(userHandlers.loginRequired, userHandlers.isEvenementFutur, eventHandler.generate_mail_appointment);

	app.route('/auth/register')
		.post(userHandlers.register);

	app.route('/auth/registerFromAdmin')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, userHandlers.registerFromAdmin);

	app.route('/auth/sign_in')
		.post(userHandlers.sign_in);

	app.route('/me')
		.get(userHandlers.me);
	app.route('/typeEvenements')
		.get(eventHandler.list_all_type_evenements)
		.put(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.create_type_evenement);

	app.route('/typeEvenements/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.edit_type_evenement)
		.delete(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.delete_type_evenement)

	app.route('/niveauEvenements')
		.get(eventHandler.list_all_niveau_evenements);

	app.route('/typeSexe')
		.get(userHandlers.list_all_sexes);

	app.route('/typeEntreprise')
		.get(userHandlers.list_all_entreprises);

	app.route('/activate')
		.post(userHandlers.activate);
	
	app.route('/changePassword')
		.post(userHandlers.changePassword);

	app.route('/changePasswordConnecte')
		.post(userHandlers.loginRequired, userHandlers.changePasswordConnecte);
	
	app.route('/sendMailReset')
		.post(userHandlers.sendMailReset);
	
	app.route('/sendMailFirst')
		.post(userHandlers.sendMailFirst);

	app.route('/myEvenements')
		.get(userHandlers.loginRequired, eventHandler.list_my_evenements);

	app.route('/myEvenementsWeek/:numWeek') 
		.get(userHandlers.loginRequired, eventHandler.list_my_evenements);
		
	app.route('/partenaires')
		.get(adminHandler.list_all_partenaires)
		.put(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.create_partenaire)

	app.route('/partenaires/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.edit_partenaire)
		.delete(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.delete_partenaire)

	app.route('/news')
		.get(adminHandler.list_all_news)
		.put(userHandlers.loginRequired, userHandlers.isAdmin, adminHandler.create_news)

	app.route('/news/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.edit_news)
		.delete(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.delete_news)

	app.route('/users')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, userHandlers.load_users)

	app.route('/usersExport')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, userHandlers.export_users)

	app.route('/usersAutocomplete')
		.post(userHandlers.load_users_autocomplete)

	app.route('/toggleCreation/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, userHandlers.toggle_creation)
	app.route('/toggleAdmin/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, userHandlers.toggle_admin)

	app.route('/toggleActif/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, userHandlers.toggle_actif)

	app.route('/updateUser/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, userHandlers.update_date_activation)

	app.route('/uploadAvatar')
		.post(userHandlers.loginRequired, userHandlers.changeAvatar)

	app.route('/commentaire/:evenementId')
		.get(userHandlers.loginRequired, userHandlers.isMembreActif, eventHandler.get_commentaire_for_user)
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, eventHandler.post_commentaire_for_user);

	app.route('/loadAbsents/:evenementId')
		.get(userHandlers.loginRequired, userHandlers.isMembreActif, eventHandler.loadAbsents)

	app.route('/setAbsent/:evenementId')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, eventHandler.setAbsent)

	app.route('/setPresent/:evenementId')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, eventHandler.setPresent)

	app.route('/isCoach')
		.get(userHandlers.loginRequired, eventHandler.is_user_coach)

	app.route('/coachHistory')
		.get(userHandlers.loginRequired, eventHandler.list_my_coach_history)

	app.route('/mesInformations')
		.get(userHandlers.loginRequired, userHandlers.get_mes_informations)
		.post(userHandlers.loginRequired, userHandlers.update_mes_informations)

	app.route('/loadUsersForMail')
		.get(userHandlers.loginRequired, userHandlers.isAdmin, userHandlers.load_users_group)

	app.route('/presentations')
		.get(adminHandler.list_all_presentations)
		.put(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.create_presentation)

	app.route('/presentations/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.edit_presentation)
		.delete(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.delete_presentation)

	app.route('/chat')
		.get(homeController.load_chat)
		.post(userHandlers.loginRequired, homeController.add_message)

	app.route('/toggleChat/:id')
		.post(userHandlers.loginRequired, userHandlers.isAdmin, homeController.toggle_message)

	app.route('/monProfil')
		.get(userHandlers.loginRequired,  userHandlers.load_profil)
		.post(userHandlers.loginRequired, userHandlers.edit_profil)

	app.route('/loadTokens')
		.get(userHandlers.loginRequired,  userHandlers.load_tokens);

	app.route('/profil/infoGenerales/:id')
		.get(userHandlers.userExists, profileController.infos_generales);

	app.route('/profil/infoProfil/:id')
		.get(userHandlers.userExists, profileController.infos_profil);

	app.route('/ribbons')
		.get(userHandlers.loginRequired, adminHandler.list_all_ribbons)
		.put(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.create_ribbons)

	app.route('/ribbons/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.edit_ribbons)
		.delete(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.delete_ribbons)

	app.route('/toggleAddRibbon/:usrId/:ribId')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.toggle_ribbon_user)

	app.route('/getRibbons/:usrId')
		.post(userHandlers.loginRequired, adminHandler.get_ribbon_user)

	app.route('/toggleActifRibbon/:ribId')
		.post(userHandlers.loginRequired, adminHandler.toggle_actif_ribbon_user)

	app.route('/profil/ribbonUser/:id')
		.get(userHandlers.userExists, profileController.my_ribbon);

	app.route('/notifications')
		.get(userHandlers.loginRequired, profileController.load_notifications);

	app.route('/readNotification/:id')
		.post(userHandlers.loginRequired, profileController.read_notification);

	app.route('/historique/exportMyHistory')
		.post(userHandlers.loginRequired, eventHandler.export_my_history);

	app.route('/historique/exportMyCoachHistory')
		.post(userHandlers.loginRequired, eventHandler.export_my_coach_history);

	app.route('/blocsByType/:type')
		.get(homeController.blocsByType);
	
	app.route('/allBlocs')
		.get(userHandlers.loginRequired, userHandlers.isAdmin, homeController.loadAllBlocs);
	
	app.route('/saveBloc/:id')
		.post(userHandlers.loginRequired, userHandlers.isAdmin, homeController.editBloc);

	app.route('/medias')
		.get(adminHandler.list_all_medias)
		.put(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.create_media)

	app.route('/medias/:id')
		.post(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.edit_media)
		.delete(userHandlers.loginRequired,  userHandlers.isAdmin, adminHandler.delete_media)

	app.route('/listMachinesForDay')
		.post(machinesController.load_list_machine)

	app.route('/toggleSelfForMachine/:id')
		.post(userHandlers.loginRequired, userHandlers.isMembreActif, machinesController.toggle_self_for_machine);
};
