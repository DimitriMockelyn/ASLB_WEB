import builder from 'focus-core/util/url/builder';
import {getConfig} from '../../config';
const url = getConfig().API_ROOT;


export default {
    addSelfToEvent: builder(url + 'activite/addSelf/${activiteId}', 'POST'),
    removeSelfToEvent: builder(url + 'activite/removeSelf/${activiteId}', 'POST'),
    deleteEvent: builder(url + 'activite/${activiteId}', 'DELETE'),
    updateEvent: builder(url + 'activite/${activiteId}', 'PUT')
};
