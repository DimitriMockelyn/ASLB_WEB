import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';

const url = getConfig().API_ROOT;
export default {
    createNews:  builder(url + 'news', 'PUT'),
    loadAllNews:  builder(url + 'news', 'GET'),
    editNews:  builder(url + 'news/${id}', 'POST'),
    deleteNews:  builder(url + 'news/${id}', 'DELETE'),
    loadAllUsers: builder(url + 'users', 'POST'),
    exportAllUsers: builder(url + 'usersExport', 'POST'),
    canCreateToggle:  builder(url + 'toggleCreation/${id}', 'POST'),
    toggleAdmin:  builder(url + 'toggleAdmin/${id}', 'POST'),
    updateUser: builder(url + 'updateUser/${id}', 'POST'),
    editPartenaire:  builder(url + 'partenaires/${id}', 'POST'),
    deletePartenaire:  builder(url + 'partenaires/${id}', 'DELETE'),
    createPartenaire:  builder(url + 'partenaires', 'PUT'),
    loadUsersForMail:  builder(url + 'loadUsersForMail', 'GET'),
    editPresentation:  builder(url + 'presentations/${id}', 'POST'),
    deletePresentation:  builder(url + 'presentations/${id}', 'DELETE'),
    createPresentation:  builder(url + 'presentations', 'PUT'),
    editTypeEvenement:  builder(url + 'typeEvenements/${id}', 'POST'),
    deleteTypeEvenement:  builder(url + 'typeEvenements/${id}', 'DELETE'),
    createTypeEvenement:  builder(url + 'typeEvenements', 'PUT'),
};
