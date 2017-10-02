/**
 * These metadatas are generated automatically.
 *
 * @type {Object}
 */
import userHelper from 'focus-core/user';
export default {
    home:{},
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
        }
    }
};

