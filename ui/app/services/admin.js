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
    deleteNews(data) {
        return fetch(adminUrl.deleteNews({urlData: {id: data.id}}), utils.computeHeaders());
    },
    loadAllUsers(data) {
        return fetch(adminUrl.loadAllUsers({data}), utils.computeHeaders());
    },
    exportAllUsers(data) {
        return fetch(adminUrl.exportAllUsers({data}), utils.computeHeaders());
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
    editPartenaire(data) {
        return fetch(adminUrl.editPartenaire({urlData: {id: data.id}, data: data}), utils.computeHeaders());
    },
    deletePartenaire(data) {
        return fetch(adminUrl.deletePartenaire({urlData: {id: data.id}}), utils.computeHeaders());
    },
    createPartenaire(data) {
        return fetch(adminUrl.createPartenaire({data}), utils.computeHeaders());
    },
    loadUsersForMail() {
        return fetch(adminUrl.loadUsersForMail(), utils.computeHeaders());
    }
};
