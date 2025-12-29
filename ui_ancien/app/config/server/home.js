import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';

const url = getConfig().API_ROOT;
export default {
    loadPartenaires:  builder(url + 'partenaires', 'GET'),
    loadMedias:  builder(url + 'medias', 'GET'),
    loadMachines:  builder(url + 'machines', 'GET'),
    loadActivites:  builder(url + 'activites', 'GET'),
    loadPresentations:  builder(url + 'presentations', 'GET'),
    loadChat: builder(url + 'chat', 'GET'),
    addMessageChat: builder(url + 'chat', 'POST'),
    loadBlocs: builder(url + 'blocsByType/${type}', 'GET'),
    loadMachinesForDay: builder(url + 'listMachinesForDay', 'POST'),
    loadActivitesForDay: builder(url + 'loadActivitesForDay', 'POST'),
    createActivityInCreneau: builder(url + 'createActivityInCreneau/${id}', 'POST'),
    loadDayOffs: builder(url + 'dayOffs', 'GET'),
    loadActivityTimes: builder(url + 'activityTimes', 'GET'),
    loadActivity: builder(url + 'activite/${id}', 'GET'),
    toggleSelfForMachine: builder(url + 'toggleSelfForMachine/${id}', 'POST'),
    loadContributeurs: builder('https://api.github.com/repos/DimitriMockelyn/ASLB_WEB/contributors', 'GET'),
    loadContributeursInfo: builder('https://api.github.com/users/${login}', 'GET'),
};
