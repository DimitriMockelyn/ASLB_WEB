import fetch from '../utils/fetch';
import userUrl from '../config/server/user';
import userHelper from 'focus-core/user';
import utils from './utils';

export default {
    loadMe() {

        return fetch(userUrl.loadMe(), utils.computeHeaders()).then(
            (res) => {
                userHelper.setLogin({...userHelper.getLogin(), ...res});
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
    sendMailReset(data) {
        return fetch(userUrl.sendMailReset({data}));
    },
    loadUserAutocomplete(data) {
        return fetch(userUrl.loadUserAutocomplete({data}), utils.computeHeaders());
    },
    loadMesInformations() {
        return fetch(userUrl.loadMesInformations(), utils.computeHeaders());
    },
    updateMesInformations(data) {
        return fetch(userUrl.updateMesInformations({data}), utils.computeHeaders());
    },
};
