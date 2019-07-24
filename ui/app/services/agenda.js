import fetch from '../utils/fetch';
import agendaUrl from '../config/server/agenda';

import utils from './utils';
export default {
    loadAll(week) {
        if (!week && week !== 0) {
            return fetch(agendaUrl.loadAll());
        }
        return fetch(agendaUrl.loadAllWeek({urlData: {numWeek:week}}));
    },
    loadMine(week) {
        if (!week && week !== 0) {
            return fetch(agendaUrl.loadMine(), utils.computeHeaders());
        }
        return fetch(agendaUrl.loadMineWeek({urlData: {numWeek:week}}), utils.computeHeaders());
    },
    loadAttendees(id) {
        return fetch(agendaUrl.loadAttendees({urlData: {eventId:id}}), utils.computeHeaders());
    },
    loadEvent(id) {
        return fetch(agendaUrl.loadEvent({urlData: {eventId:id}}));
    },
    addSelfToEvent(data){
        return fetch(agendaUrl.addSelfToEvent({urlData: {eventId: data._id},  data: {test: true}}), utils.computeHeaders());        
    },
    removeSelfToEvent(data){
        return fetch(agendaUrl.removeSelfToEvent({urlData: {eventId: data._id}, data: {test: true}}), utils.computeHeaders());        
    },
    generateAppointment(data){
        return fetch(agendaUrl.generateAppointment({urlData: {eventId: data._id}, data: {test: true}}), utils.computeHeaders());        
    },
    sendMailAppointment(data){
        return fetch(agendaUrl.sendMailAppointment({urlData: {eventId: data._id}, data: {test: true}}), utils.computeHeaders());        
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
    loadNiveauEvenements() {
        return fetch(agendaUrl.loadNiveauEvenements(), utils.computeHeaders());  
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
    },
    postReponseCommentaire(json) {
        return fetch(agendaUrl.postReponseCommentaire({urlData: {eventId:json.idEvent}, data: json}), utils.computeHeaders());
    },
    isCoach() {
        return fetch(agendaUrl.isCoach(), utils.computeHeaders());
    },
    loadMyCoachingHistory() {
        return fetch(agendaUrl.loadMyCoachingHistory(), utils.computeHeaders());
    },
    loadTokens() {
        return fetch(agendaUrl.loadTokens(), utils.computeHeaders());
    },
    loadAbsents(id) {
        return fetch(agendaUrl.loadAbsents({urlData: {eventId:id}}), utils.computeHeaders());
    },
    setAbsent(data) {
        return fetch(agendaUrl.setAbsent({urlData: {eventId:data.id}, data: data}), utils.computeHeaders());
    },
    setPresent(data) {
        return fetch(agendaUrl.setPresent({urlData: {eventId:data.id}, data: data}), utils.computeHeaders());
    },
    exportMyHistory() {
        return fetch(agendaUrl.exportMyHistory(), utils.computeHeaders());
    },
    exportMyCoachHistory() {
        return fetch(agendaUrl.exportMyCoachHistory(), utils.computeHeaders());
    },
    sendPostNotif(json) {
        return fetch(agendaUrl.sendPostNotif({urlData: {eventId:json.id}, data: json.data}), utils.computeHeaders());
    },
};
