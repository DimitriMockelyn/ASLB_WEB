import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';
const url = getConfig().API_ROOT;


export default {
    loadAll:  builder(url + 'evenements', 'GET'),
    addSelfToEvent: builder(url + 'evenements/addSelf/${eventId}', 'POST'),
    removeSelfToEvent: builder(url + 'evenements/removeSelf/${eventId}', 'POST'),
    deleteEvent: builder(url + 'evenements/${eventId}', 'DELETE'),
    createEvent: builder(url + 'evenements', 'POST'),
    updateEvent: builder(url + 'evenements/${eventId}', 'PUT'),
    loadTypeEvenements: builder(url + 'typeEvenements', 'GET'),
};
