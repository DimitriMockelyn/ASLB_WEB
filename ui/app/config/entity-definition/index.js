/**
 * These metadatas are generated automatically.
 *
 * @type {Object}
 */
import userHelper from 'focus-core/user';
export default {
    home:{},
    blocs: {
        titre: {
            domain: 'DO_LABEL_LONG',
            required: true
        },
        type: {
            domain: 'DO_LABEL_LONG',
            required: true
        },
        contenu: {
            domain: 'DO_RTE',
            required: true
        },
        ordre: {
            domain: 'DO_NUMBER',
            required: true
        }
    },
    partenaire: {
        url: {
            domain: 'DO_URL'
        },
        description: {
            domain: 'DO_RTE'
        },
        ordre: {
            domain: 'DO_NUMBER',
            required: true
        }
    },
    admin: {
        important: {
            domain: 'DO_YES_NO',
            required: true,
        },
        titre:{
            domain: 'DO_LABEL_LONG',
            required: true
        },
        content: {
            domain: 'DO_RTE',
            required: true
        },
        email: {
            domain: 'DO_EMAIL',
            required: true
        },
        password: {
            domain: 'DO_PASSWORD',
            required: true
        },
        passwordAgain: {
            domain: 'DO_PASSWORD',
            required: true
        },
        prenom: {
            domain: 'DO_LABEL_LONG',
            required: true
        },
        nom: {
            domain: 'DO_LABEL_LONG',
            required: true
        },
        date_activation: {
            domain: 'DO_DATE',
            required: false
        },
        date_fin: {
            domain: 'DO_DATE',
            required: false
        },
        dossier_complet: {
            domain: 'DO_YES_NO',
            required: false
        },
        isAdmin: {
            domain: 'DO_YES_NO',
            required: false
        },
        canCreate: {
            domain: 'DO_YES_NO',
            required: false
        },
        dateNaissance: {
            domain: 'DO_DATE',
            required: true
        },
        telephone: {
            domain: 'DO_TELEPHONE',
            required: false
        },
    },
    event: {
        created :{
            domain: 'DO_DATE',
            required: false
        },
        creator :{
            domain: 'DO_LABEL_LONG',
            required: false
        },
        start :{
            domain: 'DO_DATE_TIME',
            required: false
        },
        end :{
            domain: 'DO_DATE_TIME',
            required: false
        },
        nomSelf: {
            domain: 'DO_LABEL_LONG',
            required: true
        },        
        emailSelf: {
            domain: 'DO_EMAIL',
            required: true
        },
        commentaireAdd: {
            domain: 'DO_COMMENT',
            required: false
        },
        date_debut:{
            domain: 'DO_DATE_TIME',
            required: true
        },
        name :{
            domain: 'DO_LABEL_LONG',
            required: true
        },
        duree :{
            domain: 'DO_ID',
            required: true
        },
        limite :{
            domain: 'DO_ID',
            required: false
        },
        description:{
            domain: 'DO_COMMENT',
            required: false
        },
        animateur: {
            domain: 'DO_AUTOCOMPLETE',
            required: true
        },
        coanimateurs: {
            domain: 'DO_AUTOCOMPLETE_MULTI',
            required: false
        },
        note: {
            domain: 'DO_NOTE',
            required: true
        },
        commentaire: {
            domain: 'DO_COMMENT',
            required: false
        }
    },
    person: {
        email: {
            domain: 'DO_EMAIL',
            required: true
        },
        password: {
            domain: 'DO_PASSWORD',
            required: true
        },
        passwordAgain: {
            domain: 'DO_PASSWORD',
            required: true
        },
        prenom: {
            domain: 'DO_LABEL_LONG',
            required: true
        },
        nom: {
            domain: 'DO_LABEL_LONG',
            required: true
        },
        date_activation: {
            domain: 'DO_DATE',
            required: false
        },
        date_fin: {
            domain: 'DO_DATE',
            required: false
        },
        dossier_complet: {
            domain: 'DO_YES_NO',
            required: false
        },
        adhesion: {
            domain: 'DO_YES_NO',
            required: false
        },
        decharge: {
            domain: 'DO_YES_NO',
            required: false
        },
        reglement: {
            domain: 'DO_YES_NO',
            required: false
        },
        certificat: {
            domain: 'DO_YES_NO',
            required: false
        },
        cotisation: {
            domain: 'DO_YES_NO',
            required: false
        },
        isAdmin: {
            domain: 'DO_YES_NO',
            required: false
        },
        canCreate: {
            domain: 'DO_YES_NO',
            required: false
        },
        dateNaissance: {
            domain: 'DO_DATE',
            required: true
        },
        telephone: {
            domain: 'DO_TELEPHONE',
            required: false
        },
        description: {
            domain: 'DO_RTE'
        },
        raisonSport: {
            domain: 'DO_RTE'
        },
        activitesVoulues: {
            domain: 'DO_CHECKBOX_SELECT'
        },
        autreActivites: {
            domain: 'DO_RTE'
        },
        records: {
            domain: 'DO_RTE'
        }
    },
    presentation: {
        image: {
            domain: 'DO_URL'
        },
        description: {
            domain: 'DO_RTE'
        },
        isBureau: {
            domain: 'DO_YES_NO'
        },
        ordre: {
            domain: 'DO_NUMBER'
        }
    },
    typeEvenement: {
        description: {
            domain: 'DO_RTE'
        },
        color: {
            domain: 'DO_COLOR'
        }
    },
    ribbon: {
        color_ribbon: {
            domain: 'DO_COLOR'
        },
        color_ribbon_light: {
            domain: 'DO_COLOR'
        },
        color_ribbon_dark: {
            domain: 'DO_COLOR'
        },
        color_ribbon_darker: {
            domain: 'DO_COLOR'
        }
    }
};

