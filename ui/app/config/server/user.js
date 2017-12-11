import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';
const url = getConfig().API_ROOT;


export default {
    loadMe:  builder(url + 'me', 'GET'),
    create:  builder(url + 'auth/register', 'POST'),
    connect:  builder(url + 'auth/sign_in', 'POST'),
    activate: builder(url + 'activate', 'POST'),
    changePassword: builder(url + 'changePassword', 'POST'),
    changePasswordConnecte: builder(url + 'changePasswordConnecte', 'POST'),
    sendMailReset: builder(url + 'sendMailReset', 'POST'),
    loadUserAutocomplete:  builder(url + 'usersAutocomplete', 'POST'),
    loadMesInformations: builder(url + 'mesInformations', 'GET'),
    updateMesInformations: builder(url + 'mesInformations', 'POST'),
    loadSexes: builder(url + 'typeSexe', 'GET'),
    loadEntreprises: builder(url + 'typeEntreprise', 'GET')
};
