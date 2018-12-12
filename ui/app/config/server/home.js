import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';

const url = getConfig().API_ROOT;
export default {
    loadPartenaires:  builder(url + 'partenaires', 'GET'),
    loadMedias:  builder(url + 'medias', 'GET'),
    loadMachines:  builder(url + 'machines', 'GET'),
    loadPresentations:  builder(url + 'presentations', 'GET'),
    loadChat: builder(url + 'chat', 'GET'),
    addMessageChat: builder(url + 'chat', 'POST'),
    loadBlocs: builder(url + 'blocsByType/${type}', 'GET'),
    loadMachinesForDay: builder(url + 'listMachinesForDay', 'POST'),
    toggleSelfForMachine: builder(url + 'toggleSelfForMachine/${id}', 'POST'),
};
