import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';
const url = getConfig().API_ROOT;


export default {
    loadMe:  builder(url + 'me', 'GET'),
    create:  builder(url + 'auth/register', 'POST'),
    createFromAdmin:  builder(url + 'auth/registerFromAdmin', 'POST'),
    connect:  builder(url + 'auth/sign_in', 'POST'),
    activate: builder(url + 'activate', 'POST'),
    changePassword: builder(url + 'changePassword', 'POST'),
    changePasswordConnecte: builder(url + 'changePasswordConnecte', 'POST'),
    sendMailReset: builder(url + 'sendMailReset', 'POST'),
    sendMailFirst: builder(url + 'sendMailFirst', 'POST'),
    loadUserAutocomplete:  builder(url + 'usersAutocomplete', 'POST'),
    loadMesInformations: builder(url + 'mesInformations', 'GET'),
    updateMesInformations: builder(url + 'mesInformations', 'POST'),
    loadSexes: builder(url + 'typeSexe', 'GET'),
    loadEntreprises: builder(url + 'typeEntreprise', 'GET'),
    loadMonProfil:  builder(url + 'monProfil', 'GET'),
    updateMonProfil:  builder(url + 'monProfil', 'POST'),
};
