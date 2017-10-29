import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';

const url = getConfig().API_ROOT;
export default {
    createNews:  builder(url + 'news', 'PUT'),
    loadAllNews:  builder(url + 'news', 'GET'),
    editNews:  builder(url + 'news/${id}', 'POST'),
};
