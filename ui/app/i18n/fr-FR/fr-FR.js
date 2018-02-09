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
    domain: {
        error: {
            telephone :' Le numéro de téléphone n\'est pas valide',
            date: 'La date doit être au format JJ/MM/AAAA'
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
        createUser: 'Créer un utilisateur',
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
        voirPlus: 'Voir plus',
        exporter: 'Exporter',
        sendMailParticipants: 'Contacter les participants',
        cancelQueue: 'Je ne veux pas etre mis en attente',
        acceptQueue: 'Je me mets en file d’attente :)'
    },
    home: {
        message: {
            0: 'Bienvenue sur l\'interface web de l\'ASLB ! \n (Cliquez sur la fenêtre pour continuer)',
            1: 'Vous pouvez voir l\'ensemble des activités proposées dans ce menu',
            2: 'Vous pourrez aussi voir votre historique d\'activité et les commenter',
            3: 'Si vous voulez en savoir plus sur nous, c\'est ici',
            4: 'Nos partenaires sont la',
            5: 'Pour apprendre a mieux vous connaitre, vous pouvez personnaliser votre profil en cliquant ici ↗',
            6: 'L\'association est la pour vous. N\'hésitez pas a nous soumettre vos idées et critiques, a nous poser toutes les questions qui vous viennent ...  Nous sommes la pour vous aider. \n Laissez nous un petit message a l\'occasion, ça nous fait toujours plaisir :) \n \n Bon sport a vous, et on se retrouve à la salle !'
        }
    },
    agenda: {
        legendeStar: 'Les étoiles, si précisées, correspondent au niveau de difficulté de la séance.',
        home: 'Agenda des activités de l\'ASLB',
        evenementDetail: 'Détail de l\'évènement',
        mine: 'Mon agenda',
        all: 'Tous les évenements',
        calendar: 'Vue calendrier',
        tile: 'Vue condensée',
        legende: 'Légende',
        messageQueue: 'Salut ! \n'+
'Tu souhaites t’inscrire à cette activité mais malheureusement elle est complète ! Bouhouhou…\n'+
'Aucun problème ! Tu peux te mettre en file d’attente dans le cas ou une place se libère.\n'+
'Comment ça fonctionne ? Rien de plus simple !\n'+
'Si tu as encore des jetons disponibles, tu t’y inscris et ta position dans la la file te seras précisée, elle est attribuée par ordre d’arrivée. Tu peux te retirer de la file d’attente à tout moment pour récupérer ton jeton et t’inscrire à une autre activité.\n'+
'Une place se libère et tu es celle/celui qui peut en bénéficier ?  Super ! Tu seras avertis par mail, il faut donc que tu ais tes affaires au cas ou :)\n'+
'Tu ne peux pas y participer ? Merci de te désinscrire afin de laisser la place à celles et ceux qui sont derrière toi, en attentes d’une place. Si tu ne procèdes pas à la désincription, tu seras considéré comme absent(e).\n',
        messageQueueImpossible: 'Salut ! \n'+
'Tu souhaites t’inscrire à cette activité mais malheureusement elle est complète ! Bouhouhou…\n'+
'Aucun problème ! Tu peux te mettre en file d’attente dans le cas ou une place se libère.\n'+
'Comment ça fonctionne ? Rien de plus simple !\n'+
'Tu n\'as plus de jetons disponibles actuellement, mais si tu participe bientot a un événement, tu en récupereras un. Sinon, si tu te désinscris d\'un événement, tu pourras alors t’y inscrire et ta position dans la la file te seras précisée, elle est attribuée par ordre d’arrivée. Tu peux te retirer de la file d’attente à tout moment pour récupérer ton jeton et t’inscrire à une autre activité.\n'+
'Une place se libère et tu es celle/celui qui peut en bénéficier ?  Super ! Tu seras avertis par mail, il faut donc que tu ais tes affaires au cas ou :)\n'+
'Tu ne peux pas y participer ? Merci de te désinscrire afin de laisser la place à celles et ceux qui sont derrière toi, en attentes d’une place. Si tu ne procèdes pas à la désincription, tu seras considéré comme absent(e).\n',

    },
    admin: {
        adminUsers: 'Administrer les utilisateurs',
        typeEvenement: 'Type d\'évènements',
        addType: 'Ajouter un type',
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
        personDetail: 'Détail du compte',
        partenaire: 'Partenaire',
        addPartenaire: 'Ajouter un partenaire',
        mailAll: 'Envoyer un mail général',
        mailCreateurs: 'Envoyer un mail aux créateurs de cours',
        mailAdmins: 'Envoyer un mail aux administrateurs',
        addPresentation: 'Ajouter une présentation',
        email: 'Adresse e-mail',
        password: 'Mot de passe',
        passwordAgain: 'Confirmez le mot de passe',
        prenom: 'Prénom',
        nom: 'Nom',
        dateNaissance: 'Date de naissance',
        sexe: 'Sexe',
        entreprise: 'Entreprise',
        telephone: 'Téléphone',
    },
    detail: {
        saved: 'Les informations ont bien été enregistrées.'
    },
    event: {
        minutes: 'minutes',
        nbInscrits: 'Inscrits :',
        dateHeure: 'Date/Heure ',
        participantsPlace: 'Participants/Places',
        animePar: 'Animé par', 
        niveau: 'Niveau',
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
        typeEvenement: 'Type',
        animateur: 'Animateur',
        commentaireVide: 'Veuillez renseigner un des champs du commentaire',
        commentairePoste: 'Votre commentaire à bien été enregistré',
        editComment: 'Editer mon commentaire',
        createComment: 'Envoyer mon commentaire',
        note: 'Note',
        commentaire: 'Commentaire',
        noteMoyenne: 'Note moyenne',
        noNotes: 'Pas de notes'
    },
    confirmDelete: {
        news: 'Etes-vous sur de vouloir supprimer cette news ?',
        partenaire: 'Etes-vous sur de vouloir supprimer ce partenaire ?',
        presentation:'Etes-vous sur de vouloir supprimer cette présentation ?',
        typeEvenement: 'Etes-vous sur de vouloir supprimer ce type d\'évènement ?',
    },
    select: {
        unSelected: '-',
        oui: 'Oui',
        non: 'Non'
    },
    user: {
        firstConnect: 'Première connexion',
        askPassword: 'Initialiser mon mot de passe',
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
        confirmDesactiver: 'Etes vous sur de vouloir désactiver ce compte ? Vous pouvez indiquer la raison dans le champ ci-dessous',
        confirmActiver: 'Etes vous sur de vouloir activer ce compte ?',
        inactiver: 'Inactiver',
        activer: 'Activer',
        email: 'Adresse e-mail',
        password: 'Mot de passe',
        passwordAgain: 'Confirmez le mot de passe',
        prenom: 'Prénom',
        nom: 'Nom',
        badPasswords:'Les mots de passes sont différents',
        createdSuccess: 'Le compte à été crée, veuillez le valider pour vous connecter',
        createdSuccess2: 'Le compte à été crée',
        confirmResetPassword: 'Veuillez entrer les nouvelles informations de mot de passe',
        passwordReseted: 'Votre mot de passe a été réinitialisé',
        mailResetSent: 'Un mail vous a été envoyé pour réinitialiser votre mot de passe',
        mailFirstSent: 'Un mail vous a été envoyé pour initialiser votre mot de passe',
        date_activation: 'Date d\'adhésion',
        canCreate: 'Peut créer un événement',
        isAdmin: 'Est admin',
        toggleCanCreate: 'Toggle de la création d\'événements',
        setAdmin: 'Toggle du rôle d\'administration de la personne',
        nonAdherent: 'Adhésion non validée',
        adherentDepuis: 'Adhérent depuis le',
        changeAvatar: 'Changer mon avatar',
        modifierInformations: 'Modifier mon profil',
        monProfil: 'Mon profil',
        changeEmailWarning: 'Vous pouvez modifier votre adresse e-mail, mais vous allez être automatiquement déconnecté suite à cette action. Vous pourrez vous reconnecter par la suite.',
        mesInformations: 'Mes informations',
        dateNaissance: 'Date de naissance',
        sexe: 'Sexe',
        entreprise: 'Entreprise',
        telephone: 'Téléphone',
        date_fin: 'Date de fin d\'adhésion',
        dossier_complet: 'Dossier complet',
        changePassword: 'Changer mon mot de passe',
        description: 'Un petit mot pour te présenter ?',
        raisonSport: 'Pour toi, le sport c\'est ... ?',
        activitesVoulues: 'Parmis les activités proposées, quelles sont celles qui t\'intéressent ?',
        autreActivites: 'Y-a-t\'il des activités sportives (non proposées) que tu aimerais voir dans cette liste?',
        records: 'Des records, titres, accomplissements personnels que tu veux partager avec nous ?'
    },
    confirmAddDroits: {
        create: 'Voulez vous vraiment changer les droits de création d\'activité a cette personne ?',
        admin: 'Voulez vous vraiment changer les droits d\'administrateur a cette personne ?'
    },
    partenaires: {
        description: 'Vous trouverez ci-dessous la liste des partenaires de l\'association',
    },
    historique: {
        description: 'Historique de mes événements. Laissez un commentaire sur un événement en le selectionnant.',
        eventsParticipant: ' événement(s) terminé(s)',
        descriptionCoach: 'Historique de mon coaching événements. Cliquer sur un événement pour voir les commentaires laissés',
        notCoachYet: 'Vous souhaitez rejoindre l’équipe des animateurs ? Bien ! Nous sommes là pour vous accompagner.',
        howToCoach: 'L\'association fonctionne grâce à vous et aux animateurs qui proposent des activités de groupe pour tout le monde. Toutes les idées sont les bienvenues, elles seront étudiées et si toutes les conditions sont réunies pour que l’on puisse les proposer, on se lance !',
        coachBenefits: 'N’hésitez plus, prenez contact avec un animateur pendant les heures d\'ouverture ou envoyez nous un petit mail :) Nous vous répondrons dans les plus brefs délais !',
        coachContact: 'A très bientôt !',
        signature: 'Le bureau'
    },
    sexe: {
        label: 'sexe'
    },
    entreprise: {
        label: 'entreprise'
    },
    partenaire: {
        name: 'Nom',
        url: 'URL',
        logo: 'Logo (url)',
        description: 'Description',
        ordre: 'Ordre'
    },
    presentation: {
        name: 'Titre',
        image: 'Image (URL)',
        isBureau: 'Membre du bureau ?',
        description : 'Description',
        ordre: 'Ordre d\'affichage',
        fonction: 'Fonction'
    },
    chat: {
        comment: 'Laissez un petit mot sur notre mur'
    },
    typeEvenement: {
        name: 'Nom',
        code: 'Code',
        description: 'Description',
        color: 'Couleur rgba',
        image: 'Image (URL)'
    },
    contact: {
        contactAsso: 'Contacter l\'association',
        contactCourrier: 'Si vous voulez contacter l\'association par courrier, vous pouvez adresser votre courrier à l\'adresse suivante : ASSOCIATION SPORTIVE LA BOURSIDIÈRE, LA BOURSIDIERE, 92350 Plessis-Robinson.',
        contactMail: 'Pour un contact par e-mail, vous pouvez contacter la boite mail suivante : aslb@laboursidiere.com',
        contactPhysique: 'Pour venir nous voir pendant les heures d\'activités, c\'est ici !',
        presentationMembres: 'Présentation des membres',
        presentationTitre: 'Qui suis-je ?',
        interview: {
            quest1 : 'En deux lignes, fais-nous une petite présentation de toi (sérieuse celle-là, les bêtises c’est pour après !).',
            quest2: 'As-tu un surnom ?',
            quest3: 'Ton ou tes sports ? Tes performances ?',
            quest4: 'Si un génie t\'offre de réaliser 3 vœux, quels seraient-ils ?',
            quest5: 'Si tu pouvais retourner dans le passé, que changerais-tu ?',
            quest6: 'Tu te vois comment dans 10 ans ?',
            quest7: 'Le meilleur moment de ta journée ?',
            quest8: 'Qu\'y a-t-il sur ta table de nuit ?',
            quest9: 'Quelle est ta couleur préférée ?',
            quest10: 'Tes goûts musicaux ?',
            quest11: 'Films et séries préférés ?',
            quest12: 'Bain ou douche ?',
            quest13: 'Tu es du matin ou du soir ?',
            quest14: 'Qu\'est-ce que tu dis quand tu te cognes un orteil ?',
            quest15: 'Préfères-tu avoir un bras en mousse ou une jambe de bois ?',
            quest16: 'Que penses-tu du bio ?',
            quest17: 'Plutôt thé ou café ?',
            quest18: 'Plutôt huile de palme ou huile d\'olive ?',
            quest19: 'Tu es plutôt saucisses frites ou haricots poisson ?',
            quest20: 'C\'est quoi une journée parfaite pour toi ?',
            quest21: 'Quel est ton loisir favori (autre que le sport) ?',
            quest22: 'As-tu une devise, une citation, une phrase culte ?'
        }
    },
    stephaneMartin: {
        titre: 'Stéphane MARTIN - Président ASLB',
        quest1: 'Stéphane 43 ans, en union libre, 2 enfants. Je bosse chez Tokheim (TSG) en tant que Leader Helpdesk depuis 19 ans, à la Boursidière depuis décembre 2015.',
        quest2: 'Tifnou, je sais c’est pas hyper virile, mais bon...on ne choisi pas forcément.',
        quest3: 'Volleyeur pendant 17 ans environ, en régionale 1 à Savigny sur Orge et après quelques années sans sports je me suis mis à la course à pieds depuis 8 ans environ. (1h29’30’’ sur 20k, 39’51’’ sur 10k et 3h51’ sur marathon...je sais, y’a du boulot !)',
        quest4: '1 - me faire repousser les cheveux \\n2 - m’envoyer assister à un match à Old Trafford à l’époque ou il y avait Cantona ! (Ooh! Aah! Cantona!) \\n3 - souhaiter des voeux aussi stupides, ne mérite pas d’en avoir un 3ème :p',
        quest5: 'J’éviterais les drames de Vilnius et du 11 septembre 2001',
        quest6: 'Si possible en bonne santé, avec une médaille de marathon autour du coup pour un chrono en 3h15, et peut-être avec des petit enfants :p',
        quest7: 'Le soir quand je me couche',
        quest8: 'Actuellement le 2ème tome de Game Of Thrones',
        quest9: 'Le noir, mais j’aime beaucoup aussi le rouge foncé, genre vin',
        quest10: 'Je suis dingue de Noir Désir et pas mal de groupe rock en général. J’ai une préférence pour la musique française. J’aime aussi beaucoup ce que faisait Jamiroquai à ses débuts.',
        quest11: 'J’aime beaucoup de films, dire que j’en préfère un est un peu difficile, mais parmis ceux que j’aime il y a Mon nom est Personne, Gladiator, La vie est belle, Le cinquième élément, j’aime beaucoup l’univers Marvel/DC aussi. \\nEn ce qui concerne les séries, je suis un grand fan des Sons of Anarchy, il y a aussi Dexter, Game of Thrones, Breaking Bad',
        quest12: 'Douche',
        quest13: 'Matin',
        quest14: 'Putain de bordel de merde !!!',
        quest15: 'En v’là une question débile…..on va dire un bras en mousse',
        quest16: 'Je pense qu’il ne devrait pas y avoir autre chose que du bio, c’est une aberration de voir ce que l’on nous file à bouffer.',
        quest17: 'Café, même si j’aime les deux',
        quest18: 'Huile d’olive (bio ^^)',
        quest19: 'Haricots poisson',
        quest20: 'Déjà c’est un samedi ou un dimanche, pas parce que c’est chaumé mais car je la passe avec ma famille et que j’adore ça. Réveil sans réveil, un ciné, une balade, aller voir des amis, bref tout ce qu’on peut faire ensemble sans se prendre la tête !',
        quest21: 'J’adore regarder des films, autant je ne regarde pas la télé et je ne m\'intéresse pas à l’actualité, autant je peux regarder 4 films à la suite. J’adore jouer à Football Manager aussi, bah ouais...pas facile de gommer les parasites de jeunesse :)',
        quest22: 'Be yourself, no matter what they say \\nSoyons désinvoltes, n’ayons l’air de rien !'
   },
   guillaumeBlanchard: {
        titre: 'Guillaume BLANCHARD - Trésorier ASLB',
        quest1: 'Guillaume, 41 ans, marié, 2 filles de 6 et 8 ans. \\nJe bosse chez Klee Group en tant que Directeur de Projets en informatique. \\nJe suis à la Boursidière depuis mars 2013.',
        quest2: 'Je n’ai pas cette chance. J’ai toujours détesté les “Guigui” et autre “Yoyo” que je trouve laids.',
        quest3: 'Fan de roller, je me sers de ce mode de transport au quotidien quand les distances sont courtes : faire les courses, aller au ciné, chez le docteur... Je me sens très à l’aise en roller, mais je ne saurais pas décrire mon niveau, car je n’ai jamais fait de show ou de compétition dans ce sport.\\n Je me suis mis à la course à pieds en 2013, et je me suis aperçu que ce sport était fait pour moi. Je cours en 38’00 sur 10 km, 1h27’18” sur un semi-marathon.',
        quest4: '1 - Retrouver un copain d’enfance qui a dû quitter précipitamment la France avec ses parents en raison de menaces politiques. J’avais 10 ans, je l’aimais beaucoup, et malheureusement, je n’ai jamais retrouvé sa trace. Son dernier coup de fil était un adieu déchirant. \\n2 - D’éradiquer toutes les guerres, toutes les maladies et toutes les famines, de permettre à toutes les femmes d’avoir les mêmes droits que les hommes partout dans le monde, d’apporter l’éducation gratuite et de qualité à tous les enfants du monde… On n’a pas dit que ça ne pouvait pas être utopiste! :-)\\n3 - De pouvoir faire autant de voeux que je le voudrais… (classique, mais bon, pragmatique :-)',
        quest5: 'Tu te rappelles la dernière grosse crasse que je t’ai faite? Non? Eh ben tu vois, ça a marché, mon voyage dans le temps… ;-)',
        quest6: 'Comme aujourd’hui, avec juste 2-3 ridules en plus, mais pas davantage…\\nJe parlerai une langue de plus. Mes filles seront toujours amoureuses de leur papa. \\nEt surtout, la cantine Elior sera toujours aussi bonne, voire même encore meilleure! ',
        quest7: 'Le midi, surtout en hiver, quand on peut profiter du soleil et courir librement au contact de la nature. J’aime beaucoup aussi le repas du soir en famille, où on refait le monde, parce que d’un soir à l’autre, on a encore trouvé d’autres idées de changement...',
        quest8: 'Un Rubix cube. Je sais que pour certains, c’est un vrai casse-tête, mais moi, ça me détend. Je le résous machinalement ou alors je cherche de nouvelles méthodes de résolution (le net en est plein).',
        quest9: 'Le bleu cerise à reflets argentés et éclats pourpres… A moins que ce ne soit la couleur des chaussettes de Dorothée',
        quest10: 'J’aime bien la pop française, américaine et latina, les chansons à texte (quand je les comprends….), le jazz en voiture, le classique dans les centres commerciaux, et la Danse en soirée.',
        quest11: 'Quand je suis avec ma femme, j’aime les drames forts, plein d’émotions qui vous retournent.\\nQuand je suis avec mes potes, les films d’actions sans scenarii.\\nQuand je suis avec mes filles, les films de dessins animés.',
        quest12: 'Douche',
        quest13: 'Soir, mais pas nocturne.',
        quest14: 'Ayyyeeeeeeeeeeee!',
        quest15: 'J’opte pour la langue de 3 mètres, les oreilles d’éléphants et des pieds palmés. La jambe de bois, je la laisse à ceux qui leur manque une jambe. :-)',
        quest16: 'Je ne pense pas. Je mange bio à chaque fois que c’est possible. Je me fais de succulents jus de légumes et de fruits bio à l’aide de mon extracteur. C’est exquis!',
        quest17: 'Plutôt chocolat.',
        quest18: 'Huile d’olive vierge',
        quest19: 'Poisson haricots, et lentilles, et courgettes, et carottes, et patates douces… 5 fruits et légumes par jour. Et au delà sans modération!',
        quest20: 'C’est une journée lors de laquelle on s’est senti utile, tout en s\'épanouissant, tout en rendant les gens heureux autour de toi, tout en ayant appris quelque chose d’important dont on se souviendra dans 10 ans',
        quest21: 'Les voyages en totale liberté pendant les vacances, quand on peut s’émerveiller de tout, et s’étonner soi-même.',
        quest22: 'Ma stratégie de course : au départ, tu fonces, au milieu, tu accélères, et à la fin, tu sprintes'
   },
   dimitriMockelyn: {
        titre: 'Dimitri MOCKELYN - Secrétaire ASLB',
        quest1: 'Dimitri, 24 ans, trop jeune pour le mariage et les enfants. Ingénieur en développement chez Klee Group depuis novembre 2014, globetrotter et geek à mes heures perdues',
        quest2: 'Arnitri. C’est une longue histoire … je vous l’expliquerai à l’occasion :)',
        quest3: 'J’ai commencé par du badminton pendant 8 ans.  Puis je me suis mis à l’escalade, sport que j’affectionne tout particulièrement, mais dans lequel je ne suis pas hyper fort (niveau 6A). J’ai attrapé le virus de la course à pied en 2015, et c’est le sport qui me convient le plus. Actuellement, je sors du 1h26 au semi marathon, et moins de 40 minutes au 10K, mais je n’ai pas encore fait cette distance de façon chronométrée.',
        quest4: '1 - D\'être riche\\n2 - De vieillir en gardant le physique et l’énergie d’un homme de 25 ans\\n3 - De pouvoir me téléporter',
        quest5: 'J\'achèterai des Bitcoins quand ca ne coutait rien, pour pouvoir les revendre quand cette monnaie à explosé.',
        quest6: 'Je sais pas, mais j\'espère toujours aussi beau et autant en forme :)',
        quest7: 'Quand mon réveil sonne au matin et que je dois sortir de mon lit douillet … \\n \\nNoooooooon bien sur que non,  plutôt après le sport quand je peux manger n’importe quoi sans avoir mauvaise conscience, ou quand je me mets au lit',
        quest8: 'Une écharpe pour les nuits froides',
        quest9: 'Le bleu-vert.',
        quest10: 'J’aime beaucoup de choses, mais le point commun entre toutes les musiques que j’écoute est que le rythme est rapide. J’aime le rock, un peu de pop, parfois du rap ou de la techno … tant que le rythme est la',
        quest11: 'Scrubs, Parcs & Récréations, Brooklyn Nine-Nine, Malcolm in the middle et Sherlock sont des séries comique a voir absolument !\\nPour les films, j’ai beaucoup aimé Shawshank Redemption, Intouchables et Now you see me.',
        quest12: 'Douche',
        quest13: 'Soir',
        quest14: 'Ah putain sale merde !',
        quest15: 'Une jambe de bois. C’est hyper handicapant un bras en mousse, alors que la jambe de bois, ca permets toujours de marcher, et en plus,  on a 50% de chance de moins de se cogner un orteil',
        quest16: 'C’est bien, mais c’est cher et c’est pas toujours meilleur.',
        quest17: 'Café all day every day',
        quest18: 'Huile d’olive all day every day',
        quest19: 'Saucisses frites (pas all day) every day',
        quest20: 'Je me lève, et les croissants sont déjà la. Après un petit déjeuner pris en mode relax, devant une série, je pars rejoindre des amis pour aller faire des jeux, ou un escape game, ou un resto, ou n’importe quoi qui nous fait passer du temps ensemble en fait. Puis arrive rapidement la fin d\'après midi ou on se pose dans un bar, avec un peu de musique mais pas trop de bruit quand même pour pouvoir s’entendre parler. On discute autour de 2,3,4,5,7 bières, on rigole ensemble, on parle de tout et de rien, et au fur et à mesure des verres, on se souvient pas de la fin de la journée parfaite',
        quest21: 'J’aime voyager, découvrir de nouveaux coins. J’aime aussi rester chez moi et jouer à des jeux ou rester planté dans mon canapé à regarder la télé. Faut juste doser pour pas faire une overdose de tout ca :)',
        quest22: '“Go hard, then go home” \\n“Et si, plus tard, on voulait connaître mes histoires, combien vaudront vraiment la peine d\'être racontées ?”'
   },
    template: {
        titre: '',
        quest1: '',
        quest2: '',
        quest3: '',
        quest4: '',
        quest5: '',
        quest6: '',
        quest7: '',
        quest8: '',
        quest9: '',
        quest10: '',
        quest11: '',
        quest12: '',
        quest13: '',
        quest14: '',
        quest15: '',
        quest16: '',
        quest17: '',
        quest18: '',
        quest19: '',
        quest20: '',
        quest21: '',
        quest22: ''
    }
};
