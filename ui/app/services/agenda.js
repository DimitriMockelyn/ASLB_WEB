import fetch from '../utils/fetch';
import agendaUrl from '../config/server/agenda';

import utils from './utils';
export default {
    loadAll() {
        return fetch(agendaUrl.loadAll());
    },
    loadMine() {
        return fetch(agendaUrl.loadMine(), utils.computeHeaders());
    },
    loadAttendees(id) {
        return fetch(agendaUrl.loadAttendees({urlData: {eventId:id}}), utils.computeHeaders());
    },
    addSelfToEvent(data){
        return fetch(agendaUrl.addSelfToEvent({urlData: {eventId: data._id}}), utils.computeHeaders());        
    },
    removeSelfToEvent(data){
        return fetch(agendaUrl.removeSelfToEvent({urlData: {eventId: data._id}}), utils.computeHeaders());        
    },
    deleteEvent(data){
        return fetch(agendaUrl.deleteEvent({urlData: {eventId: data._id}}), utils.computeHeaders());        
    },
    createEvent(data){
        return fetch(agendaUrl.createEvent({data}), utils.computeHeaders());        
    },
    updateEvent(data){
        return fetch(agendaUrl.updateEvent({urlData: {eventId: data._id}, data: data}), utils.computeHeaders());        
    },
    loadTypeEvenements() {
        return fetch(agendaUrl.loadTypeEvenements(), utils.computeHeaders());  
    },
    loadIncoming() {
        return fetch(agendaUrl.loadIncoming());
    },
    loadMyHistory() {
        return fetch(agendaUrl.loadMyHistory(), utils.computeHeaders());
    },
    loadCommentaire(id) {
        return fetch(agendaUrl.loadCommentaire({urlData: {eventId:id}}), utils.computeHeaders());
    },
    postCommentaire(json) {
        return fetch(agendaUrl.postCommentaire({urlData: {eventId:json.idEvent}, data: json.data}), utils.computeHeaders());
    }
};
