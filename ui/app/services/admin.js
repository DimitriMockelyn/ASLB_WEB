import fetch from '../utils/fetch';
import adminUrl from '../config/server/admin';
import utils from './utils';

export default {
    createNews(data) {
        return fetch(adminUrl.createNews({data}), utils.computeHeaders());
    },
    loadAllNews() {
        return fetch(adminUrl.loadAllNews(), utils.computeHeaders());
    },
    editNews(data) {
        return fetch(adminUrl.editNews({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    loadAllUsers(data) {
        return fetch(adminUrl.loadAllUsers({data}), utils.computeHeaders());
    },
    canCreateToggle(data) {
        return fetch(adminUrl.canCreateToggle({urlData: {id: data.id}}), utils.computeHeaders());
    },
    toggleAdmin(data) {
        return fetch(adminUrl.toggleAdmin({urlData: {id: data.id}}), utils.computeHeaders());
    },
    updateUser(data) {
        return fetch(adminUrl.updateUser({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
};
