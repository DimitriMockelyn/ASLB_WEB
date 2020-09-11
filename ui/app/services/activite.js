import fetch from '../utils/fetch';
import activiteUrl from '../config/server/activite';

import utils from './utils';
export default {
    
    addSelfToEvent(data){
        return fetch(activiteUrl.addSelfToEvent({urlData: {activiteId: data._id},  data: {test: true}}), utils.computeHeaders());        
    },
    removeSelfToEvent(data){
        return fetch(activiteUrl.removeSelfToEvent({urlData: {activiteId: data._id}, data: {test: true}}), utils.computeHeaders());        
    },
    deleteEvent(data){
        return fetch(activiteUrl.deleteEvent({urlData: {activiteId: data._id}}), utils.computeHeaders());        
    },
    updateEvent(data){
        return fetch(activiteUrl.updateEvent({urlData: {activiteId: data._id}, data: data}), utils.computeHeaders());        
    },
};
