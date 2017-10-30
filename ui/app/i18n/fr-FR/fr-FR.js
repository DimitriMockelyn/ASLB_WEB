export default {
    application: {
        sdc: 'Mon Suivi du Contrôle',
        family: 'Pactole',
        name: 'Mon activité formation',
        noRights: 'Vous n\'avez pas les droits nécessaires pour faire cette action',
        internalError: 'Une erreur interne est survenue lors de l\'opération'
    },
    fetch: {
        error: {
            session: 'Une erreur est survenue lors de l\'exécution de votre requête. Si le problème persiste,' +
            ' vérifiez que votre session est toujours valide et que vous n\'avez pas été déconnecté'
        }
    },
    global: {
        add: 'Ajouter',
        remove: 'Supprimer',
        update: 'Mettre à jour',
        get: 'lire',
        the: ' le ',
        by: ' par ',
        create: 'Créer',
        validate: 'Valider',
        edit: 'Editer',
        compare: 'Comparer les BPF',
        print: 'Imprimer',
        forward: 'Transmettre',
        forwardSRC: 'Valider',
        forwardSRCDone:'Le BPF a bien été validé',
        forwardDone : 'Le BPF a bien été transmis',
        send: 'Envoyer',
        number: 'n°',
        consult: 'Consulter',
        etat: 'état',
        annee: 'année',
        ok: 'OK',
        confirmContinu: 'Souhaitez-vous continuer?'
    },
    popin: {
        confirmation: {
            cancel: 'Annuler',
            confirm: 'Confirmer'
        }
    },
    field: {
        required: 'Ce champ est obligatoire'
    },
    live: {
      filter: {
          title : 'Filtres de résultats'
      }
    },
    result: {
      for: 'Résultat(s) trouvé(s)'
    },
    search: {
      scope: {
          all: ' Tous'
      },
        cartridge: {
            title: 'Que recherchez vous ?'
        },
        bar: {
            placeholder: 'Entrez votre recherche ...'
        },
        empty : 'La recherche n\'a pas retourné de résultats'

    },
    button: {
        reindexAll: 'Tout ré-indexer',
        download: 'Télécharger',
        remove: 'Supprimer',
        edit: 'Modifier',
        print: 'Imprimer',
        cancel: 'Abandonner',
        save: 'Sauvegarder',
        savecontinue: 'Sauvegarder & Continuer',
        advancedSearch: 'Recherche avancée',
        back: 'Retour',
        add: 'Ajouter',
        addUser: 'Ajouter un utilisateur',
        change: 'Changer',
        estimate: 'Estimer',
        execute: 'Exécuter',
        voirPlus: 'Voir plus'
    },
    agenda: {
        home: 'Agenda des activités de l\'ASLB',
        evenementDetail: 'Détail de l\'évènement',
        mine: 'Mon agenda',
        all: 'Tous les évenements'
    },
    admin: {
        addNews: 'Créer une news',
        news: 'News',
        titre: 'Titre',
        content: 'Contenu',
        create: 'Créer',
        newsCreatedBy: 'Crée par',
        newsCreatedAt: 'le',
        derniereNews: 'Dernières news',
        incomingEvents: 'Événements à venir',
        eventAt: 'Début de l\'activité :',
        nbInscrits: 'Inscrits :',
        noMoreNews: 'Pas de news plus ancienne',
        noMoreEvents: 'Pas plus d\'événements prévu',
        personDetail: 'Détail du compte'
    },
    event: {
        created: 'Crée le',
        creator: 'Crée par',
        start: 'Débute le',
        end: 'Termine à',
        description: 'Description',
        addSelf: 'S\'inscrire à cet évenement',
        removeSelf: 'Se désinscrire de cet évenement',
        removeSelfConfirm: 'Voulez-vous vous désinscrire de cet évenement ?',
        deleteEvent: 'Supprimer cet évenement',
        deleteEventConfirm: 'Voulez-vous supprimer cet évenement ?',
        name: 'Nom',
        date_debut: 'Débute le',
        duree: 'Durée (minutes)',
        limite: 'Limite de places',
        create: 'Créer l\'évenement',
        participantsList: 'Liste des participants',
        typeEvenement: 'Type'
    },
    select: {
        unSelected: '-',
        oui: 'Oui',
        non: 'Non'
    },
    user: {
        connect : 'Se connecter',
        create: 'Créer un compte',
        connexion: 'Connexion',
        creation: 'Créer son compte',
        disconnect: 'Se déconnecter',
        activated: 'Votre compte a bien été activé',
        notActivated: 'Votre compte n\'a pas pu être activé. Veuillez vérifier votre code',
        forgot: 'Mot de passe oublié ?',
        reset: 'Envoyer un mail de réinitialisation',
        performReset: 'Changer mon mot de passe',
        notChanged: 'Ce token est invalide ou n\'est associé a aucun compte',
        changed: 'Le mot de passe à été changé.'
    },
    person: {
        email: 'Adresse e-mail',
        password: 'Mot de passe',
        passwordAgain: 'Confirmez le mot de passe',
        prenom: 'Prénom',
        nom: 'Nom',
        badPasswords:'Les mots de passes sont différents',
        createdSuccess: 'Le compte à été crée, veuillez le valider pour vous connecter',
        confirmResetPassword: 'Veuillez entrer les nouvelles informations de mot de passe',
        passwordReseted: 'Votre mot de passe a été réinitialisé',
        mailResetSent: 'Un mail vous a été envoyé pour réinitialiser votre mot de passe',
        date_activation: 'Date d\'activation',
        canCreate: 'Peut créer un événement',
        isAdmin: 'Est admin',
        toggleCanCreate: 'Toggle de la création d\'événements',
        setAdmin: 'Toggle du rôle d\'administration de la personne'
    },
    partenaires: {
        description: 'Vous trouverez ci-dessous la liste des partenaires de l\'association'
    }
};
