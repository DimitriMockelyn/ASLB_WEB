import fetch from '../utils/fetch';
import userUrl from '../config/server/user';
import userHelper from 'focus-core/user';
import utils from './utils';

export default {
    loadMe() {

        return fetch(userUrl.loadMe(), utils.computeHeaders()).then(
            (res) => {
                //userHelper.setLogin({...userHelper.getLogin(), ...res});
                return res;
            }, 
            err => {
                throw err;
            }
        );
    },
    create(data) {
        return fetch(userUrl.create({data}));
    },
    createFromAdmin(data) {
        return fetch(userUrl.createFromAdmin({data}), utils.computeHeaders());
    },
    connect(data) {
        return fetch(userUrl.connect({data}));
    },
    disconnect() {
        utils.deleteCookie('tokenJWT');
    },
    activate(id) {
        return fetch(userUrl.activate({data: {code:id}}));
    },
    changePassword(data) {
        return fetch(userUrl.changePassword({data}));
    },
    changePasswordConnecte(data) {
        return fetch(userUrl.changePasswordConnecte({data}), utils.computeHeaders());
    },
    sendMailReset(data) {
        return fetch(userUrl.sendMailReset({data}));
    },
    sendMailFirst(data) {
        return fetch(userUrl.sendMailFirst({data}));
    },
    loadUserAutocomplete(data) {
        if (!data.data || !data.data.criteria) {
            data = {data: {criteria: data}, urlData: {skip: 0, top: 30}}
        }
        return fetch(userUrl.loadUserAutocomplete({data}), utils.computeHeaders());
    },
    loadActiveUserAutocomplete(data) {
        if (!data.data || !data.data.criteria) {
            data = {data: {criteria: data}, urlData: {skip: 0, top: 30}}
        }
        return fetch(userUrl.loadActiveUserAutocomplete({data}), utils.computeHeaders());
    },
    loadMesInformations() {
        return fetch(userUrl.loadMesInformations(), utils.computeHeaders());
    },
    updateMesInformations(data) {
        return fetch(userUrl.updateMesInformations({data}), utils.computeHeaders());
    },

    loadSexes() {
        return fetch(userUrl.loadSexes());
    },
    loadEntreprises() {
        return fetch(userUrl.loadEntreprises());
    },
    loadMonProfil() {
        return fetch(userUrl.loadMonProfil(), utils.computeHeaders());
    },
    updateMonProfil(data) {
        return fetch(userUrl.updateMonProfil({data}), utils.computeHeaders());
    },
};
