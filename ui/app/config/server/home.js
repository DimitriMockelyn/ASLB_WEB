import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';

const url = getConfig().API_ROOT;
export default {
    loadPartenaires:  builder(url + 'partenaires', 'GET')
};
