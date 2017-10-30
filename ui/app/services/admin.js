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
    }
};
