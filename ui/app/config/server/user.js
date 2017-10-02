import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';
const url = getConfig().API_ROOT;


export default {
    loadMe:  builder(url + 'me', 'GET'),
    create:  builder(url + 'auth/register', 'POST'),
    connect:  builder(url + 'auth/sign_in', 'POST'),
};
