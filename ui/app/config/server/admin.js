import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';

const url = getConfig().API_ROOT;
export default {
    createNews:  builder(url + 'news', 'PUT'),
    loadAllNews:  builder(url + 'news', 'GET'),
    editNews:  builder(url + 'news/${id}', 'POST'),
    loadAllUsers: builder(url + 'users', 'POST'),
    canCreateToggle:  builder(url + 'toggleCreation/${id}', 'POST'),
    toggleAdmin:  builder(url + 'toggleAdmin/${id}', 'POST'),
    updateUser: builder(url + 'updateUser/${id}', 'POST'),
    editPartenaire:  builder(url + 'partenaires/${id}', 'POST'),
    createPartenaire:  builder(url + 'partenaires', 'PUT'),
};
