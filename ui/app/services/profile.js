import fetch from '../utils/fetch';
import profileUrl from '../config/server/profile';
import userHelper from 'focus-core/user';
import utils from './utils';

export default {
    
    getInfoGenerales(id) {
        return fetch(profileUrl.getInfoGenerales({urlData: {id}}));
    },
    getInfoProfil(id) {
        return fetch(profileUrl.getInfoProfil({urlData: {id}}));
    },
    getRibbon(id) {
        return fetch(profileUrl.getRibbon({urlData: {id}}));
    },
};
