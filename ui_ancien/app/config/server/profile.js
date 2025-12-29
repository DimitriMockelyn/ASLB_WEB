import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';
const url = getConfig().API_ROOT;


export default {
    getInfoGenerales:  builder(url + 'profil/infoGenerales/${id}', 'GET'),
    getInfoProfil:  builder(url + 'profil/infoProfil/${id}', 'GET'),
    getRibbon:  builder(url + 'profil/ribbonUser/${id}', 'GET'),
    loadNotifications: builder(url + 'notifications', 'GET'),
    readNotification: builder(url+ 'readNotification/${id}', 'POST'),
    getInfoBadges:  builder(url + 'profil/infoBadgesRecu/${id}', 'GET'),
};
